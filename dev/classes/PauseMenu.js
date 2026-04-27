const PAUSE_ITEMS = ["Resume", "Retry", "Level", "Music"];

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
  rect(width / 2, height / 2 + 50, 420, 650, 18);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("Paused", width / 2, height / 2 - 200);

  if (typeof getRunElapsedMs === "function" && typeof formatElapsedTime === "function") {
    textSize(24);
    text(`Time: ${formatElapsedTime(getRunElapsedMs())}`, width / 2, height / 2 - 158);
  }

  const rects = getPauseItemRects();
  for (const item of rects) {
    const disabled = item.label === "Music";
    rectMode(CENTER);
    fill(disabled ? color(60, 65, 80) : color(50, 55, 75));
    rect(item.x, item.y, item.w, item.h, 10);
    fill(disabled ? color(120, 130, 150) : 255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text(item.label, item.x, item.y);
  }

  const lastRect = rects[rects.length - 1];
  const abilitySectionY = lastRect.y + lastRect.h / 2 + 30;

  stroke(255, 255, 255, 40);
  strokeWeight(1);
  line(width / 2 - 160, abilitySectionY, width / 2 + 160, abilitySectionY);
  noStroke();

  fill(170, 182, 205);
  textSize(16);
  textAlign(CENTER, CENTER);
  text("Abilities", width / 2, abilitySectionY + 20);

  const abilities = Ability.getUnlockedAbilities(player);
  const labels = abilities.length > 0
    ? abilities.map(a => a.name.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, c => c.toUpperCase()))
    : ["None yet"];

  fill(255);
  textSize(18);
  for (let i = 0; i < labels.length; i++) {
    text(labels[i], width / 2, abilitySectionY + 48 + i * 26);
  }
  pop();
}

function handlePauseMenuClick(mx, my) {
  for (const item of getPauseItemRects()) {
    if (item.label === "Music") continue;
    if (
      mx >= item.x - item.w / 2 && mx <= item.x + item.w / 2 &&
      my >= item.y - item.h / 2 && my <= item.y + item.h / 2
    ) {
      if (item.label === "Resume") return "resume";
      if (item.label === "Retry")  return "retry";
      if (item.label === "Level")  return "levelSelect";
    }
  }
  return null;
}

function getLevelSelectRects() {
  // Use global levels array if available
  const count = (typeof levels !== 'undefined' && Array.isArray(levels)) ? levels.length : 3;
  const itemW = 120, itemH = 120, gap = 30;
  // Layout: up to 4 per row
  const perRow = Math.min(4, count);
  const rows = Math.ceil(count / perRow);
  const totalW = perRow * itemW + (perRow - 1) * gap;
  const totalH = rows * itemH + (rows - 1) * gap;
  const startX = width / 2 - totalW / 2 + itemW / 2;
  const startY = height / 2 - totalH / 2 + itemH / 2 + 20;
  let rects = [];
  for (let i = 0; i < count; i++) {
    const col = i % perRow;
    const row = Math.floor(i / perRow);
    rects.push({
      num: i + 1,
      label: (i === count - 1) ? 'Final Level' : `Level ${i + 1}`,
      x: startX + col * (itemW + gap),
      y: startY + row * (itemH + gap),
      w: itemW,
      h: itemH,
    });
  }
  return rects;
}

function drawLevelSelectOverlay() {
  push();
  noStroke();
  fill(0, 0, 0, 150);
  rectMode(CORNER);
  rect(0, 0, width, height);

  rectMode(CENTER);
  fill(26, 31, 46);
  // Dynamic height for more levels
  const count = (typeof levels !== 'undefined' && Array.isArray(levels)) ? levels.length : 3;
  const perRow = Math.min(4, count);
  const rows = Math.ceil(count / perRow);
  const panelW = Math.max(500, perRow * 160);
  const panelH = Math.max(260, rows * 140);
  rect(width / 2, height / 2, panelW, panelH, 18);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(30);
  text("Select Level", width / 2, height / 2 - panelH / 2 + 40);

  for (const r of getLevelSelectRects()) {
    rectMode(CENTER);
    fill(50, 55, 75);
    rect(r.x, r.y, r.w, r.h, 12);
    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);
    text(r.label, r.x, r.y);
  }
  pop();
}

function handleLevelSelectClick(mx, my) {
  for (const r of getLevelSelectRects()) {
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