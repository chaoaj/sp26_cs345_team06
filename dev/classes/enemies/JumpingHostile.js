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

    this.animFrame = 0;
    this.animTimer = 0;
    this.frameCount = 13;
    this.fps = 10;
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

    this.animTimer += deltaTime;
    const frameDuration = 1000 / this.fps;
    if (this.animTimer >= frameDuration) {
      this.animTimer -= frameDuration;
      this.animFrame = (this.animFrame + 1) % this.frameCount;
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

    if (typeof jumpingHostileImage !== "undefined" && jumpingHostileImage) {
      imageMode(CENTER);
      const sourceFrameW = jumpingHostileImage.width / this.frameCount;
      const sourceX = this.animFrame * sourceFrameW;
      const drawW = this.width * 2.6;
      const drawH = this.height * 2.6;
      const yOffset = isAirborne ? -this.height * 0.08 : 0;

      if (this.direction === -1) {
        translate(this.x, this.y + yOffset);
        scale(-1, 1);
        image(jumpingHostileImage, 0, 0, drawW, drawH, sourceX, 0, sourceFrameW, jumpingHostileImage.height);
      } else {
        image(jumpingHostileImage, this.x, this.y + yOffset, drawW, drawH, sourceX, 0, sourceFrameW, jumpingHostileImage.height);
      }
    } else {
      fill(isAirborne ? color(255, 190, 80) : color(235, 150, 50));
      ellipse(this.x, this.y, this.width, this.height * 0.8);

      fill(45);
      const eyeOffsetX = this.direction === -1 ? -this.width * 0.17 : this.width * 0.17;
      ellipse(this.x + eyeOffsetX, this.y - this.height * 0.1, this.width * 0.12, this.width * 0.12);

      fill(185, 95, 30);
      rect(this.x - this.width * 0.18, this.y + this.height * 0.25, this.width * 0.16, this.height * 0.22, 3);
      rect(this.x + this.width * 0.18, this.y + this.height * 0.25, this.width * 0.16, this.height * 0.22, 3);
    }
    pop();
  }
}
