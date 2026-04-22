function getLevel2Template() {
  const leftLow   = new MovingPlatform(1510, height - 330, 180, 30, brickPlatformImage, "y", 200, 1.5, false);
  const leftHigh  = new MovingPlatform(1510, height - 570, 180, 30, brickPlatformImage, "y", 200, 1.5, false);
  const rightLow  = new MovingPlatform(1900, height - 450, 180, 30, brickPlatformImage, "y", 200, 1.5, true);
  const rightHigh = new MovingPlatform(1900, height - 690, 180, 30, brickPlatformImage, "y", 200, 1.5, true);

  const platforms = [
    new Platform(320, height - 120, 60, 60, brickPlatformImage),
    new Platform(560, height - 185, 60, 60, brickPlatformImage),
    new Platform(430, height - 245, 60, 60, brickPlatformImage),
    new Platform(700, height - 300, 60, 60, brickPlatformImage),
    new Platform(980, height - 340, 60, 60, brickPlatformImage),
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

  ];

  const boxes = [

  ];

  const buttons = [

  ];

  const enemies = [

  ];

  const doors = [
    new Door(2260, height - 770 - 65, 75, 100),
  ];

  const pits = [

    [11, 56],
  ];

  const terrain = [

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
