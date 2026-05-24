export class CollisionSystem {
  static circlesOverlap(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const radius = a.radius + b.radius;

    return dx * dx + dy * dy <= radius * radius;
  }

  static distanceSquared(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;

    return dx * dx + dy * dy;
  }
}
