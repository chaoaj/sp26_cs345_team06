class DisappearingPlatform extends BrickPlatform {
    constructor(x, y, w, h, platformImage, collapseDelayMs = 1000, respawnDelayMs = 2000) {
        super(x, y, w, h, platformImage);
        this.collapseDelayMs = Math.max(0, collapseDelayMs);
        this.respawnDelayMs = Math.max(0, respawnDelayMs);
        this.isActive = true;
        this.triggeredAt = null;
        this.reappearAt = null;
    }

    update(player) {
        let now = millis();
        if (typeof getGameMillis === "function") {
            now = getGameMillis();
        }

        if (!this.isActive) {
            if (this.reappearAt !== null && now >= this.reappearAt) {
                this.reset();
            }
            return;
        }

        if (this.triggeredAt === null && this.isPlayerOnTop(player)) {
            this.triggeredAt = now;
        }

        if (this.triggeredAt !== null && now >= this.triggeredAt + this.collapseDelayMs) {
            this.isActive = false;
            this.reappearAt = now + this.respawnDelayMs;
            this.triggeredAt = null;
        }
    }

    isPlayerOnTop(player) {
        if (!player) {
            return false;
        }

        const playerLeft = typeof player.hitLeft === "number" ? player.hitLeft : player.x - player.width / 2;
        const playerRight = typeof player.hitRight === "number" ? player.hitRight : player.x + player.width / 2;
        const playerBottom = typeof player.hitBottom === "number" ? player.hitBottom : player.y + player.height / 2;
        const platformLeft = this.x - this.width / 2;
        const platformRight = this.x + this.width / 2;
        const platformTop = this.y - this.height / 2;
        const horizontalOverlap = playerRight > platformLeft && playerLeft < platformRight;
        const nearTop = abs(playerBottom - platformTop) <= 8;

        return horizontalOverlap && nearTop && player.yVelocity >= 0;
    }

    reset() {
        this.isActive = true;
        this.triggeredAt = null;
        this.reappearAt = null;
    }

    draw() {
        if (!this.isActive) {
            return;
        }

        super.draw();
    }
}
