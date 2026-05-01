function updateLevelMusic() {
  if (gameState === "paused" || gameState === "levelSelect" || gameState === "cheatMenu") {
    if (typeof backgroundMusic !== "undefined" && backgroundMusic.isPlaying()) backgroundMusic.pause();
    if (typeof soliloquyMusic  !== "undefined" && soliloquyMusic.isPlaying())  soliloquyMusic.pause();
    return;
  }

  const isPlayableState = gameState === "playing" || gameState === "abilityUnlock" || gameState === "levelUp";
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
