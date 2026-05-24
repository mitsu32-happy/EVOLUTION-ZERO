import { Assets, Container, Graphics, Sprite, Text, Texture } from 'pixi.js';
import { ASSET_KEYS } from '../data/asset_manifest.js';
import { playPressFeedback } from './ui_feedback.js';
import { drawBottomNavFrame, UI_COLORS, UI_LAYOUT } from './ui_theme.js';

const NAV_WIDTH = 84;
const NAV_GAP = 8;

const COMMON_ASSET_PATHS = {
  bottomNavBackground: 'assets/ui/common/bottom_nav_background.png',
  navButtonIdle: 'assets/ui/common/nav_button_idle.png',
  navButtonSelected: 'assets/ui/common/nav_button_selected.png',
  navHomeIcon: 'assets/ui/common/nav_home_icon.png',
  navResearchIcon: 'assets/ui/common/nav_research_icon.png',
  navCodexIcon: 'assets/ui/common/nav_codex_icon.png',
  navSettingsIcon: 'assets/ui/common/nav_settings_icon.png',
  navHomeIdle: 'assets/ui/common/nav_home_idle.png',
  navHomeSelected: 'assets/ui/common/nav_home_selected.png',
  navResearchIdle: 'assets/ui/common/nav_research_idle.png',
  navResearchSelected: 'assets/ui/common/nav_research_selected.png',
  navCodexIdle: 'assets/ui/common/nav_codex_idle.png',
  navCodexSelected: 'assets/ui/common/nav_codex_selected.png',
  navSettingsIdle: 'assets/ui/common/nav_settings_idle.png',
  navSettingsSelected: 'assets/ui/common/nav_settings_selected.png',
};

const NAV_ITEMS = [
  {
    id: 'home',
    label: 'ホーム',
    shortLabel: 'HOME',
    color: UI_COLORS.dna,
    iconName: 'navHomeIcon',
    idleName: 'navHomeIdle',
    selectedName: 'navHomeSelected',
  },
  {
    id: 'research',
    label: '研究',
    shortLabel: 'DNA',
    color: UI_COLORS.green,
    iconName: 'navResearchIcon',
    idleName: 'navResearchIdle',
    selectedName: 'navResearchSelected',
  },
  {
    id: 'codex',
    label: '図鑑',
    shortLabel: 'CODEX',
    color: 0x6ba9ff,
    iconName: 'navCodexIcon',
    idleName: 'navCodexIdle',
    selectedName: 'navCodexSelected',
  },
  {
    id: 'options',
    label: '設定',
    shortLabel: 'SET',
    color: 0xd7e5e3,
    iconName: 'navSettingsIcon',
    idleName: 'navSettingsIdle',
    selectedName: 'navSettingsSelected',
  },
];

const textureCache = new Map();

export function createBottomNav({ width, height, active = 'home', onNavigate = null, assetLoader = null }) {
  const view = new Container();
  const buttons = new Map();
  const textures = new Map();
  const totalWidth = NAV_ITEMS.length * NAV_WIDTH + (NAV_ITEMS.length - 1) * NAV_GAP;
  const startX = Math.max(12, Math.round((width - totalWidth) / 2));
  const y = height - UI_LAYOUT.bottomNavHeight - 8;
  const backdrop = new Sprite(Texture.EMPTY);

  backdrop.position.set(8, y - 5);
  backdrop.width = width - 16;
  backdrop.height = UI_LAYOUT.bottomNavHeight + 10;
  backdrop.alpha = 0.9;
  backdrop.visible = false;
  view.addChild(backdrop);

  NAV_ITEMS.forEach((item, index) => {
    const selected = item.id === active;
    const button = createNavButton(item, selected);

    button.view.position.set(startX + index * (NAV_WIDTH + NAV_GAP), y);
    button.view.on('pointertap', () => {
      playPressFeedback(button.view, {
        width: NAV_WIDTH,
        height: UI_LAYOUT.bottomNavHeight,
        scale: 0.97,
        alpha: 0.82,
        duration: 100,
      });
      setTimeout(() => onNavigate?.(item.id), 70);
    });
    buttons.set(item.id, button);
    view.addChild(button.view);
  });

  const api = {
    view,
    buttons,
    setActive(nextActive) {
      buttons.forEach((button, id) => updateButtonVisual(button, id === nextActive, textures));
    },
  };

  loadCommonNavTextures(assetLoader).then((loadedTextures) => {
    loadedTextures.forEach((texture, name) => textures.set(name, texture));
    const navBackground = textures.get('bottomNavBackground') ?? null;

    backdrop.texture = navBackground ?? Texture.EMPTY;
    backdrop.visible = !!navBackground;
    api.setActive(active);
  });

  return api;
}

function createNavButton(item, selected) {
  const view = new Container();
  const bg = new Graphics();
  const frame = new Sprite(Texture.EMPTY);
  const icon = new Sprite(Texture.EMPTY);
  const iconFallback = new Graphics();
  const short = createText(item.shortLabel, item.shortLabel.length > 4 ? 8 : 10, selected ? '#7cf7d4' : '#8da49e', 70);
  const text = createText(item.label, 11, '#e7fff6', 72);

  frame.position.set(0, 0);
  frame.width = NAV_WIDTH;
  frame.height = UI_LAYOUT.bottomNavHeight;
  frame.visible = false;

  icon.anchor.set(0.5);
  icon.position.set(42, 39);
  icon.width = 22;
  icon.height = 22;
  icon.visible = false;

  short.anchor.set(0.5);
  short.position.set(42, 39);
  text.anchor.set(0.5);
  text.position.set(42, 62);
  view.eventMode = 'static';
  view.cursor = 'pointer';
  view.addChild(bg, frame, iconFallback, icon, short, text);

  const button = { view, bg, frame, icon, iconFallback, short, text, item };
  updateButtonVisual(button, selected, new Map());

  return button;
}

function updateButtonVisual(button, selected, textures) {
  const integratedTexture = selected
    ? textures.get(button.item.selectedName) ?? textures.get(button.item.idleName) ?? null
    : textures.get(button.item.idleName) ?? null;
  const legacyFrameTexture = selected
    ? textures.get('navButtonSelected') ?? textures.get('navButtonIdle') ?? null
    : textures.get('navButtonIdle') ?? null;
  const frameTexture = integratedTexture ?? legacyFrameTexture;
  const iconTexture = textures.get(button.item.iconName) ?? null;
  const usesIntegratedButton = !!integratedTexture;

  button.frame.texture = frameTexture ?? Texture.EMPTY;
  button.frame.visible = !!frameTexture;
  button.bg.visible = !frameTexture;
  button.icon.texture = iconTexture ?? Texture.EMPTY;
  button.icon.visible = !usesIntegratedButton && !!iconTexture;
  button.iconFallback.visible = !usesIntegratedButton && !iconTexture;
  button.short.visible = !usesIntegratedButton && !iconTexture;
  button.text.style.fill = selected ? '#f4fffb' : '#9db2ad';
  button.text.style.fontSize = selected ? 11 : 10;
  button.text.position.y = usesIntegratedButton ? 62 : 62;

  if (!frameTexture) {
    drawBottomNavFrame(button.bg, NAV_WIDTH, selected, button.item.color);
  } else {
    button.bg.clear();
  }

  button.iconFallback
    .clear()
    .circle(42, 39, 12)
    .fill({ color: button.item.color, alpha: selected ? 0.36 : 0.18 })
    .stroke({ color: button.item.color, width: 2, alpha: selected ? 0.9 : 0.48 });
  button.short.style.fill = selected ? '#7cf7d4' : '#8da49e';
}

async function loadCommonNavTextures(assetLoader) {
  const requests = [
    ['bottomNavBackground', ASSET_KEYS.commonUi?.bottomNavBackground, COMMON_ASSET_PATHS.bottomNavBackground],
    ['navButtonIdle', ASSET_KEYS.commonUi?.navButtonIdle, COMMON_ASSET_PATHS.navButtonIdle],
    ['navButtonSelected', ASSET_KEYS.commonUi?.navButtonSelected, COMMON_ASSET_PATHS.navButtonSelected],
    ['navHomeIcon', ASSET_KEYS.commonUi?.navHomeIcon, COMMON_ASSET_PATHS.navHomeIcon],
    ['navResearchIcon', ASSET_KEYS.commonUi?.navResearchIcon, COMMON_ASSET_PATHS.navResearchIcon],
    ['navCodexIcon', ASSET_KEYS.commonUi?.navCodexIcon, COMMON_ASSET_PATHS.navCodexIcon],
    ['navSettingsIcon', ASSET_KEYS.commonUi?.navSettingsIcon, COMMON_ASSET_PATHS.navSettingsIcon],
    ['navHomeIdle', ASSET_KEYS.commonUi?.navHomeIdle, COMMON_ASSET_PATHS.navHomeIdle],
    ['navHomeSelected', ASSET_KEYS.commonUi?.navHomeSelected, COMMON_ASSET_PATHS.navHomeSelected],
    ['navResearchIdle', ASSET_KEYS.commonUi?.navResearchIdle, COMMON_ASSET_PATHS.navResearchIdle],
    ['navResearchSelected', ASSET_KEYS.commonUi?.navResearchSelected, COMMON_ASSET_PATHS.navResearchSelected],
    ['navCodexIdle', ASSET_KEYS.commonUi?.navCodexIdle, COMMON_ASSET_PATHS.navCodexIdle],
    ['navCodexSelected', ASSET_KEYS.commonUi?.navCodexSelected, COMMON_ASSET_PATHS.navCodexSelected],
    ['navSettingsIdle', ASSET_KEYS.commonUi?.navSettingsIdle, COMMON_ASSET_PATHS.navSettingsIdle],
    ['navSettingsSelected', ASSET_KEYS.commonUi?.navSettingsSelected, COMMON_ASSET_PATHS.navSettingsSelected],
  ];
  const loaded = new Map();

  await Promise.all(requests.map(async ([name, key, path]) => {
    const texture = await loadTexture(name, key, path, assetLoader);

    if (texture) {
      loaded.set(name, texture);
    }
  }));

  return loaded;
}

async function loadTexture(name, key, path, assetLoader) {
  if (textureCache.has(name)) {
    return textureCache.get(name);
  }

  const loaded = key ? await assetLoader?.load(key) : null;

  if (loaded) {
    textureCache.set(name, loaded);
    return loaded;
  }

  try {
    const texture = await Assets.load(`${import.meta.env.BASE_URL}${path}`);
    textureCache.set(name, texture);
    return texture;
  } catch {
    textureCache.set(name, null);
    return null;
  }
}

function createText(text, size, fill, wordWrapWidth = 260) {
  return new Text({
    text,
    style: {
      fill,
      fontFamily: 'Zen Kaku Gothic New, Oxanium, Noto Sans JP, sans-serif',
      fontSize: size,
      fontWeight: '700',
      letterSpacing: 0,
      align: 'center',
      wordWrap: true,
      wordWrapWidth,
    },
  });
}
