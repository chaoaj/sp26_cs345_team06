class Camera {
  constructor(worldWidth, worldHeight) {
    this.x = 0;
    this.y = 0;
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.lerpFactor = 0.12;
  }

  follow(player) {
    const targetX = player.x - width / 2;
    const targetY = player.y - height / 2;

    // Follow more aggressively when player is airborne
    const isAirborne = !player.isOnFloor;
    const lerpSpeed = isAirborne ? 0.25 : this.lerpFactor;

    this.x = lerp(this.x, targetX, lerpSpeed);
    this.y = lerp(this.y, targetY, lerpSpeed);

    this.x = constrain(this.x, 0, max(0, this.worldWidth - width));

    // Allow camera to scroll up when player is airborne
    if (isAirborne) {
      this.y = constrain(this.y, -height, max(0, this.worldHeight - height));
    } else {
      this.y = constrain(this.y, 0, max(0, this.worldHeight - height));
    }
  }

  constrainPlayer(player) {
    const halfW = player.width / 2;
    const halfH = player.height / 2;
    player.x = constrain(player.x, this.x + halfW, this.x + width - halfW);
    player.y = constrain(player.y, this.y + halfH, this.y + height - halfH);
  }

  apply() {
    push();
    translate(-this.x, -this.y);
  }

  reset() {
    pop();
  }
}
