class Floor {
    constructor(x, y, width, floorImage, pits = []) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.floorImage = floorImage;
        this.pits = pits;
        this.floors = [];
        this.floorTiles = [];
        this.lavaTiles = [];
        this.isGenerated = false;
    }

    generateFloor() {
        if (this.isGenerated) {
            return;
        }

        let pitNum = 0
        for (let i = 0; i < this.width / 32; i++) {
            if (this.pits[pitNum] && this.pits[pitNum][0] === i) {
                const pit = this.pits[pitNum];
                pitNum++;
                for (let j = 0; j < pit[1]; j++) {
                    const tileX = this.x + (i + j) * 32;
                    const tileY = this.y - 35;
                    this.lavaTiles.push({ x: tileX, y: tileY });
                }
<<<<<<< Updated upstream
                i--;
=======
                i += pit[1] - 1; // -1 because the outer for loop adds i++ after this block
>>>>>>> Stashed changes
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

        push();
        imageMode(CENTER);
        for (const tile of this.floorTiles) {
            image(this.floorImage, tile.x, tile.y, 32, 32);
        }

        for (const lava of this.lavaTiles) {
            image(lavaImage, lava.x, lava.y, 32, 32);
        }
        pop();

        return this.floors;
    }
}
