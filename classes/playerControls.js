function applyPlayerControls(player) {
  if (keyIsDown(65)) {
    player.x -= player.moveSpeed;
  }
  if (keyIsDown(68)) {
    player.x += player.moveSpeed;
  }
  if ((keyIsDown(32) || keyIsDown(87)) && player.isOnGround) {
    player.yVelocity = -player.jumpStrength;
    player.isOnGround = false;
  }
}
