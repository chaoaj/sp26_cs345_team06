let accumulatedPauseMs = 0;
let pauseStartedAt = null;
let runStartedAt = null;
let runCompletedAt = null;

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