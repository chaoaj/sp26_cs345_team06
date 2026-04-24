class Door {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }

    drawDoor() {
        if (typeof doorImage !== "undefined" && doorImage) {
            image(doorImage, this.x, this.y, this.width, this.height);
            return;
        }

        fill(139, 69, 19);
        rect(this.x, this.y, this.width, this.height);
    }
}
