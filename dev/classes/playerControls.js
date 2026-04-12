function applyPlayerControls(player) {
  const movingLeft = keyIsDown(65);
  const movingRight = keyIsDown(68);
  const jumpHeldNow = keyIsDown(32) || keyIsDown(87);
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

  const jumpPressed = jumpHeldNow && !player.wasJumpHeld;
  if (jumpPressed) {
    player.jumpBufferUntil = now + jumpBufferDurationMs;
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

  if (hasBufferedJump && player.isOnGround) {
    //TODO: test to see if debounce needed
    player.yVelocity = -player.jumpStrength;
    if (movingLeft && !movingRight) {
      player.jumpMomentumX = -directionalBoost;
    } else if (movingRight && !movingLeft) {
      player.jumpMomentumX = directionalBoost;
    } else {
      player.jumpMomentumX = 0;
    }
    player.jumpBufferUntil = 0;
    player.isOnGround = false;
  }

  player.wasJumpHeld = jumpHeldNow;
}
