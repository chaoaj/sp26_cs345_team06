class LaserTrap extends Trap {
  constructor(x, y, w, h, damage = 1, fireDuration = 2000) {
    super(x, y, w, h, damage);
    this.fireDuration = fireDuration;
  }

  isFiring() {
    return millis() < this.fireDuration;
  }

  draw() {
    if (!this.isFiring()) {
      return;
    }

    const left = this.x - this.w / 2;
    const top = this.y - this.h / 2;

    rectMode(CORNER);
    noStroke();
    fill(70);
    rect(left - 18, top - 6, 18, this.h + 12, 6);

    stroke(255, 40, 40);
    strokeWeight(this.h);
    line(left, this.y, left + this.w, this.y);

    stroke(255, 220, 220);
    strokeWeight(max(2, this.h * 0.25));
    line(left, this.y, left + this.w, this.y);

    rectMode(CENTER);
  }
}
