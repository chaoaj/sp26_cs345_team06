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
      if (platform && platform.isVisible === false) continue;
      this.resolvePlatformCollision(platform);
    }

    if (this.isOnGround) {
      this._applyMovingPlatformRide(platforms);
    }
  }

  _applyMovingPlatformRide(platforms) {
    let bestPlatform = null;
    let bestOverlap = 0;
    const myLeft   = this.x - this.w / 2;
    const myRight  = this.x + this.w / 2;
    const myBottom = this.y + this.h / 2;

    for (const platform of platforms) {
      if (!platform || platform.isVisible === false) continue;
      const pvx = platform.xVelocity || 0;
      const pvy = platform.yVelocity || 0;
      if (pvx === 0 && pvy === 0) continue;

      const platLeft  = platform.x - platform.w / 2;
      const platRight = platform.x + platform.w / 2;
      const platTop   = platform.y - platform.h / 2;
      if (Math.abs(myBottom - platTop) > 4) continue;

      const overlap = Math.min(myRight, platRight) - Math.max(myLeft, platLeft);
      if (overlap > bestOverlap) {
        bestOverlap = overlap;
        bestPlatform = platform;
      }
    }

    if (bestPlatform && bestOverlap >= this.w * 0.5) {
      this.x += bestPlatform.xVelocity || 0;
      this.y += bestPlatform.yVelocity || 0;
    }
  }

  resolvePlatformCollision(platform) {
    const platLeft   = platform.x - platform.w / 2;
    const platRight  = platform.x + platform.w / 2;
    const platTop    = platform.y - platform.h / 2;
    const platBottom = platform.y + platform.h / 2;
    const myLeft   = this.x - this.w / 2;
    const myRight  = this.x + this.w / 2;
    const myTop    = this.y - this.h / 2;
    const myBottom = this.y + this.h / 2;

    if (myRight <= platLeft || myLeft >= platRight ||
        myBottom <= platTop || myTop >= platBottom) {
      return;
    }

    const overlapLeft   = myRight   - platLeft;
    const overlapRight  = platRight - myLeft;
    const overlapTop    = myBottom  - platTop;
    const overlapBottom = platBottom - myTop;
    const minX = Math.min(overlapLeft, overlapRight);
    const minY = Math.min(overlapTop, overlapBottom);

    if (minY <= minX) {
      if (overlapTop <= overlapBottom) {
        this.y -= overlapTop;
        this.yVelocity = 0;
        this.isOnGround = true;
      } else {
        this.y += overlapBottom;
        this.yVelocity = 0;
      }
    } else {
      if (overlapLeft <= overlapRight) {
        this.x -= overlapLeft;
        this.xVelocity = 0;
      } else {
        this.x += overlapRight;
        this.xVelocity = 0;
      }
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
    push();
    fill(160, 100, 40);
    noStroke();
<<<<<<< Updated upstream
    imageMode(CENTER);
    //rect(this.x, this.y, this.w, this.h);
=======
>>>>>>> Stashed changes
    image(woodenBox, this.x, this.y, this.w, this.h);
    pop();
  }
}
