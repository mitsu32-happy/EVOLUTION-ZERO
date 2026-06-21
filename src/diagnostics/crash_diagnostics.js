import { APP_BUILD, APP_VERSION } from '../data/app_version.js';

const CRASH_REPORT_STORAGE_KEY = 'EVOLUTION_ZERO_CRASH_REPORT';
const DEBUG_CRASH_SESSION_KEY = 'EVOLUTION_ZERO_DEBUG_CRASH_TRIGGERED';
const CRASH_TICKER_STALL_MS = 8000;
const STACK_LINE_LIMIT = 7;

let installed = false;
let crashVisible = false;
let contextProvider = null;
let lastHeartbeatAt = Date.now();
let hasHeartbeat = false;
let lastContext = {};

function safeNowIso() {
  try {
    return new Date().toISOString();
  } catch {
    return `${Date.now()}`;
  }
}

function normalizeError(errorLike) {
  const error = errorLike?.error ?? errorLike?.reason ?? errorLike;
  const message = error?.message ?? errorLike?.message ?? String(error ?? 'Unknown error');
  const stack = error?.stack ?? errorLike?.stack ?? '';

  return {
    message,
    stack: String(stack || '').split('\n').slice(0, STACK_LINE_LIMIT).join('\n'),
    filename: errorLike?.filename ?? null,
    lineno: errorLike?.lineno ?? null,
    colno: errorLike?.colno ?? null,
  };
}

function readJsonishAttribute() {
  try {
    const raw = document?.body?.getAttribute?.('data-ez-perf-latest');

    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function readLastPerformanceSnapshot() {
  try {
    if (window.__EVOLUTION_ZERO_LAST_PERF_SNAPSHOT__) {
      return window.__EVOLUTION_ZERO_LAST_PERF_SNAPSHOT__;
    }
  } catch {
    // Optional debug handle.
  }

  const attrSnapshot = readJsonishAttribute();
  if (attrSnapshot) {
    return attrSnapshot;
  }

  try {
    const raw = localStorage.getItem('EVOLUTION_ZERO_LAST_PERF_SNAPSHOT');

    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function pickSnapshotValue(snapshot, key, fallback = '-') {
  const value = snapshot?.[key];

  return value === undefined || value === null ? fallback : value;
}

function buildCrashReport(reason, payload = {}, context = {}) {
  const normalizedError = normalizeError(payload);
  const providedSnapshot = context?.latestSnapshot ?? context?.snapshot ?? null;
  const contextScreen = context?.screen ?? context?.currentScreen ?? null;
  const shouldUseStoredSnapshot = !contextScreen || contextScreen === 'play';
  const snapshot = providedSnapshot ?? (shouldUseStoredSnapshot ? readLastPerformanceSnapshot() : null) ?? {};
  const stage = context?.stage ?? snapshot.stage ?? snapshot.selectedStage ?? '-';
  const difficulty = context?.difficulty ?? snapshot.difficulty ?? snapshot.selectedDifficulty ?? '-';
  const mode = context?.mode ?? snapshot.mode ?? snapshot.selectedMode ?? '-';
  const elapsedTime = context?.elapsedTime ?? snapshot.elapsedTime ?? '-';
  const webglContextLost = Boolean(
    context?.webglContextLost
    || payload?.webglContextLost
    || (snapshot.diagnostics?.contextLost ?? 0) > 0,
  );

  return {
    title: 'EVOLUTION ZERO Crash Report',
    version: APP_VERSION,
    build: APP_BUILD,
    reason,
    timestamp: safeNowIso(),
    url: typeof location !== 'undefined' ? location.href : '-',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '-',
    screen: contextScreen ?? '-',
    stage,
    difficulty,
    mode,
    elapsedTime,
    enemyCount: pickSnapshotValue(snapshot, 'enemyCount'),
    projectileCount: pickSnapshotValue(snapshot, 'projectileCount'),
    bossProjectileCount: pickSnapshotValue(snapshot, 'bossProjectileCount'),
    hazardCount: pickSnapshotValue(snapshot, 'hazardCount'),
    warningGuideCount: pickSnapshotValue(snapshot, 'warningGuideCount'),
    effectCount: pickSnapshotValue(snapshot, 'effectCount'),
    ultimateEffectCount: pickSnapshotValue(snapshot, 'ultimateEffectCount'),
    damageTextCount: pickSnapshotValue(snapshot, 'damageTextCount'),
    criticalTextCount: pickSnapshotValue(snapshot, 'criticalTextCount'),
    pickupCount: pickSnapshotValue(snapshot, 'pickupCount'),
    containerChildrenTotal: pickSnapshotValue(snapshot, 'containerChildrenTotal'),
    loadSheddingLevel: pickSnapshotValue(snapshot, 'loadSheddingLevel'),
    spawnBudget: pickSnapshotValue(snapshot, 'spawnBudget'),
    activeAudioCount: pickSnapshotValue(snapshot, 'activeAudioCount'),
    fps: pickSnapshotValue(snapshot, 'fps'),
    tickerDelta: pickSnapshotValue(snapshot, 'tickerDelta'),
    webglContextLost,
    errorMessage: normalizedError.message,
    stack: normalizedError.stack,
    source: {
      filename: normalizedError.filename,
      lineno: normalizedError.lineno,
      colno: normalizedError.colno,
    },
    latestSnapshot: snapshot,
  };
}

function formatReportText(report) {
  return [
    report.title,
    '',
    `Version: ${report.version}`,
    `Build: ${report.build}`,
    `Timestamp: ${report.timestamp}`,
    `Screen: ${report.screen}`,
    `Stage: ${report.stage}`,
    `Mode: ${report.mode}`,
    `Difficulty: ${report.difficulty}`,
    `Elapsed Time: ${report.elapsedTime}`,
    '',
    `enemyCount=${report.enemyCount}`,
    `projectileCount=${report.projectileCount}`,
    `bossProjectileCount=${report.bossProjectileCount}`,
    `hazardCount=${report.hazardCount}`,
    `warningGuideCount=${report.warningGuideCount}`,
    `effectCount=${report.effectCount}`,
    `ultimateEffectCount=${report.ultimateEffectCount}`,
    `damageTextCount=${report.damageTextCount}`,
    `criticalTextCount=${report.criticalTextCount}`,
    `pickupCount=${report.pickupCount}`,
    `containerChildrenTotal=${report.containerChildrenTotal}`,
    `loadShedding=${report.loadSheddingLevel}`,
    `spawnBudget=${report.spawnBudget}`,
    `activeAudioCount=${report.activeAudioCount}`,
    `fps=${report.fps}`,
    `tickerDelta=${report.tickerDelta}`,
    `webglContextLost=${report.webglContextLost ? 'yes' : 'no'}`,
    '',
    'Error:',
    report.errorMessage,
    '',
    'Stack:',
    report.stack || '-',
    '',
    `URL: ${report.url}`,
    `UserAgent: ${report.userAgent}`,
  ].join('\n');
}

function storeCrashReport(report) {
  try {
    localStorage.setItem(CRASH_REPORT_STORAGE_KEY, JSON.stringify(report));
  } catch {
    // Storage may be unavailable on some PWA/iOS states.
  }

  try {
    window.__EVOLUTION_ZERO_CRASH_REPORT__ = report;
  } catch {
    // Optional debug handle.
  }
}

function createStyles(node) {
  const viewportWidth = window.innerWidth || 390;
  const viewportHeight = window.innerHeight || 844;

  Object.assign(node.style, {
    position: 'fixed',
    left: '0px',
    top: '0px',
    width: `${viewportWidth}px`,
    height: `${viewportHeight}px`,
    zIndex: '2147483647',
    overflow: 'auto',
    boxSizing: 'border-box',
    padding: '0',
    background: 'transparent',
    color: '#e8fbff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    WebkitOverflowScrolling: 'touch',
  });
}

function getGameViewportRect() {
  const candidates = [
    document?.querySelector?.('canvas'),
    document?.querySelector?.('#app'),
  ].filter(Boolean);

  for (const node of candidates) {
    const rect = node.getBoundingClientRect?.();
    if (rect?.width > 0 && rect?.height > 0) {
      return {
        left: Math.max(0, rect.left),
        top: Math.max(0, rect.top),
        width: Math.min(window.innerWidth || rect.width, rect.width),
        height: Math.min(window.innerHeight || rect.height, rect.height),
      };
    }
  }

  const viewportWidth = window.innerWidth || 390;
  const viewportHeight = window.innerHeight || 844;
  const scale = Math.min(viewportWidth / 390, viewportHeight / 844);
  const width = Math.max(1, Math.floor(390 * scale));
  const height = Math.max(1, Math.floor(844 * scale));

  return {
    left: Math.max(0, Math.floor((viewportWidth - width) / 2)),
    top: Math.max(0, Math.floor((viewportHeight - height) / 2)),
    width,
    height,
  };
}

function makeMetric(label, value) {
  return `<div class="ez-crash-metric"><span>${label}</span><b>${value}</b></div>`;
}

function renderCrashScreen(report) {
  if (typeof document === 'undefined') {
    return;
  }

  let root = document.getElementById('evolution-zero-crash-screen');
  const reportText = formatReportText(report);

  if (!root) {
    root = document.createElement('section');
    root.id = 'evolution-zero-crash-screen';
    document.body.appendChild(root);
  }

  createStyles(root);

  root.innerHTML = `
    <style>
      #evolution-zero-crash-screen {
        position: fixed;
        inset: 0;
        z-index: 2147483647;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        min-height: 100dvh;
        padding: max(12px, env(safe-area-inset-top)) max(10px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(10px, env(safe-area-inset-left));
        overflow: auto;
        background:
          radial-gradient(circle at 50% 18%, rgba(29, 167, 190, 0.22), rgba(3, 9, 15, 0.2) 42%, rgba(1, 5, 9, 0.88) 100%),
          rgba(1, 6, 10, 0.94);
        color: #eaffff;
        overscroll-behavior: contain;
      }
      #evolution-zero-crash-screen * { box-sizing: border-box; }
      .ez-crash-card {
        width: min(100%, 540px);
        max-height: calc(100dvh - 24px);
        margin: auto;
        border: 1px solid rgba(82, 227, 255, 0.58);
        border-radius: 12px;
        background: rgba(4, 13, 22, 0.96);
        box-shadow: 0 0 28px rgba(20, 210, 255, 0.18);
        padding: 12px;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
      }
      .ez-crash-title { margin: 0 0 6px; font-size: 18px; line-height: 1.25; color: #ffffff; }
      .ez-crash-body { margin: 0 0 8px; font-size: 12px; line-height: 1.5; color: #c9edf2; }
      .ez-crash-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin: 8px 0; }
      .ez-crash-metric { min-width: 0; border: 1px solid rgba(96, 151, 174, 0.34); border-radius: 7px; padding: 5px 6px; background: rgba(9, 26, 38, 0.82); }
      .ez-crash-metric span { display: block; color: #8fb8c6; font-size: 9px; line-height: 1.15; }
      .ez-crash-metric b { display: block; color: #f4fdff; font-size: 12px; line-height: 1.25; overflow-wrap: anywhere; }
      .ez-crash-error {
        margin: 8px 0;
        border-radius: 8px;
        padding: 8px;
        background: rgba(1, 6, 10, 0.88);
        border: 1px solid rgba(255, 115, 115, 0.42);
        color: #ffd7d7;
        font: 11px/1.45 ui-monospace, SFMono-Regular, Consolas, monospace;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        max-height: 84px;
        overflow: auto;
      }
      .ez-crash-actions {
        position: sticky;
        bottom: 0;
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 8px;
        padding-top: 7px;
        background: linear-gradient(180deg, rgba(4, 13, 22, 0.78), rgba(4, 13, 22, 0.98));
      }
      .ez-crash-actions button {
        appearance: none;
        border: 1px solid rgba(90, 232, 255, 0.72);
        border-radius: 8px;
        background: rgba(11, 42, 56, 0.96);
        color: #eaffff;
        font-weight: 800;
        font-size: 13px;
        min-height: 40px;
        padding: 8px 12px;
      }
      .ez-crash-copy-state { min-height: 18px; margin-top: 8px; color: #8effd7; font-size: 12px; }
      .ez-crash-compact { color: #9ec4cf; font-size: 11px; line-height: 1.45; margin-top: 10px; overflow-wrap: anywhere; }
      .ez-crash-report-text {
        width: 100%;
        max-height: min(26vh, 140px);
        margin-top: 8px;
        border: 1px solid rgba(96, 151, 174, 0.34);
        border-radius: 8px;
        background: rgba(1, 6, 10, 0.82);
        color: #d8f8ff;
        font: 10px/1.4 ui-monospace, SFMono-Regular, Consolas, monospace;
        padding: 7px;
        white-space: pre-wrap;
        overflow: auto;
        user-select: text;
        -webkit-user-select: text;
      }
      @media (max-width: 380px) {
        #evolution-zero-crash-screen { padding: 8px; align-items: flex-start; }
        .ez-crash-card { width: 100%; max-height: calc(100dvh - 16px); padding: 8px; }
        .ez-crash-grid { grid-template-columns: 1fr; }
        .ez-crash-title { font-size: 17px; }
        .ez-crash-body { font-size: 11px; }
        .ez-crash-actions button { flex: 1 1 100%; }
      }
    </style>
    <div class="ez-crash-card">
      <h1 class="ez-crash-title">\u30b2\u30fc\u30e0\u304c\u505c\u6b62\u3057\u307e\u3057\u305f</h1>
      <p class="ez-crash-body">\u4e88\u671f\u3057\u306a\u3044\u30a8\u30e9\u30fc\u304c\u767a\u751f\u3057\u307e\u3057\u305f\u3002\u8a3a\u65ad\u60c5\u5831\u3092\u30b3\u30d4\u30fc\u3057\u3066\u5831\u544a\u3057\u3066\u304f\u3060\u3055\u3044\u3002</p>
      <div class="ez-crash-grid">
        ${makeMetric('Version', report.version)}
        ${makeMetric('Build', report.build)}
        ${makeMetric('Stage', report.stage)}
        ${makeMetric('Difficulty', report.difficulty)}
        ${makeMetric('Elapsed', report.elapsedTime)}
        ${makeMetric('WebGL lost', report.webglContextLost ? 'yes' : 'no')}
        ${makeMetric('Enemies', report.enemyCount)}
        ${makeMetric('Projectiles', report.projectileCount)}
        ${makeMetric('Hazards', report.hazardCount)}
        ${makeMetric('Warnings', report.warningGuideCount)}
        ${makeMetric('Effects', report.effectCount)}
        ${makeMetric('Damage Text', report.damageTextCount)}
        ${makeMetric('Critical Text', report.criticalTextCount)}
        ${makeMetric('Pickups', report.pickupCount)}
        ${makeMetric('Children', report.containerChildrenTotal)}
        ${makeMetric('Load shedding', report.loadSheddingLevel)}
      </div>
      <div class="ez-crash-error">${escapeHtml(`Error:\n${report.errorMessage}\n\nStack:\n${report.stack || '-'}`)}</div>
      <div class="ez-crash-actions">
        <button type="button" id="ez-crash-copy">\u8a3a\u65ad\u60c5\u5831\u3092\u30b3\u30d4\u30fc</button>
        <button type="button" id="ez-crash-reload">\u518d\u8d77\u52d5</button>
      </div>
      <div class="ez-crash-copy-state" id="ez-crash-copy-state"></div>
      <pre class="ez-crash-report-text" id="ez-crash-report-text" aria-label="\u8a3a\u65ad\u60c5\u5831">${escapeHtml(reportText)}</pre>
      <div class="ez-crash-compact">\u4fdd\u5b58\u30ad\u30fc: ${CRASH_REPORT_STORAGE_KEY}<br>Timestamp: ${report.timestamp}</div>
    </div>
  `;

  const copyButton = root.querySelector('#ez-crash-copy');
  const reloadButton = root.querySelector('#ez-crash-reload');
  const state = root.querySelector('#ez-crash-copy-state');
  const reportTextarea = root.querySelector('#ez-crash-report-text');
  const compact = root.querySelector('.ez-crash-compact');

  const title = root.querySelector('.ez-crash-title');
  const body = root.querySelector('.ez-crash-body');
  if (title) {
    title.textContent = '\u30b2\u30fc\u30e0\u304c\u505c\u6b62\u3057\u307e\u3057\u305f';
  }
  if (body) {
    body.textContent = '\u4e88\u671f\u3057\u306a\u3044\u30a8\u30e9\u30fc\u304c\u767a\u751f\u3057\u307e\u3057\u305f\u3002\u8a3a\u65ad\u60c5\u5831\u3092\u30b3\u30d4\u30fc\u3057\u3066\u5831\u544a\u3057\u3066\u304f\u3060\u3055\u3044\u3002';
  }
  if (copyButton) {
    copyButton.textContent = '\u8a3a\u65ad\u60c5\u5831\u3092\u30b3\u30d4\u30fc';
  }
  if (reloadButton) {
    reloadButton.textContent = '\u518d\u8d77\u52d5';
  }
  if (reportTextarea) {
    reportTextarea.setAttribute('aria-label', '\u8a3a\u65ad\u60c5\u5831');
  }
  if (compact) {
    compact.textContent = `\u4fdd\u5b58\u30ad\u30fc: ${CRASH_REPORT_STORAGE_KEY} / Timestamp: ${report.timestamp}`;
  }

  requestAnimationFrame?.(() => createStyles(root));
  window.setTimeout?.(() => createStyles(root), 300);

  copyButton?.addEventListener('click', async () => {
    const ok = await copyText(reportText);
    if (state) {
      state.textContent = ok ? '\u8a3a\u65ad\u60c5\u5831\u3092\u30b3\u30d4\u30fc\u3057\u307e\u3057\u305f\u3002' : '\u30b3\u30d4\u30fc\u3067\u304d\u307e\u305b\u3093\u3067\u3057\u305f\u3002\u8a3a\u65ad\u60c5\u5831\u6b04\u3092\u9577\u62bc\u3057\u3057\u3066\u304f\u3060\u3055\u3044\u3002';
    }

    if (!ok && reportTextarea) {
      const selection = window.getSelection?.();
      const range = document.createRange?.();
      if (selection && range) {
        range.selectNodeContents(reportTextarea);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  });

  reloadButton?.addEventListener('click', () => {
    try {
      const url = new URL(location.href);
      url.searchParams.delete('debugCrash');
      location.replace(url.toString());
    } catch {
      location.reload();
    }
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback below.
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', 'readonly');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    const ok = document.execCommand?.('copy') ?? false;
    textarea.remove();
    return ok;
  } catch {
    return false;
  }
}

export function updateCrashDiagnosticsContext(context = {}) {
  lastContext = { ...lastContext, ...context };
  lastHeartbeatAt = Date.now();
}

export function markCrashDiagnosticsHeartbeat(context = {}) {
  hasHeartbeat = true;
  updateCrashDiagnosticsContext(context);
}

function shouldReportWindowError(event) {
  return Boolean(event?.error || event?.message || (typeof ErrorEvent !== 'undefined' && event instanceof ErrorEvent));
}

export function showCrashDiagnostics(reason, payload = {}, context = null) {
  if (crashVisible && reason !== 'manual') {
    return null;
  }

  crashVisible = true;

  let providedContext = {};
  try {
    providedContext = typeof context === 'function' ? context(reason, payload) : context ?? {};
  } catch (error) {
    providedContext = { contextError: String(error?.message ?? error) };
  }

  let providerContext = {};
  try {
    providerContext = contextProvider?.(reason, payload) ?? {};
  } catch (error) {
    providerContext = { providerError: String(error?.message ?? error) };
  }

  const report = buildCrashReport(reason, payload, {
    ...lastContext,
    ...providerContext,
    ...providedContext,
  });

  storeCrashReport(report);
  renderCrashScreen(report);
  return report;
}

export function installCrashDiagnostics({ getContext = null } = {}) {
  contextProvider = getContext ?? contextProvider;

  if (installed || typeof window === 'undefined') {
    return;
  }

  installed = true;

  window.addEventListener('error', (event) => {
    if (!shouldReportWindowError(event)) {
      return;
    }
    showCrashDiagnostics('runtime-error', event);
  });

  window.addEventListener('unhandledrejection', (event) => {
    showCrashDiagnostics('unhandled-rejection', event);
  });

  window.setInterval(() => {
    if (crashVisible || document?.visibilityState === 'hidden') {
      return;
    }

    if (!hasHeartbeat || lastContext.currentScreen !== 'play') {
      return;
    }

    const elapsed = Date.now() - lastHeartbeatAt;
    if (elapsed > CRASH_TICKER_STALL_MS) {
      showCrashDiagnostics('ticker-stall', {
        message: `Ticker heartbeat stalled for ${elapsed}ms`,
      });
    }
  }, 2000);

  const params = new URLSearchParams(window.location.search);
  const debugCrash = params.get('debugCrash');
  if (debugCrash === 'runtime') {
    let alreadyTriggered = false;
    try {
      alreadyTriggered = sessionStorage.getItem(DEBUG_CRASH_SESSION_KEY) === 'runtime';
      sessionStorage.setItem(DEBUG_CRASH_SESSION_KEY, 'runtime');
    } catch {
      // Session storage is optional; if unavailable, keep the explicit debug behavior.
    }

    if (alreadyTriggered) {
      return;
    }

    window.setTimeout(() => {
      throw new Error('Debug crash diagnostics test');
    }, 1200);
  } else {
    try {
      sessionStorage.removeItem(DEBUG_CRASH_SESSION_KEY);
    } catch {
      // Optional debug state only.
    }
  }
}
