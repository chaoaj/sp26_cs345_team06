let gameState = "title";

const WORLD_WIDTH = 1800;
const WORLD_HEIGHT_MULTIPLIER = 1;

let platforms = [];
let players;
let player;
let camera;

let level1Platforms = []
let level1Items = []
let level1Traps = []
let level1Boxes = []
let level1Buttons = []
let pauseStartedAt = null;
let accumulatedPauseMs = 0;

function getGameMillis() {
  if (gameState === "paused" && pauseStartedAt !== null) {
    return pauseStartedAt - accumulatedPauseMs;
  }
  return millis() - accumulatedPauseMs;
}

function setup() {

  //TODO: make a table in a different class for
  // different levels (maybe, it is here because setup runs affter
  // preload, otherwise it was using image variables before they were loaded)
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);

  level1Platforms = [
    new Platform(250,  height - 130, 220, 30, brickPlatformImage),
    new Platform(490,  height - 220, 220, 30, brickPlatformImage),
    new Platform(730,  height - 310, 220, 30, brickPlatformImage),
    new Platform(970,  height - 220, 220, 30, brickPlatformImage),
    new Platform(1210, height - 130, 220, 30, brickPlatformImage)
  ]

  level1Items = [
    new Items(730, height - 360, "health")
  ]

  level1Traps = [
    new SpikeTrap(730, height - 75, 120, 40),
    new LaserTrap(610, height - 240, 160, 14)
  ]

  level1Boxes = [
    new Box(490, height - 290, 50),
    new Box(730, height - 390, 50)
  ]

  level1Buttons = [
    new Button(1100, height - 35, 80, 20, () => console.log("button pressed"))
  ]

  setupLevel();
}

function setupLevel() {
  level = new Level(level1Platforms, backgroundImage, brickFloorImage, level1Items, level1Traps, WORLD_WIDTH, level1Boxes, level1Buttons);
  player = new Player(width * .2, height - 100, 40, 60);
  camera = new Camera(WORLD_WIDTH, height * WORLD_HEIGHT_MULTIPLIER);
  pauseStartedAt = null;
  accumulatedPauseMs = 0;
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
    player.update(level1Platforms);
    level.applyTrapDamage(player);
    level.updatePuzzleElements(player);
    camera.follow(player);
    camera.constrainPlayer(player);

    level.drawBackground();

    camera.apply();
    level.drawWorld();
    player.draw();
    camera.reset();

    level.drawHUD(player);
    level.collectTouchedItems(player);
  } else if (gameState === "paused") {
    // Render current world without simulation updates while paused.
    level.drawBackground();
    camera.apply();
    level.drawWorld();
    player.draw();
    camera.reset();
    level.drawHUD(player);
    drawPauseOverlay();
  }
}

function drawPauseOverlay() {
  push();
  noStroke();
  fill(0, 0, 0, 140);
  rectMode(CORNER);
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(56);
  text("Paused", width / 2, height / 2 - 30);
  textSize(22);
  text("Press P or Esc to resume", width / 2, height / 2 + 24);
  pop();
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
    return;
  }

  if (key === "p" || key === "P" || keyCode === ESCAPE) {
    if (gameState === "playing") {
      pauseStartedAt = millis();
      gameState = "paused";
    } else if (gameState === "paused") {
      if (pauseStartedAt !== null) {
        accumulatedPauseMs += millis() - pauseStartedAt;
      }
      pauseStartedAt = null;
      gameState = "playing";
    }
  }
}
