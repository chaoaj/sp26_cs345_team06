// dev/classes/collisions/trapCollision.js
// Handles trap damage and pit collision for the player

function isPlayerTouchingPit(level, player) {
    if (!level.pits || level.pits.length === 0) {
        return false;
    }

    const playerLeft = typeof player.hitLeft === "number" ? player.hitLeft : player.x - player.width / 2;
    const playerRight = typeof player.hitRight === "number" ? player.hitRight : player.x + player.width / 2;
    const touchingFloorBand = player.y + player.height / 2 >= height - 1;

    if (!touchingFloorBand) {
        return false;
    }

    for (const pit of level.pits) {
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

function applyTrapDamage(level, player) {
    const now = typeof getGameMillis === "function" ? getGameMillis() : millis();
    if (now - level.lastTrapDamageAt < level.trapDamageCooldownMs) {
        return;
    }

    for (const trap of level.traps) {
        if (trap instanceof SpikeTrap) {
            if (level.isPlayerTouchingTrap(player, trap)) {
                player.takeDamage(trap.damage);
                level.lastTrapDamageAt = now;
                return;
            }
        } else if (trap instanceof LaserTrap) {
            if (!trap.isFiring()) {
                continue;
            }
            if (level.isPlayerTouchingTrap(player, trap)) {
                player.takeDamage(trap.damage);
                level.lastTrapDamageAt = now;
                return;
            }
        }
    }

    // After collision resolution the player sits flush against the platform edge
    // (zero overlap), so we expand the check by 2px to detect adjacency.
    for (const platform of level.platforms) {
        if (!platform.isHarmful) continue;
        const px = 2;
        if (
            player.hitRight  > platform.x - platform.w / 2 - px &&
            player.hitLeft   < platform.x + platform.w / 2 + px &&
            player.hitBottom > platform.y - platform.h / 2 - px &&
            player.hitTop    < platform.y + platform.h / 2 + px
        ) {
            player.takeDamage(platform.damage);
            level.lastTrapDamageAt = now;
            return;
        }
    }
}
