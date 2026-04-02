class Button {
  constructor(x, y, w, h, callback = null) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.isPressed = false;
    this.callback = callback;
  }

  checkPressed(entities) {
    const wasPressed = this.isPressed;
    this.isPressed = entities.some(e => this.isEntityOnTop(e));
    if (this.isPressed && !wasPressed && this.callback) {
      this.callback();
    }
  }

  isEntityOnTop(entity) {
    const eHalfW = (entity.w || entity.width) / 2;
    const eHalfH = (entity.h || entity.height) / 2;
    const eLeft = entity.x - eHalfW;
    const eRight = entity.x + eHalfW;
    const eBottom = entity.y + eHalfH;
    const buttonTop = this.y - this.h / 2;
    const buttonLeft = this.x - this.w / 2;
    const buttonRight = this.x + this.w / 2;

    return (
      eRight > buttonLeft &&
      eLeft < buttonRight &&
      eBottom >= buttonTop - 2 &&
      eBottom <= buttonTop + this.h
    );
  }

  draw() {
    const depression = this.isPressed ? this.h * 0.4 : 0;
    fill(this.isPressed ? color(180, 50, 50) : color(220, 80, 80));
    noStroke();
    rect(this.x, this.y + depression / 2, this.w, this.h - depression);
  }
}
