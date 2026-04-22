class Terrain {

    constructor(x, y, width, height, image) {
        //STEPS:
        // height is step(n) * 32
        // width is 96

        //BOXES:
        // height is step(n) * 32
        // width is 128

        //width and height need to be proportional to 
        // these sizes

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;

        this.isGenerated = false;
    }

    generateTerrain() {
        print("g")
        if (this.isGenerated) {
            return;
        }
        this.terrainTile = new Platform(this.x, this.y, this.width, this.height, this.image);
        this.isGenerated = true;
    }

    drawTerrain() {
        print("ter")
        this.generateTerrain();
        image(this.image, this.x, this.y, this.width, this.height);
        return this.terrainTile;
    }
}