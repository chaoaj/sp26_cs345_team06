class Box extends Entity {
  constructor(x, y, size) {
    super(x, y, size, size);
  }

  update(platforms) {
    this.isOnGround = false;
    super.update();
    this.xVelocity = 0;
    for (const platform of platforms) {
      this.resolvePlatformCollision(platform);
    }
  }

  resolveBoxCollision(other) {
    const myLeft = this.x - this.width / 2;
    const myRight = this.x + this.width / 2;
    const myTop = this.y - this.height / 2;
    const myBottom = this.y + this.height / 2;
    const otherLeft = other.x - other.width / 2;
    const otherRight = other.x + other.width / 2;
    const otherTop = other.y - other.height / 2;
    const otherBottom = other.y + other.height / 2;

    if (myRight <= otherLeft || myLeft >= otherRight || myBottom <= otherTop || myTop >= otherBottom) {
      return;
    }

    const overlapLeft = myRight - otherLeft;
    const overlapRight = otherRight - myLeft;
    const overlapTop = myBottom - otherTop;
    const overlapBottom = otherBottom - myTop;
    const minX = Math.min(overlapLeft, overlapRight);
    const minY = Math.min(overlapTop, overlapBottom);

    if (minY <= minX) {
      if (overlapTop <= overlapBottom) {
        this.y -= overlapTop;
        this.yVelocity = 0;
        this.isOnGround = true;
      } else {
        other.y -= overlapBottom;
        other.yVelocity = 0;
        other.isOnGround = true;
      }
    } else {
      if (overlapLeft <= overlapRight) {
        this.x -= overlapLeft / 2;
        other.x += overlapLeft / 2;
      } else {
        this.x += overlapRight / 2;
        other.x -= overlapRight / 2;
      }
    }
  }

  draw() {
    fill(160, 100, 40);
    noStroke();
    image(woodenBox, this.x, this.y, this.width, this.height);
  }
}