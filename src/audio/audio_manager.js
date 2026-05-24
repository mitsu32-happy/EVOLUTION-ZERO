import { AUDIO_COOLDOWNS, AUDIO_MAX_INSTANCES, AUDIO_PATHS, getAudioUrl } from './audio_catalog.js';

export class AudioManager {
  constructor() {
    this.masterVolume = 0.8;
    this.categoryVolumes = {
      ui: 0.55,
      se: 0.65,
      evolution: 0.65,
      ultimate: 0.65,
      boss: 0.65,
      bgm: 0.45,
    };
    this.muted = false;
    this.isUnlocked = false;
    this.audioContext = null;
    this.lastPlayedAt = {};
    this.activeCounts = {};
    this.currentBgm = null;
    this.currentBgmId = null;
    this.previousBgmId = null;
    this.bgmReturnTimer = null;
    this.warnedMissing = new Set();
    this.preloaded = new Map();
    this.interruptGroups = new Map();
    this.activeAudios = new Set();
  }

  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.updateCurrentBgmVolume();
  }

  setMuted(muted) {
    this.muted = muted;

    if (this.currentBgm) {
      this.currentBgm.muted = muted;

      if (muted) {
        this.currentBgm.pause();
      } else {
        this.currentBgm.play().catch((error) => {
          this.warnOnce(this.currentBgmId ?? 'bgm', 'BGM resume skipped', error);
        });
      }
    }
  }

  applySettings(settings = {}) {
    this.masterVolume = this.clampVolume(settings.masterVolume ?? this.masterVolume);
    this.categoryVolumes.bgm = this.clampVolume(settings.bgmVolume ?? this.categoryVolumes.bgm);
    this.categoryVolumes.se = this.clampVolume(settings.seVolume ?? this.categoryVolumes.se);
    this.categoryVolumes.evolution = this.categoryVolumes.se;
    this.categoryVolumes.ultimate = this.categoryVolumes.se;
    this.categoryVolumes.boss = this.categoryVolumes.se;
    this.categoryVolumes.ui = this.clampVolume(settings.uiVolume ?? this.categoryVolumes.ui);
    this.setMuted(Boolean(settings.muted ?? this.muted));
    this.updateCurrentBgmVolume();
  }

  unlockAudio() {
    if (this.isUnlocked || typeof window === 'undefined') {
      return;
    }

    try {
      const Context = window.AudioContext || window.webkitAudioContext;

      if (Context) {
        this.audioContext = this.audioContext ?? new Context();

        if (this.audioContext.state === 'suspended') {
          this.audioContext.resume().catch(() => {});
        }

        const source = this.audioContext.createBufferSource();
        source.buffer = this.audioContext.createBuffer(1, 1, 22050);
        source.connect(this.audioContext.destination);
        source.start(0);
      }

      this.isUnlocked = true;
    } catch (error) {
      this.warnOnce('unlock', 'Audio unlock skipped', error);
    }
  }

  play(id, options = {}) {
    if (this.muted || typeof Audio === 'undefined') {
      return;
    }

    if (options.unlock !== false) {
      this.unlockAudio();
    }

    const entry = AUDIO_PATHS[id];

    if (!entry) {
      if (!options.optional) {
        this.warnOnce(id, `Audio id is not registered: ${id}`);
      }
      return;
    }

    const now = (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000;
    const cooldown = options.cooldown ?? AUDIO_COOLDOWNS[id] ?? 0;

    if (now - (this.lastPlayedAt[id] ?? -999) < cooldown) {
      return;
    }

    this.lastPlayedAt[id] = now;

    if (!this.canPlayInstance(id, options.maxInstances)) {
      return;
    }

    try {
      const audio = this.createAudio(entry, options);

      this.applyPlaybackControls(id, entry, audio, options);
      this.incrementActive(id);
      this.activeAudios.add(audio);
      const releaseAudio = () => {
        this.decrementActive(id);
        this.activeAudios.delete(audio);
      };
      audio.addEventListener('ended', releaseAudio, { once: true });
      audio.addEventListener('pause', releaseAudio, { once: true });
      audio.play().catch((error) => {
        releaseAudio();
        if (!options.optional) {
          this.warnOnce(id, `Audio playback skipped: ${entry.path}`, error);
        }
      });
    } catch (error) {
      if (!options.optional) {
        this.warnOnce(id, `Audio playback failed: ${entry.path}`, error);
      }
    }
  }

  playOptional(id, options = {}) {
    this.play(id, { ...options, optional: true });
  }

  preload(ids = Object.keys(AUDIO_PATHS)) {
    if (typeof Audio === 'undefined') {
      return;
    }

    ids.forEach((id) => {
      if (this.preloaded.has(id)) {
        return;
      }

      const entry = AUDIO_PATHS[id];

      if (!entry) {
        return;
      }

      try {
        const audio = this.createAudio(entry, { volume: 0 });
        audio.preload = entry.category === 'bgm' ? 'metadata' : 'auto';
        this.preloaded.set(id, audio);
      } catch (error) {
        this.warnOnce(id, `Audio preload skipped: ${entry.path}`, error);
      }
    });
  }

  getCatalog() {
    return Object.entries(AUDIO_PATHS).map(([id, entry]) => ({
      id,
      ...entry,
      url: getAudioUrl(entry),
      cooldown: AUDIO_COOLDOWNS[id] ?? 0,
      maxInstances: AUDIO_MAX_INSTANCES[id] ?? 4,
    }));
  }

  playBgm(id, options = {}) {
    if (this.muted || typeof Audio === 'undefined') {
      return;
    }

    if (options.unlock !== false) {
      this.unlockAudio();
    }

    const entry = AUDIO_PATHS[id];

    if (!entry) {
      this.warnOnce(id, `BGM id is not registered: ${id}`);
      return;
    }

    if (entry.category !== 'bgm') {
      this.warnOnce(id, `Audio id is not BGM: ${id}`);
      return;
    }

    if (this.currentBgmId === id && this.currentBgm) {
      if (this.currentBgm.paused) {
        this.currentBgm.play().catch((error) => {
          this.warnOnce(id, `BGM playback skipped: ${entry.path}`, error);
        });
      }

      return;
    }

    this.stopBgm();

    try {
      const audio = this.createAudio(entry, options);

      audio.loop = options.loop ?? true;
      this.currentBgm = audio;
      this.currentBgmId = id;
      audio.play().catch((error) => {
        this.warnOnce(id, `BGM playback skipped: ${entry.path}`, error);
      });
    } catch (error) {
      this.warnOnce(id, `BGM playback failed: ${entry.path}`, error);
    }
  }

  playTemporaryBgm(id, duration = 8, fallbackId = this.currentBgmId) {
    this.previousBgmId = fallbackId;
    this.playBgm(id, { loop: true });

    if (this.bgmReturnTimer) {
      clearTimeout(this.bgmReturnTimer);
    }

    if (this.previousBgmId) {
      this.bgmReturnTimer = setTimeout(() => {
        this.playBgm(this.previousBgmId, { loop: true });
        this.bgmReturnTimer = null;
      }, duration * 1000);
    }
  }

  stopBgm() {
    if (this.bgmReturnTimer) {
      clearTimeout(this.bgmReturnTimer);
      this.bgmReturnTimer = null;
    }

    if (!this.currentBgm) {
      this.currentBgmId = null;
      return;
    }

    this.currentBgm.pause();
    this.currentBgm.currentTime = 0;
    this.currentBgm = null;
    this.currentBgmId = null;
  }

  stopTransientAudio() {
    this.activeAudios.forEach((audio) => this.stopAudioNow(audio));
    this.activeAudios.clear();
    this.activeCounts = {};
    this.interruptGroups.clear();
  }

  createAudio(entry, options = {}) {
    const audio = new Audio(getAudioUrl(entry));
    const categoryVolume = this.categoryVolumes[entry.category] ?? 1;
    const entryVolume = entry.volume ?? 1;

    audio.preload = entry.category === 'bgm' ? 'auto' : 'metadata';
    audio.muted = this.muted;
    audio.volume = Math.max(0, Math.min(1, (options.volume ?? 1) * entryVolume * this.masterVolume * categoryVolume));

    return audio;
  }

  applyPlaybackControls(id, entry, audio, options = {}) {
    const groupId = options.interruptGroup ?? entry.interruptGroup;

    if (groupId && (options.stopPrevious ?? entry.stopPrevious)) {
      const previous = this.interruptGroups.get(groupId);

      if (previous && previous !== audio) {
        this.stopAudioNow(previous);
      }

      this.interruptGroups.set(groupId, audio);
      audio.addEventListener('ended', () => {
        if (this.interruptGroups.get(groupId) === audio) {
          this.interruptGroups.delete(groupId);
        }
      }, { once: true });
      audio.addEventListener('pause', () => {
        if (this.interruptGroups.get(groupId) === audio) {
          this.interruptGroups.delete(groupId);
        }
      }, { once: true });
    }

    const durationHintMs = options.durationHintMs ?? entry.durationHintMs;

    if (!Number.isFinite(durationHintMs) || durationHintMs <= 0) {
      return;
    }

    const fadeOutMs = Math.max(0, options.fadeOutMs ?? entry.fadeOutMs ?? 0);
    window.setTimeout(() => {
      if (audio.paused || audio.ended) {
        return;
      }

      if (fadeOutMs <= 0) {
        this.stopAudioNow(audio);
        return;
      }

      this.fadeOutAndStop(audio, fadeOutMs);
    }, durationHintMs);
  }

  fadeOutAndStop(audio, fadeOutMs = 120) {
    const startVolume = audio.volume;
    const startedAt = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const interval = window.setInterval(() => {
      if (audio.paused || audio.ended) {
        window.clearInterval(interval);
        return;
      }

      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const progress = Math.min(1, (now - startedAt) / fadeOutMs);
      audio.volume = startVolume * (1 - progress);

      if (progress >= 1) {
        window.clearInterval(interval);
        this.stopAudioNow(audio);
      }
    }, 32);
  }

  stopAudioNow(audio) {
    try {
      audio.pause();
      audio.currentTime = 0;
    } catch {
      // Some mobile browsers reject currentTime changes for not-yet-loaded audio.
    }
  }

  updateCurrentBgmVolume() {
    if (!this.currentBgm) {
      return;
    }

    const entry = AUDIO_PATHS[this.currentBgmId];
    const entryVolume = entry?.volume ?? 1;

    this.currentBgm.volume = Math.max(0, Math.min(1, this.masterVolume * this.categoryVolumes.bgm * entryVolume));
    this.currentBgm.muted = this.muted;
  }

  clampVolume(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return 0;
    }

    return Math.max(0, Math.min(1, number));
  }

  canPlayInstance(id, maxInstances = AUDIO_MAX_INSTANCES[id] ?? 4) {
    return (this.activeCounts[id] ?? 0) < maxInstances;
  }

  incrementActive(id) {
    this.activeCounts[id] = (this.activeCounts[id] ?? 0) + 1;
  }

  decrementActive(id) {
    this.activeCounts[id] = Math.max(0, (this.activeCounts[id] ?? 0) - 1);
  }

  warnOnce(id, message, error = null) {
    if (this.warnedMissing.has(id)) {
      return;
    }

    if (this.isExpectedAudioFallback(error)) {
      return;
    }

    this.warnedMissing.add(id);

    if (error) {
      console.warn(message, error);
      return;
    }

    console.warn(message);
  }

  isExpectedAudioFallback(error) {
    if (!error) {
      return false;
    }

    const name = String(error.name ?? '');
    const message = String(error.message ?? error ?? '');

    return name === 'NotSupportedError'
      || name === 'NotAllowedError'
      || name === 'AbortError'
      || message.includes('NotSupportedError')
      || message.includes('NotAllowedError')
      || message.includes('user didn')
      || message.includes('play() failed because the user')
      || message.includes('interrupted by a call to pause');
  }
}
