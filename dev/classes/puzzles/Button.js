class Button {
  constructor(x, y, w, h, callback = null, releaseCallback = null) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.isPressed = false;
    this.callback = callback;
    this.releaseCallback = releaseCallback;
  }

  checkPressed(entities) {
    const wasPressed = this.isPressed;
    this.isPressed = entities.some(e => this.isEntityOnTop(e));

    if (this.isPressed && !wasPressed && this.callback) {
      this.callback();
    }

    if (!this.isPressed && wasPressed && this.releaseCallback) {
      this.releaseCallback();
    }
  }

  isEntityOnTop(entity) {
    const eHalfW = entity.width / 2;
    const eHalfH = entity.height / 2;
    const eLeft = entity.x - eHalfW;
    const eRight = entity.x + eHalfW;
    const eBottom = entity.y + eHalfH;
    const buttonTop = this.y - this.height / 2;
    const buttonLeft = this.x - this.width / 2;
    const buttonRight = this.x + this.width / 2;

    return (
      eRight > buttonLeft &&
      eLeft < buttonRight &&
      eBottom >= buttonTop - 2 &&
      eBottom <= buttonTop + this.height
    );
  }

  draw() {
    const depression = this.isPressed ? this.height * 0.4 : 0;
    fill(this.isPressed ? color(180, 50, 50) : color(220, 80, 80));
    noStroke();
    rect(this.x, this.y + depression / 2, this.width, this.height - depression);
  }
}
