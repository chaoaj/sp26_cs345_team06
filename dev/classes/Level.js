class Level {
    constructor(platforms, backgroundimage, floorImage, items = [], traps = [], worldWidth = null, boxes = [], buttons = [], enemies = [], doors = [], pits =[], terrain = []) {
        this.worldWidth = worldWidth || width;
        //table of platforms, not drawn yet
        this.platforms = [...platforms];
        this.items = [...items];
        this.traps = [...traps];
        this.doors = [...doors];
        this.boxes = [...boxes];
        this.buttons = [...buttons];
        this.enemies = [...enemies];
        this.background = backgroundimage;
        this.pits = [...pits];
        this.terrain = [...terrain];

        //floor, do not include in level platforms
        this.trapDamageCooldownMs = 400;
        this.lastTrapDamageAt = -Infinity;
        // var floorHitbox = new Platform(this.worldWidth / 2, height, this.worldWidth, 50, null);
        // platforms.push(floorHitbox);
        //10 blocks in, 3 wide
        this.floor = new Floor(0, height + 25, this.worldWidth, floorImage, this.pits);
        this.floorPlatforms = this.floor.drawFloor();
        this.platforms.push(...this.floorPlatforms);
        this.terrainPlatforms = []
        for (const terrain of this.terrain) {
            print(terrain)
            print("this")
            this.terrainPlatforms.push(terrain.drawTerrain());
        }
        this.platforms.push(...this.terrainPlatforms);

        this.initialItemStates = this.items.map((item) => ({
            x: item.x,
            y: item.y,
            isCollected: item.isCollected,
            collectedUntil: item.collectedUntil,
        }));

        this.initialBoxStates = this.boxes.map((box) => ({
            x: box.x,
            y: box.y,
            xVelocity: box.xVelocity,
            yVelocity: box.yVelocity,
            isOnGround: box.isOnGround,
        }));

        this.pushPlatform = function(platform) {
            this.platforms.push(platform);
        }
    }

    resetDynamicState() {
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            const initial = this.initialItemStates[i];
            if (!item || !initial) {
                continue;
            }

            item.x = initial.x;
            item.y = initial.y;
            item.isCollected = false;
            item.collectedUntil = 0;
        }

        for (let i = 0; i < this.boxes.length; i++) {
            const box = this.boxes[i];
            const initial = this.initialBoxStates[i];
            if (!box || !initial) {
                continue;
            }

            box.x = initial.x;
            box.y = initial.y;
            box.xVelocity = 0;
            box.yVelocity = 0;
            box.isOnGround = false;
        }
    }

    drawPlatforms() {
        for (let platform of this.platforms) {
            platform.draw();
        }
    }

    updateMovingPlatforms() {
        for (const platform of this.platforms) {
            if (platform instanceof MovingPlatform) {
                platform.update();
            }
        }

        for (const trap of this.traps) {
            if (typeof trap.updateAttachedPosition === "function") {
                trap.updateAttachedPosition();
            }
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

    drawDoors() {
        for (const door of this.doors) {
            console.log("drawing door")
            door.drawDoor();
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

    isPlayerTouchingPit(player) {
        if (!this.pits || this.pits.length === 0) {
            return false;
        }

        // Pits are floor tile gaps; each tile is 32px wide and centered at i*32.
        const playerLeft = typeof player.hitLeft === "number" ? player.hitLeft : player.x - player.width / 2;
        const playerRight = typeof player.hitRight === "number" ? player.hitRight : player.x + player.width / 2;
        const touchingFloorBand = player.y + player.height / 2 >= height - 1;

        if (!touchingFloorBand) {
            return false;
        }

        for (const pit of this.pits) {
            const startTile = pit[0];
            const tileSpan = pit[1] + 1;
            const pitLeft = startTile * 32 - 16;
            const pitRight = pitLeft + tileSpan * 32;

            if (playerRight > pitLeft && playerLeft < pitRight) {
                return true;
            }
        }

        return false;
    }

    applyPitfall(player) {
        if (this.isPlayerTouchingPit(player)) {
            player.respawn();
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
        const now = typeof getGameMillis === "function" ? getGameMillis() : millis();

        for (const item of this.items) {
            if (typeof item.isAvailable === "function" && !item.isAvailable(now)) {
                continue;
            }

            const touched = this.isPlayerTouchingItem(player, item);
            if (touched) {
                item.applyEffect(player);
            }
        }
    }

    isPlayerTouchingItem(player, item) {
        const playerLeft = typeof player.hitLeft === "number" ? player.hitLeft : player.x - player.width / 2;
        const playerRight = typeof player.hitRight === "number" ? player.hitRight : player.x + player.width / 2;
        const playerTop = typeof player.hitTop === "number" ? player.hitTop : player.y - player.height / 2;
        const playerBottom = typeof player.hitBottom === "number" ? player.hitBottom : player.y + player.height / 2;

        let itemHalfW = item.w / 2;
        let itemHalfH = item.h / 2;

        if (typeof item.w === "undefined") {
            itemHalfW = item.radius;
        }

        if (typeof item.h === "undefined") {
            itemHalfH = item.radius;
        }

        const itemLeft = item.x - itemHalfW;
        const itemRight = item.x + itemHalfW;
        const itemTop = item.y - itemHalfH;
        const itemBottom = item.y + itemHalfH;

        return (
            playerRight > itemLeft &&
            playerLeft < itemRight &&
            playerBottom > itemTop &&
            playerTop < itemBottom
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
        this.drawDoors();
        this.floor.drawFloor();
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

        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            const enemyLeft   = enemy.x - enemy.w / 2;
            const enemyRight  = enemy.x + enemy.w / 2;
            const enemyTop    = enemy.y - enemy.h / 2;
            const enemyBottom = enemy.y + enemy.h / 2;

            const isOverlapping = (
                player.hitRight > enemyLeft &&
                player.hitLeft  < enemyRight &&
                player.hitBottom > enemyTop &&
                player.hitTop   < enemyBottom
            );

            if (!isOverlapping) {
                continue;
            }

            if (this.isPlayerStompingEnemy(player, enemy)) {
                enemy.isDead = true;
                this.enemies.splice(i, 1);
                player.yVelocity = -Math.max(8, player.jumpStrength * 0.55);
                player.isOnGround = false;
                return;
            }

            if (!enemy.isDead) {
                player.takeDamage(enemy.damage);
                this.lastTrapDamageAt = now;
                return;
            }
        }
    }

    isPlayerStompingEnemy(player, enemy) {
        if (!enemy || !enemy.canBeStomped) {
            return false;
        }

        const enemyTop = enemy.y - enemy.h / 2;
        const stompGracePx = 14;
        const fallingOntoEnemy = player.yVelocity > 0;
        const nearTopSurface = player.hitBottom <= enemyTop + stompGracePx;

        return fallingOntoEnemy && nearTopSurface;
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
                //rect(35 + i * 40, 70, 24, 24, 5);
                image(shieldImage, 20 + i * 40, 60, 30, 30);
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

        if (typeof levelNum === "number") {
            textAlign(RIGHT, TOP);
            text(`Level ${levelNum}`, width - 20, 20);
        }
    }
}
