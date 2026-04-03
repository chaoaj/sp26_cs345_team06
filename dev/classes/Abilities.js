class Ability {
  constructor(name, description = "", applyEffect = null) {
    this.name = name;
    this.description = description;
    this.applyEffect = applyEffect;
  }

  applyTo(player) {
    if (typeof this.applyEffect === "function") {
      this.applyEffect(player);
    }
  }
}

class StatAbility extends Ability {
  constructor(name, statChanges = {}, description = "") {
    super(name, description);
    this.statChanges = statChanges;
  }

  applyTo(player) {
    for (const [stat, delta] of Object.entries(this.statChanges)) {
      if (typeof player[stat] !== "number") {
        continue;
      }

      player[stat] += delta;
    }

    if (typeof player.health === "number" && typeof player.maxHealth === "number") {
      player.health = Math.min(player.health, player.maxHealth);
    }
  }
}
