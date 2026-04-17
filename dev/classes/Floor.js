class Floor {
    constructor(x, y, width, floorImage, pits = []) {
        //32x32px
        this.x = x;
        this.y = y;
        this.width = width;
        this.floorImage = floorImage;
        this.pits = pits;
        this.floors = []
    }
    drawFloor() {
        let pitNum = 0
        for (let i = 0; i < this.width / 32; i++) {
            if (this.pits[pitNum] && this.pits[pitNum][0] === i) {
                i += this.pits[pitNum][1];
                pitNum++;
            } else {
                image(this.floorImage, this.x + i * 32, this.y-35, 32, 32);
                this.floors.push(new Platform(this.x + i * 32, this.y - 35, 32, 32, null));
            }
        }
        return this.floors;
    }
}