class Player {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.spawnX = x;
    this.spawnY = y;
    this.width = width;
    this.height = height;
    this.yVelocity = 0;
    this.baseMoveSpeed = 5;
    this.moveSpeed = this.baseMoveSpeed;
    this.speedPotionMoveSpeed = 8;
    this.speedPotionDurationMs = 30000;
    this.speedPotionExpiresAt = 0;
    this.jumpMomentumX = 0;
    this.jumpDirectionalBoost = 2.4;
    this.jumpMomentumDecay = 0.88;
    this.wasJumpHeld = false;
    this.jumpBufferDurationMs = 120;
    this.jumpBufferUntil = 0;
    this.baseJumpStrength = 15;
    this.jumpStrength = this.baseJumpStrength;
    this.gravity = 0.6;
    this.isOnGround = false;
    this.maxHealth = 3;
    this.health = this.maxHealth;
    this.maxShield = 2;
    this.shieldHealth = 0;
    this.abilities = {};

    this.hitboxInsetX   = 12;
    this.hitboxInsetTop = 20;

    this.facingLeft = false;
    this.isHurt = false;
    this.animations = {
      idle: { sheet: playerIdleSheet, frameCount: 4, fps: 8,  loop: true  },
      walk: { sheet: playerWalkSheet, frameCount: 6, fps: 10, loop: true  },
      run:  { sheet: playerRunSheet,  frameCount: 6, fps: 14, loop: true  },
      jump: { sheet: playerJumpSheet, frameCount: 8, fps: 10, loop: false },
      hurt: { sheet: playerHurtSheet, frameCount: 4, fps: 12, loop: false },
    };
    this.animState = "idle";
    this.animFrame = 0;
    this.animTimer = 0;
    this.highJumpDurationMs = 30000;
    this.highJumpStrength = 22;
    this.highJumpExpiresAt = 0;
  }

  get hitLeft()   { return this.x - this.width  / 2 + this.hitboxInsetX;   }
  get hitRight()  { return this.x + this.width  / 2 - this.hitboxInsetX;   }
  get hitTop()    { return this.y - this.height / 2 + this.hitboxInsetTop; }
  get hitBottom() { return this.y + this.height / 2;                        }

  update(platforms) {
    const previousX = this.x;
    const previousY = this.y;

    this.updateTimedEffects();
    applyPlayerControls(this);
    this.resolveHorizontalCollisions(platforms, previousX);

    this.yVelocity += this.gravity;
    this.y += this.yVelocity;
    this.isOnGround = false;

    this.resolveVerticalCollisions(platforms, previousY);
    this.constrainToScreen();
    this.updateAnimation();
    this.advanceFrame();
  }

  updateTimedEffects() {
    const now = getGameMillis();

    if (this.highJumpExpiresAt > 0) {
      if (now >= this.highJumpExpiresAt) {
        this.jumpStrength = this.baseJumpStrength;
        this.highJumpExpiresAt = 0;
      }
    }

    if (this.speedPotionExpiresAt > 0) {
      if (now >= this.speedPotionExpiresAt) {
        this.moveSpeed = this.baseMoveSpeed;
        this.speedPotionExpiresAt = 0;
      }
    }
  }

  resolveHorizontalCollisions(platforms, previousX) {
    for (const platform of platforms) {
      const platformTop = platform.y - platform.h / 2;
      const platformBottom = platform.y + platform.h / 2;
      const platformLeft = platform.x - platform.w / 2;
      const platformRight = platform.x + platform.w / 2;

      const overlapsY = this.hitBottom > platformTop && this.hitTop < platformBottom;
      const overlapsX = this.hitRight > platformLeft && this.hitLeft < platformRight;

      if (!overlapsX || !overlapsY) continue;

      if (this.x > previousX) {
        this.x = platformLeft - (this.width / 2 - this.hitboxInsetX);
      } else if (this.x < previousX) {
        this.x = platformRight + (this.width / 2 - this.hitboxInsetX);
      }
    }
  }

  resolveVerticalCollisions(platforms, previousY) {
    const previousHitBottom = previousY + this.height / 2;
    const previousHitTop    = previousY - this.height / 2 + this.hitboxInsetTop;

    for (const platform of platforms) {
      const platformTop = platform.y - platform.h / 2;
      const platformBottom = platform.y + platform.h / 2;
      const platformLeft = platform.x - platform.w / 2;
      const platformRight = platform.x + platform.w / 2;

      const overlapsX = this.hitRight > platformLeft && this.hitLeft < platformRight;
      const overlapsY = this.hitBottom > platformTop && this.hitTop < platformBottom;

      if (!overlapsX || !overlapsY) continue;

      if (this.yVelocity >= 0 && previousHitBottom <= platformTop) {
        this.y = platformTop - this.height / 2;
        this.yVelocity = 0;
        this.jumpMomentumX = 0;
        this.isOnGround = true;
      } else if (this.yVelocity < 0 && previousHitTop >= platformBottom) {
        this.y = platformBottom + this.height / 2 - this.hitboxInsetTop;
        this.yVelocity = 0;
      }
    }
  }


  constrainToScreen() {
    const halfHeight = this.height / 2;

    if (this.y + halfHeight >= height) {
      this.y = height - halfHeight;
      this.yVelocity = 0;
      this.jumpMomentumX = 0;
      this.isOnGround = true;
    }
  }
  updateAnimation() {
    if (this.isHurt) {
      if (this.animFrame >= this.animations.hurt.frameCount - 1) {
        this.isHurt = false;
      } else {
        return;
      }
    }

    const moving = keyIsDown(65) || keyIsDown(68);
    if (!this.isOnGround) {
      this.setAnimState("jump");
    } else if (moving) {
      this.setAnimState("walk");
    } else {
      this.setAnimState("idle");
    }
  }

  setAnimState(state) {
    if (this.animState !== state) {
      this.animState = state;
      this.animFrame = 0;
      this.animTimer = 0;
    }
  }

  advanceFrame() {
    const anim = this.animations[this.animState];
    this.animTimer += deltaTime;
    const frameDuration = 1000 / anim.fps;
    if (this.animTimer >= frameDuration) {
      this.animTimer -= frameDuration;
      if (anim.loop) {
        this.animFrame = (this.animFrame + 1) % anim.frameCount;
      } else {
        this.animFrame = min(this.animFrame + 1, anim.frameCount - 1);
      }
    }
  }

  takeDamage(amount = 1) {
    let remainingDamage = amount;

    if (this.shieldHealth > 0) {
      const blockedDamage = Math.min(this.shieldHealth, remainingDamage);
      this.shieldHealth -= blockedDamage;
      remainingDamage -= blockedDamage;
    }

    if (remainingDamage > 0) {
      this.health = Math.max(0, this.health - remainingDamage);
    }

    this.isHurt = true;
    this.setAnimState("hurt");
    if (this.health <= 0) {
      this.respawn();
    }
  }

  gainHealth(amount = 1) {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  addShield(amount = 2) {
    this.shieldHealth = Math.min(this.maxShield, this.shieldHealth + amount);
  }

  setSpawnPoint(x, y) {
    this.spawnX = x;
    this.spawnY = y;
  }

  respawn() {
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.jumpMomentumX = 0;
    this.jumpBufferUntil = 0;
    this.yVelocity = 0;
    this.isOnGround = false;
    this.health = this.maxHealth;
    this.isHurt = false;
    this.setAnimState("idle");
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

  activateHighJump() {
    const now = getGameMillis();
    this.jumpStrength = this.highJumpStrength;
    this.highJumpExpiresAt = now + this.highJumpDurationMs;
  }

  activateSpeedPotion() {
    const now = getGameMillis();
    this.moveSpeed = this.speedPotionMoveSpeed;
    this.speedPotionExpiresAt = now + this.speedPotionDurationMs;
  }

  getHighJumpTimeLeftMs() {
    if (this.highJumpExpiresAt <= 0) {
      return 0;
    }

    return this.highJumpExpiresAt - getGameMillis();
  }

  getSpeedPotionTimeLeftMs() {
    if (this.speedPotionExpiresAt <= 0) {
      return 0;
    }

    return this.speedPotionExpiresAt - getGameMillis();
  }

  draw() {
    const anim = this.animations[this.animState];
    const frameW = anim.sheet.width / anim.frameCount;
    const sx = this.animFrame * frameW;

    push();
    translate(this.x, this.y);
    if (this.facingLeft) scale(-1, 1);
    imageMode(CENTER);
    noStroke();
    image(anim.sheet, 0, 0, this.width, this.height, sx, 0, frameW, anim.sheet.height);
    pop();
  }
}
