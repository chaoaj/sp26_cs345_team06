let gameState = "title";

let platforms;
let player;

level1Platforms = [
  new Platform(200, 400, 300, 20),
  new Platform(500, 300, 200, 20),
  new Platform(800, 500, 250, 20),
  new Platform(1100, 350, 150, 20),
  new Platform(1400, 450, 300, 20)
]

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  setupLevel();
}

function setupLevel() {
  //platform = new Platform(width / 2, height * 0.72, 320, 20);
  level = new Level(level1Platforms, backgroundImage);
  level.drawPlatforms();
  player = new Player(width * .2, height-100, 40, 60);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setupLevel();
}

function draw() { // change to wanted game state.
  if (gameState === "title") {
    drawTitleScreen();
  } else if (gameState === "playing") {
    level.drawLevel();
    player.update(level1Platforms);
    player.draw();
  }
}

function drawGamePrototype() {
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
