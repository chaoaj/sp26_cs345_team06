// dev/classes/collisions/itemCollision.js
// Checks if player is touching an item (AABB collision)

function isPlayerTouchingItem(player, item) {
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
