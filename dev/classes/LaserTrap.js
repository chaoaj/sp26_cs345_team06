class LaserTrap extends Trap {
  constructor(x, y, w, h, damage = 1, fireDuration = 2000, repeatInterval = 5000, previewDuration = 800, axis = "x") {
    super(x, y, w, h, damage);
    this.fireDuration = fireDuration;
    this.previewDuration = previewDuration;
    this.repeatInterval = max(repeatInterval, fireDuration + previewDuration);
    this.axis = axis;
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
    const left = this.x - this.width / 2;
    const right = this.x + this.width / 2;
    const top = this.y - this.height / 2;
    const bottom = this.y + this.height / 2;
    const isVertical = this.axis === "y";
    const beamThickness = isVertical ? this.width : this.height;
    const emitterSize = beamThickness + 2;

    rectMode(CORNER);
    noStroke();
    fill(70);
    if (isVertical) {
      rect(left - 6, top - 18, this.width + 12, 18, 6);
    } else {
      rect(left - 18, top - 6, 18, this.height + 12, 6);
    }

    if (this.isPreviewing()) {
      stroke(255, 70, 70, 140);
      strokeWeight(max(2, beamThickness * 0.35));
      if (isVertical) {
        line(this.x, top, this.x, bottom);
      } else {
        line(left, this.y, right, this.y);
      }

      noStroke();
      fill(150, 45, 45);
      if (isVertical) {
        circle(this.x, top - 9, emitterSize);
      } else {
        circle(left - 9, this.y, emitterSize);
      }
      rectMode(CENTER);
      return;
    }

    if (!this.isFiring()) {
      noStroke();
      fill(120);
      if (isVertical) {
        circle(this.x, top - 9, beamThickness);
      } else {
        circle(left - 9, this.y, beamThickness);
      }
      rectMode(CENTER);
      return;
    }

    stroke(255, 40, 40);
    strokeWeight(beamThickness);
    if (isVertical) {
      line(this.x, top, this.x, bottom);
    } else {
      line(left, this.y, right, this.y);
    }

    stroke(255, 120, 120);
    strokeWeight(max(2, beamThickness * 0.25));
    if (isVertical) {
      line(this.x, top, this.x, bottom);
    } else {
      line(left, this.y, right, this.y);
    }

    noStroke();
    fill(220, 70, 70);
    if (isVertical) {
      circle(this.x, top - 9, beamThickness + 6);
    } else {
      circle(left - 9, this.y, beamThickness + 6);
    }

    rectMode(CENTER);
  }
}
