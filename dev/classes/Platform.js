class Platform{
    constructor(x, y, w, h, platformImage) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.platformImage = platformImage;
    }
    draw(){
        noStroke();
        if (this.platformImage) {
            imageMode(CENTER);
            image(this.platformImage, this.x, this.y, this.w, this.h);
        }
    }
}