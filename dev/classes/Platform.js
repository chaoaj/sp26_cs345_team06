class Platform{
    // constructor(data){
    //     this.x = data.x;
    //     this.y = data.y;
    //     this.w = data.w;
    //     this.h = data.h;
    // }

    //File will not compile with both constructors, 
    // above constructor is not needed at all

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