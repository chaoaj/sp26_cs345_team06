class Platform{
    // constructor(data){
    //     this.x = data.x;
    //     this.y = data.y;
    //     this.w = data.w;
    //     this.h = data.h;
    // }

    //File will not compile with both constructors

    constructor(x, y, w, h, platformImage) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.platformImage = platformImage;
    }
    draw(){
        fill(100, 100, 100);
        noStroke();
        //rect(this.x, this.y, this.w, this.h);

        //rect is for hitbox visualization,
        // actual hitbox is determined by the 
        // numerical properties.
        //uncomment rect if collision issues arise

        //TODO: make these images into a repeatimng texture
        // in some way, so that they can be any width without looking stretched
        image(this.platformImage, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    }
}