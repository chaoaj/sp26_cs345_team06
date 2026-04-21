// JumpingHostile is a vertical-jump ground enemy.
// Use it in level enemy arrays like:
// new JumpingHostile(x, y, w, h, speed, leftBound, rightBound, damage, jumpHeight, jumpCooldownMs, jumpSpeed)
// Tuning notes:
// - jumpHeight controls target jump apex (ignored when jumpSpeed is provided)
// - jumpCooldownMs controls time between jumps
// - jumpSpeed overrides height-based jump velocity when set
class JumpingHostile extends Hostile {
  constructor(
    x,
    y,
    w = 40,
    h = 40,
    speed = 2,
    leftBound = x - 120,
    rightBound = x + 120,
    damage = 1,
    jumpHeight = 150,
    jumpCooldownMs = 900,
    jumpSpeed = null
  ) {
    super(x, y, w, h, speed, leftBound, rightBound, damage);

    this.groundY = y;
    this.gravity = 0.55;
    this.yVelocity = 0;
    this.maxJumpHeight = Math.max(20, jumpHeight);
    this.jumpCooldownMs = Math.max(120, jumpCooldownMs);
    this.jumpStrength = jumpSpeed == null
      ? sqrt(2 * this.gravity * this.maxJumpHeight)
      : Math.max(1, jumpSpeed);
    this.nextJumpAt = 0;
    this.canBeStomped = false;
  }

  update() {
    const now = typeof getGameMillis === "function" ? getGameMillis() : millis();
    const isGrounded = this.y >= this.groundY - 0.1 && this.yVelocity >= 0;

    if (isGrounded) {
      this.y = this.groundY;
      this.yVelocity = 0;

      if (now >= this.nextJumpAt) {
        this.startJump(now);
      }
    } else {
      this.yVelocity += this.gravity;
      this.y += this.yVelocity;
      // no horizontal movement while airborne — purely vertical jump
    }

    if (this.x <= this.leftBound) {
      this.x = this.leftBound;
      this.direction = 1;
    } else if (this.x >= this.rightBound) {
      this.x = this.rightBound;
      this.direction = -1;
    }
  }

  startJump(now) {
    this.yVelocity = -this.jumpStrength;
    this.nextJumpAt = now + this.jumpCooldownMs;
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
