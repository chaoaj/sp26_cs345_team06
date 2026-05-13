// CONSTANTS

const CHEAT_MODE = true;
const WORLD_WIDTH = 3000;
const WORLD_HEIGHT_MULTIPLIER = 1;
const LEVEL_WORLD_WIDTHS = [4160, 5000, 3296, 2400, 4200];


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
let completedLevels = [false, false, false, false];
let abilityUnlockPopup = null;
let gameState = "title";

// FUNCTIONS

function setup() {
  noSmooth();
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);

  levelTemplates = [
    getLevel1Template(),
    getLevel2Template(),
    getLevel3Template(),
    getLevel4Template(),
    getNavigationLevelTemplate(),
  ]
  setupLevel();
}

function setupLevel() {
  print(levelTemplates[0][9])
  level1 = new Level(
    levelTemplates[0][0], backgroundImageLevel4, floorTileLevel1,
    levelTemplates[0][1], levelTemplates[0][2], LEVEL_WORLD_WIDTHS[0],
    levelTemplates[0][3], levelTemplates[0][4], levelTemplates[0][5],
    levelTemplates[0][6], levelTemplates[0][7], levelTemplates[0][8],
    levelTemplates[0][9], levelTemplates[0][10]);
  level2 = new Level(
    levelTemplates[1][0], backgroundImageLevel4, floorTileLevel2,
    levelTemplates[1][1], levelTemplates[1][2], LEVEL_WORLD_WIDTHS[1],
     levelTemplates[1][3], levelTemplates[1][4], levelTemplates[1][5],
     levelTemplates[1][6], levelTemplates[1][7], levelTemplates[1][8],
     levelTemplates[1][9], levelTemplates[1][10]);
  level3 = new Level(
    levelTemplates[2][0], backgroundImageLevel4, floorTileLevel3,
    levelTemplates[2][1], levelTemplates[2][2], LEVEL_WORLD_WIDTHS[2],
    levelTemplates[2][3], levelTemplates[2][4], levelTemplates[2][5],
    levelTemplates[2][6], levelTemplates[2][7], levelTemplates[2][8],
    levelTemplates[2][9], levelTemplates[2][10]);
  // Attach blocker to Level 3 instance for reset logic
  if (levelTemplates[2].blocker) {
    level3.blocker = levelTemplates[2].blocker;
  }
  level4 = new Level(
    levelTemplates[3][0], backgroundImageLevel4, floorTileLevel1,
    levelTemplates[3][1], levelTemplates[3][2], LEVEL_WORLD_WIDTHS[3],
    levelTemplates[3][3], levelTemplates[3][4], levelTemplates[3][5],
    levelTemplates[3][6], levelTemplates[3][7], levelTemplates[3][8],
    levelTemplates[3][9], levelTemplates[3][10]);
  if (levelTemplates[3][10] instanceof Door) {
    level4.pipePuzzleSolvedDoor = levelTemplates[3][10];
  }
  // DEBUG: Log enemies array from template before instantiation
  console.log('[setupLevel] NavigationLevel enemies from template:',
    (levelTemplates[4][5] || []).map(e => e?.constructor?.name)
  );
  navigationLevel = new NavigationLevel(
    levelTemplates[4][0], // platforms
    backgroundImageLevel4,
    floorTileLevel1,
    levelTemplates[4][1], // items
    levelTemplates[4][2], // traps
    LEVEL_WORLD_WIDTHS[4],
    levelTemplates[4][3], // boxes
    levelTemplates[4][4], // buttons
    levelTemplates[4][5], // enemies
    levelTemplates[4][6], // doors
    levelTemplates[4][7], // pits
    levelTemplates[4][8], // terrain
    levelTemplates[4][12], // pipePuzzles
    levelTemplates[4][13]  // laserPuzzles
  );
  navigationLevel.worldHeight = 6000;
  if (typeof refreshNavigationDoorLocks === "function") {
    refreshNavigationDoorLocks(navigationLevel);
  }
  levels.push(level1, level2, level3, level4);
  // Insert navigationLevel after main levels, but before endGameLevel
  const navigationLevelIndex = levels.length;
  window.navigationLevelIndex = navigationLevelIndex;
  levels.push(navigationLevel);

  endGameLevel = new EndGame();
  levels.push(endGameLevel);

  level = levels[levelNum - 1];

  player = new Player(width / 2, height / 2, 64, 64);
  camera = new Camera(player);
}

function draw() {
  if (gameState === "title") {
    drawTitleScreen();
    return;
  }

  if (gameState === "paused") {
    drawPauseMenu();
    return;
  }

  if (gameState === "levelUp") {
    drawLevelUpSelection();
    return;
  }

  background(220);

  const activeLevel = levels[levelNum - 1];
  camera.update(activeLevel.worldWidth, activeLevel.worldHeight);

  push();
  translate(-camera.x, -camera.y);

  activeLevel.draw();

  player.update(activeLevel.platforms, activeLevel.traps, activeLevel.boxes, activeLevel.enemies, activeLevel.pits, activeLevel.terrain);
  player.draw();

  activeLevel.update(player);

  pop();

  if (gameState === "abilityUnlock") {
    drawAbilityUnlockPopup();
  }

  drawCheatMenu();
  drawTimer();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function switchToLevel(newLevelNum) {
  if (newLevelNum >= 1 && newLevelNum <= levels.length) {
    levelNum = newLevelNum;
    level = levels[levelNum - 1];
    player.respawn();
  }
}

function keyPressed() {
  if (gameState === "title") {
    if (keyCode === ENTER) {
      gameState = "playing";
      if (backgroundMusic && !backgroundMusic.isPlaying()) {
        backgroundMusic.loop();
      }
    }
    return;
  }

  if (gameState === "paused") {
    handlePauseKeys();
    return;
  }

  if (gameState === "levelUp") {
    handleLevelUpKeys();
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
