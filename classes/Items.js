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

        if (this.type === "shield") {
            return 15000;
        }

        if (this.type === "potion") {
            return 10000;
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
        imageMode(CENTER);
        if (!this.isAvailable()) {
            return;
        }

        if (this.type === "health") {
            image(healthImage, this.x, this.y, this.w*1.5, this.h*1.5);
        }

        if (this.type === "feather") {
            image(featherImage, this.x, this.y- this.w*.75, this.w*2, this.h*2);
        }
        if (this.type === "shield") {
            image(shieldImage, this.x, this.y, this.w*1.5, this.h*1.5);
        }

        if (this.type === "potion") {
            image(speedImage, this.x, this.y, this.w*1.5, this.h*1.5);
        }

        if (this.type === "doubleJumpAbility") {
            image(doubleJumpAmuletImage, this.x, this.y, this.w*1.5, this.h*1.5);
        }

        if (this.type === "dashAbility") {
            image(dashAmuletImage, this.x, this.y, this.w*1.5, this.h*1.5);
        }

        noStroke();
        rectMode(CENTER);
       //rect(this.x, this.y, this.w, this.h);
    }

    onCollected(now = this.getNowMs()) {
        this.isCollected = true;

        if (this.canRespawn) {
            this.collectedUntil = now + this.respawnDelayMs;
        }
    }

    applyEffect(player) {
        if (this.type === "health") {
            const bonusHeartAmount = typeof hasLevelUpAbility === "function" && hasLevelUpAbility(player, "bonusHeart") ? 1 : 0;
            player.gainHealth(1 + bonusHeartAmount);
        }

        if (this.type === "feather") {
            player.activateHighJump();
        }

        if (this.type === "shield") {
            const multiplier = typeof getItemEffectMultiplier === "function" ? getItemEffectMultiplier(player) : 1;
            player.addShield(Math.ceil(2 * multiplier));
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
