const ASSET_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif', '.mp3', '.ogg', '.wav', '.m4a', '.aac']);

export function getAssetBaseUrl() {
  return import.meta.env.BASE_URL || '/';
}

export function getAssetExtension(path = '') {
  const cleanPath = String(path).split('?')[0].split('#')[0];
  const dotIndex = cleanPath.lastIndexOf('.');

  return dotIndex >= 0 ? cleanPath.slice(dotIndex).toLowerCase() : '';
}

export function toAssetAbsoluteUrl(path = '', { stripQuery = false } = {}) {
  const rawPath = String(path || '');
  const cleanPath = rawPath.replace(/^\/+/, '');
  const base = getAssetBaseUrl();
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://example.invalid';
  const url = /^https?:\/\//.test(rawPath)
    ? new URL(rawPath)
    : new URL(`${base}${cleanPath}`, baseUrl);

  if (stripQuery) {
    url.search = '';
    url.hash = '';
  }

  return typeof window !== 'undefined' ? url.href : `${url.pathname}${url.search}${url.hash}`;
}

export function normalizeAssetRequestUrl(urlLike = '') {
  if (!urlLike) {
    return '';
  }

  try {
    const url = new URL(String(urlLike), typeof window !== 'undefined' ? window.location.href : 'https://example.invalid/');
    const base = getAssetBaseUrl();
    const normalizedBase = base.endsWith('/') ? base : `${base}/`;

    if (!url.pathname.startsWith(normalizedBase)) {
      return '';
    }

    const relativePath = url.pathname.slice(normalizedBase.length).replace(/^\/+/, '');
    if (!relativePath.startsWith('assets/') || !ASSET_EXTENSIONS.has(getAssetExtension(relativePath))) {
      return '';
    }

    url.search = '';
    url.hash = '';
    return typeof window !== 'undefined' ? url.href : url.pathname;
  } catch {
    return '';
  }
}

export function isAssetRequestUrl(urlLike = '') {
  return Boolean(normalizeAssetRequestUrl(urlLike));
}
