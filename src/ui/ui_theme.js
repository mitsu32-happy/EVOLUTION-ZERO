export const UI_COLORS = {
  bg: 0x030607,
  panel: 0x071012,
  panelSoft: 0x0b1619,
  line: 0x335059,
  text: 0xf4f7f5,
  subText: 0x91aaa4,
  danger: 0xff4d38,
  dangerBright: 0xff6b62,
  dna: 0x35d7ff,
  dnaSoft: 0x7cf7d4,
  gold: 0xffc739,
  green: 0x65e878,
  purple: 0xae73ff,
};

export const UI_LAYOUT = {
  margin: 24,
  safeBottom: 24,
  radius: 8,
  panelRadius: 10,
  buttonHeight: 58,
  backButtonSize: 52,
  bottomNavHeight: 86,
};

export const UI_TEXT = {
  title: 32,
  section: 18,
  body: 13,
  caption: 10,
};

export function drawScreenBackground(graphics, width, height, accent = UI_COLORS.danger) {
  graphics
    .clear()
    .rect(0, 0, width, height)
    .fill({ color: UI_COLORS.bg, alpha: 1 })
    .ellipse(width * 0.62, height * 0.24, width * 0.34, height * 0.12)
    .fill({ color: accent, alpha: 0.12 })
    .ellipse(width * 0.46, height * 0.5, width * 0.52, height * 0.36)
    .fill({ color: 0x10242c, alpha: 0.22 })
    .rect(0, 0, width, height)
    .stroke({ color: accent, width: 2, alpha: 0.16 });
}

export function drawPanel(graphics, x, y, width, height, options = {}) {
  const accent = options.accent ?? UI_COLORS.danger;
  const alpha = options.alpha ?? 0.9;

  graphics
    .clear()
    .roundRect(x, y, width, height, options.radius ?? UI_LAYOUT.panelRadius)
    .fill({ color: options.fill ?? UI_COLORS.panel, alpha })
    .stroke({ color: accent, width: options.width ?? 1.2, alpha: options.strokeAlpha ?? 0.34 });
}

export function drawButtonFrame(graphics, width, height, options = {}) {
  const variant = options.variant ?? 'neutral';
  const accent = getAccent(variant, options.accent);
  const selected = options.selected ?? false;
  const disabled = options.disabled ?? false;
  const fill = selected ? 0x170809 : UI_COLORS.panel;

  graphics
    .clear()
    .roundRect(0, 0, width, height, options.radius ?? UI_LAYOUT.radius)
    .fill({ color: disabled ? 0x05090a : fill, alpha: disabled ? 0.58 : 0.92 })
    .stroke({
      color: accent,
      width: selected ? 2.2 : 1.3,
      alpha: disabled ? 0.24 : selected ? 0.9 : 0.58,
    });

  if (selected || options.glow) {
    graphics
      .roundRect(3, 3, width - 6, height - 6, Math.max(4, (options.radius ?? UI_LAYOUT.radius) - 2))
      .stroke({ color: accent, width: 1, alpha: disabled ? 0.1 : 0.2 });
  }
}

export function drawBackButtonFrame(graphics) {
  drawButtonFrame(graphics, UI_LAYOUT.backButtonSize, UI_LAYOUT.backButtonSize, {
    variant: 'danger',
    glow: true,
  });
}

export function drawBottomNavFrame(graphics, width, selected = false, accent = UI_COLORS.dna) {
  drawButtonFrame(graphics, width, UI_LAYOUT.bottomNavHeight, {
    accent,
    selected,
    glow: selected,
  });
}

export function getAccent(variant, fallback = null) {
  if (fallback !== null) {
    return fallback;
  }

  if (variant === 'primary') {
    return UI_COLORS.gold;
  }

  if (variant === 'danger') {
    return UI_COLORS.danger;
  }

  if (variant === 'dna') {
    return UI_COLORS.dna;
  }

  if (variant === 'green') {
    return UI_COLORS.green;
  }

  if (variant === 'purple') {
    return UI_COLORS.purple;
  }

  return UI_COLORS.line;
}

export function toCssColor(color) {
  return `#${color.toString(16).padStart(6, '0')}`;
}
