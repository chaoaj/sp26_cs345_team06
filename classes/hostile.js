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
  }

  update() {
    this.x += this.speed * this.direction;

    if (this.x <= this.leftBound) {
      this.x = this.leftBound;
      this.direction = 1;
    } else if (this.x >= this.rightBound) {
      this.x = this.rightBound;
      this.direction = -1;
    }
  }

  draw() {
    fill(200, 60, 60);
    noStroke();
    rect(this.x, this.y, this.w, this.h, 8);
  }
}
