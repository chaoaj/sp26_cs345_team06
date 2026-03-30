function applyPlayerControls(player) {
  if (keyIsDown(65)) {
    player.x -= player.moveSpeed;
  }
  if (keyIsDown(68)) {
    player.x += player.moveSpeed;
  }
  if ((keyIsDown(32) || keyIsDown(87)) && player.isOnGround) {
    //TODO: test to see if debounced needed
    //TODO: test if keypressed better
    player.yVelocity = -player.jumpStrength;
    player.isOnGround = false;
  }
}
