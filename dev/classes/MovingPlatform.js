class MovingPlatform extends BrickPlatform {

    // axis:     "x" for left/right,  "y" for up/down
    // distance: how many pixels to travel away from the start position (positive)
    // speed:    pixels per frame
    //
    // Example — horizontal, travels 200px to the right then back:
    //   new MovingPlatform(500, height - 300, 200, 30, brickPlatformImage, "x", 200, 2)
    //
    // Example — vertical, travels 150px downward then back:
    //   new MovingPlatform(800, height - 400, 200, 30, brickPlatformImage, "y", 150, 1.5)

    constructor(x, y, w, h, platformImage, axis, distance, speed, startOpposite = false) {
        super(x, y, w, h, platformImage);
        this.startX = x;
        this.startY = y;
        this.axis = axis;
        this.distance = distance;
        this.speed = speed;
        this._originalDirection = startOpposite ? -1 : 1;
        this.direction = this._originalDirection;
        this.xVelocity = 0;
        this.yVelocity = 0;

        if (startOpposite) {
            if (this.axis === "x") {
                this.x = this.startX + this.distance;
            } else {
                this.y = this.startY + this.distance;
            }
        }
    }

    update() {
        this.xVelocity = 0;
        this.yVelocity = 0;

        const previousX = this.x;
        const previousY = this.y;

        if (this.axis === "x") {
            const step = this.speed * this.direction;
            this.x += step;

            if (this.x >= this.startX + this.distance) {
                this.x = this.startX + this.distance;
                this.direction = -1;
            } else if (this.x <= this.startX) {
                this.x = this.startX;
                this.direction = 1;
            }

            this.xVelocity = this.x - previousX;
        } else {
            const step = this.speed * this.direction;
            this.y += step;

            if (this.y >= this.startY + this.distance) {
                this.y = this.startY + this.distance;
                this.direction = -1;
            } else if (this.y <= this.startY) {
                this.y = this.startY;
                this.direction = 1;
            }

            this.yVelocity = this.y - previousY;
        }
    }
        reset() {
            this.x = this.startX;
            this.y = this.startY;
            this.direction = this._originalDirection;
            this.xVelocity = 0;
            this.yVelocity = 0;
            // Also reset to the correct endpoint if originally started opposite
            if (this._originalDirection === -1) {
                if (this.axis === "x") {
                    this.x = this.startX + this.distance;
                } else {
                    this.y = this.startY + this.distance;
                }
            }
        }
}
