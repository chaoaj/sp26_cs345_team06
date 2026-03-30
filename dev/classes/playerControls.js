var jumpDebounce = false
const gravity = 0.5
let yVelocity = 0;

function jumpDebounceTimeout() {
    //TODO: TEST THIS
    //TODO: LANDED CHECK
    //TODO: FIGURE OUT HOW TO DETECT LANDING
    setTimeout(() => {
        jumpDebounce = false;
        print("db reset")
    }, 500);
}

function keyListener() {
    if (keyIsDown(65)) {
        //  A
        playerX -= 5;
    }
    if (keyIsDown(68)) {
        //  D
        playerX += 5;
    }
    if ((keyIsDown(32) || keyIsDown(87)) && !jumpDebounce) {
        //  W or Space
        yVelocity = -10;
        jumpDebounce = true
        jumpDebounceTimeout();
    }

    yVelocity += gravity;
    playerY += yVelocity;
}