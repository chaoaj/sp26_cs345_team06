class Items {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.w = 20;
        this.h = 20;
    }

    draw() {
        if (this.type === "health") {
            fill(255, 215, 0);
        }

        if (this.type === "feather") {
            fill(200, 230, 255);
        }

        noStroke();
        rectMode(CENTER);
        rect(this.x, this.y, this.w, this.h);
    }

    applyEffect(player) {
        if (this.type === "health") {
            player.gainHealth(1);
        }

        if (this.type === "feather") {
            player.activateHighJump();
        }
    }
}
