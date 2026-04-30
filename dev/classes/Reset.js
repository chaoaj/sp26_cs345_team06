// dev/classes/Reset.js
// Add your reset logic here


// Moves Level.prototype.resetDynamicState logic here
function resetDynamicStateForLevel(level) {
    // Reset doors
    for (let i = 0; i < level.doors.length; i++) {
        if (level.initialDoorStates[i]) {
            level.doors[i].isVisible = level.initialDoorStates[i].isVisible;
        }
    }

    // Reset all buttons to unpressed state
    for (const button of level.buttons) {
        button.isPressed = false;
        if (typeof button.permaPressed !== 'undefined') {
            button.permaPressed = false;
        }
    }
    // Reset items
    for (let i = 0; i < level.items.length; i++) {
        const item = level.items[i];
        const initial = level.initialItemStates[i];
        if (!item || !initial) continue;
        item.x = initial.x;
        item.y = initial.y;
        item.isCollected = false;
        item.collectedUntil = 0;
    }

    // Reset boxes
    for (let i = 0; i < level.boxes.length; i++) {
        const box = level.boxes[i];
        const initial = level.initialBoxStates[i];
        if (!box || !initial) continue;
        box.x = initial.x;
        box.y = initial.y;
        box.xVelocity = 0;
        box.yVelocity = 0;
        box.isOnGround = false;
    }

    // Reset laser mirrors
    for (let i = 0; i < level.laserMirrors.length; i++) {
        const mirror = level.laserMirrors[i];
        const initial = level.initialLaserMirrorStates[i];
        if (!mirror || !initial) continue;
        mirror.x = initial.x;
        mirror.y = initial.y;
        mirror.xVelocity = 0;
        mirror.yVelocity = 0;
        mirror.isOnGround = false;
    }

    // Reset laser collectors
    for (const collector of level.laserCollectors) {
        collector.isHit = false;
        collector._hitThisFrame = false;
    }

    // Reset lasers
    for (const laser of level.lasers) {
        laser.segments = [];
    }

    // Remove dynamically spawned enemies (those not in initialEnemyStates)
    if (Array.isArray(level.initialEnemyStates) && level.initialEnemyStates.length > 0) {
        level.enemies = [];
        for (let i = 0; i < level.initialEnemyStates.length; i++) {
            const initial = level.initialEnemyStates[i];
            let newEnemy;
            if (initial.type === "FlyingHostile") {
                newEnemy = new FlyingHostile(
                    initial.x, initial.y,
                    initial.w, initial.h,
                    initial.speed, initial.leftBound, initial.rightBound,
                    initial.damage, initial.detectionRange, initial.dashRange
                );
            } else if (initial.type === "JumpingHostile") {
                newEnemy = new JumpingHostile(
                    initial.x, initial.y,
                    initial.w, initial.h,
                    initial.speed, initial.leftBound, initial.rightBound,
                    initial.damage, initial.jumpHeight, initial.jumpInterval, initial.jumpDuration
                );
            } else if (initial.type === "Hostile") {
                newEnemy = new Hostile(
                    initial.x, initial.y,
                    initial.w, initial.h,
                    initial.speed, initial.leftBound, initial.rightBound,
                    initial.damage
                );
            } else if (initial.type === "RangedHostile") {
                newEnemy = new RangedHostile(
                    initial.x, initial.y,
                    initial.w, initial.h,
                    initial.speed, initial.leftBound, initial.rightBound,
                    initial.damage, initial.range, initial.cooldown
                );
            } else {
                // fallback: do nothing
                continue;
            }
            newEnemy.isDead = false;
            newEnemy.pendingRemoval = false;
            if (newEnemy.constructor && newEnemy.constructor.name === "FlyingHostile") {
                newEnemy.state = "idle";
            }
            level.enemies.push(newEnemy);
        }
    }

    // Reset platforms
    for (const platform of level.platforms) {
        if (platform && typeof platform.reset === "function") {
            platform.reset();
        }
    }
}
