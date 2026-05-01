function getLevel2Template() {

  // ── SECTION 1: PARKOUR ────────────────────────────────────────────────────
  const leftLow   = new MovingPlatform(1510, height - 330, 180, 32, brickTileImage, "y", 200, 1.5, false);
  const leftHigh  = new MovingPlatform(1510, height - 570, 180, 32, brickTileImage, "y", 200, 1.5, false);
  const rightLow  = new MovingPlatform(1900, height - 450, 180, 32, brickTileImage, "y", 200, 1.5, true);
  const rightHigh = new MovingPlatform(1900, height - 690, 180, 32, brickTileImage, "y", 200, 1.5, true);

  // ── SECTION 2: FLAPPY BIRD GAUNTLET ──────────────────────────────────────
  // Long floating platform player lands on after the parkour (x: 2000–3200)
  const longPlatform = new BrickPlatform(2600, height - 770, 1200, 32, brickTileImage);

  // Five flappy-bird style column pairs — 32px wide, 200px apart.
  // Lower columns vary in height so each gap sits at a different vertical level.
  // Upper columns are 800px tall so their tops are never visible when jumping.
  // Gap is always 140px (player is 120px tall — tight but passable).
  //
  // Pair 1 (x=2150): lower h=64  → gap height-850  to height-990  (low, tiny jump)
  // Pair 2 (x=2350): lower h=224 → gap height-1010 to height-1150 (high, big jump)
  // Pair 3 (x=2550): lower h=128 → gap height-914  to height-1054 (mid)
  // Pair 4 (x=2750): lower h=256 → gap height-1042 to height-1182 (highest)
  // Pair 5 (x=2950): lower h=96  → gap height-882  to height-1022 (low-mid)
  const fbLow1  = new HarmfulPlatform(2150, height - 818,  32,  64);
  const fbHigh1 = new HarmfulPlatform(2150, height - 1390, 32, 800);
  const fbLow2  = new HarmfulPlatform(2350, height - 898,  32, 224);
  const fbHigh2 = new HarmfulPlatform(2350, height - 1550, 32, 800);
  const fbLow3  = new HarmfulPlatform(2550, height - 850,  32, 128);
  const fbHigh3 = new HarmfulPlatform(2550, height - 1454, 32, 800);
  const fbLow4  = new HarmfulPlatform(2750, height - 914,  32, 256);
  const fbHigh4 = new HarmfulPlatform(2750, height - 1582, 32, 800);
  const fbLow5  = new HarmfulPlatform(2950, height - 834,  32,  96);
  const fbHigh5 = new HarmfulPlatform(2950, height - 1422, 32, 800);

  // ── SECTION 3: BOX PUZZLE ─────────────────────────────────────────────────
  // Shifted right to make room for the gauntlet above.
  const boxPlatform    = new BrickPlatform(3620, height - 770, 240, 32, brickTileImage);
  const movingX        = new MovingPlatform(3836, height - 770, 192, 32, brickTileImage, "x", 500, 2, false);
  const farPlatform    = new BrickPlatform(4556, height - 770, 240, 32, brickTileImage);
  const buttonPlatform = new BrickPlatform(4086, height - 516, 192, 32, brickTileImage);

  const exitDoor     = new Door(4556, height - 851, 75, 130);
  exitDoor.isVisible = false;

  const exitButton = new Button(
    4086, height - 540, 128, 18,
    () => { exitDoor.isVisible = true;  },
    () => { exitDoor.isVisible = false; }
  );

  // ── PLATFORMS ─────────────────────────────────────────────────────────────
  const platforms = [
    new BrickPlatform(320,  height - 120, 64, 64, brickTileImage),
    new BrickPlatform(560,  height - 185, 64, 64, brickTileImage),
    new BrickPlatform(430,  height - 245, 64, 64, brickTileImage),
    new BrickPlatform(700,  height - 300, 64, 64, brickTileImage),
    new BrickPlatform(980,  height - 340, 64, 64, brickTileImage),
    leftLow, leftHigh, rightLow, rightHigh,
    longPlatform,
    fbLow1, fbHigh1, fbLow2, fbHigh2, fbLow3, fbHigh3, fbLow4, fbHigh4, fbLow5, fbHigh5,
    boxPlatform, movingX, farPlatform, buttonPlatform,
  ];

  // ── ITEMS ─────────────────────────────────────────────────────────────────
  const items = [
    new Items(220, height - 40, "potion"),
    // Dash ability at the start of the long platform so the player has it for the gauntlet
    new Items(2050, height - 806, "dashAbility"),
  ];

  // ── TRAPS ─────────────────────────────────────────────────────────────────
  const traps = [];

  // ── BOXES ─────────────────────────────────────────────────────────────────
  const boxes = [
    new Box(3620, height - 806, 40),
  ];

  // ── BUTTONS ───────────────────────────────────────────────────────────────
  const buttons = [exitButton];

  // ── ENEMIES ───────────────────────────────────────────────────────────────
  const enemies = [];

  // ── DOORS ─────────────────────────────────────────────────────────────────
  const doors = [exitDoor];

  // ── PITS ──────────────────────────────────────────────────────────────────
  const pits = [
    [11, 2200],
    [2200, 3400],
  ];

  // ── TERRAIN ───────────────────────────────────────────────────────────────
  const terrain = [];
  const pipePuzzles = [];

  return [
    platforms,
    items,
    traps,
    boxes,
    buttons,
    enemies,
    doors,
    pits,
    terrain,
    pipePuzzles,
  ];
}
