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

    this.x = lerp(this.x, targetX, this.lerpFactor);
    this.y = lerp(this.y, targetY, this.lerpFactor);

    this.x = constrain(this.x, 0, max(0, this.worldWidth - width));
    this.y = constrain(this.y, 0, max(0, this.worldHeight - height));
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
