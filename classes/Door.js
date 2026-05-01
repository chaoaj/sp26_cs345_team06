class Door {
    constructor(x, y, w, h, targetLevelNum = null) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.targetLevelNum = targetLevelNum; // Level number to go to when used
    }

    drawDoor() {
        if (this.isVisible === false) return;

        if (typeof doorImage !== "undefined" && doorImage) {
            image(doorImage, this.x, this.y, this.w, this.h);
            return;
        }

        fill(139, 69, 19);
        rect(this.x, this.y, this.w, this.h);
    }
}
