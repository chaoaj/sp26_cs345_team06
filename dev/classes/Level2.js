function getLevel2Template() {
  // Vertical mover gauntlet: two columns of platforms (left x=1510, right x=1900).
  // Within each column the platforms are at different heights and move in the same phase,
  // so each side rises/falls together.
  const leftLow   = new MovingPlatform(1510, height - 330, 180, 30, brickPlatformImage, "y", 200, 1.5, false);
  const leftHigh  = new MovingPlatform(1510, height - 570, 180, 30, brickPlatformImage, "y", 200, 1.5, false);
  const rightLow  = new MovingPlatform(1900, height - 450, 180, 30, brickPlatformImage, "y", 200, 1.5, true);
  const rightHigh = new MovingPlatform(1900, height - 690, 180, 30, brickPlatformImage, "y", 200, 1.5, true);

  const level2Platforms = [
    // Simple lead-in jumps before the gauntlet starts (zig-zag x pattern).
    new Platform(320, height - 120, 60, 60, brickPlatformImage), // simple box jumps 1
    new Platform(560, height - 185, 60, 60, brickPlatformImage), // simple box jumps 2
    new Platform(430, height - 245, 60, 60, brickPlatformImage), // simple box jumps 3
    new Platform(700, height - 300, 60, 60, brickPlatformImage), // simple box jumps 4
    new Platform(980, height - 340, 60, 60, brickPlatformImage), // simple box jumps 5
    // Left column (x=1510): two platforms at different heights, same phase.
    leftLow,
    leftHigh,
    // Right column (x=1900): two platforms at different heights, same phase.
    rightLow,
    rightHigh,
    // Top landing platform — reachable only from rightHigh at the top of its arc.
    new Platform(2180, height - 770, 240, 30, brickPlatformImage),
  ];

  const level2Items = [
    // Speed pickup near the spawn/start of the level.
    new Items(220, height - 40, "potion"),
    // Dash unlock at the gauntlet finish near the door.
    new Items(2260, height - 805, "dashAbility"),
  ];

  const level2Traps = [
    // TODO: add Level 2 traps
  ];

  const level2Boxes = [
    // TODO: add Level 2 boxes
  ];

  const level2Buttons = [
    // TODO: add Level 2 buttons
  ];

  const level2Enemies = [
    // TODO: add Level 2 enemies
  ];

  const level2Doors = [
    new Door(2260, height - 770 - 65, 75, 100),
  ];

  const level2Pits = [
    // Extended pit: starts shortly after the potion and runs a little past the gauntlet.
    // Format: [startTileIndex, tileCount]
    [11, 56],
  ];

  const level2Terrain = [
    new Terrain(0, height - 50, width, 50, step2)
  ]

  return [
    level2Platforms,
    level2Items,
    level2Traps,
    level2Boxes,
    level2Buttons,
    level2Enemies,
    level2Doors,
    level2Pits,
    level2Terrain
  ];
}
