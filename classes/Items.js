class Items {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.radius = 10;
    }

    draw() {
        fill(255, 215, 0);
        noStroke();
        ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    }

    applyEffect(player) {
        if (this.type === "health") {
            player.gainHealth(1);
        }
    }
}
