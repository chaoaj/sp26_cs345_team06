class Floor {
    constructor(x, y, width, floorImage, pits = []) {
        //32x32px
        this.x = x;
        this.y = y;
        this.width = width;
        this.floorImage = floorImage;
        this.pits = pits;
        this.floors = [];
        this.floorTiles = [];
        this.isGenerated = false;
    }

    generateFloor() {
        if (this.isGenerated) {
            return;
        }

        let pitNum = 0
        for (let i = 0; i < this.width / 32; i++) {
            if (this.pits[pitNum] && this.pits[pitNum][0] === i) {
                i += this.pits[pitNum][1];
                pitNum++;
            } else {
                const tileX = this.x + i * 32;
                const tileY = this.y - 35;
                this.floorTiles.push({ x: tileX, y: tileY });
                this.floors.push(new Platform(tileX, tileY, 32, 32, null));
            }
        }

        this.isGenerated = true;
    }

    drawFloor() {
        this.generateFloor();

        for (const tile of this.floorTiles) {
            image(this.floorImage, tile.x, tile.y, 32, 32);
        }

        return this.floors;
    }
}
