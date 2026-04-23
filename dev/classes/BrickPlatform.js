class BrickPlatform extends Platform {
    constructor(x, y, w, h, image) {
        super(x, y, w, h, image)
        this.h -= this.h%32
        this.w -= this.w%32
        this.tiles = this.w/32
    }

    drawPlatform() {
        for (let i = 0; i < this.tiles, i++;) {
            image()
            print(this.w) 
            print("platform")
        }
    }
}