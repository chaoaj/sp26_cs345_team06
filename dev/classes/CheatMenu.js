// EJs awesome cheat menu

// this is just funny to show chao can turn it off for testing things
const cheatDetectionOn = true
let last5KeysTyped = ""
let hasCheated = false

const cheatState = {
    infiniteHealth: false,
    infiniteJumps: false,
    unlockAll: false,
    skipLevel: false,
    unlockItems: false
};

function handleCheatMenuKeys() {
    if (CHEAT_MODE && gameState === "playing") {

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
}

function toggleCheat(key) {
    cheatState[key] = !cheatState[key];
    onCheatToggled(key, cheatState[key]);
}

function onCheatToggled(key, enabled) {
    hasCheated = true

    switch (key) {
        case "infiniteHealth": setInfiniteHealth(); break
        case "infiniteJumps": setInfiniteJumps(); break
        case "unlockAll": setUnlockAll(); break
        case "skipLevel": setSkipLevel(); break
        case "unlockItems": setUnlockItems(); break
    }
}

function setInfiniteHealth() {
    player.health = 99
}
function setInfiniteJumps() {
    player.maxAirJumps = 9999
}
function setUnlockAll() {
    Ability.grant(player, DOUBLE_JUMP_ABILITY);
    Ability.grant(player, DASH_ABILITY)
}
function setSkipLevel() {
    const nextLevelNum = (levelNum % levels.length) + 1;
    switchToLevel(nextLevelNum);
}
function setUnlockItems() {
    player.activateSpeedPotion();
    player.activateHighJump()
}

function drawCheatMenuOverlay() {
    push();
    noStroke();
    fill(0, 0, 0, 160);
    rectMode(CORNER);
    rect(0, 0, width, height);

    const cheats = [
        { label: "> INFINITE HEALTH", key: "infiniteHealth" },
        { label: "> INFINITE JUMPS", key: "infiniteJumps" },
        { label: "> UNLOCK ALL ABILITIES", key: "unlockAll" },
        { label: "> SKIP LEVEL", key: "skipLevel" },
        { label: "> UNLOCK ALL ITEMS", key: "unlockItems" },
    ];

    const lineHeight = 38;
    const basePanelH = 340;
    const panelH = min(height - 20, basePanelH + max(0, cheats.length - 4) * lineHeight);
    const panelW = min(520, width - 60);
    const panelX = width / 2;
    const panelY = height / 2;
    const panelTop = panelY - panelH / 2;

    rectMode(CENTER);
    fill(8, 14, 8);
    rect(panelX, panelY, panelW, panelH, 6);

    const flicker = sin(frameCount * 0.18) * 18 + 200;
    stroke(0, flicker, 40, 180);
    strokeWeight(2);
    noFill();
    rect(panelX, panelY, panelW - 8, panelH - 8, 4);

    noStroke();
    for (let sy = panelTop + 4; sy < panelTop + panelH - 4; sy += 4) {
        fill(0, 0, 0, 100);
        rectMode(CORNER);
        rect(panelX - panelW / 2 + 4, sy, panelW - 8, 2);
    }
    rectMode(CENTER);

    noStroke();
    fill(0, 255, 70);
    textAlign(CENTER, CENTER);
    textSize(13);
    text("[ SYSTEM BREACH DETECTED ]", panelX, panelTop + 28);

    textSize(30);
    fill(0, 230 + int(sin(frameCount * 0.12) * 25), 50);
    text("[ HACKER MODE ENABLED ]", panelX, panelTop + 72);

    stroke(0, 180, 40, 120);
    strokeWeight(1);
    line(panelX - panelW / 2 + 24, panelTop + 100, panelX + panelW / 2 - 24, panelTop + 100);
    noStroke();

    fill(0, 180, 40);
    textSize(13);
    textAlign(LEFT, CENTER);
    text(`root@localhost:~$ hacker_mode`, panelX - panelW / 2 + 28, panelTop + 122);

    const firstButtonY = panelTop + 154;
    const mx = mouseX;
    const my = mouseY;

    for (let i = 0; i < cheats.length; i++) {
        const bx = panelX;
        const by = firstButtonY + i * lineHeight;
        const bw = panelW - 48;
        const bh = 30;

        const hovered = mx > bx - bw / 2 && mx < bx + bw / 2 &&
            my > by - bh / 2 && my < by + bh / 2;

        rectMode(CENTER);
        if (hovered) {
            fill(0, 180, 40, 60);
            stroke(0, 255, 70, 200);
            strokeWeight(1);
        } else {
            fill(0, 80, 20, 30);
            stroke(0, 140, 40, 80);
            strokeWeight(1);
        }
        rect(bx, by, bw, bh, 3);
        noStroke();

        fill(hovered ? color(180, 255, 180) : color(0, 200, 50));
        textSize(15);
        textAlign(LEFT, CENTER);
        text(cheats[i].label, bx - bw / 2 + 14, by);
    }

    noStroke();
    fill(0, 120, 30);
    textAlign(CENTER, CENTER);
    textSize(13);
    text("Press C or Esc to close", panelX, panelTop + panelH - 22);

    pop();
}

function drawCheaterOverlay() {
  push();
  noStroke();
  fill(0, 0, 0, 160);
  rectMode(CORNER);
  rect(0, 0, width, height);

  const panelW = min(420, width - 60);
  const panelH = 140;
  const panelX = width / 2;
  const panelY = height / 2;
  const panelTop = panelY - panelH / 2;

  rectMode(CENTER);
  fill(14, 4, 4);
  rect(panelX, panelY, panelW, panelH, 6);

  const flicker = sin(frameCount * 0.18) * 18 + 200;
  stroke(flicker, 0, 0, 180);
  strokeWeight(2);
  noFill();
  rect(panelX, panelY, panelW - 8, panelH - 8, 4);

  noStroke();
  for (let sy = panelTop + 4; sy < panelTop + panelH - 4; sy += 4) {
    fill(0, 0, 0, 28);
    rectMode(CORNER);
    rect(panelX - panelW / 2 + 4, sy, panelW - 8, 2);
  }
  rectMode(CENTER);

  noStroke();
  fill(200, 0, 0);
  textAlign(CENTER, CENTER);
  textSize(12);
  text("[ HACKER MENU USED ]", panelX, panelTop + 30);

  textSize(52);
  fill(220, 0, 0);
  text("YOU CHEATED", panelX + 3, panelTop + 95 + 3);

  pop();
}

function handleCheatMenuMousePressed() {
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

function handleCheatMenuDraw() {
    level.drawBackground();
    camera.apply();
    level.drawWorld();
    player.draw();
    camera.reset();
    level.drawHUD(player);
    drawCheatMenuOverlay();
}