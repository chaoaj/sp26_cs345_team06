function getLevel1Template() {
  const movingPlatformPuzzle = new BrickPlatform(3448 + 16, height - 380, 32, 320, brickTileImage)
  const platforms = [
    new BrickPlatform(650, height - 120, 160, 32, brickTileImage),
    new BrickPlatform(850, height - 185, 160, 32, brickTileImage),
    new MovingPlatform(1200, height - 185, 160, 32, brickTileImage, "x", 900, 3, true),
    new BrickPlatform(2300, height - 185, 160, 32, brickTileImage),
    new MovingPlatform(2765, height - 200, 130, 32, brickTileImage, "y", 150, 1),
    new BrickPlatform(2900, height - 210, 128, 32, brickTileImage),
    new BrickPlatform(3100, height - 240, 128, 32, brickTileImage),
    new BrickPlatform(3300, height - 270, 128, 32, brickTileImage),
    movingPlatformPuzzle,
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
    new SinglePressButton(
      3300,
      height - 35,
      80,
      20,
      () => {
        for (let i = 0; i < 320; i++) {
          setTimeout(() => {
            movingPlatformPuzzle.y += 1;
          }, i * 15);
        }
      }
    ),
  ];

  const enemies = [
    new Hostile(3600, height - 248, 40, 40, 1.6, 3500, 3900),
  ];

  const spawnDoor1 = new Door(width * 0.12, height - 76, 75, 100);
  spawnDoor1.isVisible = false;
  const doors = [
    spawnDoor1,
    new Door(4000, height - 278, 75, 100),
  ];

  const pits = [
<<<<<<< Updated upstream
    [35, 44],
=======
    [36, 40],
    [85, 4],   // pit under the vertical moving platform (x=2750, w=128)
>>>>>>> Stashed changes
  ];

  const terrain = [
    new Terrain(1026, height - 72, 192, 256, step4),
    new Terrain(2592, height - 100, 192, 256, step4),

    new Terrain(3800, height - 100, 704, 256, box4long),
  ]
<<<<<<< Updated upstream
  const pipePuzzles = [
    // new Pipe(200, height-50, 64, 64, "straight", 0),
    // new Pipe(564, 200, 64, 64, "elbow", 1),
    // new Pipe(564, 264, 64, 64, "t", 2),
    // new Pipe(500, 264, 64, 64, "quad", 0),
  ]
=======
  const pipePuzzles = []
>>>>>>> Stashed changes

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
