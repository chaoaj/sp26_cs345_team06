class Items {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.w = 20;
        this.h = 20;
        this.isCollected = false;
        this.collectedUntil = 0;
        this.respawnDelayMs = this.getRespawnDelayMs();
        this.canRespawn = !this.isAbilityPickup();
    }

    isAbilityPickup() {
        return this.type === "doubleJumpAbility" || this.type === "dashAbility";
    }

    getRespawnDelayMs() {
        if (this.type === "health") {
            return 8000;
        }

        if (this.type === "feather") {
            return 12000;
        }

        return 0;
    }

    getNowMs() {
        return typeof getGameMillis === "function" ? getGameMillis() : millis();
    }

    isAvailable(now = this.getNowMs()) {
        if (!this.isCollected) {
            return true;
        }

        if (this.canRespawn && now >= this.collectedUntil) {
            this.isCollected = false;
            return true;
        }

        return false;
    }

    draw() {
        if (!this.isAvailable()) {
            return;
        }

        if (this.type === "health") {
            fill(255, 215, 0);
        }

        if (this.type === "feather") {
            fill(200, 230, 255);
        }

        if (this.type === "shield") {
            fill(80, 170, 255);
        }

        if (this.type === "potion") {
            fill(150, 90, 255);
        }

        if (this.type === "doubleJumpAbility") {
            fill(120, 210, 255);
        }

        if (this.type === "dashAbility") {
            fill(255, 170, 90);
        }

        noStroke();
        rectMode(CENTER);
        rect(this.x, this.y, this.w, this.h);
    }

    onCollected(now = this.getNowMs()) {
        this.isCollected = true;

        if (this.canRespawn) {
            this.collectedUntil = now + this.respawnDelayMs;
        }
    }

    applyEffect(player) {
        if (this.type === "health") {
            player.gainHealth(1);
        }

        if (this.type === "feather") {
            player.activateHighJump();
        }

        if (this.type === "shield") {
            player.addShield(2);
        }

        if (this.type === "potion") {
            player.activateSpeedPotion();
        }

        if (this.type === "doubleJumpAbility") {
            player.addPermanentAbility(DOUBLE_JUMP_ABILITY);
        }

        if (this.type === "dashAbility") {
            player.addPermanentAbility(DASH_ABILITY);
        }

        this.onCollected();
    }
}
