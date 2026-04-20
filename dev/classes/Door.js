class Door {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    drawDoor() {
        if (typeof doorImage !== "undefined" && doorImage) {
            imageMode(CENTER);
            image(doorImage, this.x, this.y, this.w, this.h);
            return;
        }

        fill(139, 69, 19);
        rect(this.x, this.y, this.w, this.h);
    }
}
