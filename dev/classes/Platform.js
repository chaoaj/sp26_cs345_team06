class Platform{
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }


    draw(){
        fill(100, 100, 100);
        noStroke();
        rect(this.x, this.y, this.w, this.h);
    }

}