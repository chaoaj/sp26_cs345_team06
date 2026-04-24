function drawPauseOverlay() {
  push();
  noStroke();
  fill(0, 0, 0, 140);
  rectMode(CORNER);
  rect(0, 0, width, height);

  const formatAbilityName = (abilityName) => {
    if (!abilityName) {
      return "Unknown Ability";
    }

    return abilityName
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (letter) => letter.toUpperCase());
  };

  const unlockedAbilities = typeof Ability !== "undefined"
    ? Ability.getUnlockedAbilities(player)
    : [];
  const abilityLabels = unlockedAbilities.length > 0
    ? unlockedAbilities.map((ability) => formatAbilityName(ability.name))
    : ["None yet"];
  const abilityLineHeight = 28;
  const basePanelH = 320;
  const panelH = min(height - 20, basePanelH + max(0, abilityLabels.length - 1) * abilityLineHeight);
  const panelW = min(520, width - 60);
  const panelX = width / 2;
  const panelY = height / 2;
  const panelTop = panelY - panelH / 2;
  const titleY = panelTop + 58;
  const subtitleY = titleY + 52;
  const hintY = subtitleY + 42;
  const abilityHeaderY = hintY + 48;
  const firstAbilityY = abilityHeaderY + 34;

  rectMode(CENTER);
  fill(26, 31, 46);
  rect(panelX, panelY, panelW, panelH, 18);

  stroke(255, 255, 255, 40);
  strokeWeight(2);
  noFill();
  rect(panelX, panelY, panelW - 12, panelH - 12, 14);

  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(50);
  text("Paused", panelX, titleY);

  fill(210, 218, 235);
  textSize(22);
  text("Game is frozen while paused.", panelX, subtitleY);

  fill(255);
  textSize(24);
  text(`Time: ${formatElapsedTime(getRunElapsedMs())}`, panelX, subtitleY + 36);

  fill(255);
  textSize(18);
  text("Press P or Esc to resume", panelX, hintY + 18);

  fill(170, 182, 205);
  textSize(15);
  text("Unlocked Abilities", panelX, abilityHeaderY);

  fill(255);
  textSize(17);
  for (let i = 0; i < abilityLabels.length; i++) {
    text(abilityLabels[i], panelX, firstAbilityY + i * abilityLineHeight, panelW - 48);
  }
  pop();
}