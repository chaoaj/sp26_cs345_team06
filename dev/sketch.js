const CHEAT_MODE = true;

let gameState = "title";

const WORLD_WIDTH = 3000;
const WORLD_HEIGHT_MULTIPLIER = 1;
const LEVEL_WORLD_WIDTHS = [4160, 3400, 3296];

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
let level1LaserPuzzles = null
let pauseStartedAt = null;
let accumulatedPauseMs = 0;
let abilityUnlockPopup = null;
let runStartedAt = null;
let runCompletedAt = null;

let last5KeysTyped = "";

function getGameMillis() {
  if ((gameState === "paused" || gameState === "abilityUnlock") && pauseStartedAt !== null) {
    return pauseStartedAt - accumulatedPauseMs;
  }
  return millis() - accumulatedPauseMs;
}

function getRunElapsedMs() {
  if (runStartedAt === null) {
    return 0;
  }
  const currentTime = runCompletedAt !== null ? runCompletedAt : getGameMillis();
  return Math.max(0, currentTime - runStartedAt);
}

function formatElapsedTime(totalMs) {
  const totalSeconds = Math.floor(Math.max(0, totalMs) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
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
  if (runStartedAt === null) {
    runStartedAt = getGameMillis();
  }
  runCompletedAt = null;
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
      if (pauseStartedAt !== null) {
        accumulatedPauseMs += millis() - pauseStartedAt;
      }
      pauseStartedAt = null;
      gameState = "playing";
    } else if (action === "levelSelect") {
      gameState = "levelSelect";
    }
    return;
  }

  if (gameState === "cheatMenu") {
    const cheats = [
      "infiniteHealth", "infiniteJumps", "unlockAll",
      "skipLevel", "unlockItems"
    ];
    const lineHeight = 38;
    const panelW = min(520, width - 60);
    const basePanelH = 340;
    const panelH = min(height - 20, basePanelH + max(0, cheats.length - 4) * lineHeight);
    const panelX = width / 2;
    const panelY = height / 2;
    const panelTop = panelY - panelH / 2;
    const firstButtonY = panelTop + 154;
    const bw = panelW - 48;
    const bh = 30;

    for (let i = 0; i < cheats.length; i++) {
      const bx = panelX;
      const by = firstButtonY + i * lineHeight;
      if (mouseX > bx - bw / 2 && mouseX < bx + bw / 2 &&
          mouseY > by - bh / 2 && mouseY < by + bh / 2) {
        toggleCheat(cheats[i]);
      }
    }
    return;
  }

  if (gameState === "levelSelect") {
    const selectedLevel = handleLevelSelectClick(mouseX, mouseY);
    if (selectedLevel) {
      switchToLevel(selectedLevel);
      if (pauseStartedAt !== null) {
        accumulatedPauseMs += millis() - pauseStartedAt;
      }
      pauseStartedAt = null;
      gameState = selectedLevel === levels.length ? "endgame" : "playing";
    }
    return;
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

    if (level.doors.length > 0) {
      for (const door of level.doors) {
        if (door.isVisible === false) continue;
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
            gameState = "endgame";
          } else {
            switchToLevel(levelNum + 1);
            if (levelNum === levels.length) {
              gameState = "endgame";
            }
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

    endGameLevel.collectTouchedItems(player);

    const win = endGameLevel.hasCollectedTreasure(player);
    if (win) {
      if (runCompletedAt === null) {
        runCompletedAt = getGameMillis();
      }
      push();
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(38);
      text("You Win!", width / 2, height / 2 - 20);
      textSize(18);
      text("Treasure recovered.", width / 2, height / 2 + 18);
      text(`Time: ${formatElapsedTime(getRunElapsedMs())}`, width / 2, height / 2 + 40);
      text("Press R to return to title", width / 2, height / 2 + 74);
      pop();
      if (hasCheated) {
        drawCheaterOverlay();
      }
    }
  } else if (gameState === "paused") {
    level.drawBackground();
    camera.apply();
    level.drawWorld();
    player.draw();
    camera.reset();
    level.drawHUD(player);
    drawPauseOverlay();
  } else if (gameState === "cheatMenu") {
    level.drawBackground();
    camera.apply();
    level.drawWorld();
    player.draw();
    camera.reset();
    level.drawHUD(player);
    drawCheatMenuOverlay();
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

  if (CHEAT_MODE && gameState === "playing") {
    if (key === '1') Ability.grant(player, DOUBLE_JUMP_ABILITY);
    if (key === '2') Ability.grant(player, DASH_ABILITY);
    if (key === 'r' || key === 'R') player.respawn();

    last5KeysTyped += key.toLowerCase();
    if (last5KeysTyped.length > 5) {
      last5KeysTyped = last5KeysTyped.slice(-5);
    }
    if (last5KeysTyped === "cheat") {
      gameState = "cheatMenu";
      last5KeysTyped = "";
    }
  }

  if (gameState === "cheatMenu") {
    if (key === "Escape" || key === "c" || key === "C") {
      gameState = "playing";
    }
  }

  // TEMPORARY
  if (key === 'l' || key === 'L') {
    const nextLevelNum = (levelNum % levels.length) + 1;
    switchToLevel(nextLevelNum);
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