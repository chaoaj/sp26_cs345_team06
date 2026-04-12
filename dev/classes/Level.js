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
            // if (!(trap instanceof SpikeTrap)) {
            //     continue;
            // }

            // if (this.isPlayerTouchingTrap(player, trap)) {
            //     player.takeDamage(trap.damage);
            //     this.lastTrapDamageAt = now;
            //     return;
            // }
            if (trap instanceof SpikeTrap) {
                if (this.isPlayerTouchingTrap(player, trap)) {
                    player.takeDamage(trap.damage);
                    this.lastTrapDamageAt = now;
                    return;
                }
            }

            else if (trap instanceof LaserTrap) {
                if (!trap.isFiring()) {
                    continue;
                }

                if (this.isPlayerTouchingTrap(player, trap)) {
                    player.takeDamage(trap.damage);
                    this.lastTrapDamageAt = now;
                    return;
                }
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
        let itemHalfW = item.w / 2;
        let itemHalfH = item.h / 2;

        if (typeof item.w === "undefined") {
            itemHalfW = item.radius;
        }

        if (typeof item.h === "undefined") {
            itemHalfH = item.radius;
        }

        return (
            Math.abs(player.x - item.x) <= playerHalfW + itemHalfW &&
            Math.abs(player.y - item.y) <= playerHalfH + itemHalfH
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

    applyEnemyDamage(player) {
        const now = typeof getGameMillis === "function" ? getGameMillis() : millis();
        if (now - this.lastTrapDamageAt < this.trapDamageCooldownMs) {
            return;
        }

        for (const enemy of this.enemies) {
            const enemyLeft   = enemy.x - enemy.w / 2;
            const enemyRight  = enemy.x + enemy.w / 2;
            const enemyTop    = enemy.y - enemy.h / 2;
            const enemyBottom = enemy.y + enemy.h / 2;

            if (
                player.hitRight > enemyLeft &&
                player.hitLeft  < enemyRight &&
                player.hitBottom > enemyTop &&
                player.hitTop   < enemyBottom
            ) {
                player.takeDamage(enemy.damage);
                this.lastTrapDamageAt = now;
                return;
            }
        }
    }

    drawLevel() {
        noSmooth()

        this.drawBackground();
        this.drawWorld();
    }
    drawPlayer(player) {
        noSmooth()
        player.draw();
    }
    drawHUD(player) {
        noSmooth()
        fill(255);
        textSize(24);
        textAlign(LEFT, TOP);
        if (typeof heartImage !== "undefined" && heartImage) {
            for (let i = 0; i < player.health; i++) {
                noSmooth()
                image(heartImage, 20 + i * 40, 20, 30, 30);
            }
        } else {
            text(`Health: ${player.health}`, 10, 10);
        }

        if (player.shieldHealth > 0) {
            fill(80, 170, 255);
            for (let i = 0; i < player.shieldHealth; i++) {
                rect(35 + i * 40, 70, 24, 24, 5);
            }
            fill(255);
        }

        if (player.highJumpExpiresAt > 0) {
            const highJumpTimeLeftMs = player.getHighJumpTimeLeftMs();
            const highJumpTimeLeftSeconds = ceil(highJumpTimeLeftMs / 1000);
            text(`High Jump: ${highJumpTimeLeftSeconds}s`, 20, 100);
        }

        if (player.speedPotionExpiresAt > 0) {
            const speedPotionTimeLeftMs = player.getSpeedPotionTimeLeftMs();
            const speedPotionTimeLeftSeconds = ceil(speedPotionTimeLeftMs / 1000);
            text(`Speed: ${speedPotionTimeLeftSeconds}s`, 20, 135);
        }
    }
}
