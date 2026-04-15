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

  static getRegistry() {
    if (!Ability.playerAbilities) {
      Ability.playerAbilities = new WeakMap();
    }

    return Ability.playerAbilities;
  }

  static getPlayerAbilityMap(player) {
    if (!player) {
      return null;
    }

    const registry = Ability.getRegistry();
    if (!registry.has(player)) {
      registry.set(player, new Map());
    }

    return registry.get(player);
  }

  static grant(player, ability) {
    if (!player || !ability || !ability.name) {
      return false;
    }

    const abilityMap = Ability.getPlayerAbilityMap(player);
    if (abilityMap.has(ability.name)) {
      return false;
    }

    abilityMap.set(ability.name, ability);
    ability.applyTo(player);
    return true;
  }

  static has(player, abilityName) {
    if (!player || !abilityName) {
      return false;
    }

    const abilityMap = Ability.getRegistry().get(player);
    return !!(abilityMap && abilityMap.has(abilityName));
  }

  static canDoubleJump(player) {
    return (
      Ability.has(player, "doubleJump") ||
      (typeof player?.maxAirJumps === "number" && player.maxAirJumps > 0)
    );
  }

  static canDash(player) {
    return Ability.has(player, "dash") || !!player?.canDash;
  }

  static calculateDashStep(player, context) {

    const {
      dashPressed = false,
      movingLeft = false,
      movingRight = false,
      now = 0,
    } = context || {};

    const dashSpeed = typeof player?.dashSpeed === "number" ? player.dashSpeed : 14;
    const groundDashMultiplier = typeof player?.groundDashMultiplier === "number" ? player.groundDashMultiplier : 1.4;
    const dashDurationMs = typeof player?.dashDurationMs === "number" ? player.dashDurationMs : 140;
    const dashCooldownMs = typeof player?.dashCooldownMs === "number" ? player.dashCooldownMs : 450;

    if (typeof player.isDashing !== "boolean") {
      player.isDashing = false;
    }
    if (typeof player.dashDirection !== "number" || !isFinite(player.dashDirection) || player.dashDirection === 0) {
      player.dashDirection = player.facingLeft ? -1 : 1;
    }
    if (typeof player.dashEndsAt !== "number") {
      player.dashEndsAt = 0;
    }
    if (typeof player.dashCooldownUntil !== "number") {
      player.dashCooldownUntil = 0;
    }

    if (player.isDashing && now >= player.dashEndsAt) {
      player.isDashing = false;
    }

    const unlocked = Ability.canDash(player);
    if (unlocked && dashPressed && !player.isDashing && now >= player.dashCooldownUntil) {
      if (movingLeft && !movingRight) {
        player.dashDirection = -1;
      } else if (movingRight && !movingLeft) {
        player.dashDirection = 1;
      } else {
        player.dashDirection = player.facingLeft ? -1 : 1;
      }

      player.isDashing = true;
      player.dashEndsAt = now + dashDurationMs;
      player.dashCooldownUntil = now + dashCooldownMs;
      player.jumpMomentumX = 0;
    }

    if (!player.isDashing) {
      return 0;
    }

    const effectiveDashSpeed = player.isOnGround ? dashSpeed * groundDashMultiplier : dashSpeed;
    return player.dashDirection * effectiveDashSpeed;
  }

  static tryPerformJump(player, context) {
    const {
      jumpPressed = false,
      hasBufferedJump = false,
      movingLeft = false,
      movingRight = false,
      directionalBoost = 1.8,
    } = context || {};

    const maxAirJumps = typeof player?.maxAirJumps === "number" ? player.maxAirJumps : 1;
    if (typeof player.remainingAirJumps !== "number" || player.remainingAirJumps < 0) {
      player.remainingAirJumps = maxAirJumps;
    }

    const triggerJump = () => {
      player.yVelocity = -player.jumpStrength;
      if (movingLeft && !movingRight) {
        player.jumpMomentumX = -directionalBoost;
      } else if (movingRight && !movingLeft) {
        player.jumpMomentumX = directionalBoost;
      } else {
        player.jumpMomentumX = 0;
      }
      player.isOnGround = false;
    };

    if (hasBufferedJump && player.isOnGround) {
      triggerJump();
      player.jumpBufferUntil = 0;
      return true;
    }

    if (Ability.canDoubleJump(player) && jumpPressed && !player.isOnGround && player.remainingAirJumps > 0) {
      triggerJump();
      player.remainingAirJumps -= 1;
      return true;
    }

    return false;
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

const DOUBLE_JUMP_ABILITY = new Ability(
  "doubleJump",
  "Allows one extra jump while airborne.",
  (player) => {
    player.maxAirJumps = 1;
    player.remainingAirJumps = player.maxAirJumps;
  }
);

const DASH_ABILITY = new Ability(
  "dash",
  "Press [Left Shift] to dash horizontally in your movement direction.",
  (player) => {
    player.canDash = true;
  }
);
