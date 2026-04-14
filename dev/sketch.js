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
let level1Enemies = []
let pauseStartedAt = null;
let accumulatedPauseMs = 0;
let abilityUnlockPopup = null;

function getGameMillis() {
  if ((gameState === "paused" || gameState === "abilityUnlock") && pauseStartedAt !== null) {
    return pauseStartedAt - accumulatedPauseMs;
  }
  return millis() - accumulatedPauseMs;
}

function showAbilityUnlock(ability) {
  if (!ability || !ability.name || gameState !== "playing") {
    return;
  }

  abilityUnlockPopup = {
    name: ability.name,
    description: ability.description || "New ability unlocked.",
  };

  pauseStartedAt = millis();
  gameState = "abilityUnlock";
}

function closeAbilityUnlockPopup() {
  if (!abilityUnlockPopup || gameState !== "abilityUnlock") {
    return;
  }

  if (pauseStartedAt !== null) {
    accumulatedPauseMs += millis() - pauseStartedAt;
  }

  pauseStartedAt = null;
  abilityUnlockPopup = null;
  gameState = "playing";
}

function setup() {
  noSmooth()
  //TODO: make a table in a different class for
  // different levels (maybe, it is here because setup runs affter
  // preload, otherwise it was using image variables before they were loaded)
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  level1Platforms = [
    new Platform(250,  height - 170, 220, 30, brickPlatformImage),
    new Platform(490,  height - 300, 220, 30, brickPlatformImage),
    new Platform(730,  height - 430, 220, 30, brickPlatformImage),
    new Platform(970,  height - 300, 220, 30, brickPlatformImage),
    new Platform(1210, height - 170, 220, 30, brickPlatformImage),
    new MovingPlatform(1450, height - 300, 200, 30, brickPlatformImage, "y", 180, 1.5),
    new MovingPlatform(1650, height - 170, 200, 30, brickPlatformImage, "x", 200, 2)
  ]

  level1Items = [
    new Items(730, height - 460, "health"),
    new Items(970, height - 35, "feather"),
    new Items(490, height - 390, "shield"),
    new Items(1210, height - 200, "potion"),
    new Items(250, height - 220, "doubleJumpAbility"),
    new Items(1210, height - 220, "dashAbility")
  ]

  level1Traps = [
    new SpikeTrap(730, height - 45, 120, 40),
    new LaserTrap(610, height - 325, 160, 14)
  ]

  level1Boxes = [
    new Box(490, height - 360, 50),
    new Box(700, height - 490, 50)
  ]

  level1Buttons = [
    new Button(1100, height - 35, 80, 20, () => console.log("button pressed"))
  ]

  level1Enemies = [
    new Hostile(970, height - 335, 40, 40, 1.5, 900, 1040)
  ]

  setupLevel();

}

function setupLevel() {
  level = new Level(level1Platforms, backgroundImage, brickFloorImage, level1Items, level1Traps, WORLD_WIDTH, level1Boxes, level1Buttons, level1Enemies);
  player = new Player(width * .2, height - 100, 80, 120);
  camera = new Camera(WORLD_WIDTH, height * WORLD_HEIGHT_MULTIPLIER);
  abilityUnlockPopup = null;
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
    level.updateMovingPlatforms();
    player.update(level1Platforms);
    level.applyTrapDamage(player);
    level.applyEnemyDamage(player);
    level.updateEnemies();
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
  } else if (gameState === "abilityUnlock") {
    level.drawBackground();
    camera.apply();
    level.drawWorld();
    player.draw();
    camera.reset();
    level.drawHUD(player);
    drawAbilityUnlockOverlay();
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

function drawAbilityUnlockOverlay() {
  if (!abilityUnlockPopup) {
    return;
  }

  push();
  noStroke();
  fill(0, 0, 0, 165);
  rectMode(CORNER);
  rect(0, 0, width, height);

  const panelW = min(560, width - 60);
  const panelH = 220;
  const panelX = width / 2;
  const panelY = height / 2;

  rectMode(CENTER);
  fill(24, 28, 42);
  rect(panelX, panelY, panelW, panelH, 18);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(34);
  text("Ability Unlocked", panelX, panelY - 65);

  textSize(28);
  text(abilityUnlockPopup.name, panelX, panelY - 20);

  textSize(20);
  text(abilityUnlockPopup.description, panelX, panelY + 24);

  textSize(16);
  text("Press any key to continue", panelX, panelY + 78);
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

  if (gameState === "abilityUnlock") {
    closeAbilityUnlockPopup();
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
