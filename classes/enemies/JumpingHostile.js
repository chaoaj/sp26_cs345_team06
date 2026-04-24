class JumpingHostile extends Hostile {
  constructor(
    x,
    y,
    w = 40,
    h = 40,
    speed = 2,
    leftBound = x - 120,
    rightBound = x + 120,
    damage = 1
  ) {
    super(x, y, w, h, speed, leftBound, rightBound, damage);

    this.groundY = y;
    this.gravity = 0.55;
    this.yVelocity = 0;
    this.jumpStrength = 11;
    this.airControl = Math.max(1.4, speed * 1.35);
    this.jumpCooldownMs = 900;
    this.nextJumpAt = 0;
    this.canBeStomped = true;
  }

  update() {
    const now = typeof getGameMillis === "function" ? getGameMillis() : millis();
    const target = this.getTargetPlayer();
    const isGrounded = this.y >= this.groundY - 0.1;

    if (isGrounded) {
      this.y = this.groundY;
      this.yVelocity = 0;

      if (now >= this.nextJumpAt) {
        this.startJump(target, now);
      }
    } else {
      this.yVelocity += this.gravity;
      this.y += this.yVelocity;
      this.x += this.speed * this.direction;
    }

    if (this.x <= this.leftBound) {
      this.x = this.leftBound;
      this.direction = 1;
    } else if (this.x >= this.rightBound) {
      this.x = this.rightBound;
      this.direction = -1;
    }
  }

  getTargetPlayer() {
    if (typeof player === "undefined" || !player) {
      return null;
    }

    return player;
  }

  startJump(target, now) {
    this.yVelocity = -this.jumpStrength;
    this.nextJumpAt = now + this.jumpCooldownMs;

    if (target && abs(target.x - this.x) > 14) {
      this.direction = target.x > this.x ? 1 : -1;
    }

    this.speed = this.airControl;
  }

  draw() {
    const isAirborne = this.y < this.groundY - 1;

    push();
    rectMode(CENTER);
    noStroke();

    fill(isAirborne ? color(255, 190, 80) : color(235, 150, 50));
    ellipse(this.x, this.y, this.w, this.h * 0.8);

    fill(45);
    const eyeOffsetX = this.direction === -1 ? -this.w * 0.17 : this.w * 0.17;
    ellipse(this.x + eyeOffsetX, this.y - this.h * 0.1, this.w * 0.12, this.w * 0.12);

    fill(185, 95, 30);
    rect(this.x - this.w * 0.18, this.y + this.h * 0.25, this.w * 0.16, this.h * 0.22, 3);
    rect(this.x + this.w * 0.18, this.y + this.h * 0.25, this.w * 0.16, this.h * 0.22, 3);
    pop();
  }
}
