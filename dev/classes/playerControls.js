var jumpDebounce = false
const gravity = 0.5
let yVelocity = 0;

function keyListener() {
    setupPlayfield()
    if (keyIsDown(65)) {
        playerX -= 5;
    }
    if (keyIsDown(68)) {
        playerX += 5;
    }
    if (keyIsDown(32) && !jumpDebounce) {
        yVelocity = -10;
        jumpDebounce = true
    }
    yVelocity += gravity;
    playerY += yVelocity;
}