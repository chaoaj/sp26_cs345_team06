function getLevel1Template() {

  const platforms = [
    new BrickPlatform(650, height - 120, 160, 32, brickTileImage),
    new BrickPlatform(850, height - 185, 160, 32, brickTileImage),
    new MovingPlatform(1200, height - 185, 160, 32, brickTileImage, "x", 900, 3, true),
    new BrickPlatform(2300, height - 185, 160, 32, brickTileImage),

    new MovingPlatform(2750, height - 200, 128, 32, brickTileImage, "y", 200, 1),
    new BrickPlatform(2900, height - 210, 128, 32, brickTileImage),
    new BrickPlatform(3100, height - 240, 128, 32, brickTileImage),
    new BrickPlatform(3300, height - 270, 128, 32, brickTileImage),
  ];

  const items = [
    // new Items(420, height - 40, "potion"),
    // new Items(400, height - 40, "feather"),
    // new Items(300, height - 40, "dashAbility"),
    // new Items(280, height - 40, "doubleJumpAbility"),

  ];

  const traps = [

  ];

  const boxes = [

  ];

  const buttons = [

  ];

  const enemies = [
    new Hostile(3600, height - 248, 40, 40, 1.6, 3500, 3900),
  ];

  const doors = [
    new Door(4000, height - 278, 75, 100),
  ];

  const pits = [
    [36, 40],
  ];

  const terrain = [
    new Terrain(1026, height - 72, 192, 256, step4),
    new Terrain(2600, height - 100, 192, 256, step4),

    new Terrain(3800, height - 100, 704, 256, box4long),
  ]
  const pipePuzzles = [
    new Pipe(500, 200, 64, 64, "straight", 0),
    new Pipe(564, 200, 64, 64, "elbow", 1),
    new Pipe(564, 264, 64, 64, "t", 2),
    new Pipe(500, 264, 64, 64, "quad", 0),
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
    pipePuzzles,
  ];
}