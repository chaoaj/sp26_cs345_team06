class BrickPlatform extends Platform {
    constructor(x, y, w, h, pimage) {
        super(x, y, w, h, null)
        this.h -= this.h % 32
        this.w -= this.w % 32
        this.tilesX = this.w / 32
        this.tilesY = this.h / 32
        this.image = pimage
    }

    draw() {
        const startX = this.x - this.w / 2
        const startY = this.y - this.h / 2
        for (let row = 0; row < this.tilesY; row++) {
            for (let col = 0; col < this.tilesX; col++) {
                image(this.image, startX + (col * 32), startY + (row * 32), 32, 32)
            }
        }
    }
}