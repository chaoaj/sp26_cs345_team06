function getLevel1Template() {

  const platforms = [
    new BrickPlatform(450, height - 120, 160, 32, brickPlatformImage),
    new Platform(650, height - 185, 160, 32, brickPlatformImage),
    new MovingPlatform(1100, height - 185, 160, 32, brickPlatformImage, "x", 600, 3, true),
  ];

  const items = [
    new Items(220, height - 40, "potion"),
    new Items(200, height - 40, "feather"),
    new Items(100, height - 40, "dashAbility"),
    new Items(80, height - 40, "doubleJumpAbility"),

  ];

  const traps = [
    
  ];

  const boxes = [

  ];

  const buttons = [

  ];

  const enemies = [
    new RangedHostile(700, height - 40, 44, 44, 1.1, 620, 820, 1, 280, 1100, 5.5, 1),
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
