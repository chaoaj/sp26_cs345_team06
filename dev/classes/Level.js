class Level {
    constructor(platforms, backgroundimage, floorImage) {
        //table of platforms, not drawn yet
        this.platforms = platforms;
        this.background = backgroundimage;
        //floor, do not include in level platforms
        var floor = new Platform(width / 2, height, width, 50, floorImage);
        platforms.push(floor);
        image(this.background, 0, 0, width, height);
    }
    drawPlatforms() {
        print("drawing platforms")
        for (let platform of this.platforms) {
            platform.draw();
        }
    }
    drawLevel() {
        image(this.background, 0, 0, width, height);
        this.drawPlatforms();
    }
}