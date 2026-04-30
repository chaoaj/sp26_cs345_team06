class RangedProjectile {
  constructor(x, y, velocityX, damage = 1, radius = 10, lifetimeMs = 2500, colorValue = null) {
    let now = millis();
    if (typeof getGameMillis === "function") {
      now = getGameMillis();
    }

    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.damage = damage;
    this.radius = radius;
    this.expiresAt = now + lifetimeMs;
    this.colorValue = colorValue || color(255, 120, 80);
    this.isExpired = false;
  }

  update() {
    this.x += this.velocityX;

    let now = millis();
    if (typeof getGameMillis === "function") {
      now = getGameMillis();
    }
    if (now >= this.expiresAt) {
      this.isExpired = true;
    }
  }

  draw() {
    push();
    imageMode(CENTER);

    if (typeof rangedHostileProjectileImage !== "undefined" && rangedHostileProjectileImage) {
      translate(this.x, this.y);
      if (this.velocityX < 0) {
        scale(-1, 1);
      }
      image(rangedHostileProjectileImage, 0, 0, this.radius * 4, this.radius * 1.4);
    } else {
      noStroke();
      fill(this.colorValue);
      ellipse(this.x, this.y, this.radius * 2, this.radius * 2);

      fill(255, 220, 180, 200);
      ellipse(this.x - this.radius * 0.2, this.y - this.radius * 0.2, this.radius, this.radius);
    }

    pop();
  }
}

class RangedHostile extends Hostile {
  constructor(
    x,
    y,
    w = 44,
    h = 44,
    speed = 1.4,
    leftBound = x - 120,
    rightBound = x + 120,
    damage = 1,
    detectionRange = 320,
    shootCooldownMs = 1200,
    projectileSpeed = 5.5,
    projectileDamage = 1
  ) {
    super(x, y, w, h, speed, leftBound, rightBound, damage);

    this.homeX = x;
    this.homeY = y;
    this.detectionRange = detectionRange;
    this.shootCooldownMs = Math.max(150, shootCooldownMs);
    this.projectileSpeed = Math.max(1, projectileSpeed);
    this.projectileDamage = projectileDamage;
    this.projectileRadius = 10;
    this.projectileLifetimeMs = 2500;
    this.projectiles = [];
    this.nextShotAt = 0;
    this.homeDirection = this.direction;
    this.canBeStomped = false;
    this.isDead = false;
    this.animFrame = 0;
    this.animTimer = 0;
    this.currentAnimationKey = "walk";
    this.attackingUntil = 0;
  }

  update() {
    this.updateProjectiles();
    this.patrol();

    const target = this.getTargetPlayer();
    let now = millis();
    if (typeof getGameMillis === "function") {
      now = getGameMillis();
    }

    if (!target) {
      this.updateAnimation();
      return;
    }

    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const distanceToPlayer = sqrt(dx * dx + dy * dy);
    const playerInRange = distanceToPlayer <= this.detectionRange;

    if (dx < 0) {
      this.direction = -1;
    } else if (dx > 0) {
      this.direction = 1;
    }

    if (playerInRange) {
      if (now >= this.nextShotAt) {
        this.shootAt(target.x, target.y, now);
      }
    }

    this.updateAnimation();
  }

  patrol() {
    this.x += this.speed * this.direction;

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

  shootAt(targetX, targetY, now) {
    let projectileDirection = 1;
    if (targetX < this.x) {
      projectileDirection = -1;
    }

    let projectileY = this.y;
    if (targetY < this.y) {
      projectileY = this.y - this.height * 0.12;
    }

    const projectile = new RangedProjectile(
      this.x + projectileDirection * (this.width * 0.5 + 8),
      projectileY,
      projectileDirection * this.projectileSpeed,
      this.projectileDamage,
      this.projectileRadius,
      this.projectileLifetimeMs
    );

    this.projectiles.push(projectile);
    this.nextShotAt = now + this.shootCooldownMs;
    this.attackingUntil = now + 450;
  }

  updateProjectiles() {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      projectile.update();

      if (projectile.isExpired) {
        this.projectiles.splice(i, 1);
      }
    }
  }

  reset() {
    this.x = this.homeX;
    this.y = this.homeY;
    this.direction = this.homeDirection;
    this.projectiles = [];
    this.nextShotAt = 0;
    this.isDead = false;
    this.attackingUntil = 0;
    this.animFrame = 0;
    this.animTimer = 0;
    this.currentAnimationKey = "walk";
  }

  getActiveAnimation() {
    const now = typeof getGameMillis === "function" ? getGameMillis() : millis();

    if (
      now < this.attackingUntil &&
      typeof rangedHostileAttackFrames !== "undefined" &&
      Array.isArray(rangedHostileAttackFrames) &&
      rangedHostileAttackFrames.length > 0
    ) {
      return {
        key: "attack",
        frames: rangedHostileAttackFrames,
        fps: 14,
        loop: false,
      };
    }

    if (
      this.speed > 0 &&
      typeof rangedHostileWalkFrames !== "undefined" &&
      Array.isArray(rangedHostileWalkFrames) &&
      rangedHostileWalkFrames.length > 0
    ) {
      return {
        key: "walk",
        frames: rangedHostileWalkFrames,
        fps: 10,
        loop: true,
      };
    }

    if (
      typeof rangedHostileIdleFrames !== "undefined" &&
      Array.isArray(rangedHostileIdleFrames) &&
      rangedHostileIdleFrames.length > 0
    ) {
      return {
        key: "idle",
        frames: rangedHostileIdleFrames,
        fps: 10,
        loop: true,
      };
    }

    return {
      key: "fallback",
      frames: [],
      fps: 10,
      loop: true,
    };
  }

  updateAnimation() {
    const animation = this.getActiveAnimation();
    if (!animation.frames || animation.frames.length === 0) {
      return;
    }

    if (this.currentAnimationKey !== animation.key) {
      this.currentAnimationKey = animation.key;
      this.animFrame = 0;
      this.animTimer = 0;
    }

    this.animTimer += deltaTime;
    const frameDuration = 1000 / animation.fps;
    while (this.animTimer >= frameDuration) {
      this.animTimer -= frameDuration;
      if (animation.loop) {
        this.animFrame = (this.animFrame + 1) % animation.frames.length;
      } else {
        this.animFrame = Math.min(this.animFrame + 1, animation.frames.length - 1);
      }
    }
  }

  draw() {
    push();

    const animation = this.getActiveAnimation();
    const frame = animation.frames && animation.frames.length > 0
      ? animation.frames[Math.min(this.animFrame, animation.frames.length - 1)]
      : null;

    if (frame) {
      imageMode(CENTER);
      const drawH = this.height * 2.8;
      const drawW = drawH * (frame.width / frame.height);
      const yOffset = this.height * 0.5 - drawH * 0.5;

      if (this.direction === 1) {
        translate(this.x, this.y + yOffset);
        scale(-1, 1);
        image(frame, 0, 0, drawW, drawH);
      } else {
        image(frame, this.x, this.y + yOffset, drawW, drawH);
      }
    } else {
      rectMode(CENTER);
      noStroke();
      fill(155, 155, 165);
      rect(this.x, this.y, this.width, this.height);
    }

    pop();

    for (const projectile of this.projectiles) {
      projectile.draw();
    }
  }
}
