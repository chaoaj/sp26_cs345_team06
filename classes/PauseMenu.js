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
  const count = 2;
  const itemW = 120, itemH = 120, gap = 30;
  const totalW = count * itemW + (count - 1) * gap;
  const startX = width / 2 - totalW / 2 + itemW / 2;
  return Array.from({ length: count }, (_, i) => ({
    num: i + 1,
    x: startX + i * (itemW + gap),
    y: height / 2 + 20,
    w: itemW,
    h: itemH,
  }));
}

function drawLevelSelectOverlay() {
  push();
  noStroke();
  fill(0, 0, 0, 150);
  rectMode(CORNER);
  rect(0, 0, width, height);

  rectMode(CENTER);
  fill(26, 31, 46);
  rect(width / 2, height / 2, 380, 260, 18);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(30);
  text("Select Level", width / 2, height / 2 - 90);

  for (const r of getLevelSelectRects()) {
    rectMode(CENTER);
    fill(50, 55, 75);
    rect(r.x, r.y, r.w, r.h, 12);
    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);
    text(`Level ${r.num}`, r.x, r.y);
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
