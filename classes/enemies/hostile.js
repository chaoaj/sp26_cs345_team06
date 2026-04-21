class Hostile {
  constructor(x, y, w = 40, h = 40, speed = 2, leftBound = x - 100, rightBound = x + 100, damage = 1) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = speed;
    this.leftBound = leftBound;
    this.rightBound = rightBound;
    this.damage = damage;
    this.direction = 1;

    this.frameCount = 8;
    this.fps = 8;
    this.animFrame = 0;
    this.animTimer = 0;
  }

  update() {
    //copied anim sheet stuff from player
    this.x += this.speed * this.direction;

    if (this.x <= this.leftBound) {
      this.x = this.leftBound;
      this.direction = 1;
    } else if (this.x >= this.rightBound) {
      this.x = this.rightBound;
      this.direction = -1;
    }

    this.animTimer += deltaTime;
    const frameDuration = 1000 / this.fps;
    if (this.animTimer >= frameDuration) {
      this.animTimer -= frameDuration;
      this.animFrame = (this.animFrame + 1) % this.frameCount;
    }
  }

  draw() {
    const frameW = greenslimeimage.width / this.frameCount;
    const sx = this.animFrame * frameW;
    const drawH = this.h * 3;
    const yOffset = -this.h; 

    push();
    imageMode(CENTER);
    noStroke();
    if (this.direction === -1) {
      translate(this.x, this.y + yOffset);
      scale(-1, 1);
      image(greenslimeimage, 0, 0, this.w * 3, drawH, sx, 0, frameW, greenslimeimage.height);
    } else {
      image(greenslimeimage, this.x, this.y + yOffset, this.w * 3, drawH, sx, 0, frameW, greenslimeimage.height);
    }
    pop();
  }
}