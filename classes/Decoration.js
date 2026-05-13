class Decoration {
    constructor(x, y, w, h, img) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.img = img;
    }

    draw() {
        if (this.img) {
            push();
            imageMode(CENTER);
            image(this.img, this.x, this.y, this.w, this.h);
            pop();
        }
    }
}
