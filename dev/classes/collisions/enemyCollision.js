// dev/classes/collisions/enemyCollision.js
// Handles enemy and projectile collision with the player

function applyEnemyDamage(level, player) {
    const now = typeof getGameMillis === "function" ? getGameMillis() : millis();
    if (now - level.lastTrapDamageAt < level.trapDamageCooldownMs) {
        return;
    }

    for (let i = level.enemies.length - 1; i >= 0; i--) {
        const enemy = level.enemies[i];

        if (enemy.projectiles && enemy.projectiles.length > 0) {
            for (let j = enemy.projectiles.length - 1; j >= 0; j--) {
                const projectile = enemy.projectiles[j];
                const projectileLeft = projectile.x - projectile.radius;
                const projectileRight = projectile.x + projectile.radius;
                const projectileTop = projectile.y - projectile.radius;
                const projectileBottom = projectile.y + projectile.radius;

                const hitByProjectile = (
                    player.hitRight > projectileLeft &&
                    player.hitLeft < projectileRight &&
                    player.hitBottom > projectileTop &&
                    player.hitTop < projectileBottom
                );

                if (!hitByProjectile) {
                    continue;
                }

                player.takeDamage(projectile.damage);
                enemy.projectiles.splice(j, 1);
                level.lastTrapDamageAt = now;
                return;
            }
        }

        const enemyLeft   = enemy.x - enemy.width / 2;
        const enemyRight  = enemy.x + enemy.width / 2;
        const enemyTop    = enemy.y - enemy.height / 2;
        const enemyBottom = enemy.y + enemy.height / 2;

        const isOverlapping = (
            player.hitRight > enemyLeft &&
            player.hitLeft  < enemyRight &&
            player.hitBottom > enemyTop &&
            player.hitTop   < enemyBottom
        );

        if (!isOverlapping) {
            continue;
        }

        if (level.isPlayerStompingEnemy(player, enemy)) {
            if (typeof enemy.startDeathAnimation === "function") {
                enemy.startDeathAnimation();
            } else {
                enemy.isDead = true;
                level.enemies.splice(i, 1);
            }
            player.yVelocity = -Math.max(8, player.jumpStrength * 0.55);
            player.isOnGround = false;
            if (typeof tryApplyStompHeal === "function") {
                tryApplyStompHeal(player);
            }
            return;
        }

        if (!enemy.isDead) {
            player.takeDamage(enemy.damage);
            level.lastTrapDamageAt = now;
            return;
        }
    }
}
