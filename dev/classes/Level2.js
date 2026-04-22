function getLevel2Template() {
  // Vertical mover gauntlet: two columns of platforms (left x=1510, right x=1900).
  // Within each column the platforms are at different heights and move in the same phase,
  // so each side rises/falls together.
  const leftLow   = new MovingPlatform(1510, height - 330, 180, 30, brickPlatformImage, "y", 200, 1.5, false);
  const leftHigh  = new MovingPlatform(1510, height - 570, 180, 30, brickPlatformImage, "y", 200, 1.5, false);
  const rightLow  = new MovingPlatform(1900, height - 450, 180, 30, brickPlatformImage, "y", 200, 1.5, true);
  const rightHigh = new MovingPlatform(1900, height - 690, 180, 30, brickPlatformImage, "y", 200, 1.5, true);

  const platforms = [
    new Platform(320, height - 120, 60, 60, brickPlatformImage), // simple box jumps 1
    new Platform(560, height - 185, 60, 60, brickPlatformImage), // simple box jumps 2
    new Platform(430, height - 245, 60, 60, brickPlatformImage), // simple box jumps 3
    new Platform(700, height - 300, 60, 60, brickPlatformImage), // simple box jumps 4
    new Platform(980, height - 340, 60, 60, brickPlatformImage), // simple box jumps 5
    leftLow,
    leftHigh,
    rightLow,
    rightHigh,
    new Platform(2180, height - 770, 240, 30, brickPlatformImage),
  ];

  const items = [
    new Items(220, height - 40, "potion"),
    new Items(2260, height - 805, "dashAbility"),
  ];

  const traps = [
    // TODO: add Level 2 traps
  ];

  const boxes = [
    // TODO: add Level 2 boxes
  ];

  const buttons = [
    // TODO: add Level 2 buttons
  ];

  const enemies = [
    // TODO: add Level 2 enemies
  ];

  const doors = [
    new Door(2260, height - 770 - 65, 75, 100),
  ];

  const pits = [

    [11, 56],
  ];

  const terrain = [
    // new Terrain(0, height - 32, 96, 32, step1),
  ]

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
  ];
}
