const PAUSE_ITEMS = ["Resume", "Retry", "Level", "Music"];
let gameMuted = false;

function getPauseItemRects() {
  const itemW = 320, itemH = 62, gap = 22;
  const totalH = PAUSE_ITEMS.length * (itemH + gap) - gap;
  const startY = height / 2 - totalH / 2 + 80;
  return PAUSE_ITEMS.map((label, i) => ({
    label,
    x: width / 2,
    y: startY + i * (itemH + gap),
    w: itemW,
    h: itemH,
  }));
}

function handlePauseKeys() {
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
    } else if (gameState === "levelSelect") {
      gameState = "paused";
    }
  }
}

function drawPauseOverlay() {
  push();
  noStroke();
  fill(0, 0, 0, 150);
  rectMode(CORNER);
  rect(0, 0, width, height);

  rectMode(CENTER);
  fill(26, 31, 46);
  rect(width / 2, height / 2, 420, 520, 18);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("Paused", width / 2, height / 2 - 200);

  if (typeof getRunElapsedMs === "function" && typeof formatElapsedTime === "function") {
    textSize(24);
    text(`Time: ${formatElapsedTime(getRunElapsedMs())}`, width / 2, height / 2 - 158);
  }

  const rects = getPauseItemRects();
  imageMode(CENTER);
  for (const item of rects) {
    let btnImg;
    if      (item.label === "Resume") btnImg = pauseResumeBtn;
    else if (item.label === "Retry")  btnImg = pauseRetryBtn;
    else if (item.label === "Level")  btnImg = pauseLevelBtn;
    else if (item.label === "Music")  btnImg = gameMuted ? pauseMusicOffBtn : pauseMusicOnBtn;
    if (btnImg) {
      image(btnImg, item.x, item.y, item.w, item.h);
    }
  }

  pop();
}

function handlePauseMenuClick(mx, my) {
  for (const item of getPauseItemRects()) {
    if (
      mx >= item.x - item.w / 2 && mx <= item.x + item.w / 2 &&
      my >= item.y - item.h / 2 && my <= item.y + item.h / 2
    ) {
      if (item.label === "Resume") return "resume";
      if (item.label === "Retry")  return "retry";
      if (item.label === "Level")  return "levelSelect";
      if (item.label === "Music") {
        gameMuted = !gameMuted;
        if (gameMuted) {
          if (typeof backgroundMusic !== "undefined" && backgroundMusic.isPlaying()) backgroundMusic.pause();
          if (typeof soliloquyMusic  !== "undefined" && soliloquyMusic.isPlaying())  soliloquyMusic.pause();
        }
        return null;
      }
    }
  }
  return null;
}

// Toggle to false to allow access to all levels regardless of progress
const LEVEL_SELECT_LOCK = false;
let _highestLevelSeen = 1;

function getLevelSelectRects() {
  if (typeof levelNum !== 'undefined') {
    _highestLevelSeen = max(_highestLevelSeen, levelNum);
  }

  // Layout constants — adjust CW (card width) and CH (card height) to resize cards
  const CW = 130, CH = 90, GAP = 25, ROW_GAP = 40;
  const PAD_X = 36, PAD_TOP = 0, PAD_BOT = 36;
  const TITLE_H = 32, TITLE_GAP = 16;
  const FW = CW * 3 + GAP * 2;   // Final Level spans full inner row
  const FH = CH;                  // same height as numbered cards
  const PW = FW + PAD_X * 2;
  const PH = PAD_TOP + TITLE_H + TITLE_GAP + CH + ROW_GAP + CH + ROW_GAP + FH + PAD_BOT;

  const PX = width / 2, PY = height / 2;
  const panelTop = PY - PH / 2;
  const row1Y = panelTop + PAD_TOP + TITLE_H + TITLE_GAP + CH / 2;
  const row2Y = row1Y + CH + ROW_GAP;
  const finalY = row2Y + CH / 2 + ROW_GAP + FH / 2;

  return [
    { num: 1, label: '1',           x: PX - CW - GAP,         y: row1Y, w: CW, h: CH, PX, PY, PW, PH },
    { num: 2, label: '2',           x: PX,                     y: row1Y, w: CW, h: CH, PX, PY, PW, PH },
    { num: 3, label: '3',           x: PX + CW + GAP,          y: row1Y, w: CW, h: CH, PX, PY, PW, PH },
    { num: 4, label: '4',           x: PX - CW / 2 - GAP / 2,  y: row2Y, w: CW, h: CH, PX, PY, PW, PH },
    { num: 5, label: '5',           x: PX + CW / 2 + GAP / 2,  y: row2Y, w: CW, h: CH, PX, PY, PW, PH },
    { num: 6, label: 'Final Level', x: PX,                     y: finalY, w: FW, h: FH, PX, PY, PW, PH },
  ];
}

function drawLevelSelectOverlay() {
  const rects = getLevelSelectRects();
  const { PX, PY, PW, PH } = rects[0];

  push();
  noStroke();
  fill(0, 0, 0, 160);
  rectMode(CORNER);
  rect(0, 0, width, height);

  noStroke();
  rectMode(CENTER);
  fill(26, 31, 46);
  rect(PX, PY, PW, PH, 14);


  for (const r of rects) {
    const locked = LEVEL_SELECT_LOCK && r.num > _highestLevelSeen;
    noStroke();
    rectMode(CENTER);
    fill(locked ? color(38, 42, 56) : color(50, 55, 75));
    rect(r.x, r.y, r.w, r.h, 8);
    fill(locked ? color(75, 82, 102) : color(210, 218, 235));
    textAlign(CENTER, CENTER);
    textSize(r.num < 6 ? 26 : 20);
    text(r.label, r.x, r.y);
  }
  pop();
}

function handleLevelSelectClick(mx, my) {
  for (const r of getLevelSelectRects()) {
    const locked = LEVEL_SELECT_LOCK && r.num > _highestLevelSeen;
    if (locked) continue;
    if (
      mx >= r.x - r.w / 2 && mx <= r.x + r.w / 2 &&
      my >= r.y - r.h / 2 && my <= r.y + r.h / 2
    ) {
      return r.num;
    }
  }
  return null;
}


function handlePauseMenuDraw() {
    level.drawBackground();
    camera.apply();
    level.drawWorld();
    player.draw();
    camera.reset();
    level.drawHUD(player);
    drawPauseOverlay();
}