class EndGame {
  constructor(worldWidth, floorImage, platformImage) {
    this.worldWidth = worldWidth;
    this.floorImage = floorImage;
    this.platformImage = platformImage;
    this.platforms = [];
    this.treasure = null;
  }

  setup() {
    const floorHeight = 50;
    this.platforms = [
      new Platform(this.worldWidth / 2, height, this.worldWidth, floorHeight, this.floorImage),
      new Platform(340, height - 160, 180, 26, this.platformImage),
      new Platform(510, height - 250, 180, 26, this.platformImage),
      new Platform(680, height - 340, 180, 26, this.platformImage),
      new Platform(850, height - 430, 180, 26, this.platformImage),
    ];

    this.treasure = {
      x: 850,
      y: height - 470,
      w: 62,
      h: 46,
      collected: false,
    };
  }

  getSpawnPoint() {
    return {
      x: 120,
      y: height - 100,
    };
  }

  hasCollectedTreasure(player) {
    if (!this.treasure || this.treasure.collected) {
      return !!(this.treasure && this.treasure.collected);
    }

    const chestLeft = this.treasure.x - this.treasure.w / 2;
    const chestRight = this.treasure.x + this.treasure.w / 2;
    const chestTop = this.treasure.y - this.treasure.h / 2;
    const chestBottom = this.treasure.y + this.treasure.h / 2;

    const touchingChest =
      player.hitRight > chestLeft &&
      player.hitLeft < chestRight &&
      player.hitBottom > chestTop &&
      player.hitTop < chestBottom;

    if (touchingChest) {
      this.treasure.collected = true;
    }

    return this.treasure.collected;
  }

  drawBackground() {
    background(20, 24, 34);

    noStroke();
    fill(42, 55, 78);
    rectMode(CORNER);
    rect(0, height * 0.62, width, height * 0.38);
  }

  drawTreasureChest() {
    if (!this.treasure || this.treasure.collected) {
      return;
    }

    const x = this.treasure.x;
    const y = this.treasure.y;
    const w = this.treasure.w;
    const h = this.treasure.h;

    push();
    rectMode(CENTER);
    stroke(70, 40, 10);
    strokeWeight(2);

    fill(143, 90, 45);
    rect(x, y + 8, w, h * 0.62, 4);

    fill(170, 110, 55);
    rect(x, y - 8, w, h * 0.42, 7);

    noStroke();
    fill(236, 192, 74);
    rect(x, y + 6, 12, 10, 2);
    pop();
  }

  drawWorld() {
    for (const platform of this.platforms) {
      platform.draw();
    }

    this.drawTreasureChest();
  }
}
