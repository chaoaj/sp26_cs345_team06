// FlyingHostile is a chase-and-dash airborne enemy.
// Use it in level enemy arrays like:
// new FlyingHostile(x, y, w, h, speed, leftBound, rightBound, damage, detectionRange, dashRange)
// Tuning notes:
// - detectionRange controls when it starts chasing
// - dashRange controls when it starts windup and dash attacks
class FlyingHostile extends Hostile {
  constructor(
    x,
    y,
    w = 40,
    h = 40,
    speed = 2,
    leftBound = x - 100,
    rightBound = x + 100,
    damage = 1,
    detectionRange = 320,
    dashRange = 120
  ) {
    super(x, y, w, h, speed, leftBound, rightBound, damage);

    this.homeX = x;
    this.homeY = y;

    this.detectionRange = detectionRange;
    this.dashRange = dashRange;
    this.chaseSpeed = Math.max(2.5, speed * 1.6);
    this.returnSpeed = Math.max(1.8, speed * 1.2);
    this.dashSpeed = Math.max(8.5, speed * 4.5);
    this.dashDurationMs = 220;
    this.windupDurationMs = 520;
    this.dashCooldownMs = 900;
    this.dashHitCooldownMs = 1800;

    this.state = "idle";
    this.dashVx = 0;
    this.dashVy = 0;
    this.dashUntil = 0;
    this.nextDashAllowedAt = -Infinity;
    this.windupUntil = 0;
    this.windupAimX = x;
    this.windupAimY = y;
    this.dashConnected = false;
    this.canBeStomped = true;
    this.isDead = false;
  }

  update() {
    const target = this.getTargetPlayer();
    const now = typeof getGameMillis === "function" ? getGameMillis() : millis();

    if (!target) {
      this.returnHome();
      return;
    }

    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const distanceToPlayer = sqrt(dx * dx + dy * dy);
    const canDetect = distanceToPlayer <= this.detectionRange;

    if (this.state === "dash") {
      this.x += this.dashVx;
      this.y += this.dashVy;

      if (!this.dashConnected && this.isTouchingPlayer(target)) {
        this.dashConnected = true;
      }

      if (now >= this.dashUntil) {
        this.nextDashAllowedAt = now + (this.dashConnected ? this.dashHitCooldownMs : this.dashCooldownMs);
        this.dashConnected = false;
        this.state = canDetect ? "chase" : "return";
      }
    } else if (this.state === "windup") {
      this.state = "windup";

      if (!canDetect) {
        this.state = "return";
      } else if (now >= this.windupUntil) {
        const aimDx = this.windupAimX - this.x;
        const aimDy = this.windupAimY - this.y;
        this.startDash(aimDx, aimDy, now);
      }
    } else if (canDetect) {
      const canDash = now >= this.nextDashAllowedAt;
      if (canDash && distanceToPlayer <= this.dashRange) {
        this.startWindup(target.x, target.y, now);
      } else {
        this.state = "chase";
        this.moveToward(target.x, target.y, this.chaseSpeed);
      }
    } else {
      this.returnHome();
    }

    if (this.dashVx < 0 || (this.state !== "dash" && target.x < this.x)) {
      this.direction = -1;
    } else if (this.dashVx > 0 || (this.state !== "dash" && target.x > this.x)) {
      this.direction = 1;
    }
  }

  getTargetPlayer() {
    if (typeof player === "undefined" || !player) {
      return null;
    }

    return player;
  }

  startDash(dx, dy, now) {
    const len = sqrt(dx * dx + dy * dy) || 1;
    this.dashVx = (dx / len) * this.dashSpeed;
    this.dashVy = (dy / len) * this.dashSpeed;
    this.dashUntil = now + this.dashDurationMs;
    this.dashConnected = false;
    this.state = "dash";
  }

  startWindup(targetX, targetY, now) {
    this.windupAimX = targetX;
    this.windupAimY = targetY;
    this.windupUntil = now + this.windupDurationMs;
    this.state = "windup";
  }

  moveToward(targetX, targetY, speed) {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const len = sqrt(dx * dx + dy * dy) || 1;

    this.x += (dx / len) * speed;
    this.y += (dy / len) * speed;
  }

  returnHome() {
    const dxHome = this.homeX - this.x;
    const dyHome = this.homeY - this.y;
    const homeDistance = sqrt(dxHome * dxHome + dyHome * dyHome);

    this.state = "return";
    if (homeDistance <= 2) {
      this.x = this.homeX;
      this.y = this.homeY;
      this.state = "idle";
      return;
    }

    this.moveToward(this.homeX, this.homeY, this.returnSpeed);
  }

  isTouchingPlayer(target) {
    if (!target) {
      return false;
    }

    const enemyLeft = this.x - this.width / 2;
    const enemyRight = this.x + this.width / 2;
    const enemyTop = this.y - this.height / 2;
    const enemyBottom = this.y + this.height / 2;

    const playerLeft = typeof target.hitLeft === "number" ? target.hitLeft : target.x - target.width / 2;
    const playerRight = typeof target.hitRight === "number" ? target.hitRight : target.x + target.width / 2;
    const playerTop = typeof target.hitTop === "number" ? target.hitTop : target.y - target.height / 2;
    const playerBottom = typeof target.hitBottom === "number" ? target.hitBottom : target.y + target.height / 2;

    return (
      playerRight > enemyLeft &&
      playerLeft < enemyRight &&
      playerBottom > enemyTop &&
      playerTop < enemyBottom
    );
  }

  draw() {
    const isDashing = this.state === "dash";
    const isWindup = this.state === "windup";
    const windupPulse = (sin(millis() * 0.02) + 1) * 0.5;

    push();
    rectMode(CENTER);
    noStroke();

    if (isWindup) {
      stroke(255, 210, 90, 190);
      strokeWeight(2);
      noFill();
      ellipse(this.x, this.y, this.width + 8 + windupPulse * 14, this.height + 8 + windupPulse * 14);
      noStroke();
    }

    fill(isDashing ? color(255, 95, 65) : isWindup ? color(255, 170, 70) : color(215, 70, 70));
    ellipse(this.x, this.y, this.width, this.height * 0.75);

    fill(isDashing ? color(255, 210, 160) : color(245, 230, 205));
    const wingSpread = isDashing ? this.width * 0.75 : this.width * 0.55;
    triangle(
      this.x - this.width * 0.1,
      this.y - this.height * 0.1,
      this.x - wingSpread,
      this.y - this.height * 0.45,
      this.x - wingSpread,
      this.y + this.height * 0.3
    );
    triangle(
      this.x + this.width * 0.1,
      this.y - this.height * 0.1,
      this.x + wingSpread,
      this.y - this.height * 0.45,
      this.x + wingSpread,
      this.y + this.height * 0.3
    );

    fill(30);
    const eyeOffsetX = this.direction === -1 ? -this.width * 0.15 : this.width * 0.15;
    ellipse(this.x + eyeOffsetX, this.y - this.height * 0.08, this.width * 0.1, this.width * 0.1);
    pop();
  }
}
