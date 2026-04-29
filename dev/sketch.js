// CONSTANTS

const CHEAT_MODE = true;
const WORLD_WIDTH = 3000;
const WORLD_HEIGHT_MULTIPLIER = 1;
const LEVEL_WORLD_WIDTHS = [4160, 3400, 3296, 2400];


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
let testLevelActive = false;
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
  levelTemplates.push(getTestLevelTemplate());
  // Add NavigationLevel template
  const navigationLevelTemplate = getNavigationLevelTemplate();
  if (navigationLevelTemplate.length < 8) {
    navigationLevelTemplate.push([]);
  }
  if (navigationLevelTemplate.length < 10) {
    navigationLevelTemplate.push(null);
  }
  levelTemplates.push(navigationLevelTemplate);
  setupLevel();
}

function setupLevel() {
  level1 = new Level(
    levelTemplates[0][0], backgroundImage, floorTileLevel1,
    levelTemplates[0][1], levelTemplates[0][2], LEVEL_WORLD_WIDTHS[0],
    levelTemplates[0][3], levelTemplates[0][4], levelTemplates[0][5],
    levelTemplates[0][6], levelTemplates[0][7], levelTemplates[0][8],
    levelTemplates[0][9], levelTemplates[0][10]);
  level2 = new Level(
    levelTemplates[1][0], backgroundImage, floorTileLevel2,
    levelTemplates[1][1], levelTemplates[1][2], LEVEL_WORLD_WIDTHS[1],
     levelTemplates[1][3], levelTemplates[1][4], levelTemplates[1][5],
     levelTemplates[1][6], levelTemplates[1][7], levelTemplates[1][8],
     levelTemplates[1][9], levelTemplates[1][10]);
  level3 = new Level(
    levelTemplates[2][0], backgroundImage, floorTileLevel3,
    levelTemplates[2][1], levelTemplates[2][2], LEVEL_WORLD_WIDTHS[2],
    levelTemplates[2][3], levelTemplates[2][4], levelTemplates[2][5],
    levelTemplates[2][6], levelTemplates[2][7], levelTemplates[2][8],
    levelTemplates[2][9], levelTemplates[2][10]);
  levelTest = new Level(
    levelTemplates[3][0], backgroundImage, floorTileLevel1,
    levelTemplates[3][1], levelTemplates[3][2], LEVEL_WORLD_WIDTHS[3],
    levelTemplates[3][3], levelTemplates[3][4], levelTemplates[3][5],
    levelTemplates[3][6], levelTemplates[3][7], levelTemplates[3][8],
    levelTemplates[3][9], levelTemplates[3][10]);
  navigationLevel = new NavigationLevel(
    levelTemplates[4][0], backgroundImage, floorTileLevel1,
    levelTemplates[4][1], levelTemplates[4][2], LEVEL_WORLD_WIDTHS[4],
    levelTemplates[4][3], levelTemplates[4][4], levelTemplates[4][5],
    levelTemplates[4][6], levelTemplates[4][7], levelTemplates[4][8],
    levelTemplates[4][9], levelTemplates[4][10]
  );
  levels.push(level1, level2, level3);
  // Insert navigationLevel after main levels, but before endGameLevel
  const navigationLevelIndex = levels.length;
  levels.push(navigationLevel);

  endGameLevel = new EndGame(1200, floorTileLevel3, brickPlatformImage);
  endGameLevel.setup();
  levels.push(endGameLevel);

  // Store navigationLevelIndex globally for use in keyPressed
  window.navigationLevelIndex = navigationLevelIndex;

  const spawnX = width * 0.12;
  const spawnY = height - 160;
  player = new Player(spawnX, spawnY, 80, 120);
  player.onBeforeRespawn = () => {
    if (gameState === "endgame" && endGameLevel && typeof endGameLevel.getSpawnPoint === "function") {
      const spawn = endGameLevel.getSpawnPoint();
      player.setSpawnPoint(spawn.x, spawn.y);
      return;
    }
    const activeLevel = testLevelActive ? levelTest : levels[levelNum - 1];
    if (activeLevel && typeof activeLevel.getSpawnPoint === "function") {
      const spawn = activeLevel.getSpawnPoint();
      player.setSpawnPoint(spawn.x, spawn.y);
    }
  };
  player.onRespawn = () => {
    const activeLevel = testLevelActive ? levelTest : levels[levelNum - 1];
    if (activeLevel) {
      resetDynamicStateForLevel(activeLevel);
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
      resetDynamicStateForLevel(levels[levelNum - 1]);
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
  level = testLevelActive ? levelTest : levels[levelNum - 1];
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
    applyTrapDamage(level, player);
    applyEnemyDamage(level, player);
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
    // TEMP: Press 'n' to switch to NavigationLevel
    if (key === 'n' || key === 'N') {
      // Jump to navigationLevel (now in levels array)
      if (typeof window.navigationLevelIndex === 'number') {
        levelNum = window.navigationLevelIndex + 1; // levelNum is 1-based
        player.respawn();
        return;
      }
    }
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

  if (key === 'q' || key === 'Q') {
    testLevelActive = !testLevelActive;
    player.respawn();
  }
}
