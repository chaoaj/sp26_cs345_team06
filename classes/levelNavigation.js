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

function handleLevelSelectMousePressed() {
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

function handleDoors() {
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
                if (door.targetLevelNum != null && levels[door.targetLevelNum - 1]) {
                    switchToLevel(door.targetLevelNum);
                } else if (levelNum >= levels.length) {
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
}
