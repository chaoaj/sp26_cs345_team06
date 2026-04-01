let gameState = "title";

let platforms = [];
let players;
let player;

let level1Platforms = []
let level1Items = []
let level1Traps = []

function setup() {

  //TODO: make a table in a different class for
  // different levels (maybe, it is here because setup runs affter
  // preload, otherwise it was using image variables before they were loaded)
  level1Platforms = [
    new Platform(200, 400, 300, 40, brickPlatformImage),
    new Platform(500, 300, 200, 40, brickPlatformImage),
    new Platform(800, 500, 250, 40, brickPlatformImage),
    new Platform(1100, 350, 150, 40, brickPlatformImage),
    new Platform(1400, 450, 300, 40, brickPlatformImage)
  ]

  level1Items = [
    new Items(500, 250, "health")
  ]

  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);

  level1Traps = [
    new SpikeTrap(800, height - 75, 120, 40)
  ]

  setupLevel();
}

function setupLevel() {
  //platform = new Platform(width / 2, height * 0.72, 320, 20);
  level = new Level(level1Platforms, backgroundImage, brickFloorImage, level1Items, level1Traps);
  level.drawPlatforms();
  player = new Player(width * .2, height-100, 40, 60);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setupLevel();
  //TODO: LOGIC ERROR -> resizing makes player respawn
}

function draw() {
  if (gameState === "title") {
    drawTitleScreen();
  } else if (gameState === "playing") {
    level.drawLevel();
    player.update(level1Platforms);
    level.collectTouchedItems(player);
    player.draw();
    level.drawHUD(player);
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
    //handleTitleKeyPressed();
    //  why are there two?
  }
}
