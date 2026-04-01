class Player {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.yVelocity = 0;
    this.moveSpeed = 5;
    this.jumpStrength = 12;
    this.gravity = 0.6;
    this.isOnGround = false;
  }

  update(platforms) {
    applyPlayerControls(this);

    this.yVelocity += this.gravity;
    this.y += this.yVelocity;
    this.isOnGround = false;

    for (const platform of platforms) {
      this.resolvePlatformCollision(platform);
    }

    this.constrainToScreen();
  }

  resolvePlatformCollision(platform) {
    const platformTop = platform.y - platform.h / 2;
    const platformLeft = platform.x - platform.w / 2;
    const platformRight = platform.x + platform.w / 2;
    const playerLeft = this.x - this.width / 2;
    const playerRight = this.x + this.width / 2;
    const playerTop = this.y - this.height / 2;
    const playerBottom = this.y + this.height / 2;

    if (
      this.yVelocity >= 0 &&
      playerRight > platformLeft &&
      playerLeft < platformRight &&
      playerBottom >= platformTop &&
      playerTop < platformTop
    ) {
      this.y = platformTop - this.height / 2;
      this.yVelocity = 0;
      this.isOnGround = true;
    }
  }

  constrainToScreen() {
    const halfHeight = this.height / 2;

    if (this.y + halfHeight >= height) {
      this.y = height - halfHeight;
      this.yVelocity = 0;
      this.isOnGround = true;
    }
  }

  draw() {
    fill(70, 130, 255);
    noStroke();
    rect(this.x, this.y, this.width, this.height, 8);
  }
}