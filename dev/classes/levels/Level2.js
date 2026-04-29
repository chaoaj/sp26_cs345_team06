function getLevel2Template() {

  // ── SECTION 1: PARKOUR ────────────────────────────────────────────────────
  const leftLow   = new MovingPlatform(1510, height - 330, 180, 32, brickTileImage, "y", 200, 1.5, false);
  const leftHigh  = new MovingPlatform(1510, height - 570, 180, 32, brickTileImage, "y", 200, 1.5, false);
  const rightLow  = new MovingPlatform(1900, height - 450, 180, 32, brickTileImage, "y", 200, 1.5, true);
  const rightHigh = new MovingPlatform(1900, height - 690, 180, 32, brickTileImage, "y", 200, 1.5, true);

  // ── SECTION 2: BOX PUZZLE ─────────────────────────────────────────────────
  // Floating platform with box
  const boxPlatform = new BrickPlatform(2180, height - 770, 240, 32, brickTileImage);

  // Moving platform
  const movingX = new MovingPlatform(2396, height - 770, 192, 32, brickTileImage, "x", 500, 2, false);


  const farPlatform = new BrickPlatform(3116, height - 770, 240, 32, brickTileImage);

  // Button platform
  const buttonPlatform = new BrickPlatform(2646, height - 516, 192, 32, brickTileImage);

  const exitDoor     = new Door(3116, height - 851, 75, 130);
  exitDoor.isVisible = false;

  const exitButton = new Button(
    2646, height - 540, 128, 18,
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
    boxPlatform,
    movingX,
    farPlatform,
    buttonPlatform,
  ];

  // ── ITEMS ─────────────────────────────────────────────────────────────────
  const items = [
    new Items(220, height - 40, "potion"),
    // Dash ability next to the box on the same platform
    new Items(2180 + 50, height - 806, "dashAbility"),
  ];

  // ── TRAPS ─────────────────────────────────────────────────────────────────
  const traps = [];

  // ── BOXES ─────────────────────────────────────────────────────────────────
  const boxes = [
    new Box(2180, height - 806, 40),
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
  const pipePuzzles = []
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
    pipePuzzles

  ];
}
