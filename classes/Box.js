class Box {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.w = size;
    this.h = size;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.gravity = 0.6;
    this.isOnGround = false;
  }

  update(platforms) {
    this.yVelocity += this.gravity;
    this.x += this.xVelocity;
    this.y += this.yVelocity;
    this.xVelocity = 0;
    this.isOnGround = false;

    for (const platform of platforms) {
      this.resolvePlatformCollision(platform);
    }
  }

  resolvePlatformCollision(platform) {
    const platformTop = platform.y - platform.h / 2;
    const platformLeft = platform.x - platform.w / 2;
    const platformRight = platform.x + platform.w / 2;
    const myLeft = this.x - this.w / 2;
    const myRight = this.x + this.w / 2;
    const myTop = this.y - this.h / 2;
    const myBottom = this.y + this.h / 2;

    if (
      this.yVelocity >= 0 &&
      myRight > platformLeft &&
      myLeft < platformRight &&
      myBottom >= platformTop &&
      myTop < platformTop
    ) {
      this.y = platformTop - this.h / 2;
      this.yVelocity = 0;
      this.isOnGround = true;
    }
  }

  resolveBoxCollision(other) {
    const myLeft = this.x - this.w / 2;
    const myRight = this.x + this.w / 2;
    const myTop = this.y - this.h / 2;
    const myBottom = this.y + this.h / 2;
    const otherLeft = other.x - other.w / 2;
    const otherRight = other.x + other.w / 2;
    const otherTop = other.y - other.h / 2;
    const otherBottom = other.y + other.h / 2;

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
    //rect(this.x, this.y, this.w, this.h);
    image(woodenBox, this.x, this.y, this.w, this.h);
  }
}
