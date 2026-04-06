function applyPlayerControls(player) {
  if (keyIsDown(65)) {
    player.x -= player.moveSpeed;
    player.facingLeft = true;
  }
  if (keyIsDown(68)) {
    player.x += player.moveSpeed;
    player.facingLeft = false;
  }
  if ((keyIsDown(32) || keyIsDown(87)) && player.isOnGround) {
    //TODO: test to see if debounce needed
    player.yVelocity = -player.jumpStrength;
    player.isOnGround = false;
  }
}
