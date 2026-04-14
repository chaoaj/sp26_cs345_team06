class MovingPlatform extends Platform {
    // axis:     "x" for left/right,  "y" for up/down
    // distance: how many pixels to travel away from the start position (positive)
    // speed:    pixels per frame
    //
    // Example — horizontal, travels 200px to the right then back:
    //   new MovingPlatform(500, height - 300, 200, 30, brickPlatformImage, "x", 200, 2)
    //
    // Example — vertical, travels 150px downward then back:
    //   new MovingPlatform(800, height - 400, 200, 30, brickPlatformImage, "y", 150, 1.5)

    constructor(x, y, w, h, platformImage, axis, distance, speed) {
        super(x, y, w, h, platformImage);
        this.startX = x;
        this.startY = y;
        this.axis = axis;
        this.distance = distance;
        this.speed = speed;
        this.direction = 1;
        this.xVelocity = 0;
        this.yVelocity = 0;
    }

    update() {
        if (this.axis === "x") {
            this.x += this.speed * this.direction;
            this.xVelocity = this.speed * this.direction;

            if (this.x >= this.startX + this.distance) {
                this.x = this.startX + this.distance;
                this.direction = -1;
            } else if (this.x <= this.startX) {
                this.x = this.startX;
                this.direction = 1;
            }
        } else {
            this.y += this.speed * this.direction;
            this.yVelocity = this.speed * this.direction;

            if (this.y >= this.startY + this.distance) {
                this.y = this.startY + this.distance;
                this.direction = -1;
            } else if (this.y <= this.startY) {
                this.y = this.startY;
                this.direction = 1;
            }
        }
    }
}
