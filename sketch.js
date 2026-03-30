let gameState = "title";

let platform;
let player;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  setupLevel();
}

function setupLevel() {
  platform = new Platform(width / 2, height * 0.72, 320, 20);
  player = new Player(width / 2, platform.y - platform.h / 2 - 30, 40, 60);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setupLevel();
}

function draw() { // change to wanted game state.
  if (gameState === "title") {
    drawTitleScreen();
  } else if (gameState === "playing") {
    background(220);
    player.update([platform]);
    platform.draw();
    player.draw();
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
    handleTitleKeyPressed();
  }
}
