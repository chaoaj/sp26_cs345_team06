let gameState = "title";

const WORLD_WIDTH = 1800;
const WORLD_HEIGHT_MULTIPLIER = 1;

let platforms = [];
let players;
let player;
let camera;

let levelNum = 1
let levels = []
let levelTemplates = []

let level1Platforms = []
let level1Items = []
let level1Traps = []
let level1Boxes = []
let level1Buttons = []
let level1Enemies = []
let level1Doors = []
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

  level2Boxes = [

  ]

  level1Doors = []

  level1Buttons = [
    new Button(1100, height - 35, 80, 20, () => console.log("button pressed"))
  ]

  level1Enemies = [
    new Hostile(970, height - 335, 40, 40, 1.5, 900, 1040)
  ]
  level1Template = [level1Platforms, level1Items, level1Traps, level1Boxes, level1Buttons, level1Enemies, level1Doors]
  levelTemplates.push(level1Template);
  level2Template = [level1Platforms, level1Items, level1Traps, level2Boxes, level1Buttons, level1Enemies, level1Doors]
  levelTemplates.push(level2Template);
  setupLevel();

}

function setupLevel() {
  //level = new Level(level1Platforms, backgroundImage, brickFloorImage, level1Items, level1Traps, WORLD_WIDTH, level1Boxes, level1Buttons, level1Enemies, level1Doors);
  level1 = new Level(levelTemplates[0][0], backgroundImage, brickFloorImage, levelTemplates[0][1], levelTemplates[0][2], WORLD_WIDTH, levelTemplates[0][3], levelTemplates[0][4], levelTemplates[0][5], levelTemplates[0][6]);
  level2 = new Level(levelTemplates[1][0], backgroundImage, brickFloorImage, levelTemplates[1][1], levelTemplates[1][2], WORLD_WIDTH, levelTemplates[1][3], levelTemplates[1][4], levelTemplates[1][5], levelTemplates[1][6]);
  levels.push(level1, level2);
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

function updateLevelMusic() {
  const isPlayableState =
    gameState === "playing" ||
    gameState === "paused" ||
    gameState === "abilityUnlock";

  if (!isPlayableState) {
    return;
  }

  const isFinalLevel = levelNum === levels.length;
  if (!isFinalLevel) {
    if (typeof soliloquyMusic !== "undefined" && soliloquyMusic.isPlaying()) {
      soliloquyMusic.stop();
    }
    return;
  }

  if (typeof backgroundMusic !== "undefined" && backgroundMusic.isPlaying()) {
    backgroundMusic.stop();
  }

  if (typeof soliloquyMusic !== "undefined") {
    soliloquyMusic.setLoop(true);
    if (!soliloquyMusic.isPlaying()) {
      soliloquyMusic.play();
    }
  }
}

function draw() {
  level = levels[levelNum - 1];
  updateLevelMusic();
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

  const formatAbilityName = (abilityName) => {
    if (!abilityName) {
      return "Unknown Ability";
    }

    return abilityName
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (letter) => letter.toUpperCase());
  };

  const unlockedAbilities = typeof Ability !== "undefined"
    ? Ability.getUnlockedAbilities(player)
    : [];
  const abilityLabels = unlockedAbilities.length > 0
    ? unlockedAbilities.map((ability) => formatAbilityName(ability.name))
    : ["None yet"];
  const abilityLineHeight = 28;
  const basePanelH = 320;
  const panelH = min(height - 20, basePanelH + max(0, abilityLabels.length - 1) * abilityLineHeight);
  const panelW = min(520, width - 60);
  const panelX = width / 2;
  const panelY = height / 2;
  const panelTop = panelY - panelH / 2;
  const titleY = panelTop + 58;
  const subtitleY = titleY + 52;
  const hintY = subtitleY + 42;
  const abilityHeaderY = hintY + 48;
  const firstAbilityY = abilityHeaderY + 34;

  rectMode(CENTER);
  fill(26, 31, 46);
  rect(panelX, panelY, panelW, panelH, 18);

  stroke(255, 255, 255, 40);
  strokeWeight(2);
  noFill();
  rect(panelX, panelY, panelW - 12, panelH - 12, 14);

  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(50);
  text("Paused", panelX, titleY);

  fill(210, 218, 235);
  textSize(22);
  text("Game is frozen while paused.", panelX, subtitleY);

  fill(255);
  textSize(18);
  text("Press P or Esc to resume", panelX, hintY);

  fill(170, 182, 205);
  textSize(15);
  text("Unlocked Abilities", panelX, abilityHeaderY);

  fill(255);
  textSize(17);
  for (let i = 0; i < abilityLabels.length; i++) {
    text(abilityLabels[i], panelX, firstAbilityY + i * abilityLineHeight, panelW - 48);
  }
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
  //TEMPORARY
  if (key=='l') {
    levelNum = 2
  }
  //TEMPORARY
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
