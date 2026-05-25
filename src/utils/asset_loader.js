import { Assets } from 'pixi.js';
import { flattenAssetManifest } from '../data/asset_manifest.js';

export class AssetLoader {
  constructor(manifest = null) {
    this.items = flattenAssetManifest(manifest ?? undefined);
    this.cache = new Map();
    this.missing = new Set();
    this.pending = new Map();
    this.groupPending = new Map();
    this.loadedGroups = new Set();
    this.failedGroups = new Map();
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
      const texture = await this.load(key, { force });
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
          'player',
          'playerSheets',
          'pickups',
          'items',
          'hitEffects',
          'normalAttackEffects',
          'normalAttackIcons',
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
