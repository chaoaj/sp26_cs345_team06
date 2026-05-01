class Player extends Actor {


  constructor(x, y, width, height) {
    super(x, y, width, height);

    this.baseMoveSpeed = 5;
    this.moveSpeed = this.baseMoveSpeed;

    this.onPlatform = null; // Track the platform player is standing on

    this.jumpStrength = 15;

    this.maxAirJumps = 0;
    this.remainingAirJumps = 0;

    this.canDash = false;

    this.isHurt = false;

    this.spawnX = x;
    this.spawnY = y;

    this.speedPotionMoveSpeed = 8;
    this.speedPotionDurationMs = 30000;
    this.speedPotionExpiresAt = 0;
    this.jumpMomentumX = 0;
    this.jumpDirectionalBoost = 2.4;
    this.jumpMomentumDecay = 0.88;
    this.wasJumpHeld = false;
    this.jumpBufferDurationMs = 120;
    this.jumpBufferUntil = 0;


    this.isDashing = false;
    this.dashDirection = 1;
    this.dashSpeed = 14;
    this.groundDashMultiplier = 1.4;
    this.dashDurationMs = 140;
    this.dashCooldownMs = 450;
    this.dashEndsAt = 0;
    this.dashCooldownUntil = 0;
    this.wasDashHeld = false;

    this.baseJumpStrength = 15;
    this.jumpStrength = this.baseJumpStrength;
    this.gravity = 0.6;
    this.isOnGround = false;
    this.isOnFloor = false;
    this.maxShield = 2;
    this.shieldHealth = 0;
    this.onBeforeRespawn = null;
    this.onRespawn = null;

    this.coyoteWindowMs = 100;
    this.coyoteUntil = 0;

    this.hitboxInsetX   = 35;
    this.hitboxInsetTop = 50;

    this.facingLeft = false;

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
    this.highJumpStrength = 18;
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

    // Wall contact detection for wall jump (now in Ability)
    if (typeof Ability !== "undefined" && Ability.detectWallContact) {
      Ability.detectWallContact(this, platforms);
    }

    applyPlayerControls(this);

    this.applyPhysics();

    this.resolveHorizontalCollisions(platforms, previousX, previousY);

    this.move();

    this.isOnGround = false;
    this.isOnFloor = false;
    this.onPlatform = null; // Reset before checking collisions

    this.resolveVerticalCollisions(platforms, previousY);
    if (this.isOnGround) {
      this.coyoteUntil = getGameMillis() + this.coyoteWindowMs;
    }

    this.constrainToScreen();
    this.updateAnimation();
    this.advanceFrame();
  }

  resolveVerticalCollisions(platforms, previousY) {
    const previousHitBottom = previousY + this.height / 2;
    const previousHitTop    = previousY - this.height / 2 + this.hitboxInsetTop;

    for (const platform of platforms) {
      if (platform && (platform.isActive === false || platform.isVisible === false)) {
        continue;
      }

      const platformTop = platform.y - platform.h / 2;
      const platformBottom = platform.y + platform.h / 2;
      const platformLeft = platform.x - platform.w / 2;
      const platformRight = platform.x + platform.w / 2;
      const platformYVelocity = typeof platform.yVelocity === "number" ? platform.yVelocity : 0;
      const previousPlatformTop = platformTop - platformYVelocity;

      const overlapsX = this.hitRight > platformLeft && this.hitLeft < platformRight;
      // When platform moves down it pulls away from the player, so also check overlap using old top.
      const overlapsY = this.hitBottom > platformTop && this.hitTop < platformBottom;
      const downwardCarry = Math.max(0, platformYVelocity); // how far platform moved down this frame
      const crossedPlatformTop =
        this.yVelocity >= 0 &&
        previousHitBottom <= previousPlatformTop + 2 &&
        this.hitBottom >= platformTop - downwardCarry + 6;

      // Swept landing check prevents phasing through platforms at high relative speeds.
      if (overlapsX && crossedPlatformTop) {
        this.y = platformTop - this.height / 2;
        this.yVelocity = downwardCarry > 0 ? downwardCarry : 0;
        this.jumpMomentumX = 0;
        this.remainingAirJumps = this.maxAirJumps;
        this.isOnGround = true;
        this.onPlatform = platform;
        if (platform.xVelocity) {
          this.x += platform.xVelocity;
        }
        if (platform.onLand) platform.onLand(this);
        continue;
      }

      if (!overlapsX || !overlapsY) continue;

      if (this.yVelocity >= 0 && previousHitBottom <= previousPlatformTop + 2) {
        this.y = platformTop - this.height / 2;
        this.yVelocity = downwardCarry > 0 ? downwardCarry : 0;
        this.jumpMomentumX = 0;
        this.remainingAirJumps = this.maxAirJumps;
        this.isOnGround = true;
        this.onPlatform = platform;
        if (platform.xVelocity) {
          this.x += platform.xVelocity;
        }
        if (platform.onLand) platform.onLand(this);
      } else if (this.yVelocity < 0 && previousHitTop >= platformBottom) {
        this.y = platformBottom + this.height / 2 - this.hitboxInsetTop;
        this.yVelocity = 0;
      }
    }
  }
    resolveHorizontalCollisions(platforms, previousX, previousY) {
      const previousHitBottom = previousY + this.height / 2;
      const previousHitTop = previousY - this.height / 2 + this.hitboxInsetTop;

      for (const platform of platforms) {
        if (platform && (platform.isActive === false || platform.isVisible === false)) {
          continue;
        }

        const platformTop = platform.y - platform.h / 2;
        const platformBottom = platform.y + platform.h / 2;
        const platformLeft = platform.x - platform.w / 2;
        const platformRight = platform.x + platform.w / 2;
        const platformYVelocity = typeof platform.yVelocity === "number" ? platform.yVelocity : 0;
        const previousPlatformTop = platformTop - platformYVelocity;
        const previousPlatformBottom = platformBottom - platformYVelocity;
        const wasAbovePlatformLastFrame = previousHitBottom <= previousPlatformTop + 2;
        const wasBelowPlatformLastFrame = previousHitTop >= previousPlatformBottom - 2;

        const overlapsY = this.hitBottom > platformTop && this.hitTop < platformBottom;
        const overlapsX = this.hitRight > platformLeft && this.hitLeft < platformRight;

        if (!overlapsX || !overlapsY) continue;
        if (wasAbovePlatformLastFrame) continue;
        if (wasBelowPlatformLastFrame) continue;

        if (this.x > previousX) {
          this.x = platformLeft - (this.width / 2 - this.hitboxInsetX);
        } else if (this.x < previousX) {
          this.x = platformRight + (this.width / 2 - this.hitboxInsetX);
        }
      }
    }
  constrainToScreen() {
    const halfHeight = this.height / 2;

    if (this.y + halfHeight >= height) {
      this.y = height - halfHeight;
      this.yVelocity = 0;
      this.jumpMomentumX = 0;
      this.remainingAirJumps = this.maxAirJumps;
      this.isOnGround = true;
      this.isOnFloor = true;
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
    damageSound.play()
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
      deathSound.play()
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

  clearTemporaryItemEffects() {
    this.jumpStrength = this.baseJumpStrength;
    this.highJumpExpiresAt = 0;
    this.moveSpeed = this.baseMoveSpeed;
    this.speedPotionExpiresAt = 0;
    this.shieldHealth = 0;
  }

  respawn() {
    if (typeof this.onBeforeRespawn === "function") {
      this.onBeforeRespawn(this);
    }

    this.x = this.spawnX;
    this.y = this.spawnY;
    this.jumpMomentumX = 0;
    this.jumpBufferUntil = 0;
    this.remainingAirJumps = this.maxAirJumps;
    this.isDashing = false;
    this.dashEndsAt = 0;
    this.dashCooldownUntil = 0;
    this.wasDashHeld = false;
    this.wasJumpHeld = false;
    this.yVelocity = 0;
    this.isOnGround = false;
    this.clearTemporaryItemEffects();
    this.health = this.maxHealth;
    this.isHurt = false;
    this.setAnimState("idle");

    if (typeof this.onRespawn === "function") {
      this.onRespawn(this);
    }
  }

  addPermanentAbility(ability) { // if called will add ability
    const didGrant = Ability.grant(this, ability);
    if (!didGrant) {
      return false;
    }

    if (typeof showAbilityUnlock === "function") {
      showAbilityUnlock(ability);
    }

    return true;
  }

  hasAbility(abilityName) { // check for if player already has it
    return Ability.has(this, abilityName);
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
  updateTimedEffects() {
    const now = typeof getGameMillis === 'function' ? getGameMillis() : millis();

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
