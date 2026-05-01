const levelUpAbilities = [
  {
    id: "maxHealth",
    name: "Max Health",
    description: "Gain +1 maximum heart.",
    stackable: true,
  },
  {
    id: "pitInsurance",
    name: "Pit Insurance",
    description: "Once per level, falling into a pit does not cost health.",
    stackable: false,
  },
  {
    id: "stompHeal",
    name: "Stomp Heal",
    description: "Stomping an enemy has a chance to heal 1 heart.",
    stackable: true,
  },
  {
    id: "healthyStart",
    name: "Healthy Start",
    description: "Start each level with +1 temporary heart.",
    stackable: false,
  },
  {
    id: "emergencyShield",
    name: "Emergency Shield",
    description: "Once per level, dropping to low health grants a brief shield.",
    stackable: false,
  },
  {
    id: "longerDash",
    name: "Longer Dash",
    description: "Dash travels farther.",
    stackable: true,
  },
  {
    id: "bonusHeart",
    name: "Bonus Heart",
    description: "Heart pickups heal +1 extra heart.",
    stackable: false,
  },
  {
    id: "longerEffects",
    name: "Longer Effects",
    description: "Timed item effects last 25% longer.",
    stackable: true,
  },
  {
    id: "strongerPickups",
    name: "Stronger Pickups",
    description: "Item effects are 25% stronger.",
    stackable: true,
  },
];

let levelUpChoices = [];
let pendingLevelUpTargetLevel = null;

function getPlayerLevelUpRanks(player) {
  if (!player) {
    return {};
  }

  if (!player.levelUpAbilityRanks) {
    player.levelUpAbilityRanks = {};
  }

  return player.levelUpAbilityRanks;
}

function getLevelUpAbilityRank(player, abilityId) {
  const ranks = getPlayerLevelUpRanks(player);
  return ranks[abilityId] || 0;
}

function hasLevelUpAbility(player, abilityId) {
  return getLevelUpAbilityRank(player, abilityId) > 0;
}

function getAvailableLevelUpAbilities(player) {
  return levelUpAbilities.filter((ability) => {
    return ability.stackable || !hasLevelUpAbility(player, ability.id);
  });
}

function getRandomLevelUpChoices(player, count = 3) {
  const available = [...getAvailableLevelUpAbilities(player)];
  const choices = [];

  while (available.length > 0 && choices.length < count) {
    const index = Math.floor(Math.random() * available.length);
    choices.push(available.splice(index, 1)[0]);
  }

  return choices;
}

function grantLevelUpAbility(player, ability) {
  if (!player || !ability) {
    return false;
  }

  const ranks = getPlayerLevelUpRanks(player);
  const currentRank = ranks[ability.id] || 0;
  if (!ability.stackable && currentRank > 0) {
    return false;
  }

  ranks[ability.id] = currentRank + 1;

  if (ability.id === "maxHealth") {
    player.maxHealth += 1;
    player.health = Math.min(player.maxHealth, player.health + 1);
  }

  if (ability.id === "longerDash") {
    player.dashDurationMs += 25;
  }

  if (ability.id === "healthyStart") {
    applyHealthyStart(player);
  }

  return true;
}

function resetLevelUpAbilityUses(player) {
  if (!player) {
    return;
  }

  player.usedPitInsuranceThisLevel = false;
  player.usedEmergencyShieldThisLevel = false;
  applyHealthyStart(player);
}

function applyHealthyStart(player) {
  if (!hasLevelUpAbility(player, "healthyStart")) {
    return;
  }

  player.temporaryHealth = Math.max(player.temporaryHealth || 0, 1);
}

function getItemEffectMultiplier(player) {
  return 1 + getLevelUpAbilityRank(player, "strongerPickups") * 0.25;
}

function getTimedEffectMultiplier(player) {
  return 1 + getLevelUpAbilityRank(player, "longerEffects") * 0.25;
}

function tryUsePitInsurance(player) {
  if (!hasLevelUpAbility(player, "pitInsurance") || player.usedPitInsuranceThisLevel) {
    return false;
  }

  player.usedPitInsuranceThisLevel = true;
  return true;
}

function tryApplyStompHeal(player) {
  const rank = getLevelUpAbilityRank(player, "stompHeal");
  if (rank <= 0 || !player || player.health >= player.maxHealth) {
    return;
  }

  const healChance = Math.min(0.75, 0.25 * rank);
  if (Math.random() < healChance) {
    player.gainHealth(1);
  }
}

function tryApplyEmergencyShield(player) {
  if (!hasLevelUpAbility(player, "emergencyShield") || player.usedEmergencyShieldThisLevel) {
    return;
  }

  if (player.health > 0 && player.health <= 1) {
    player.usedEmergencyShieldThisLevel = true;
    player.addShield(2);
  }
}

function getLevelUpChoiceRects() {
  const gap = 24;
  const cardW = Math.min(260, (width - 96) / 3);
  const cardH = 210;
  const totalW = levelUpChoices.length * cardW + Math.max(0, levelUpChoices.length - 1) * gap;
  const startX = width / 2 - totalW / 2 + cardW / 2;
  const y = height / 2 + 30;

  return levelUpChoices.map((ability, index) => ({
    ability,
    x: startX + index * (cardW + gap),
    y,
    w: cardW,
    h: cardH,
  }));
}

function startLevelUpSelection(player, targetLevelNum) {
  levelUpChoices = getRandomLevelUpChoices(player, 3);
  pendingLevelUpTargetLevel = targetLevelNum;

  if (levelUpChoices.length === 0) {
    switchToPendingLevelUpTarget();
    return false;
  }

  pauseStartedAt = millis();
  gameState = "levelUp";
  return true;
}

function switchToPendingLevelUpTarget() {
  const targetLevelNum = pendingLevelUpTargetLevel;
  pendingLevelUpTargetLevel = null;
  levelUpChoices = [];

  if (targetLevelNum != null) {
    switchToLevel(targetLevelNum);
    if (targetLevelNum === levels.length) {
      gameState = "endgame";
    } else {
      gameState = "playing";
    }
  }
}

function handleLevelUpClick(mx, my) {
  for (const choice of getLevelUpChoiceRects()) {
    if (
      mx >= choice.x - choice.w / 2 && mx <= choice.x + choice.w / 2 &&
      my >= choice.y - choice.h / 2 && my <= choice.y + choice.h / 2
    ) {
      grantLevelUpAbility(player, choice.ability);
      if (pauseStartedAt !== null) {
        accumulatedPauseMs += millis() - pauseStartedAt;
      }
      pauseStartedAt = null;
      switchToPendingLevelUpTarget();
      return true;
    }
  }

  return false;
}

function drawLevelUpOverlay() {
  push();
  noStroke();
  fill(0, 0, 0, 170);
  rectMode(CORNER);
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(38);
  text("Choose an Upgrade", width / 2, height / 2 - 150);

  textSize(18);
  fill(190, 200, 220);
  text("Pick one reward before the next level", width / 2, height / 2 - 112);

  for (const choice of getLevelUpChoiceRects()) {
    const rank = getLevelUpAbilityRank(player, choice.ability.id);
    const hovered =
      mouseX >= choice.x - choice.w / 2 && mouseX <= choice.x + choice.w / 2 &&
      mouseY >= choice.y - choice.h / 2 && mouseY <= choice.y + choice.h / 2;

    rectMode(CENTER);
    fill(hovered ? color(67, 78, 112) : color(35, 42, 64));
    rect(choice.x, choice.y, choice.w, choice.h, 10);

    fill(255);
    textSize(24);
    text(choice.ability.name, choice.x, choice.y - 62, choice.w - 28, 34);

    fill(190, 200, 220);
    textSize(16);
    text(choice.ability.description, choice.x, choice.y + 2, choice.w - 32, 84);

    if (choice.ability.stackable && rank > 0) {
      fill(120, 210, 255);
      textSize(14);
      text(`Current rank: ${rank}`, choice.x, choice.y + 76);
    }
  }

  pop();
}
