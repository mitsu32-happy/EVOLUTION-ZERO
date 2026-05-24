import { Assets } from 'pixi.js';
import { flattenAssetManifest } from '../data/asset_manifest.js';

export class AssetLoader {
  constructor(manifest = null) {
    this.items = flattenAssetManifest(manifest ?? undefined);
    this.cache = new Map();
    this.missing = new Set();
    this.pending = new Map();
    this.checkedAt = new Map();
    this.reloadVersion = 0;
  }

  async load(key, options = {}) {
    const force = options.force === true;
    const cacheBust = options.cacheBust === true;

    if (force) {
      this.cache.delete(key);
      this.missing.delete(key);
      this.pending.delete(key);
    }

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    if (this.missing.has(key)) {
      return null;
    }

    if (this.pending.has(key)) {
      return this.pending.get(key);
    }

    const item = this.items.find((entry) => entry.key === key);

    if (!item) {
      this.missing.add(key);
      this.checkedAt.set(key, new Date());
      return null;
    }

    const task = Assets.load(this.toUrl(item.path, cacheBust ? this.reloadVersion : null))
      .then((texture) => {
        this.cache.set(key, texture);
        this.pending.delete(key);
        this.checkedAt.set(key, new Date());
        return texture;
      })
      .catch(() => {
        this.missing.add(key);
        this.pending.delete(key);
        this.checkedAt.set(key, new Date());
        return null;
      });

    this.pending.set(key, task);
    return task;
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

  clearMissing(key = null) {
    if (key) {
      this.missing.delete(key);
      return;
    }

    this.missing.clear();
  }

  list() {
    return this.items.map((item) => ({
      ...item,
      loaded: this.cache.has(item.key),
      missing: this.missing.has(item.key),
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

  withCacheBust(url, cacheBust = null) {
    if (cacheBust === null || cacheBust === undefined) {
      return url;
    }

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}asset_reload=${encodeURIComponent(cacheBust)}`;
  }
}
