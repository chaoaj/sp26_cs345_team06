function applyPlayerControls(player) {
  const movingLeft = keyIsDown(65);
  const movingRight = keyIsDown(68);
  const jumpHeldNow = keyIsDown(32) || keyIsDown(87);
  const dashHeldNow = keyIsDown(16);
  const directionalBoost = typeof player.jumpDirectionalBoost === "number" ? player.jumpDirectionalBoost : 1.8;
  const momentumDecay = typeof player.jumpMomentumDecay === "number" ? player.jumpMomentumDecay : 0.88;
  const jumpBufferDurationMs = typeof player.jumpBufferDurationMs === "number" ? player.jumpBufferDurationMs : 120;
  if (typeof player.wallJumpLockoutUntil !== "number") player.wallJumpLockoutUntil = 0;
  if (typeof player.lastWallDir !== "number") player.lastWallDir = 0;
  const now = typeof getGameMillis === "function" ? getGameMillis() : millis();

  if (typeof player.jumpMomentumX !== "number" || !isFinite(player.jumpMomentumX)) {
    player.jumpMomentumX = 0;
  }
  if (typeof player.wasJumpHeld !== "boolean") {
    player.wasJumpHeld = false;
  }
  if (typeof player.wasDashHeld !== "boolean") {
    player.wasDashHeld = false;
  }

  // Wall jump detection (only if player has wall jump ability)
  let touchingWall = false;
  let wallDir = 0;
  if (typeof Ability !== "undefined" && Ability.canWallJump && Ability.canWallJump(player)) {
    // Check for wall collision (left/right)
    // We'll use a simple check: if player is not on ground and is colliding with a wall, allow wall jump
    // This requires Player.js to set player.touchingWallLeft/right each frame
    if (player.touchingWallLeft) {
      touchingWall = true;
      wallDir = -1;
    } else if (player.touchingWallRight) {
      touchingWall = true;
      wallDir = 1;
    }
  }

  const jumpPressed = jumpHeldNow && !player.wasJumpHeld;
  const dashPressed = dashHeldNow && !player.wasDashHeld;
  if (jumpPressed) {
    player.jumpBufferUntil = now + jumpBufferDurationMs;
  }

  const dashStep = Ability.calculateDashStep(player, {
    dashPressed,
    movingLeft,
    movingRight,
    now,
  });
  if (dashStep !== 0) {
    player.x += dashStep;
    player.wasJumpHeld = jumpHeldNow;
    player.wasDashHeld = dashHeldNow;
    return;
  }

  const hasBufferedJump = typeof player.jumpBufferUntil === "number" && now <= player.jumpBufferUntil;

  if (movingLeft) {
    player.x -= player.moveSpeed;
    player.facingLeft = true;
  }

  if (movingRight) {
    player.x += player.moveSpeed;
    player.facingLeft = false;
  }

  if (!player.isOnGround && player.jumpMomentumX !== 0) {
    player.x += player.jumpMomentumX;
    player.jumpMomentumX *= momentumDecay;

    if (abs(player.jumpMomentumX) < 0.05) {
      player.jumpMomentumX = 0;
    }
  }

  const coyoteGrounded = !player.isOnGround && now <= (player.coyoteUntil || 0);

  // Wall jump logic
  let didWallJump = false;
  if (
    touchingWall &&
    !player.isOnGround &&
    jumpPressed &&
    now > player.wallJumpLockoutUntil
  ) {
    // Wall jump!
    player.yVelocity = -player.jumpStrength;
    player.jumpMomentumX = (wallDir || player.lastWallDir || 1) * player.jumpDirectionalBoost;
    player.remainingAirJumps = player.maxAirJumps;
    player.wallJumpLockoutUntil = now + 180; // Prevent re-jumping instantly
    player.lastWallDir = wallDir;
    didWallJump = true;
  }

  if (!didWallJump) {
    Ability.tryPerformJump(player, {
      jumpPressed,
      hasBufferedJump,
      movingLeft,
      movingRight,
      directionalBoost,
      coyoteGrounded,
    });
  }

  player.wasJumpHeld = jumpHeldNow;
  player.wasDashHeld = dashHeldNow;
}
