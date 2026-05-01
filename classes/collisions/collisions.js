// dev/classes/collisions/collisions.js
// Handles dynamic collision resolution for player and objects

function resolvePlayerDynamicCollisions(player, dynamicObjects) {
    for (const object of dynamicObjects) {
        if (object && object.isVisible === false) continue;
        const objectLeft = object.x - object.w / 2;
        const objectRight = object.x + object.w / 2;
        const objectTop = object.y - object.h / 2;
        const objectBottom = object.y + object.h / 2;

        if (player.hitRight <= objectLeft || player.hitLeft >= objectRight ||
            player.hitBottom <= objectTop || player.hitTop >= objectBottom) {
            continue;
        }

        const overlapLeft = player.hitRight - objectLeft;
        const overlapRight = objectRight - player.hitLeft;
        const overlapTop = player.hitBottom - objectTop;
        const overlapBottom = objectBottom - player.hitTop;
        const minX = Math.min(overlapLeft, overlapRight);
        const minY = Math.min(overlapTop, overlapBottom);

        if (minY <= minX) {
            if (overlapTop <= overlapBottom) {
                player.y -= overlapTop;
                player.yVelocity = 0;
                player.isOnGround = true;
                player.onPlatform = object;
            } else {
                player.y += overlapBottom;
            }
        } else {
            if (overlapLeft <= overlapRight) {
                player.x -= overlapLeft;
                object.xVelocity = 4;
            } else {
                player.x += overlapRight;
                object.xVelocity = -4;
            }
        }
    }
}

function resolveDynamicObjectCollision(first, second) {
    const firstLeft = first.x - first.w / 2;
    const firstRight = first.x + first.w / 2;
    const firstTop = first.y - first.h / 2;
    const firstBottom = first.y + first.h / 2;
    const secondLeft = second.x - second.w / 2;
    const secondRight = second.x + second.w / 2;
    const secondTop = second.y - second.h / 2;
    const secondBottom = second.y + second.h / 2;

    if (firstRight <= secondLeft || firstLeft >= secondRight || firstBottom <= secondTop || firstTop >= secondBottom) {
        return;
    }

    const overlapLeft = firstRight - secondLeft;
    const overlapRight = secondRight - firstLeft;
    const overlapTop = firstBottom - secondTop;
    const overlapBottom = secondBottom - firstTop;
    const minX = Math.min(overlapLeft, overlapRight);
    const minY = Math.min(overlapTop, overlapBottom);

    if (minY <= minX) {
        if (overlapTop <= overlapBottom) {
            first.y -= overlapTop;
            first.yVelocity = 0;
            first.isOnGround = true;
        } else {
            second.y -= overlapBottom;
            second.yVelocity = 0;
            second.isOnGround = true;
        }
    } else {
        if (overlapLeft <= overlapRight) {
            first.x -= overlapLeft / 2;
            second.x += overlapLeft / 2;
        } else {
            first.x += overlapRight / 2;
            second.x -= overlapRight / 2;
        }
    }
}
