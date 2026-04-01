class Level {
    constructor(platforms, backgroundimage, floorImage, items = [], traps = []) { // added items parameter with default empty array
        //table of platforms, not drawn yet
        this.platforms = platforms;
        this.items = items;
        this.traps = traps;
        this.background = backgroundimage;
        //floor, do not include in level platforms
        var floor = new Platform(width / 2, height, width, 50, floorImage);
        platforms.push(floor);
        image(this.background, 0, 0, width, height);
    }
    drawPlatforms() {
        //print("drawing platforms")
        for (let platform of this.platforms) {
            platform.draw();
        }
    }

    drawItems() {
        for (let item of this.items) {
            item.draw();
        }
    }

    drawTraps() {
        for (let trap of this.traps) {
            trap.draw();
        }
    }

    collectTouchedItems(player) {
        this.items = this.items.filter((item) => {
            const touched = this.isPlayerTouchingItem(player, item);
            if (touched) {
                item.applyEffect(player);
            }
            return !touched;
        });
    }

    isPlayerTouchingItem(player, item) {
        const playerHalfW = player.width / 2;
        const playerHalfH = player.height / 2;

        return (
            Math.abs(player.x - item.x) <= playerHalfW + item.radius &&
            Math.abs(player.y - item.y) <= playerHalfH + item.radius
        );
    }

    drawLevel() {
        image(this.background, 0, 0, width, height);
        this.drawPlatforms();
        this.drawItems();
        this.drawTraps();
    }
    drawPlayer(player) {
        player.draw();
    }
    drawHUD(player) {
        fill(255);
        textSize(24);
        textAlign(LEFT, TOP);
        text(`Health: ${player.health}`, 10, 10);
    }
}
