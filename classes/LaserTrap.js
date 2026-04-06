class LaserTrap extends Trap {
  constructor(x, y, w, h, damage = 1, fireDuration = 2000, repeatInterval = 5000, previewDuration = 800) {
    super(x, y, w, h, damage);
    this.fireDuration = fireDuration;
    this.previewDuration = previewDuration;
    this.repeatInterval = max(repeatInterval, fireDuration + previewDuration);
  }

  getCycleTime() {
    const clock = typeof getGameMillis === "function" ? getGameMillis() : millis();
    return clock % this.repeatInterval;
  }

  isPreviewing() {
    const cycleTime = this.getCycleTime();
    return cycleTime < this.previewDuration;
  }

  isFiring() {
    const cycleTime = this.getCycleTime();
    return cycleTime >= this.previewDuration && cycleTime < this.previewDuration + this.fireDuration;
  }

  draw() {
    const left = this.x - this.w / 2;
    const top = this.y - this.h / 2;
    const emitterX = left - 9;

    rectMode(CORNER);
    noStroke();
    fill(70);
    rect(left - 18, top - 6, 18, this.h + 12, 6);

    if (this.isPreviewing()) {
      stroke(255, 70, 70, 140);
      strokeWeight(max(2, this.h * 0.35));
      line(left, this.y, left + this.w, this.y);

      noStroke();
      fill(150, 45, 45);
      circle(emitterX, this.y, this.h + 2);
      rectMode(CENTER);
      return;
    }

    if (!this.isFiring()) {
      noStroke();
      fill(120);
      circle(emitterX, this.y, this.h);
      rectMode(CENTER);
      return;
    }

    stroke(255, 40, 40);
    strokeWeight(this.h);
    line(left, this.y, left + this.w, this.y);

    stroke(255, 120, 120);
    strokeWeight(max(2, this.h * 0.25));
    line(left, this.y, left + this.w, this.y);

    noStroke();
    fill(220, 70, 70);
    circle(emitterX, this.y, this.h + 6);

    rectMode(CENTER);
  }
}
