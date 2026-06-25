import { Assets } from 'pixi.js';
import { flattenAssetManifest } from '../data/asset_manifest.js';
import { toAssetAbsoluteUrl } from './asset_url.js';

const DEFAULT_LOAD_TIMEOUT_MS = 8000;
const CRITICAL_LOAD_TIMEOUT_MS = 20000;
const TEXTURE_WARMUP_TIMEOUT_MS = 9000;

class AssetLoadTimeoutError extends Error {
  constructor(key, timeoutMs) {
    super(`Asset load timed out after ${timeoutMs}ms: ${key}`);
    this.name = 'AssetLoadTimeoutError';
    this.key = key;
    this.timeoutMs = timeoutMs;
    this.isAssetTimeout = true;
  }
}

export class AssetLoader {
  constructor(manifest = null) {
    this.items = flattenAssetManifest(manifest ?? undefined);
    this.cache = new Map();
    this.missing = new Set();
    this.timedOut = new Set();
    this.retryableTimeouts = new Set();
    this.pending = new Map();
    this.lateLoadSubscribers = new Map();
    this.groupPending = new Map();
    this.loadedGroups = new Set();
    this.failedGroups = new Map();
    this.checkedAt = new Map();
    this.reloadVersion = 0;
    this.diagnostics = {
      criticalRequested: 0,
      criticalLoaded: 0,
      criticalMissing: 0,
      effectFallbackCount: 0,
      effectSkippedBecauseMissing: 0,
      effectSkippedBecauseBudget: 0,
      effectRetried: 0,
      effectDisplayed: 0,
      effectRequestToDisplayTotalMs: 0,
      effectRequestToDisplayCount: 0,
      playSceneStartCriticalReady: false,
      preloadDurationMs: 0,
      deferredLoadCount: 0,
      duplicateLoadAvoided: 0,
      cacheHitApprox: 0,
      loaderCacheHitCount: 0,
      loaderCacheMissCount: 0,
      textureCacheHitCount: 0,
      decodeDurationMs: 0,
      decodeDurationTotalMs: 0,
      decodeDurationCount: 0,
      decodeDurationMaxMs: 0,
      gpuUploadEstimateMs: 0,
      lastLoadUrl: '',
      lastNormalizedLoadUrl: '',
      lastCriticalLabel: null,
      lastCriticalMissingKeys: [],
      lastCriticalTimedOutKeys: [],
      lastCriticalPermanentMissingKeys: [],
      retryCount: 0,
      retrySuccessCount: 0,
      retryFailedCount: 0,
      companionTimeoutCount: 0,
      enemyTimeoutCount: 0,
      fallbackBecauseTimeoutCount: 0,
      fallbackBecausePermanentMissingCount: 0,
      lateAssetSwapCount: 0,
    };
    this.textureWarmupDiagnostics = this.createTextureWarmupDiagnostics();
  }

  createTextureWarmupDiagnostics() {
    return {
      enabled: false,
      requested: 0,
      completed: 0,
      failed: 0,
      skipped: 0,
      durationMs: 0,
      cacheHits: 0,
      textureCacheHits: 0,
      gpuUploadEstimateMs: 0,
      selectedRunReady: false,
      criticalReadyBeforePlay: false,
      lastLabel: null,
      lastFailedKeys: [],
      lastSkippedKeys: [],
    };
  }

  async load(key, options = {}) {
    const force = options.force === true;
    const cacheBust = options.cacheBust === true;
    const timeoutMs = options.timeoutMs ?? DEFAULT_LOAD_TIMEOUT_MS;

    if (force) {
      this.cache.delete(key);
      this.missing.delete(key);
      this.timedOut.delete(key);
      this.retryableTimeouts.delete(key);
      this.pending.delete(key);
    }

    this.subscribeLateLoad(key, options.onLateLoad);

    if (this.cache.has(key)) {
      this.diagnostics.cacheHitApprox += 1;
      this.diagnostics.loaderCacheHitCount += 1;
      return this.cache.get(key);
    }

    if (this.missing.has(key)) {
      return null;
    }

    if (this.pending.has(key)) {
      this.diagnostics.duplicateLoadAvoided += 1;
      return this.pending.get(key);
    }

    const retryingAfterTimeout = this.retryableTimeouts.has(key);
    if (retryingAfterTimeout) {
      this.diagnostics.retryCount += 1;
    }

    const item = this.items.find((entry) => entry.key === key);

    if (!item) {
      this.missing.add(key);
      this.checkedAt.set(key, new Date());
      return null;
    }

    let task = null;
    const loadUrl = this.toUrl(item.path, cacheBust ? this.reloadVersion : null);
    const normalizedLoadUrl = this.toNormalizedUrl(item.path);
    const loadStartedAt = this.now();

    this.diagnostics.loaderCacheMissCount += 1;
    this.diagnostics.lastLoadUrl = loadUrl;
    this.diagnostics.lastNormalizedLoadUrl = normalizedLoadUrl;
    if (this.hasPixiTextureCache(loadUrl) || this.hasPixiTextureCache(normalizedLoadUrl)) {
      this.diagnostics.textureCacheHitCount += 1;
    }

    const assetTask = Assets.load(loadUrl)
      .then((texture) => {
        this.recordDecodeDuration(loadStartedAt);
        this.cache.set(key, texture);
        if (this.pending.get(key) === task) {
          this.pending.delete(key);
        }
        if (retryingAfterTimeout) {
          this.diagnostics.retrySuccessCount += 1;
        }
        if (this.timedOut.has(key) || this.retryableTimeouts.has(key)) {
          this.recordLateAssetSwap();
          this.notifyLateLoad(key, texture);
        }
        this.timedOut.delete(key);
        this.retryableTimeouts.delete(key);
        this.checkedAt.set(key, new Date());
        return texture;
      })
      .catch(() => {
        this.recordDecodeDuration(loadStartedAt);
        if (this.pending.get(key) === task) {
          this.pending.delete(key);
        }
        if (retryingAfterTimeout) {
          this.diagnostics.retryFailedCount += 1;
        }
        this.missing.add(key);
        this.timedOut.delete(key);
        this.retryableTimeouts.delete(key);
        this.checkedAt.set(key, new Date());
        return null;
      });

    task = this.withTimeout(assetTask, timeoutMs, key)
      .catch((error) => {
        if (error?.isAssetTimeout) {
          if (this.pending.get(key) === task) {
            this.pending.delete(key);
          }
          this.timedOut.add(key);
          this.retryableTimeouts.add(key);
          this.checkedAt.set(key, new Date());
          this.recordAssetTimeout(options.assetType ?? this.getAssetType(key));
          return null;
        }

        if (this.pending.get(key) === task) {
          this.pending.delete(key);
        }
        this.missing.add(key);
        this.checkedAt.set(key, new Date());
        return null;
      });

    this.pending.set(key, task);
    return task;
  }

  async preloadCritical(keys = [], { label = 'critical' } = {}) {
    const uniqueKeys = [...new Set((Array.isArray(keys) ? keys : [keys]).filter(Boolean))];
    const startedAt = this.now();
    const beforePending = uniqueKeys.filter((key) => this.pending.has(key)).length;

    this.diagnostics.criticalRequested += uniqueKeys.length;
    this.diagnostics.deferredLoadCount += beforePending;
    this.diagnostics.lastCriticalLabel = label;

    const results = await Promise.all(uniqueKeys.map(async (key) => {
      const texture = await this.load(key, {
        timeoutMs: CRITICAL_LOAD_TIMEOUT_MS,
        assetType: this.getAssetType(key),
      });
      const status = this.getStatus(key);
      return {
        key,
        loaded: Boolean(texture),
        missing: !texture && status.missing,
        timedOut: !texture && status.timedOut,
      };
    }));

    const loaded = results.filter((entry) => entry.loaded).length;
    const missingKeys = results.filter((entry) => entry.missing).map((entry) => entry.key);
    const timedOutKeys = results.filter((entry) => entry.timedOut).map((entry) => entry.key);

    this.diagnostics.criticalLoaded += loaded;
    this.diagnostics.criticalMissing += missingKeys.length;
    this.diagnostics.playSceneStartCriticalReady = missingKeys.length === 0 && timedOutKeys.length === 0;
    this.diagnostics.preloadDurationMs = Math.round(this.now() - startedAt);
    this.diagnostics.lastCriticalMissingKeys = missingKeys;
    this.diagnostics.lastCriticalTimedOutKeys = timedOutKeys;
    this.diagnostics.lastCriticalPermanentMissingKeys = missingKeys;

    return {
      label,
      requested: uniqueKeys.length,
      loaded,
      missing: missingKeys,
      timedOut: timedOutKeys,
      durationMs: this.diagnostics.preloadDurationMs,
      ready: missingKeys.length === 0 && timedOutKeys.length === 0,
    };
  }

  async warmupCritical(keys = [], options = {}) {
    const {
      label = 'texture-warmup',
      enabled = true,
      maxCount = 36,
      timeoutMs = TEXTURE_WARMUP_TIMEOUT_MS,
      onProgress = null,
    } = options;
    const uniqueKeys = [...new Set((Array.isArray(keys) ? keys : [keys]).filter(Boolean))];
    const limit = Math.max(0, Math.floor(maxCount));
    const selectedKeys = enabled ? uniqueKeys.slice(0, limit) : [];
    const skippedKeys = enabled ? uniqueKeys.slice(limit) : uniqueKeys;
    const startedAt = this.now();
    const diagnostics = {
      ...this.createTextureWarmupDiagnostics(),
      enabled: Boolean(enabled),
      requested: selectedKeys.length,
      skipped: skippedKeys.length,
      lastLabel: label,
      lastSkippedKeys: skippedKeys.slice(0, 12),
    };

    if (!enabled || selectedKeys.length === 0) {
      diagnostics.durationMs = Math.round(this.now() - startedAt);
      diagnostics.selectedRunReady = selectedKeys.length === 0;
      diagnostics.criticalReadyBeforePlay = diagnostics.selectedRunReady;
      this.textureWarmupDiagnostics = diagnostics;
      return { ...diagnostics };
    }

    for (const key of selectedKeys) {
      const item = this.getItem(key);
      const progressBase = {
        label,
        key,
        completed: diagnostics.completed,
        failed: diagnostics.failed,
        total: selectedKeys.length,
      };

      if (!item) {
        diagnostics.failed += 1;
        diagnostics.lastFailedKeys.push(key);
        onProgress?.({ ...progressBase, failed: diagnostics.failed });
        await this.yieldToMainThread();
        continue;
      }

      const loadUrl = this.toUrl(item.path);
      const normalizedUrl = this.toNormalizedUrl(item.path);
      if (this.cache.has(key)) {
        diagnostics.cacheHits += 1;
        diagnostics.completed += 1;
        if (this.hasPixiTextureCache(loadUrl) || this.hasPixiTextureCache(normalizedUrl)) {
          diagnostics.textureCacheHits += 1;
        }
        onProgress?.({ ...progressBase, completed: diagnostics.completed });
        await this.yieldToMainThread();
        continue;
      }

      if (this.hasPixiTextureCache(loadUrl) || this.hasPixiTextureCache(normalizedUrl)) {
        diagnostics.textureCacheHits += 1;
      }

      const texture = await this.load(key, {
        timeoutMs,
        assetType: this.getAssetType(key),
      });

      if (texture) {
        diagnostics.completed += 1;
      } else {
        diagnostics.failed += 1;
        diagnostics.lastFailedKeys.push(key);
      }

      onProgress?.({
        ...progressBase,
        completed: diagnostics.completed,
        failed: diagnostics.failed,
      });
      await this.yieldToMainThread();
    }

    diagnostics.durationMs = Math.round(this.now() - startedAt);
    diagnostics.gpuUploadEstimateMs = Math.max(0, diagnostics.durationMs - (this.diagnostics.decodeDurationMs ?? 0));
    diagnostics.lastFailedKeys = diagnostics.lastFailedKeys.slice(0, 12);
    diagnostics.selectedRunReady = diagnostics.requested > 0 && diagnostics.completed > 0;
    diagnostics.criticalReadyBeforePlay = diagnostics.failed === 0;
    this.textureWarmupDiagnostics = diagnostics;
    return { ...diagnostics };
  }

  recordEffectFallback() {
    this.diagnostics.effectFallbackCount += 1;
  }

  recordEffectSkippedBecauseMissing() {
    this.diagnostics.effectSkippedBecauseMissing += 1;
  }

  recordEffectSkippedBecauseBudget() {
    this.diagnostics.effectSkippedBecauseBudget += 1;
  }

  recordEffectRetried() {
    this.diagnostics.effectRetried += 1;
  }

  recordEffectDisplayed(requestedAt = null) {
    this.diagnostics.effectDisplayed += 1;
    if (Number.isFinite(requestedAt)) {
      this.diagnostics.effectRequestToDisplayTotalMs += Math.max(0, this.now() - requestedAt);
      this.diagnostics.effectRequestToDisplayCount += 1;
    }
  }

  recordAssetTimeout(assetType = null) {
    if (assetType === 'companion') {
      this.diagnostics.companionTimeoutCount += 1;
    } else if (assetType === 'enemy') {
      this.diagnostics.enemyTimeoutCount += 1;
    }
  }

  recordAssetFallback(reason = 'permanentMissing') {
    if (reason === 'timeout') {
      this.diagnostics.fallbackBecauseTimeoutCount += 1;
    } else {
      this.diagnostics.fallbackBecausePermanentMissingCount += 1;
    }
  }

  recordLateAssetSwap() {
    this.diagnostics.lateAssetSwapCount += 1;
  }

  getDiagnostics() {
    const count = this.diagnostics.effectRequestToDisplayCount;
    const decodeCount = this.diagnostics.decodeDurationCount;
    return {
      ...this.diagnostics,
      permanentMissingKeys: [...this.missing],
      timedOutKeys: [...this.timedOut],
      retryableTimeoutKeys: [...this.retryableTimeouts],
      criticalTimedOutKeys: [...(this.diagnostics.lastCriticalTimedOutKeys ?? [])],
      criticalPermanentMissingKeys: [...(this.diagnostics.lastCriticalPermanentMissingKeys ?? [])],
      textureWarmup: { ...this.textureWarmupDiagnostics },
      effectRequestToDisplayAverageMs: count > 0
        ? Math.round(this.diagnostics.effectRequestToDisplayTotalMs / count)
        : 0,
      decodeDurationAverageMs: decodeCount > 0
        ? Math.round(this.diagnostics.decodeDurationTotalMs / decodeCount)
        : 0,
    };
  }

  now() {
    return typeof performance !== 'undefined' ? performance.now() : Date.now();
  }

  withTimeout(promise, timeoutMs, key = null) {
    if (!Number.isFinite(timeoutMs) || timeoutMs <= 0 || typeof window === 'undefined') {
      return promise;
    }

    let timeoutId = null;
    const timeout = new Promise((_, reject) => {
      timeoutId = window.setTimeout(() => {
        reject(new AssetLoadTimeoutError(key, timeoutMs));
      }, timeoutMs);
    });

    return Promise.race([promise, timeout]).finally(() => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    });
  }

  yieldToMainThread() {
    if (typeof window === 'undefined') {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      window.setTimeout(resolve, 0);
    });
  }

  async reload(key) {
    this.reloadVersion += 1;
    return this.load(key, {
      force: true,
      cacheBust: true,
    });
  }

  async reloadMany(keys) {
    this.reloadVersion += 1;

    return Promise.all(keys.map((key) => this.load(key, {
      force: true,
      cacheBust: true,
    })));
  }

  async loadGroup(groupId, options = {}) {
    const force = options.force === true;
    const items = this.getGroupItems(groupId);
    const keys = [...new Set(items.map((item) => item.key))];

    if (!force && this.loadedGroups.has(groupId)) {
      options.onProgress?.({
        groupId,
        loaded: keys.length,
        total: keys.length,
        key: null,
      });
      return this.getGroupSummary(groupId);
    }

    if (!force && this.groupPending.has(groupId)) {
      return this.groupPending.get(groupId);
    }

    let loaded = 0;
    const failed = [];
    const task = Promise.all(keys.map(async (key) => {
      const texture = await this.load(key, { force, assetType: this.getAssetType(key) });
      loaded += 1;
      options.onProgress?.({
        groupId,
        loaded,
        total: keys.length,
        key,
      });
      if (!texture) {
        failed.push(key);
      }
      return texture;
    })).then(() => {
      this.groupPending.delete(groupId);
      this.loadedGroups.add(groupId);
      if (failed.length > 0) {
        this.failedGroups.set(groupId, failed);
      } else {
        this.failedGroups.delete(groupId);
      }
      return this.getGroupSummary(groupId);
    }).catch((error) => {
      this.groupPending.delete(groupId);
      this.failedGroups.set(groupId, keys);
      throw error;
    });

    this.groupPending.set(groupId, task);
    return task;
  }

  async loadGroups(groupIds, options = {}) {
    const groups = [...new Set((Array.isArray(groupIds) ? groupIds : [groupIds]).filter(Boolean))];
    const totals = groups.map((groupId) => this.getGroupItems(groupId).length);
    const total = totals.reduce((sum, count) => sum + count, 0);
    let loaded = 0;

    const results = [];
    for (const groupId of groups) {
      const result = await this.loadGroup(groupId, {
        force: options.force === true,
        onProgress: (progress) => {
          const groupIndex = groups.indexOf(groupId);
          const prior = totals.slice(0, groupIndex).reduce((sum, count) => sum + count, 0);
          loaded = prior + progress.loaded;
          options.onProgress?.({
            groupId,
            loaded,
            total,
            groupLoaded: progress.loaded,
            groupTotal: progress.total,
            key: progress.key,
          });
        },
      });
      results.push(result);
    }

    return results;
  }

  getGroupItems(groupId) {
    return this.items.filter((item) => this.itemBelongsToGroup(item, groupId));
  }

  getGroupSummary(groupId) {
    const items = this.getGroupItems(groupId);

    return {
      groupId,
      count: items.length,
      loaded: items.filter((item) => this.cache.has(item.key)).length,
      missing: items.filter((item) => this.missing.has(item.key)).map((item) => item.key),
      timedOut: items.filter((item) => this.timedOut.has(item.key)).map((item) => item.key),
      pending: items.filter((item) => this.pending.has(item.key)).map((item) => item.key),
      failed: this.failedGroups.get(groupId) ?? [],
    };
  }

  itemBelongsToGroup(item, groupId) {
    const key = item.key.toLowerCase();
    const path = (item.path ?? '').toLowerCase();
    const category = item.category;

    if (groupId?.startsWith('dino:')) {
      const dinoId = groupId.slice('dino:'.length).toLowerCase();
      return key.includes(dinoId) || path.includes(dinoId);
    }

    if (groupId?.startsWith('stage:')) {
      const stageId = groupId.slice('stage:'.length).toLowerCase();
      return key.includes(stageId) || path.includes(stageId);
    }

    switch (groupId) {
      case 'boot':
        return category === 'titleUi' || item.key === 'homeUi.evolutionZeroLogo';
      case 'home':
        return [
          'homeUi',
          'commonUi',
          'titleFrames',
          'titleSelectUi',
          'dinoSelectHero',
          'evolutionHeroes',
        ].includes(category);
      case 'stageSelect':
        return ['stageSelectUi', 'stageThumbnails', 'commonUi'].includes(category);
      case 'dinoSelect':
        return ['dinoSelectUi', 'dinoSelectPortraits', 'dinoSelectHero', 'commonUi'].includes(category);
      case 'research':
        return ['researchUi', 'researchIcons', 'commonUi'].includes(category);
      case 'options':
        return ['optionsUi', 'commonUi'].includes(category);
      case 'codex':
        return [
          'codexUi',
          'dinos',
          'dinoSelectPortraits',
          'dinoSelectHero',
          'evolutionHeroes',
          'evolutionPortraits',
          'evolutionSheets',
        ].includes(category);
      case 'battle':
        return [
          'hudUi',
          'pauseUi',
          'selectionUi',
          'evolutionUi',
          'pickups',
          'items',
          'hitEffects',
          'adaptationIcons',
          'adaptationSkillEffects',
          'adaptationSkillIcons',
          'boostSkillIcons',
          'evolutionEffects',
          'specialEffects',
        ].includes(category);
      case 'zero':
        return category === 'zeroUi' || key.includes('zero') || path.includes('zero');
      default:
        return false;
    }
  }

  getAssetType(key = '') {
    if (key.startsWith('companions.')) {
      return 'companion';
    }
    if (key.startsWith('enemies.')) {
      return 'enemy';
    }
    if (key.startsWith('bosses.')) {
      return 'boss';
    }
    if (key.startsWith('pickups.') || key.startsWith('items.')) {
      return 'pickup';
    }
    if (key.includes('Effects.') || key.endsWith('Effect')) {
      return 'effect';
    }
    return null;
  }

  clearMissing(key = null) {
    if (key) {
      this.missing.delete(key);
      this.timedOut.delete(key);
      this.retryableTimeouts.delete(key);
      return;
    }

    this.missing.clear();
    this.timedOut.clear();
    this.retryableTimeouts.clear();
  }

  list() {
    return this.items.map((item) => ({
      ...item,
      loaded: this.cache.has(item.key),
      missing: this.missing.has(item.key),
      timedOut: this.timedOut.has(item.key),
      retryableTimeout: this.retryableTimeouts.has(item.key),
      checkedAt: this.checkedAt.get(item.key) ?? null,
    }));
  }

  getItem(key) {
    return this.items.find((entry) => entry.key === key) ?? null;
  }

  getStatus(key) {
    const texture = this.cache.get(key) ?? null;

    return {
      key,
      item: this.getItem(key),
      loaded: this.cache.has(key),
      missing: this.missing.has(key),
      timedOut: this.timedOut.has(key),
      retryableTimeout: this.retryableTimeouts.has(key),
      pending: this.pending.has(key),
      checkedAt: this.checkedAt.get(key) ?? null,
      dummy: this.getItem(key)?.meta?.testOnly === true,
      placeholderProduction: this.getItem(key)?.meta?.placeholderProduction === true,
      spriteSheet: this.getItem(key)?.meta?.spriteSheet === true,
      animations: this.getItem(key)?.meta?.animations ?? null,
      actualWidth: texture ? Math.round(texture.width ?? texture.source?.width ?? 0) : null,
      actualHeight: texture ? Math.round(texture.height ?? texture.source?.height ?? 0) : null,
    };
  }

  toUrl(path, cacheBust = null) {
    if (!path) {
      return '';
    }

    if (/^https?:\/\//.test(path)) {
      return this.withCacheBust(path, cacheBust);
    }

    return this.withCacheBust(`${import.meta.env.BASE_URL}${path}`, cacheBust);
  }

  toNormalizedUrl(path) {
    return toAssetAbsoluteUrl(path, { stripQuery: true });
  }

  withCacheBust(url, cacheBust = null) {
    if (cacheBust === null || cacheBust === undefined) {
      return url;
    }

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}asset_reload=${encodeURIComponent(cacheBust)}`;
  }

  hasPixiTextureCache(url) {
    if (!url) {
      return false;
    }

    try {
      return Boolean(
        Assets.cache?.has?.(url)
        || Assets.cache?.get?.(url)
        || Assets.get?.(url),
      );
    } catch {
      return false;
    }
  }

  recordDecodeDuration(startedAt) {
    const duration = Math.max(0, Math.round(this.now() - startedAt));

    this.diagnostics.decodeDurationMs = duration;
    this.diagnostics.decodeDurationTotalMs += duration;
    this.diagnostics.decodeDurationCount += 1;
    this.diagnostics.decodeDurationMaxMs = Math.max(this.diagnostics.decodeDurationMaxMs, duration);
  }

  subscribeLateLoad(key, callback) {
    if (!key || typeof callback !== 'function') {
      return;
    }

    const subscribers = this.lateLoadSubscribers.get(key) ?? new Set();
    subscribers.add(callback);
    this.lateLoadSubscribers.set(key, subscribers);
  }

  notifyLateLoad(key, texture) {
    const subscribers = this.lateLoadSubscribers.get(key);
    if (!subscribers?.size) {
      return;
    }

    subscribers.forEach((callback) => {
      try {
        callback(texture, key);
      } catch {
        // Late-load subscribers are best-effort visual recovery hooks.
      }
    });
    this.lateLoadSubscribers.delete(key);
  }
}
