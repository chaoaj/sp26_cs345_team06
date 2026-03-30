let gameState = "title";

let platform;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  platform = new Platform(200, 400, 300, 20);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() { // change to wanted game state.
  if (gameState === "title") {
    drawTitleScreen();
  } else if (gameState === "playing") {
    background(220);
    platform.draw();
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
    handleTitleKeyPressed()
  }
}
