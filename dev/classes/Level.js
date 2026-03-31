class Level {
    constructor(platforms) {
        //table of platforms, not drawn yet
        this.platforms = platforms;
        this.background = backgroundImage;
        //floor, do not include in level platforms
        var floor = new Platform(width / 2, height, width, 50);
        platforms.push(floor);
        image(this.background, 0, 0, width, height);
    }
    drawPlatforms() {
        for (let platform of this.platforms) {
            platform.draw();
        }

        
    }
    drawLevel() {
        image(this.background, 0, 0, width, height);
        this.drawPlatforms();
    }
    
}