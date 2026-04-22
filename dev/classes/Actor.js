class Actor {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;

        this.width = w;
        this.height = h;

        this.xVelocity = 0;
        this.yVelocity = 0;

        this.gravity = 0.6;
        this.isOnGround = false;

        this.facingLeft = false;

        this.maxHealth = 3;
        this.health = this.maxHealth;
    }

    get left() { return this.x - this.width / 2; }
    get right() { return this.x + this.width / 2; }
    get top() { return this.y - this.height / 2; }
    get bottom() { return this.y + this.height / 2; }

    update(platforms) {
        this.applyPhysics();
        this.move();
    }

    applyPhysics() {
        this.yVelocity += this.gravity;
    }

    move() {
        this.x += this.xVelocity;
        this.y += this.yVelocity;
    }

    takeDamage(amount = 1) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        // override in subclasses
    }

    draw() {
        // override
    }
}
