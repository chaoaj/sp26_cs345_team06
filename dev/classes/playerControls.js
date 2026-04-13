function applyPlayerControls(player) {
  const movingLeft = keyIsDown(65);
  const movingRight = keyIsDown(68);
  const jumpHeldNow = keyIsDown(32) || keyIsDown(87);
  const dashHeldNow = keyIsDown(16);
  const directionalBoost = typeof player.jumpDirectionalBoost === "number" ? player.jumpDirectionalBoost : 1.8;
  const momentumDecay = typeof player.jumpMomentumDecay === "number" ? player.jumpMomentumDecay : 0.88;
  const jumpBufferDurationMs = typeof player.jumpBufferDurationMs === "number" ? player.jumpBufferDurationMs : 120;
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

  Ability.tryPerformJump(player, {
    jumpPressed,
    hasBufferedJump,
    movingLeft,
    movingRight,
    directionalBoost,
  });

  player.wasJumpHeld = jumpHeldNow;
  player.wasDashHeld = dashHeldNow;
}
