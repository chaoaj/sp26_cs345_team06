class Level {
    constructor(platforms) {
        //table of platforms, not drawn yet
        this.platforms = platforms;
        this.background = backgroundImage;
        image(this.background, 0, 0, width, height);
    }
    drawPlatforms() {
        for (let platform of this.platforms) {
            platform.draw();
        }
    }
}