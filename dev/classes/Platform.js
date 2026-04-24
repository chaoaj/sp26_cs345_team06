class Platform{
    constructor(x, y, w, h, platformImage) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.platformImage = platformImage;
    }
    draw(){
        noStroke();
        if (this.platformImage) {
            imageMode(CENTER);
            image(this.platformImage, this.x, this.y, this.width, this.height);
        }
    }
}