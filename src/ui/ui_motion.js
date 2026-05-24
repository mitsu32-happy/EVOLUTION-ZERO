export function resetIntroMotion(target, options = {}) {
  target.__introMotion = {
    time: 0,
    duration: options.duration ?? 0.22,
    startScale: options.startScale ?? 0.97,
    endScale: options.endScale ?? 1,
  };
  target.alpha = 0;
  target.scale.set(target.__introMotion.startScale);
}

export function updateIntroMotion(target, delta) {
  const motion = target.__introMotion;

  if (!motion) {
    return;
  }

  motion.time = Math.min(motion.duration, motion.time + delta);
  const progress = motion.duration <= 0 ? 1 : motion.time / motion.duration;
  const eased = 1 - Math.pow(1 - progress, 3);
  const scale = motion.startScale + (motion.endScale - motion.startScale) * eased;

  target.alpha = eased;
  target.scale.set(scale);

  if (progress >= 1) {
    target.__introMotion = null;
  }
}

export function pulseAlpha(target, time, min = 0.72, max = 1) {
  const value = min + (Math.sin(time * 8) * 0.5 + 0.5) * (max - min);

  target.alpha = value;
}
