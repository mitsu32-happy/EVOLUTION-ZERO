export function playPressFeedback(target, options = {}) {
  if (!target) {
    return;
  }

  const duration = options.duration ?? 110;
  const scale = options.scale ?? 0.97;
  const alpha = options.alpha ?? 0.82;
  const width = options.width ?? 0;
  const height = options.height ?? 0;

  if (target.__pressFeedbackTimer) {
    clearTimeout(target.__pressFeedbackTimer);
    restorePressFeedback(target);
  }

  target.__pressFeedback = {
    x: target.position?.x ?? 0,
    y: target.position?.y ?? 0,
    scaleX: target.scale?.x ?? 1,
    scaleY: target.scale?.y ?? 1,
    alpha: target.alpha ?? 1,
  };

  if (target.scale?.set) {
    target.scale.set(target.__pressFeedback.scaleX * scale, target.__pressFeedback.scaleY * scale);
  }

  if (target.position?.set && width > 0 && height > 0) {
    target.position.set(
      target.__pressFeedback.x + (width * (1 - scale)) / 2,
      target.__pressFeedback.y + (height * (1 - scale)) / 2,
    );
  }

  target.alpha = alpha;
  target.__pressFeedbackTimer = setTimeout(() => restorePressFeedback(target), duration);
}

export function restorePressFeedback(target) {
  const state = target?.__pressFeedback;

  if (!target || !state) {
    return;
  }

  if (target.scale?.set) {
    target.scale.set(state.scaleX, state.scaleY);
  }

  if (target.position?.set) {
    target.position.set(state.x, state.y);
  }

  target.alpha = state.alpha;
  target.__pressFeedback = null;
  target.__pressFeedbackTimer = null;
}
