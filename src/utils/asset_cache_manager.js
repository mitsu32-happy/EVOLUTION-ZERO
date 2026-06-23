import { AUDIO_PATHS } from '../audio/audio_catalog.js';
import { APP_BUILD, APP_VERSION } from '../data/app_version.js';
import { flattenAssetManifest } from '../data/asset_manifest.js';

export const ASSET_CACHE_PREFIX = 'evolution-zero-assets-';

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif']);
const AUDIO_EXTENSIONS = new Set(['.mp3', '.ogg', '.wav', '.m4a', '.aac']);
const LEGACY_MISSING_CATEGORIES = new Set(['ui', 'effects', 'maps', 'icons', 'uiIcons', 'skillIcons']);
const LEGACY_MISSING_KEYS = new Set([
  'hudUi.codexEvolutionSpeed',
  'hudUi.codexEvolutionHunting',
  'hudUi.codexEvolutionAttack',
]);
const ESTIMATED_IMAGE_BYTES = 295.78 * 1024 * 1024;
const ESTIMATED_AUDIO_BYTES = 21.27 * 1024 * 1024;
const PROGRESS_STORAGE_KEY = 'evolutionZeroAssetCacheLastUpdatedBuild';
const PROGRESS_UPDATED_AT_KEY = 'evolutionZeroAssetCacheLastUpdatedAt';

function isBrowser() {
  return typeof window !== 'undefined';
}

function getBaseUrl() {
  return import.meta.env.BASE_URL || '/';
}

function getExtension(path = '') {
  const cleanPath = String(path).split('?')[0].split('#')[0];
  const dotIndex = cleanPath.lastIndexOf('.');

  return dotIndex >= 0 ? cleanPath.slice(dotIndex).toLowerCase() : '';
}

function toAbsoluteAssetUrl(path = '') {
  const cleanPath = String(path).replace(/^\/+/, '');

  if (!isBrowser()) {
    return `${getBaseUrl()}${cleanPath}`;
  }

  return new URL(`${getBaseUrl()}${cleanPath}`, window.location.origin).href;
}

function getLocalStorage() {
  if (!isBrowser()) {
    return null;
  }

  try {
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

function makeAssetCacheName(build = APP_BUILD) {
  const safeBuild = String(build || 'unknown')
    .trim()
    .replace(/[^a-z0-9._-]+/gi, '-')
    .replace(/^-+|-+$/g, '') || 'unknown';

  return `${ASSET_CACHE_PREFIX}${safeBuild}`;
}

function isSecureLocalhost() {
  if (!isBrowser()) {
    return false;
  }

  const host = window.location.hostname;

  return host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host === '::1';
}

function isManifestAssetEligible(entry) {
  if (!entry?.path || LEGACY_MISSING_CATEGORIES.has(entry.category) || LEGACY_MISSING_KEYS.has(entry.key)) {
    return false;
  }

  return IMAGE_EXTENSIONS.has(getExtension(entry.path));
}

function uniqueByUrl(items) {
  const seen = new Set();

  return items.filter((item) => {
    if (!item?.url || seen.has(item.url)) {
      return false;
    }

    seen.add(item.url);
    return true;
  });
}

export function getAssetCacheName(build = APP_BUILD) {
  return makeAssetCacheName(build);
}

export function syncAssetCacheServiceWorker() {
  if (!isBrowser() || !('serviceWorker' in navigator)) {
    return;
  }

  const message = {
    type: 'SET_ASSET_CACHE',
    cacheName: getAssetCacheName(),
    build: APP_BUILD,
  };

  try {
    navigator.serviceWorker.controller?.postMessage(message);
    navigator.serviceWorker.ready
      ?.then((registration) => {
        registration.active?.postMessage(message);
      })
      .catch(() => {});
  } catch {
    // Service worker cache sync is best-effort only.
  }
}

export class AssetBulkCacheManager {
  constructor({ build = APP_BUILD, version = APP_VERSION } = {}) {
    this.build = build;
    this.version = version;
    this.cacheName = getAssetCacheName(build);
    this.lastProgress = this.createEmptyProgress();
    this.lastFailures = [];
  }

  createEmptyProgress() {
    return {
      supported: false,
      cacheName: this.cacheName,
      total: 0,
      cached: 0,
      downloaded: 0,
      failed: 0,
      progress: 0,
      estimatedBytes: ESTIMATED_IMAGE_BYTES,
      storageUsage: null,
      storageQuota: null,
      lastUpdatedBuild: this.getLastUpdatedBuild(),
      oldCachesCount: 0,
      currentCategory: '',
      currentUrl: '',
      isDownloading: false,
    };
  }

  getSupportStatus() {
    const cacheStorageSupported = isBrowser() && 'caches' in window;
    const serviceWorkerSupported = isBrowser() && 'serviceWorker' in navigator;
    const secureContext = isBrowser() && (window.isSecureContext || isSecureLocalhost());

    return {
      supported: Boolean(cacheStorageSupported && secureContext),
      cacheStorageSupported,
      serviceWorkerSupported,
      secureContext,
      cacheName: this.cacheName,
      build: this.build,
      version: this.version,
    };
  }

  buildAssetList({ includeAudio = false } = {}) {
    const manifestAssets = flattenAssetManifest()
      .filter(isManifestAssetEligible)
      .map((entry) => ({
        key: entry.key,
        category: entry.category,
        path: entry.path,
        url: toAbsoluteAssetUrl(entry.path),
        type: 'image',
      }));

    const audioAssets = includeAudio
      ? Object.entries(AUDIO_PATHS)
        .filter(([, value]) => value?.path && AUDIO_EXTENSIONS.has(getExtension(value.path)))
        .map(([key, value]) => ({
          key: `audio.${key}`,
          category: `audio:${value.category ?? 'misc'}`,
          path: value.path,
          url: toAbsoluteAssetUrl(value.path),
          type: 'audio',
        }))
      : [];

    return uniqueByUrl([...manifestAssets, ...audioAssets]).sort((a, b) => (
      a.category.localeCompare(b.category) || a.key.localeCompare(b.key)
    ));
  }

  getEstimatedBytes({ includeAudio = false } = {}) {
    return Math.round(ESTIMATED_IMAGE_BYTES + (includeAudio ? ESTIMATED_AUDIO_BYTES : 0));
  }

  async estimateStorage() {
    if (!isBrowser() || !navigator.storage?.estimate) {
      return { usage: null, quota: null };
    }

    try {
      const estimate = await navigator.storage.estimate();

      return {
        usage: Number.isFinite(estimate.usage) ? estimate.usage : null,
        quota: Number.isFinite(estimate.quota) ? estimate.quota : null,
      };
    } catch {
      return { usage: null, quota: null };
    }
  }

  async getOldAssetCacheNames() {
    if (!this.getSupportStatus().supported) {
      return [];
    }

    const keys = await caches.keys();

    return keys.filter((key) => key.startsWith(ASSET_CACHE_PREFIX) && key !== this.cacheName);
  }

  async getCacheStatus({ includeAudio = false } = {}) {
    const support = this.getSupportStatus();
    const items = this.buildAssetList({ includeAudio });
    const storage = await this.estimateStorage();
    const oldCaches = support.supported ? await this.getOldAssetCacheNames() : [];
    let cached = 0;

    if (support.supported) {
      const cache = await caches.open(this.cacheName);

      for (let index = 0; index < items.length; index += 1) {
        const match = await cache.match(items[index].url);
        if (match) {
          cached += 1;
        }
        if (index % 24 === 0) {
          await this.yieldToUi();
        }
      }
    }

    this.lastProgress = {
      ...this.lastProgress,
      supported: support.supported,
      cacheName: this.cacheName,
      total: items.length,
      cached,
      failed: this.lastFailures.length,
      progress: items.length > 0 ? cached / items.length : 0,
      estimatedBytes: this.getEstimatedBytes({ includeAudio }),
      storageUsage: storage.usage,
      storageQuota: storage.quota,
      lastUpdatedBuild: this.getLastUpdatedBuild(),
      oldCachesCount: oldCaches.length,
      isDownloading: false,
    };

    syncAssetCacheServiceWorker();
    return { ...this.lastProgress, failures: [...this.lastFailures] };
  }

  async downloadAll({ includeAudio = false, onProgress = null, signal = null } = {}) {
    const support = this.getSupportStatus();
    const items = this.buildAssetList({ includeAudio });
    const storage = await this.estimateStorage();

    if (!support.supported) {
      this.lastProgress = {
        ...this.lastProgress,
        supported: false,
        total: items.length,
        estimatedBytes: this.getEstimatedBytes({ includeAudio }),
        storageUsage: storage.usage,
        storageQuota: storage.quota,
      };
      onProgress?.({ ...this.lastProgress, failures: [...this.lastFailures] });
      return { ...this.lastProgress, failures: [...this.lastFailures] };
    }

    const cache = await caches.open(this.cacheName);
    const failures = [];
    let cached = 0;
    let downloaded = 0;
    let completed = 0;

    this.lastFailures = [];
    this.lastProgress = {
      ...this.lastProgress,
      supported: true,
      total: items.length,
      cached: 0,
      downloaded: 0,
      failed: 0,
      progress: 0,
      estimatedBytes: this.getEstimatedBytes({ includeAudio }),
      storageUsage: storage.usage,
      storageQuota: storage.quota,
      isDownloading: true,
    };
    onProgress?.({ ...this.lastProgress, failures: [] });

    for (let index = 0; index < items.length; index += 1) {
      if (signal?.aborted) {
        break;
      }

      const item = items[index];
      try {
        const existing = await cache.match(item.url);
        if (existing) {
          cached += 1;
        } else {
          const response = await fetch(item.url, {
            cache: 'reload',
            credentials: 'same-origin',
            signal,
          });
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          await cache.put(item.url, response.clone());
          downloaded += 1;
          cached += 1;
        }
      } catch (error) {
        if (signal?.aborted) {
          break;
        }
        failures.push({
          key: item.key,
          category: item.category,
          path: item.path,
          url: item.url,
          reason: error?.message ?? 'download failed',
        });
      }

      completed += 1;
      this.lastProgress = {
        ...this.lastProgress,
        total: items.length,
        cached,
        downloaded,
        failed: failures.length,
        progress: items.length > 0 ? completed / items.length : 0,
        currentCategory: item.category,
        currentUrl: item.path,
        isDownloading: true,
      };
      onProgress?.({ ...this.lastProgress, failures: [...failures] });

      if (index % 4 === 0) {
        await this.yieldToUi();
      }
    }

    this.lastFailures = failures;
    this.lastProgress = {
      ...this.lastProgress,
      failed: failures.length,
      progress: items.length > 0 ? (signal?.aborted ? this.lastProgress.progress : 1) : 1,
      currentCategory: signal?.aborted ? '中止' : '',
      currentUrl: '',
      isDownloading: false,
      lastUpdatedBuild: failures.length === 0 && !signal?.aborted ? this.markUpdated() : this.getLastUpdatedBuild(),
    };
    syncAssetCacheServiceWorker();
    onProgress?.({ ...this.lastProgress, failures: [...failures] });

    return { ...this.lastProgress, failures: [...failures] };
  }

  async clearOldCaches() {
    const support = this.getSupportStatus();
    if (!support.supported) {
      return { deleted: 0 };
    }

    const oldCaches = await this.getOldAssetCacheNames();
    await Promise.all(oldCaches.map((key) => caches.delete(key)));
    await this.getCacheStatus();

    return { deleted: oldCaches.length };
  }

  async clearCurrentCache() {
    const support = this.getSupportStatus();
    if (!support.supported) {
      return { deleted: false };
    }

    const deleted = await caches.delete(this.cacheName);
    this.lastFailures = [];
    const storage = getLocalStorage();
    try {
      storage?.removeItem(PROGRESS_STORAGE_KEY);
      storage?.removeItem(PROGRESS_UPDATED_AT_KEY);
    } catch {
      // Local cache metadata is optional.
    }
    await this.getCacheStatus();

    return { deleted };
  }

  getDiagnostics() {
    return {
      supported: this.lastProgress.supported,
      cacheName: this.cacheName,
      total: this.lastProgress.total,
      cached: this.lastProgress.cached,
      failed: this.lastProgress.failed,
      progress: this.lastProgress.progress,
      estimatedBytes: this.lastProgress.estimatedBytes,
      storageUsage: this.lastProgress.storageUsage,
      storageQuota: this.lastProgress.storageQuota,
      lastUpdatedBuild: this.lastProgress.lastUpdatedBuild,
      oldCachesCount: this.lastProgress.oldCachesCount,
    };
  }

  getLastUpdatedBuild() {
    const storage = getLocalStorage();

    try {
      return storage?.getItem(PROGRESS_STORAGE_KEY) ?? null;
    } catch {
      return null;
    }
  }

  markUpdated() {
    const storage = getLocalStorage();

    try {
      storage?.setItem(PROGRESS_STORAGE_KEY, this.build);
      storage?.setItem(PROGRESS_UPDATED_AT_KEY, String(Date.now()));
    } catch {
      // Local cache metadata is optional.
    }

    return this.build;
  }

  yieldToUi() {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.requestAnimationFrame) {
        window.requestAnimationFrame(() => resolve());
      } else {
        setTimeout(resolve, 0);
      }
    });
  }
}
