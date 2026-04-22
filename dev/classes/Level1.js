function getLevel1Template() {

  const platforms = [
    new Platform(450, height - 120, 160, 30, brickPlatformImage),
    new Platform(650, height - 185, 160, 30, brickPlatformImage),
    new MovingPlatform(1100, height - 185, 160, 30, brickPlatformImage, "x", 600, 3, true),
  ];

  const items = [
    new Items(220, height - 40, "potion"),
    new Items(100, height - 40, "dashAbility"),
    new Items(80, height - 40, "doubleJumpAbility"),

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
    [29, 56],
  ];

  const terrain = [
    new Terrain(826, height - 72, 192, 256, step4),
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
