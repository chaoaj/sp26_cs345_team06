function getTestLevelTemplate() {

  // ── PLATFORMS ─────────────────────────────────────────────────────────────
  const platforms = [
    // Stepping stones for navigating around walls
    new BrickPlatform(350,  height - 190, 128, 32, brickTileImage),
    new BrickPlatform(750,  height - 360, 160, 32, brickTileImage),
    new BrickPlatform(1120, height - 300, 128, 32, brickTileImage),
    new BrickPlatform(1600, height - 200, 224, 32, brickTileImage),

    // ── HARMFUL WALLS ───────────────────────────────────────────────────────
    // Wall 1: short grounded wall — jump over it
    new HarmfulPlatform(540,  height - 112, 32, 224),
    // Wall 2: floating wall — use stepping stone above to pass over
    new HarmfulPlatform(900,  height - 360, 32, 224),
    // Wall 3: tall grounded wall — needs the stepping stone at x=1120 to clear
    new HarmfulPlatform(1250, height - 160, 32, 320),
    // Wall 4: two grounded walls forming a 128px passage — thread through carefully
    new HarmfulPlatform(1430, height - 96,  32, 192),
    new HarmfulPlatform(1590, height - 96,  32, 192),
  ];

  // ── ITEMS ─────────────────────────────────────────────────────────────────
  const items = [
    new Items(200,  height - 40, "potion"),
    new Items(1800, height - 40, "potion"),
  ];

  return [
    platforms,  // [0]
    items,      // [1]
    [],         // [2] traps
    [],         // [3] boxes
    [],         // [4] buttons
    [],         // [5] enemies
    [],         // [6] doors
    [],         // [7] pits  — solid floor everywhere
    [],         // [8] terrain
  ];
}
