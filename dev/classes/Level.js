class Level {
    constructor(platforms, backgroundimage, floorImage, items = [], traps = [], worldWidth = null, boxes = [], buttons = [], enemies = []) {
        this.worldWidth = worldWidth || width;
        //table of platforms, not drawn yet
        this.platforms = platforms;
        this.items = items;
        this.traps = traps;
        this.boxes = boxes;
        this.buttons = buttons;
        this.enemies = enemies;
        this.background = backgroundimage;
        //floor, do not include in level platforms
        this.trapDamageCooldownMs = 400;
        this.lastTrapDamageAt = -Infinity;
        var floor = new Platform(this.worldWidth / 2, height, this.worldWidth, 50, floorImage);
        platforms.push(floor);
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

    drawEnemies() {
        for (const enemy of this.enemies) {
            enemy.draw();
        }
    }

    updateEnemies() {
        for (const enemy of this.enemies) {
            enemy.update();
        }
    }

    applyTrapDamage(player) {
        const now = typeof getGameMillis === "function" ? getGameMillis() : millis();
        if (now - this.lastTrapDamageAt < this.trapDamageCooldownMs) {
            return;
        }

        for (const trap of this.traps) {
            if (!(trap instanceof SpikeTrap)) {
                continue;
            }

            if (this.isPlayerTouchingTrap(player, trap)) {
                player.takeDamage(trap.damage);
                this.lastTrapDamageAt = now;
                return;
            }
        }
    }

    isPlayerTouchingTrap(player, trap) {
        const trapLeft = trap.x - trap.w / 2;
        const trapRight = trap.x + trap.w / 2;
        const trapTop = trap.y - trap.h / 2;
        const trapBottom = trap.y + trap.h / 2;

        return (
            player.hitRight > trapLeft &&
            player.hitLeft < trapRight &&
            player.hitBottom > trapTop &&
            player.hitTop < trapBottom
        );
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

    drawBackground() {
        image(this.background, 0, 0, width, height);
    }

    drawWorld() {
        this.drawPlatforms();
        this.drawItems();
        this.drawTraps();
        this.drawEnemies();
        for (const box of this.boxes) box.draw();
        for (const button of this.buttons) button.draw();
    }

    updatePuzzleElements(player) {
        this.resolvePlayerBoxCollisions(player);

        for (const box of this.boxes) {
            box.update(this.platforms);
        }

        for (let i = 0; i < this.boxes.length; i++) {
            for (let j = i + 1; j < this.boxes.length; j++) {
                this.boxes[i].resolveBoxCollision(this.boxes[j]);
            }
        }

        const entities = [player, ...this.boxes];
        for (const button of this.buttons) {
            button.checkPressed(entities);
        }
    }

    resolvePlayerBoxCollisions(player) {
        for (const box of this.boxes) {
            const boxLeft = box.x - box.w / 2;
            const boxRight = box.x + box.w / 2;
            const boxTop = box.y - box.h / 2;
            const boxBottom = box.y + box.h / 2;

            if (player.hitRight <= boxLeft || player.hitLeft >= boxRight ||
                player.hitBottom <= boxTop || player.hitTop >= boxBottom) {
                continue;
            }

            const overlapLeft = player.hitRight - boxLeft;
            const overlapRight = boxRight - player.hitLeft;
            const overlapTop = player.hitBottom - boxTop;
            const overlapBottom = boxBottom - player.hitTop;
            const minX = Math.min(overlapLeft, overlapRight);
            const minY = Math.min(overlapTop, overlapBottom);

            if (minY <= minX) {
                if (overlapTop <= overlapBottom) {
                    player.y -= overlapTop;
                    player.yVelocity = 0;
                    player.isOnGround = true;
                } else {
                    player.y += overlapBottom;
                }
            } else {
                if (overlapLeft <= overlapRight) {
                    player.x -= overlapLeft;
                    box.xVelocity = 4;
                } else {
                    player.x += overlapRight;
                    box.xVelocity = -4;
                }
            }
        }
    }

    drawLevel() {
        this.drawBackground();
        this.drawWorld();
    }
    drawPlayer(player) {
        player.draw();
    }
    drawHUD(player) {
        fill(255);
        textSize(24);
        textAlign(LEFT, TOP);
        if (typeof heartImage !== "undefined" && heartImage) {
            for (let i = 0; i < player.health; i++) {
                image(heartImage, 20 + i * 40, 20, 30, 30);
            }
        } else {
            text(`Health: ${player.health}`, 10, 10);
        }
    }
}
