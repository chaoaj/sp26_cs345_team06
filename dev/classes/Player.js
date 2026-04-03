class Player {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.spawnX = x;
    this.spawnY = y;
    this.width = width;
    this.height = height;
    this.yVelocity = 0;
    this.moveSpeed = 5;
    this.jumpStrength = 14;
    this.gravity = 0.6;
    this.isOnGround = false;
    this.maxHealth = 3;
    this.health = this.maxHealth;
    this.abilities = {};
  }

  update(platforms) {
    const previousX = this.x;
    const previousY = this.y;

    applyPlayerControls(this);
    this.resolveHorizontalCollisions(platforms, previousX);

    this.yVelocity += this.gravity;
    this.y += this.yVelocity;
    this.isOnGround = false;

    this.resolveVerticalCollisions(platforms, previousY);
    this.constrainToScreen();
  }

  resolveHorizontalCollisions(platforms, previousX) {
    const playerTop = this.y - this.height / 2;
    const playerBottom = this.y + this.height / 2;

    for (const platform of platforms) {
      const platformTop = platform.y - platform.h / 2;
      const platformBottom = platform.y + platform.h / 2;
      const platformLeft = platform.x - platform.w / 2;
      const platformRight = platform.x + platform.w / 2;
      const playerLeft = this.x - this.width / 2;
      const playerRight = this.x + this.width / 2;

      const overlapsY = playerBottom > platformTop && playerTop < platformBottom;
      const overlapsX = playerRight > platformLeft && playerLeft < platformRight;

      if (!overlapsX || !overlapsY) {
        continue;
      }

      if (this.x > previousX) {
        this.x = platformLeft - this.width / 2;
      } else if (this.x < previousX) {
        this.x = platformRight + this.width / 2;
      }
    }
  }

  resolveVerticalCollisions(platforms, previousY) {
    const previousTop = previousY - this.height / 2;
    const previousBottom = previousY + this.height / 2;

    for (const platform of platforms) {
      const platformTop = platform.y - platform.h / 2;
      const platformBottom = platform.y + platform.h / 2;
      const platformLeft = platform.x - platform.w / 2;
      const platformRight = platform.x + platform.w / 2;
      const playerLeft = this.x - this.width / 2;
      const playerRight = this.x + this.width / 2;
      const playerTop = this.y - this.height / 2;
      const playerBottom = this.y + this.height / 2;

      const overlapsX = playerRight > platformLeft && playerLeft < platformRight;
      const overlapsY = playerBottom > platformTop && playerTop < platformBottom;

      if (!overlapsX || !overlapsY) {
        continue;
      }

      if (this.yVelocity >= 0 && previousBottom <= platformTop) {
        this.y = platformTop - this.height / 2;
        this.yVelocity = 0;
        this.isOnGround = true;
      } else if (this.yVelocity < 0 && previousTop >= platformBottom) {
        this.y = platformBottom + this.height / 2;
        this.yVelocity = 0;
      }
    }
  }

  resolvePlatformCollision(platform) {
    // Legacy single-pass collision (kept for reference).
    // const platformTop = platform.y - platform.h / 2;
    // const platformLeft = platform.x - platform.w / 2;
    // const platformRight = platform.x + platform.w / 2;
    // const playerLeft = this.x - this.width / 2;
    // const playerRight = this.x + this.width / 2;
    // const playerTop = this.y - this.height / 2;
    // const playerBottom = this.y + this.height / 2;
    //
    // if (
    //   this.yVelocity >= 0 &&
    //   playerRight > platformLeft &&
    //   playerLeft < platformRight &&
    //   playerBottom >= platformTop &&
    //   playerTop < platformTop
    // ) {
    //   this.y = platformTop - this.height / 2;
    //   this.yVelocity = 0;
    //   this.isOnGround = true;
    // }
  }

  constrainToScreen() {
    const halfHeight = this.height / 2;

    if (this.y + halfHeight >= height) {
      this.y = height - halfHeight;
      this.yVelocity = 0;
      this.isOnGround = true;
    }
  }
  takeDamage(amount = 1) {
    this.health = Math.max(0, this.health - amount);
    if (this.health <= 0) {
      this.respawn();
    }
  }

  gainHealth(amount = 1) {
    this.health += amount;
  }

  setSpawnPoint(x, y) {
    this.spawnX = x;
    this.spawnY = y;
  }

  respawn() {
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.yVelocity = 0;
    this.isOnGround = false;
    this.health = this.maxHealth;
  }

  addPermanentAbility(ability) { // if called will add ability
    if (!ability || !ability.name) {
      return false;
    }

    if (this.abilities[ability.name]) {
      return false;
    }

    this.abilities[ability.name] = ability;
    ability.applyTo(this);
    return true;
  }

  hasAbility(abilityName) { // check for if player already has it
    return !!this.abilities[abilityName];
  }

  draw() {
    fill(70, 130, 255);
    noStroke();
    rect(this.x, this.y, this.width, this.height, 8);
  }
}
