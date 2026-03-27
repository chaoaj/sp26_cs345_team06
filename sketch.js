let gameState = "title";

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() { // change to wanted game state.
  if (gameState === "title") {
    drawTitleScreen();
  } else {
    return;
  }
}

function drawGamePrototype() {
  background(220);
  fill(20);
  noStroke();
  textSize(24);
  text("Game Prototype Running", width / 2, height / 2);
}

function keyPressed() {
  if (gameState === "title") {
    gameState = handleTitleKeyPressed();
  }
}
