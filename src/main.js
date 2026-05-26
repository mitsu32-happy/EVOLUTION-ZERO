import { Application } from 'pixi.js';
import { ScreenManager } from './core/screen_manager.js';
import './style.css';

const DESIGN_WIDTH = 390;
const DESIGN_HEIGHT = 844;

const appRoot = document.querySelector('#app');
const app = new Application();

let screenManager;

function registerServiceWorker() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) {
    return;
  }

  const baseUrl = import.meta.env.BASE_URL || '/';

  const register = () => {
    navigator.serviceWorker
      .register(`${baseUrl}service-worker.js`, { scope: baseUrl })
      .catch(() => {
        // PWA registration is optional; it must never block the game boot.
      });
  };

  if (document.readyState === 'complete') {
    register();
  } else {
    window.addEventListener('load', register, { once: true });
  }
}

function preventIfCancelable(event) {
  if (event.cancelable) {
    event.preventDefault();
  }
}

function installMobileInteractionGuards() {
  const guardedEvents = ['gesturestart', 'gesturechange', 'gestureend', 'dblclick', 'contextmenu'];
  let lastTouchEndAt = 0;

  guardedEvents.forEach((eventName) => {
    window.addEventListener(eventName, preventIfCancelable, { passive: false });
  });

  document.addEventListener('touchmove', preventIfCancelable, { passive: false });
  document.addEventListener('touchstart', (event) => {
    if (event.touches?.length > 1) {
      preventIfCancelable(event);
    }
  }, { passive: false });
  document.addEventListener('touchend', (event) => {
    const now = Date.now();

    if (now - lastTouchEndAt < 420) {
      preventIfCancelable(event);
    }

    lastTouchEndAt = now;
  }, { passive: false });
}

function layout() {
  const width = app.screen.width;
  const height = app.screen.height;
  const scale = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
  const offsetX = (width - DESIGN_WIDTH * scale) / 2;
  const offsetY = (height - DESIGN_HEIGHT * scale) / 2;

  app.stage.scale.set(scale);
  app.stage.position.set(offsetX, offsetY);
}

async function boot() {
  installMobileInteractionGuards();

  await app.init({
    background: '#071015',
    antialias: true,
    autoDensity: true,
    preference: 'webgl',
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    resizeTo: appRoot,
  });

  app.canvas.setAttribute('aria-label', 'EVOLUTION ZERO game screen');
  appRoot.appendChild(app.canvas);

  screenManager = new ScreenManager({
    canvas: app.canvas,
    width: DESIGN_WIDTH,
    height: DESIGN_HEIGHT,
  });

  if ([...new URLSearchParams(window.location.search).keys()].some((key) => key.startsWith('debug'))) {
    try {
      window.__EVOLUTION_ZERO_SCREEN_MANAGER__ = screenManager;
    } catch {
      // Some embedded browser inspection contexts expose a non-extensible window.
      // Debug helpers should never block the actual game boot.
    }
    try {
      appRoot.__EVOLUTION_ZERO_SCREEN_MANAGER__ = screenManager;
    } catch {
      // Optional debug handle only.
    }
  }

  app.stage.addChild(screenManager.view);
  app.ticker.add((ticker) => screenManager.update(ticker.deltaMS / 1000));

  layout();
  app.renderer.on('resize', layout);
}

boot().catch((error) => {
  console.error('[EVOLUTION ZERO] boot failed', error);
});

registerServiceWorker();
