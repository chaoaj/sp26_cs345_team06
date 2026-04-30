// Assumes collisions.js is loaded as a script and exposes functions globally
// Level class manages all state and logic for a single game level.
class Level {
    constructor(platforms, backgroundimage, floorImage, items = [], traps = [], worldWidth = null, boxes = [], buttons = [], enemies = [], doors = [], pits = [], terrain = [], pipePuzzles = [], laserPuzzles = {}) {
        // Defensive: ensure all arrays are valid even if null is passed
        platforms = platforms || [];
        items = items || [];
        traps = traps || [];
        boxes = boxes || [];
        buttons = buttons || [];
        enemies = enemies || [];
        doors = doors || [];
        pits = pits || [];
        terrain = terrain || [];
        laserPuzzles = laserPuzzles || {};
        this.worldWidth = worldWidth || width;
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
        this.lasers = [...(laserPuzzles.lasers || [])];
        this.laserCollectors = [...(laserPuzzles.collectors || [])];
        this.laserMirrors = [...(laserPuzzles.mirrors || [])];
        this.pipePuzzles = [...(pipePuzzles || [])];

        this.abilityToImageMap = [
            { ability: "doubleJump", image: doublejumpui },
            { ability: "dash", image: dashui },
            { ability: "highJump", image: featherImage },
            { ability: "speed", image: speedImage }
        ];

        this.trapDamageCooldownMs = 400;
        this.lastTrapDamageAt = -Infinity;

        this.floor = new Floor(0, height + 25, this.worldWidth, floorImage, this.pits);
        this.floorPlatforms = this.floor.drawFloor();
        this.platforms.push(...this.floorPlatforms);
        this.terrainPlatforms = [];
        for (const terrain of this.terrain) {
            this.terrainPlatforms.push(terrain.drawTerrain());
        }
        this.platforms.push(...this.terrainPlatforms);

        this.initialItemStates = this.items.map((item) => ({
            x: item.x,
            y: item.y,
            isCollected: item.isCollected,
            collectedUntil: item.collectedUntil,
        }));

        this.initialDoorStates = this.doors.map((door) => ({
            isVisible: door.isVisible,
        }));

        this.initialBoxStates = this.boxes.map((box) => ({
            x: box.x,
            y: box.y,
            xVelocity: box.xVelocity,
            yVelocity: box.yVelocity,
            isOnGround: box.isOnGround,
        }));

        this.initialLaserMirrorStates = this.laserMirrors.map((mirror) => ({
            x: mirror.x,
            y: mirror.y,
            xVelocity: mirror.xVelocity,
            yVelocity: mirror.yVelocity,
            isOnGround: mirror.isOnGround,
        }));



        this.initialEnemyStates = this.enemies.map((enemy) => ({
            type: enemy.constructor.name,
            x: enemy.x,
            y: enemy.y,
            w: enemy.w,
            h: enemy.h,
            speed: enemy.speed,
            leftBound: enemy.leftBound,
            rightBound: enemy.rightBound,
            damage: enemy.damage,
            detectionRange: enemy.detectionRange,
            dashRange: enemy.dashRange,
            jumpHeight: enemy.maxJumpHeight,
            jumpCooldownMs: enemy.jumpCooldownMs,
            jumpSpeed: enemy.jumpStrength,
            shootCooldownMs: enemy.shootCooldownMs,
            projectileSpeed: enemy.projectileSpeed,
            projectileDamage: enemy.projectileDamage,
        }));
    }

    getSpawnPoint() {
        return {
            x: width * 0.12,
            y: height - 160,
        };
    }

    drawPlatforms() {
        for (let platform of this.platforms) {
            platform.draw();
        }
    }

    updateMovingPlatforms(player = null) {
        for (const platform of this.platforms) {
            if (platform instanceof MovingPlatform) {
                platform.update();
            } else if (platform instanceof DisappearingPlatform) {
                platform.update(player);
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
            door.drawDoor();
        }
    }

    updateEnemies() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update();
            if (enemy.pendingRemoval) {
                this.enemies.splice(i, 1);
            }
        }
    }

    // ...existing code...

    applyPitfall(player) {
        // Use the global isPlayerTouchingPit for pitfall logic (from trapCollision.js)
        if (typeof isPlayerTouchingPit === 'function' ? isPlayerTouchingPit(this, player) : false) {
            deathSound.play();
            player.respawn();
        }
    // (No longer needed: isPlayerTouchingPitCustom)
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

            const touched = isPlayerTouchingItem(player, item);
            if (touched) {
                item.applyEffect(player);
            }
        }
    }

    // ...existing code...

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
        for (const mirror of this.laserMirrors) mirror.draw();
        for (const collector of this.laserCollectors) collector.draw();
        for (const laser of this.lasers) laser.draw();
        for (const pipePuzzle of this.pipePuzzles) {
            if (isPipePuzzleSolved(this.pipePuzzles)) {
                print("true");
            }
            pipePuzzle.update(player);  
            pipePuzzle.drawPipe();
        }
    }

    updatePuzzleElements(player) {
        const dynamicObjects = [...this.boxes, ...this.laserMirrors];

        resolvePlayerDynamicCollisions(player, dynamicObjects);

        for (const box of this.boxes) {
            box.update(this.platforms);
            // Box pitfall respawn logic (Level 2)
            if (this.pits && this.pits.length > 0) {
                const boxLeft = box.x - box.w / 2;
                const boxRight = box.x + box.w / 2;
                const boxBottom = box.y + box.h / 2;
                const floorY = this.floor ? this.floor.y : height;
                const touchingFloorBand = boxBottom >= floorY - 1;
                if (touchingFloorBand) {
                    for (const pit of this.pits) {
                        const startTile = pit[0];
                        const tileSpan = pit[1] + 1;
                        const pitLeft = startTile * 32 - 16;
                        const pitRight = pitLeft + tileSpan * 32;
                        if (boxRight > pitLeft && boxLeft < pitRight) {
                            // Respawn box at its initial position
                            const idx = this.boxes.indexOf(box);
                            if (this.initialBoxStates && this.initialBoxStates[idx]) {
                                const initial = this.initialBoxStates[idx];
                                box.x = initial.x;
                                box.y = initial.y;
                                box.xVelocity = 0;
                                box.yVelocity = 0;
                                box.isOnGround = false;
                            }
                            break;
                        }
                    }
                }
            }
        }

        for (const mirror of this.laserMirrors) {
            mirror.update(this.platforms);
        }

        for (let i = 0; i < dynamicObjects.length; i++) {
            for (let j = i + 1; j < dynamicObjects.length; j++) {
                resolveDynamicObjectCollision(dynamicObjects[i], dynamicObjects[j]);
            }
        }

        const entities = [player, ...this.boxes];
        for (const button of this.buttons) {
            button.checkPressed(entities);
        }

        const laserBlockers = [...this.platforms, ...this.boxes];
        for (const laser of this.lasers) {
            laser.update(this.laserMirrors, this.laserCollectors, laserBlockers);
        }
    }

    // ...existing code...

    // ...existing code...

    isPlayerStompingEnemy(player, enemy) {
        if (!enemy || !enemy.canBeStomped) {
            return false;
        }

        const enemyTop = enemy.y - enemy.height / 2;
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
        let abilities = []
        if (Ability.has(player, "doubleJump")) {
            abilities.push("doubleJump");
        }
        if (Ability.has(player, "dash")) {
            abilities.push("dash");
        }
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
                image(shieldImage, 20 + i * 40, 60, 30, 30);
            }
            fill(255);
        }

        let timedAbilities = [];

        if (player.highJumpExpiresAt > 0) {
            const highJumpTimeLeftMs = player.getHighJumpTimeLeftMs();
            const highJumpTimeLeftSeconds = ceil(highJumpTimeLeftMs / 1000);
            timedAbilities.push({ ability: "highJump", timeLeft: highJumpTimeLeftSeconds })

        }

        if (player.speedPotionExpiresAt > 0) {
            const speedPotionTimeLeftMs = player.getSpeedPotionTimeLeftMs();
            const speedPotionTimeLeftSeconds = ceil(speedPotionTimeLeftMs / 1000);
            timedAbilities.push({ ability: "speed", timeLeft: speedPotionTimeLeftSeconds })
        }

        for (let i = 0; i < abilities.length; i++) {
            const ability = abilities[i];
            const imageToDisplay = this.abilityToImageMap.find((mapping) => mapping.ability === ability);
            if (imageToDisplay) {
                image(imageToDisplay.image, 20 + i * 50, 170, 50, 50);
            }
        }

        for (let i = 0; i < timedAbilities.length; i++) {
            const ability = timedAbilities[i];
            const imageToDisplay = this.abilityToImageMap.find((mapping) => mapping.ability === ability.ability);
            if (imageToDisplay) {
                image(imageToDisplay.image, 20 + i * 50, 120, 50, 50);
                stroke(0,0,0)
                strokeWeight(3)
                text(`${ability.timeLeft}s`, 32 + i * 50, 132)
                noStroke()

            }
        }

        if (typeof levelNum === "number") {
            textAlign(RIGHT, TOP);
            text(`Level ${levelNum}`, width - 20, 20);
        }

        if (typeof getRunElapsedMs === "function" && typeof formatElapsedTime === "function") {
            textAlign(RIGHT, TOP);
            text(`Time ${formatElapsedTime(getRunElapsedMs())}`, width - 20, 52);
        }
    }
}
