class Trap {
  constructor(x, y, w, h, damage = 1) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.damage = damage;
    this.anchorPlatform = null;
    this.anchorOffsetX = 0;
    this.anchorOffsetY = 0;
  }

  attachToPlatform(platform, offsetX = 0, offsetY = 0) {
    this.anchorPlatform = platform;
    this.anchorOffsetX = offsetX;
    this.anchorOffsetY = offsetY;
    this.updateAttachedPosition();
  }

  updateAttachedPosition() {
    if (!this.anchorPlatform) {
      return;
    }

    this.x = this.anchorPlatform.x + this.anchorOffsetX;
    this.y = this.anchorPlatform.y + this.anchorOffsetY;
  }

  draw() {}
}
