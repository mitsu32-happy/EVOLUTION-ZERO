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
    this.lifecycleHandlersInstalled = false;
    this.pageAudioSuspended = false;
    this.wasBgmPlayingBeforePageHide = false;
    this.suspendedBgmId = null;
    this.suspendedBgmTime = 0;
    this.lastBgmEnsureAt = 0;
  }

  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.updateCurrentBgmVolume();
    this.updateActiveAudioVolumes();
  }

  setMuted(muted) {
    this.muted = muted;

    if (this.currentBgm) {
      if (muted) {
        this.currentBgm.pause();
      } else if (!this.pageAudioSuspended) {
        this.currentBgm.play().catch((error) => {
          this.warnOnce(this.currentBgmId ?? 'bgm', 'BGM resume skipped', error);
        });
      }
    }

    this.updateActiveAudioVolumes();
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
    this.updateActiveAudioVolumes();
  }

  installPageLifecycleHandlers() {
    if (this.lifecycleHandlersInstalled || typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    this.lifecycleHandlersInstalled = true;

    this.handlePageHidden = () => {
      this.suspendForPageHide();
    };
    this.handleVisibilityChange = () => {
      if (document.hidden) {
        this.suspendForPageHide();
        return;
      }

      this.resumeFromPageShow();
    };
    this.handlePageShown = () => {
      if (!document.hidden) {
        this.resumeFromPageShow();
      }
    };

    document.addEventListener('visibilitychange', this.handleVisibilityChange, { passive: true });
    window.addEventListener('pagehide', this.handlePageHidden, { passive: true });
    window.addEventListener('freeze', this.handlePageHidden, { passive: true });
    window.addEventListener('blur', this.handlePageHidden, { passive: true });
    window.addEventListener('pageshow', this.handlePageShown, { passive: true });
    window.addEventListener('focus', this.handlePageShown, { passive: true });
  }

  suspendForPageHide() {
    if (this.pageAudioSuspended) {
      return;
    }

    this.pageAudioSuspended = true;
    this.wasBgmPlayingBeforePageHide = Boolean(this.currentBgm && !this.currentBgm.paused && !this.muted);

    if (this.currentBgm) {
      this.currentBgm.pause();
    }

    this.suspendedBgmId = this.currentBgmId;
    this.suspendedBgmTime = this.currentBgm?.currentTime ?? 0;

    if (this.currentBgm) {
      this.releaseAudioElement(this.currentBgm);
      this.currentBgm = null;
      this.currentBgmId = null;
    }

    this.stopTransientAudio({ release: true });

    if (this.audioContext?.state === 'running') {
      this.audioContext.suspend().catch(() => {});
    }

    this.setMediaSessionState('paused');
  }

  resumeFromPageShow() {
    if (!this.pageAudioSuspended) {
      return;
    }

    this.pageAudioSuspended = false;

    if (this.audioContext?.state === 'suspended' && this.isUnlocked) {
      this.audioContext.resume().catch(() => {});
    }

    if (this.wasBgmPlayingBeforePageHide && this.suspendedBgmId && !this.muted) {
      this.playBgm(this.suspendedBgmId, {
        unlock: false,
        loop: true,
        startTime: this.suspendedBgmTime,
      });
      this.setMediaSessionState('playing');
    }

    this.wasBgmPlayingBeforePageHide = false;
    this.suspendedBgmId = null;
    this.suspendedBgmTime = 0;
  }

  unlockAudio() {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const Context = window.AudioContext || window.webkitAudioContext;

      if (Context) {
        this.audioContext = this.audioContext ?? new Context();

        if (this.audioContext.state === 'suspended') {
          this.audioContext.resume().catch(() => {});
        }
      } else if (this.audioContext?.state === 'suspended') {
        this.audioContext.resume().catch(() => {});
      }

      if (this.isUnlocked) {
        this.refreshAudioRouting();
        return;
      }

      if (this.audioContext) {
        const source = this.audioContext.createBufferSource();
        source.buffer = this.audioContext.createBuffer(1, 1, 22050);
        source.connect(this.audioContext.destination);
        source.start(0);
      }

      this.isUnlocked = true;
      this.refreshAudioRouting();
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

      this.ensureAudioRouting(audio);
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
        this.ensureAudioRouting(audio);
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
      this.ensureAudioRouting(this.currentBgm);
      this.updateCurrentBgmVolume();
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
      if (Number.isFinite(options.startTime) && options.startTime > 0) {
        try {
          audio.currentTime = Math.max(0, options.startTime);
        } catch {
          // Metadata timing differs by browser; starting from 0 is acceptable after background resume.
        }
      }
      this.currentBgm = audio;
      this.currentBgmId = id;
      this.ensureAudioRouting(audio);
      this.updateCurrentBgmVolume();
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

  stopTransientAudio({ release = false } = {}) {
    this.activeAudios.forEach((audio) => {
      if (release) {
        this.releaseAudioElement(audio);
        return;
      }

      this.stopAudioNow(audio);
    });
    this.activeAudios.clear();
    this.activeCounts = {};
    this.interruptGroups.clear();
  }

  createAudio(entry, options = {}) {
    const audio = new Audio(getAudioUrl(entry));
    const baseVolume = options.volume ?? 1;

    audio.preload = entry.category === 'bgm' ? 'auto' : 'metadata';
    audio.muted = this.muted;
    audio.volume = this.computeAudioVolume(entry, baseVolume);
    audio.__ezAudioEntry = entry;
    audio.__ezAudioBaseVolume = baseVolume;

    return audio;
  }

  ensureAudioRouting(audio) {
    if (
      !audio
      || !this.shouldUseMediaElementRouting(audio.__ezAudioEntry)
      || !this.audioContext
      || audio.__ezGainNode
      || audio.__ezRoutingFailed
    ) {
      return;
    }

    try {
      const source = this.audioContext.createMediaElementSource(audio);
      const gain = this.audioContext.createGain();
      source.connect(gain);
      gain.connect(this.audioContext.destination);
      audio.__ezSourceNode = source;
      audio.__ezGainNode = gain;
      this.applyVolumeToAudio(audio);
    } catch (error) {
      audio.__ezRoutingFailed = true;
      this.warnOnce('media-routing', 'WebAudio media routing skipped', error);
    }
  }

  refreshAudioRouting() {
    if (this.currentBgm) {
      this.ensureAudioRouting(this.currentBgm);
      this.updateCurrentBgmVolume();
    }

    this.activeAudios.forEach((audio) => {
      this.ensureAudioRouting(audio);
    });
    this.updateActiveAudioVolumes();
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
    const startVolume = this.getRuntimeAudioLevel(audio);
    const startedAt = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const interval = window.setInterval(() => {
      if (audio.paused || audio.ended) {
        window.clearInterval(interval);
        return;
      }

      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const progress = Math.min(1, (now - startedAt) / fadeOutMs);
      this.setRuntimeAudioLevel(audio, startVolume * (1 - progress));

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

  releaseAudioElement(audio) {
    if (!audio) {
      return;
    }

    try {
      audio.pause();
    } catch {
      // Ignore unavailable media state.
    }

    try {
      audio.removeAttribute('src');
      audio.load?.();
    } catch {
      // iOS can reject media mutations during teardown.
    }

    try {
      audio.__ezSourceNode?.disconnect?.();
    } catch {
      // Already disconnected.
    }

    try {
      audio.__ezGainNode?.disconnect?.();
    } catch {
      // Already disconnected.
    }

    audio.__ezSourceNode = null;
    audio.__ezGainNode = null;
  }

  getRuntimeAudioLevel(audio) {
    if (audio?.__ezGainNode) {
      return audio.__ezGainNode.gain.value;
    }

    return audio?.volume ?? 0;
  }

  setRuntimeAudioLevel(audio, value) {
    if (audio?.__ezGainNode) {
      audio.__ezGainNode.gain.value = Math.max(0, Math.min(1, value));
      return;
    }

    try {
      audio.volume = Math.max(0, Math.min(1, value));
    } catch {
      // Media element volume can be ignored on iOS Safari.
    }
  }

  updateCurrentBgmVolume() {
    if (!this.currentBgm) {
      return;
    }

    this.ensureAudioRouting(this.currentBgm);
    this.applyVolumeToAudio(this.currentBgm, AUDIO_PATHS[this.currentBgmId]);
  }

  updateActiveAudioVolumes() {
    this.activeAudios.forEach((audio) => {
      const entry = audio.__ezAudioEntry;

      if (!entry) {
        return;
      }

      this.ensureAudioRouting(audio);
      this.applyVolumeToAudio(audio, entry);
    });
  }

  applyVolumeToAudio(audio, entry = audio?.__ezAudioEntry) {
    if (!audio) {
      return;
    }

    const targetVolume = this.computeAudioVolume(entry, audio.__ezAudioBaseVolume ?? 1);

    if (audio.__ezGainNode) {
      audio.__ezGainNode.gain.value = this.muted ? 0 : targetVolume;
      audio.muted = false;
      try {
        audio.volume = 1;
      } catch {
        // iOS Safari can ignore volume writes; WebAudio gain handles volume there.
      }
      return;
    }

    audio.muted = this.muted;
    try {
      audio.volume = this.muted ? 0 : targetVolume;
    } catch {
      // Media element volume may be read-only on some mobile browsers.
    }
  }

  ensureBgmPlaying(expectedId = this.currentBgmId) {
    if (this.muted || this.pageAudioSuspended || typeof Audio === 'undefined') {
      return;
    }

    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (now - this.lastBgmEnsureAt < 900) {
      return;
    }
    this.lastBgmEnsureAt = now;

    if (expectedId && this.currentBgmId !== expectedId) {
      this.playBgm(expectedId, { unlock: false, loop: true });
      return;
    }

    if (!this.currentBgm || !this.currentBgmId) {
      if (expectedId) {
        this.playBgm(expectedId, { unlock: false, loop: true });
      }
      return;
    }

    this.ensureAudioRouting(this.currentBgm);
    this.updateCurrentBgmVolume();

    if (!this.currentBgm.paused) {
      this.setMediaSessionState('playing');
      return;
    }

    this.currentBgm.play().then(() => {
      this.setMediaSessionState('playing');
    }).catch((error) => {
      this.warnOnce(this.currentBgmId ?? 'bgm', 'BGM resume skipped by watchdog', error);
    });
  }

  computeAudioVolume(entry, baseVolume = 1) {
    const categoryVolume = this.categoryVolumes[entry?.category] ?? 1;
    const entryVolume = entry?.volume ?? 1;

    return Math.max(0, Math.min(1, baseVolume * entryVolume * this.masterVolume * categoryVolume));
  }

  shouldUseMediaElementRouting(entry) {
    // iOS Safari needs WebAudio gain for BGM volume, but routing many short SE
    // media elements through MediaElementSource is fragile and can silence them.
    return entry?.category === 'bgm';
  }

  setMediaSessionState(state) {
    try {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = state;
        if (state === 'paused') {
          navigator.mediaSession.metadata = null;
        }
      }
    } catch {
      // Media Session is optional and inconsistent across browsers.
    }
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
