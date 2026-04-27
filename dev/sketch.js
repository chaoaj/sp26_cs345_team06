// CONSTANTS

const CHEAT_MODE = true;
const WORLD_WIDTH = 3000;
const WORLD_HEIGHT_MULTIPLIER = 1;
const LEVEL_WORLD_WIDTHS = [4160, 3400, 3296];


///TEMP VARIABLES
///    PUT TEMP VARIALBES HERE TO STOP CLUTTER


let level1LaserPuzzles = null


///END OF TEMP VARIABLES


// INITIALIZATIONS

let platforms = [];
let players;
let player;
let camera;
let endGameLevel;

let levelNum = 1
let levels = []
let levelTemplates = []
let abilityUnlockPopup = null;
let gameState = "title";

// FUNCTIONS

function setup() {
  noSmooth();
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);

  const level1Template = getLevel1Template();
  levelTemplates.push(level1Template);
  const level2Template = getLevel2Template();
  if (level2Template.length < 10) {
    level2Template.push(null);
  }
  levelTemplates.push(level2Template);
  const level3Template = getLevel3Template();
  if (level3Template.length < 8) {
    level3Template.push([]);
  }
  if (level3Template.length < 10) {
    level3Template.push(null);
  }
  levelTemplates.push(level3Template);
  setupLevel();
}

function setupLevel() {
  level1 = new Level(levelTemplates[0][0], backgroundImage, floorTileLevel1, levelTemplates[0][1], levelTemplates[0][2], LEVEL_WORLD_WIDTHS[0], levelTemplates[0][3], levelTemplates[0][4], levelTemplates[0][5], levelTemplates[0][6], levelTemplates[0][7], levelTemplates[0][8], levelTemplates[0][9]);
  level2 = new Level(levelTemplates[1][0], backgroundImage, floorTileLevel2, levelTemplates[1][1], levelTemplates[1][2], LEVEL_WORLD_WIDTHS[1], levelTemplates[1][3], levelTemplates[1][4], levelTemplates[1][5], levelTemplates[1][6], levelTemplates[1][7], levelTemplates[1][8], levelTemplates[1][9]);
  level3 = new Level(levelTemplates[2][0], backgroundImage, floorTileLevel3, levelTemplates[2][1], levelTemplates[2][2], LEVEL_WORLD_WIDTHS[2], levelTemplates[2][3], levelTemplates[2][4], levelTemplates[2][5], levelTemplates[2][6], levelTemplates[2][7], levelTemplates[2][8], levelTemplates[2][9]);
  levels.push(level1, level2, level3);

  endGameLevel = new EndGame(1200, floorTileLevel3, brickPlatformImage);
  endGameLevel.setup();
  levels.push(endGameLevel);

  const spawnX = width * 0.12;
  const spawnY = height - 160;
  player = new Player(spawnX, spawnY, 80, 120);
  player.onBeforeRespawn = () => {
    if (gameState === "endgame" && endGameLevel && typeof endGameLevel.getSpawnPoint === "function") {
      const spawn = endGameLevel.getSpawnPoint();
      player.setSpawnPoint(spawn.x, spawn.y);
      return;
    }
    const activeLevel = levels[levelNum - 1];
    if (activeLevel && typeof activeLevel.getSpawnPoint === "function") {
      const spawn = activeLevel.getSpawnPoint();
      player.setSpawnPoint(spawn.x, spawn.y);
    }
  };
  player.onRespawn = () => {
    const activeLevel = levels[levelNum - 1];
    if (activeLevel && typeof activeLevel.resetDynamicState === "function") {
      activeLevel.resetDynamicState();
    }
    if (camera) {
      if (gameState === "endgame" && endGameLevel) {
        camera.worldWidth = endGameLevel.worldWidth;
      } else if (activeLevel) {
        camera.worldWidth = activeLevel.worldWidth;
      }
      camera.x = 0;
      camera.y = 0;
    }
  };
  camera = new Camera(LEVEL_WORLD_WIDTHS[0], height * WORLD_HEIGHT_MULTIPLIER);
  abilityUnlockPopup = null;
  pauseStartedAt = null;
  accumulatedPauseMs = 0;
  runStartedAt = null;
  runCompletedAt = null;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (camera) {
    camera.worldHeight = height * WORLD_HEIGHT_MULTIPLIER;
    if (player) {
      camera.follow(player);
      camera.constrainPlayer(player);
    }
  }
}

function mousePressed() {
  if (gameState === "paused") {
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
      accumulatedPauseMs = 0;
      pauseStartedAt = null;
      runStartedAt = getGameMillis();
      runCompletedAt = null;
      gameState = "playing";
    } else if (action === "levelSelect") {
      gameState = "levelSelect";
    }
    return;
  }
  if (gameState === "cheatMenu") {
      handleCheatMenuMousePressed()
  }

  if (gameState === "levelSelect") {
    handleLevelSelectMousePressed()
  }
}

function draw() {
  level = levels[levelNum - 1];
  if (camera && level) {
    camera.worldWidth = level.worldWidth;
  }
  updateLevelMusic();
  if (levelNum === levels.length && gameState !== "endgame") {
    gameState = "endgame";
  }

  if (gameState === "title") {
    drawTitleScreen();
  } else if (gameState === "playing") {
    level.updateMovingPlatforms(player);
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

    handleDoors()
  } else if (gameState === "endgame") {
    handleEndGameDraw()
  } else if (gameState === "paused") {
    handlePauseMenuDraw()
  } else if (gameState === "cheatMenu") {
    handleCheatMenuDraw()
  } else if (gameState === "levelSelect") {
    level.drawBackground();
    camera.apply();
    level.drawWorld();
    player.draw();
    camera.reset();
    level.drawHUD(player);
    drawLevelSelectOverlay();
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

function keyPressed() {
  if (gameState === "title") {
    handleTitleKeyPressed();
    return;
  }

  if (gameState === "abilityUnlock") {
    closeAbilityUnlockPopup();
    return;
  }

  handleEndGameKeys()
  handleCheatMenuKeys()
  handlePauseKeys()

}