// Button: base class for all buttons
class Button {
  constructor(x, y, w, h, callback = null, releaseCallback = null) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
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
    const eHalfW = (entity.w || entity.width) / 2;
    const eHalfH = (entity.h || entity.height) / 2;
    const eLeft   = entity.x - eHalfW;
    const eRight  = entity.x + eHalfW;
    const eTop    = entity.y - eHalfH;
    const eBottom = entity.y + eHalfH;
    const buttonLeft   = this.x - this.w / 2;
    const buttonRight  = this.x + this.w / 2;
    const buttonTop    = this.y - this.h / 2;
    const buttonBottom = this.y + this.h / 2;

    return (
      eRight  > buttonLeft   &&
      eLeft   < buttonRight  &&
      eBottom > buttonTop    &&
      eBottom < buttonBottom + 8
    );
  }

  draw() {
    const depression = this.isPressed ? this.h * 0.4 : 0;
    fill(this.isPressed ? color(180, 50, 50) : color(220, 80, 80));
    noStroke();
    rect(this.x, this.y + depression / 2, this.w, this.h - depression);
  }
}

// SinglePressButton: starts red, turns green and stays down after first press
class SinglePressButton extends Button {
  constructor(x, y, w, h, callback = null) {
    super(x, y, w, h, callback, null);
    this.permaPressed = false;
  }

  checkPressed(entities) {
    if (this.permaPressed) return;
    const wasPressed = this.isPressed;
    this.isPressed = entities.some(e => this.isEntityOnTop(e));
    if (this.isPressed && !wasPressed && this.callback) {
      this.callback();
      this.permaPressed = true;
    }
  }

  draw() {
    // If permanently pressed, stays green and down
    const depressed = this.permaPressed || this.isPressed;
    const depression = depressed ? this.h * 0.4 : 0;
    fill(depressed ? color(60, 180, 60) : color(220, 80, 80));
    noStroke();
    rect(this.x, this.y + depression / 2, this.w, this.h - depression);
  }
}
