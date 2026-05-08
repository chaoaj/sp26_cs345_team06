class HarmfulPlatform extends BrickPlatform {
    constructor(x, y, w, h, damage = 1) {
        super(x, y, w, h, harmfulPlatformVinesTileset);
        this.damage = damage;
        this.isHarmful = true;
    }

    draw() {
        if (this.isVisible === false) return;
        const startX = this.x - this.w / 2;
        const startY = this.y - this.h / 2;
        for (let row = 0; row < this.tilesY; row++) {
            // top tile = sy 0, middle = sy 32, bottom = sy 64
            let srcY;
            if (row === 0)                        srcY = 0;
            else if (row === this.tilesY - 1)     srcY = 64;
            else                                  srcY = 32;
            for (let col = 0; col < this.tilesX; col++) {
                image(this.image, startX + col * 32, startY + row * 32, 32, 32, 0, srcY, 32, 32);
            }
        }
    }
}
