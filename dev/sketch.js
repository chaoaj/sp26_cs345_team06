let gameState = "title";

const WORLD_WIDTH = 3000;
const WORLD_HEIGHT_MULTIPLIER = 1;
const LEVEL_WORLD_WIDTHS = [1800, 2600, 3300];

let platforms = [];
let players;
let player;
let camera;
let endGameLevel;

let levelNum = 1
let levels = []
let levelTemplates = []

let level1Platforms = []
let level2Platforms = []
let level1Items = []
let level1Traps = []
let level1Boxes = []
let level2Boxes = []
let level1Buttons = []
let level1Enemies = []
let level1Doors = []
let level1Pits = []
let level2Pits = []
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
  // different levels (maybe, it is here because setup runs after
  // preload, otherwise it was using image variables before they were loaded)
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  level1Platforms = [
    new Platform(250,  height - 170, 220, 30, brickPlatformImage),
    new Platform(490,  height - 260, 220, 30, brickPlatformImage),
    new Platform(730,  height - 350, 220, 30, brickPlatformImage),
    new Platform(970,  height - 260, 220, 30, brickPlatformImage),
    new Platform(1210, height - 170, 220, 30, brickPlatformImage),
    new MovingPlatform(1450, height - 300, 200, 30, brickPlatformImage, "y", 180, 1.5),
    new MovingPlatform(1650, height - 170, 200, 30, brickPlatformImage, "x", 700, 2),
    new Platform(2000, height - 300, 220, 30, brickPlatformImage),
    new Platform(2450, height - 350, 220, 30, brickPlatformImage),
    new Platform(2600, height - 170, 220, 30, brickPlatformImage),
    new Platform(2800, height - 300, 220, 30, brickPlatformImage)
  ]

  level1Items = [
    new Items(730, height - 420, "health"),
    new Items(970, height - 280, "feather"),
    new Items(490, height - 330, "shield"),
    new Items(1210, height - 200, "potion"),
    new Items(250, height - 220, "doubleJumpAbility"),
    new Items(1210, height - 220, "dashAbility")
  ]

  level1Traps = [
    new SpikeTrap(730, height - 45, 120, 40),
    new LaserTrap(610, height - 285, 160, 14),
    new SpikeTrap(1900, height - 45, 120, 30)
  ]

  level1Boxes = [
    new Box(490, height - 360, 50),
    new Box(700, height - 490, 50)
  ]

  level2Boxes = [

  ]

  level1Doors = [
    new Door(2800, height - 365, 75, 100)
  ]

  level1Buttons = [
    new Button(1100, height - 35, 80, 20, () => console.log("button pressed"))
  ]

  level1Enemies = [
    new Hostile(970, height - 295, 40, 40, 1.5, 900, 1040),
    new FlyingHostile(520, height - 320, 44, 44, 2.2, 420, 620, 1, 360, 130)
  ]
  level1Template = [level1Platforms, level1Items, level1Traps, level1Boxes, level1Buttons, level1Enemies, level1Doors, level1Pits]
  levelTemplates.push(level1Template);
  level2Template = getLevel2Template();
  levelTemplates.push(level2Template);
  level3Template = getLevel3Template();
  if (level3Template.length < 8) {
    level3Template.push([]);
  }
  levelTemplates.push(level3Template);
  setupLevel();

}

function setupLevel() {
  //level = new Level(level1Platforms, backgroundImage, brickFloorImage, level1Items, level1Traps, WORLD_WIDTH, level1Boxes, level1Buttons, level1Enemies, level1Doors);
  level1 = new Level(levelTemplates[0][0], backgroundImage, floorTileLevel1, levelTemplates[0][1], levelTemplates[0][2], LEVEL_WORLD_WIDTHS[0], levelTemplates[0][3], levelTemplates[0][4], levelTemplates[0][5], levelTemplates[0][6], levelTemplates[0][7]);
  level2 = new Level(levelTemplates[1][0], backgroundImage, floorTileLevel2, levelTemplates[1][1], levelTemplates[1][2], LEVEL_WORLD_WIDTHS[1], levelTemplates[1][3], levelTemplates[1][4], levelTemplates[1][5], levelTemplates[1][6], levelTemplates[1][7]);
  levels.push(level1, level2);

  level3 = new Level(levelTemplates[2][0], backgroundImage, floorTileLevel3, levelTemplates[2][1], levelTemplates[2][2], LEVEL_WORLD_WIDTHS[2], levelTemplates[2][3], levelTemplates[2][4], levelTemplates[2][5], levelTemplates[2][6], levelTemplates[2][7]);
  levels = [];
  levels.push(level1, level2, level3);

  endGameLevel = new EndGame(1200, floorTileLevel3, brickPlatformImage);
  endGameLevel.setup();

  const spawnX = width * 0.12;
  const spawnY = height - 160;
  player = new Player(spawnX, spawnY, 80, 120);
  player.onRespawn = () => {
    const activeLevel = levels[levelNum - 1];
    if (activeLevel && typeof activeLevel.resetDynamicState === "function") {
      activeLevel.resetDynamicState();
    }
  };
  camera = new Camera(LEVEL_WORLD_WIDTHS[0], height * WORLD_HEIGHT_MULTIPLIER);
  abilityUnlockPopup = null;
  pauseStartedAt = null;
  accumulatedPauseMs = 0;
}

function startEndGame() {
  if (!endGameLevel || !player) {
    return;
  }

  const spawn = endGameLevel.getSpawnPoint();
  player.setSpawnPoint(spawn.x, spawn.y);
  player.respawn();

  if (camera) {
    camera.worldWidth = endGameLevel.worldWidth;
    camera.x = 0;
    camera.y = 0;
  }

  gameState = "endgame";
}

function restartToTitle() {
  levelNum = 1;
  levels = [];
  levelTemplates = [];
  setup();

  if (typeof backgroundMusic !== "undefined" && backgroundMusic.isPlaying()) {
    backgroundMusic.stop();
  }
  if (typeof soliloquyMusic !== "undefined" && soliloquyMusic.isPlaying()) {
    soliloquyMusic.stop();
  }

  gameState = "title";
}

function switchToLevel(nextLevelNum) {
  if (!levels || levels.length === 0) {
    return;
  }

  const clampedLevelNum = constrain(nextLevelNum, 1, levels.length);
  if (levelNum === clampedLevelNum) {
    return;
  }

  levelNum = clampedLevelNum;

  const spawnX = width * 0.12;
  const spawnY = height - 160;
  if (player) {
    player.setSpawnPoint(spawnX, spawnY);
    player.respawn();
  }

  if (camera) {
    const activeLevel = levels[levelNum - 1];
    if (activeLevel) {
      camera.worldWidth = activeLevel.worldWidth;
    }
    camera.x = 0;
    camera.y = 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // Keep current run state on resize instead of rebuilding levels/player.
  if (camera) {
    camera.worldHeight = height * WORLD_HEIGHT_MULTIPLIER;
    if (player) {
      camera.follow(player);
      camera.constrainPlayer(player);
    }
  }
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

    if (typeof backgroundMusic !== "undefined") {
      backgroundMusic.setLoop(true);
      if (!backgroundMusic.isPlaying()) {
        backgroundMusic.play();
      }
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

function mousePressed() {
  if (gameState !== "paused") {
    return;
  }

  const action = handlePauseMenuClick(mouseX, mouseY);
  if (action === "resume") {
    if (pauseStartedAt !== null) {
      accumulatedPauseMs += millis() - pauseStartedAt;
    }
    pauseStartedAt = null;
    gameState = "playing";
  } else if (action === "retry") {
    levels[levelNum - 1].resetDynamicState();
    player.respawn();
    if (pauseStartedAt !== null) {
      accumulatedPauseMs += millis() - pauseStartedAt;
    }
    pauseStartedAt = null;
    gameState = "playing";
  } else if (action === "levelSelect") {
    const levelNum = handleLevelSelectClick(mouseX, mouseY);
    if (levelNum) {
      switchToLevel(levelNum);
      if (pauseStartedAt !== null) {
        accumulatedPauseMs += millis() - pauseStartedAt;
      }
      pauseStartedAt = null;
      gameState = "playing";
    }
  }
}

function draw() {
  level = levels[levelNum - 1];
  if (camera && level) {
    camera.worldWidth = level.worldWidth;
  }
  updateLevelMusic();
  if (gameState === "title") {
    drawTitleScreen();
  } else if (gameState === "playing") {

    level.updateMovingPlatforms();
    player.update(level.platforms);
    level.applyPitfall(player);
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

    if (level.doors.length > 0) {
      for (const door of level.doors) {
        const playerLeft = typeof player.hitLeft === "number" ? player.hitLeft : player.x - player.width / 2;
        const playerRight = typeof player.hitRight === "number" ? player.hitRight : player.x + player.width / 2;
        const playerTop = typeof player.hitTop === "number" ? player.hitTop : player.y - player.height / 2;
        const playerBottom = typeof player.hitBottom === "number" ? player.hitBottom : player.y + player.height / 2;

        const doorLeft = door.x - door.w / 2;
        const doorRight = door.x + door.w / 2;
        const doorTop = door.y - door.h / 2;
        const doorBottom = door.y + door.h / 2;

        const hit =
          playerRight > doorLeft &&
          playerLeft < doorRight &&
          playerBottom >= doorTop &&
          playerTop < doorBottom;

        if (hit) {
          if (levelNum >= levels.length) {
            startEndGame();
          } else {
            switchToLevel(levelNum + 1);
          }
          break;
        }
      }
    }
  } else if (gameState === "endgame") {
    player.update(endGameLevel.platforms);
    camera.follow(player);
    camera.constrainPlayer(player);

    endGameLevel.drawBackground();

    camera.apply();
    endGameLevel.drawWorld();
    player.draw();
    camera.reset();

    if (endGameLevel.hasCollectedTreasure(player)) {
      push();
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(38);
      text("You Win!", width / 2, height / 2 - 20);
      textSize(18);
      text("Treasure recovered.", width / 2, height / 2 + 18);
      text("Press R to return to title", width / 2, height / 2 + 52);
      pop();
    }
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

  if (gameState === "endgame") {
    const canRestart = endGameLevel && endGameLevel.treasure && endGameLevel.treasure.collected;
    if (canRestart && (key === "r" || key === "R")) {
      restartToTitle();
    }
    return;
  }

  //TEMPORARY
  if (key === 'l' || key === 'L') {
    const nextLevelNum = (levelNum % levels.length) + 1;
    switchToLevel(nextLevelNum);
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
