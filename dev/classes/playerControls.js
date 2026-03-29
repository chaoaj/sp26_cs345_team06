var jumpDebounce = false
const gravity = 0.5
let yVelocity = 0;

function jumpDebounceTimeout() {
    setTimeout(() => {
        jumpDebounce = false;
        print("db reset")
    }, 500);
}

function keyListener() {
    if (keyIsDown(65)) {
        playerX -= 5;
    }
    if (keyIsDown(68)) {
        playerX += 5;
    }
    if (keyIsDown(32) && !jumpDebounce) {
        yVelocity = -10;
        jumpDebounce = true
        jumpDebounceTimeout();
    }

    yVelocity += gravity;
    playerY += yVelocity;
}