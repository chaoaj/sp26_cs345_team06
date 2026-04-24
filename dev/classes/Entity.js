class Entity {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.gravity = 0.6;
    this.isOnGround = false;
  }

  get left()   { return this.x - this.width  / 2; }
  get right()  { return this.x + this.width  / 2; }
  get top()    { return this.y - this.height / 2; }
  get bottom() { return this.y + this.height / 2; }

  applyPhysics() {
    this.yVelocity += this.gravity;
  }

  move() {
    this.x += this.xVelocity;
    this.y += this.yVelocity;
  }

  update() {
    this.applyPhysics();
    this.move();
  }

  resolvePlatformCollision(platform) {
    if (platform.isActive === false) return;

    const platLeft   = platform.x - platform.w / 2;
    const platRight  = platform.x + platform.w / 2;
    const platTop    = platform.y - platform.h / 2;
    const platBottom = platform.y + platform.h / 2;
    const platformXVelocity = typeof platform.xVelocity === "number" ? platform.xVelocity : 0;
    const platformYVelocity = typeof platform.yVelocity === "number" ? platform.yVelocity : 0;
    const myLeft   = this.x - this.width  / 2;
    const myRight  = this.x + this.width  / 2;
    const myTop    = this.y - this.height / 2;
    const myBottom = this.y + this.height / 2;

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
        this.x += platformXVelocity;
        this.y += platformYVelocity;
        if (platform.onLand) platform.onLand(this);
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

  draw() {}
}