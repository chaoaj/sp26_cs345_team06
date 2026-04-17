class PauseMenu {
  constructor() {
    this.resetButtonBounds = null;
    this.musicToggleBounds = null;
    this.musicDownBounds = null;
    this.musicUpBounds = null;

    this.musicVolumeLevel = 0.8;
    this.musicMuted = false;
  }

  applyMusicVolume(backgroundTrack, finalTrack) {
    const effectiveVolume = this.musicMuted ? 0 : this.musicVolumeLevel;

    if (backgroundTrack && typeof backgroundTrack.setVolume === "function") {
      backgroundTrack.setVolume(effectiveVolume);
    }

    if (finalTrack && typeof finalTrack.setVolume === "function") {
      finalTrack.setVolume(effectiveVolume);
    }
  }

  draw(player) {
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
    const basePanelH = 390;
    const panelH = min(height - 20, basePanelH + max(0, abilityLabels.length - 1) * abilityLineHeight);
    const panelW = min(520, width - 60);
    const panelX = width / 2;
    const panelY = height / 2;
    const panelTop = panelY - panelH / 2;
    const titleY = panelTop + 58;
    const subtitleY = titleY + 52;
    const hintY = subtitleY + 42;
    const musicToggleY = hintY + 38;
    const volumeRowY = musicToggleY + 42;
    const abilityHeaderY = volumeRowY + 42;
    const firstAbilityY = abilityHeaderY + 34;

    const musicToggleW = 200;
    const musicToggleH = 34;
    const musicButtonSize = 34;

    const musicToggleHovered =
      mouseX >= panelX - musicToggleW / 2 &&
      mouseX <= panelX + musicToggleW / 2 &&
      mouseY >= musicToggleY - musicToggleH / 2 &&
      mouseY <= musicToggleY + musicToggleH / 2;

    const musicDownX = panelX - 96;
    const musicUpX = panelX + 96;
    const musicDownHovered =
      mouseX >= musicDownX - musicButtonSize / 2 &&
      mouseX <= musicDownX + musicButtonSize / 2 &&
      mouseY >= volumeRowY - musicButtonSize / 2 &&
      mouseY <= volumeRowY + musicButtonSize / 2;
    const musicUpHovered =
      mouseX >= musicUpX - musicButtonSize / 2 &&
      mouseX <= musicUpX + musicButtonSize / 2 &&
      mouseY >= volumeRowY - musicButtonSize / 2 &&
      mouseY <= volumeRowY + musicButtonSize / 2;

    const resetButtonW = 190;
    const resetButtonH = 44;
    const resetButtonX = panelX;
    const resetButtonY = panelY + panelH / 2 - 34;
    const resetButtonHovered =
      mouseX >= resetButtonX - resetButtonW / 2 &&
      mouseX <= resetButtonX + resetButtonW / 2 &&
      mouseY >= resetButtonY - resetButtonH / 2 &&
      mouseY <= resetButtonY + resetButtonH / 2;

    this.resetButtonBounds = {
      x: resetButtonX,
      y: resetButtonY,
      w: resetButtonW,
      h: resetButtonH,
    };

    this.musicToggleBounds = {
      x: panelX,
      y: musicToggleY,
      w: musicToggleW,
      h: musicToggleH,
    };

    this.musicDownBounds = {
      x: musicDownX,
      y: volumeRowY,
      w: musicButtonSize,
      h: musicButtonSize,
    };

    this.musicUpBounds = {
      x: musicUpX,
      y: volumeRowY,
      w: musicButtonSize,
      h: musicButtonSize,
    };

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
    textSize(18);
    text("Press P or Esc to resume", panelX, hintY);

    // Music controls
    rectMode(CENTER);
    noStroke();
    fill(musicToggleHovered ? color(80, 109, 167) : color(64, 91, 145));
    rect(panelX, musicToggleY, musicToggleW, musicToggleH, 8);

    fill(255);
    textSize(16);
    text(this.musicMuted ? "Music: Off" : "Music: On", panelX, musicToggleY + 1);

    fill(musicDownHovered ? color(80, 109, 167) : color(64, 91, 145));
    rect(musicDownX, volumeRowY, musicButtonSize, musicButtonSize, 8);
    fill(255);
    textSize(22);
    text("-", musicDownX, volumeRowY + 1);

    fill(musicUpHovered ? color(80, 109, 167) : color(64, 91, 145));
    rect(musicUpX, volumeRowY, musicButtonSize, musicButtonSize, 8);
    fill(255);
    textSize(22);
    text("+", musicUpX, volumeRowY + 1);

    const volumePercent = round(this.musicVolumeLevel * 100);
    textSize(16);
    text(`Volume: ${volumePercent}%`, panelX, volumeRowY + 1);

    fill(170, 182, 205);
    textSize(15);
    text("Unlocked Abilities", panelX, abilityHeaderY);

    fill(255);
    textSize(17);
    for (let i = 0; i < abilityLabels.length; i++) {
      text(abilityLabels[i], panelX, firstAbilityY + i * abilityLineHeight, panelW - 48);
    }

    // Reset button
    rectMode(CENTER);
    noStroke();
    fill(resetButtonHovered ? color(215, 70, 70) : color(180, 52, 52));
    rect(resetButtonX, resetButtonY, resetButtonW, resetButtonH, 10);

    fill(255);
    textSize(18);
    text("Reset To Title", resetButtonX, resetButtonY + 1);
    pop();
  }

  isInside(bounds, x, y) {
    if (!bounds) {
      return false;
    }

    return (
      x >= bounds.x - bounds.w / 2 &&
      x <= bounds.x + bounds.w / 2 &&
      y >= bounds.y - bounds.h / 2 &&
      y <= bounds.y + bounds.h / 2
    );
  }

  handleMousePressed(x, y, onReset) {
    if (this.isInside(this.musicToggleBounds, x, y)) {
      this.musicMuted = !this.musicMuted;
      return true;
    }

    if (this.isInside(this.musicDownBounds, x, y)) {
      this.musicVolumeLevel = max(0, round((this.musicVolumeLevel - 0.1) * 10) / 10);
      if (this.musicVolumeLevel === 0) {
        this.musicMuted = true;
      } else if (this.musicMuted) {
        this.musicMuted = false;
      }
      return true;
    }

    if (this.isInside(this.musicUpBounds, x, y)) {
      this.musicVolumeLevel = min(1, round((this.musicVolumeLevel + 0.1) * 10) / 10);
      this.musicMuted = false;
      return true;
    }

    if (this.isInside(this.resetButtonBounds, x, y)) {
      if (typeof onReset === "function") {
        onReset();
      }
      return true;
    }

    return false;
  }
}
