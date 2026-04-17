function getLevel3Template() {
  const level3Platforms = [
    // Connected moving staircase with larger gaps and varied step sizes.
    new MovingPlatform(260, height - 150, 220, 30, brickPlatformImage, "x", 60, 1.2, false),
    new MovingPlatform(520, height - 220, 160, 30, brickPlatformImage, "x", 60, 1.2, true),
    new MovingPlatform(800, height - 290, 200, 30, brickPlatformImage, "x", 60, 1.2, false),
    new MovingPlatform(1080, height - 360, 140, 30, brickPlatformImage, "x", 60, 1.2, true),
    new MovingPlatform(1370, height - 430, 210, 30, brickPlatformImage, "x", 60, 1.2, false),
    new MovingPlatform(1660, height - 500, 170, 30, brickPlatformImage, "x", 60, 1.2, true),
    new MovingPlatform(1940, height - 420, 230, 30, brickPlatformImage, "y", 80, 1, false),
    new MovingPlatform(2200, height - 320, 180, 30, brickPlatformImage, "x", 220, 2, true),
    new MovingPlatform(2480, height - 190, 150, 30, brickPlatformImage, "y", 150, 1.6, false),
  ];

  const level3Items = [
    new Items(770, height - 420, "health"),
    new Items(1030, height - 35, "feather"),
    new Items(510, height - 310, "shield"),
    new Items(1290, height - 200, "potion"),
  ];

  const level3Traps = [
    new SpikeTrap(880, height - 45, 120, 40),
    new LaserTrap(640, height - 305, 170, 14),
  ];

  const level3Boxes = [
    new Box(580, height - 340, 50),
  ];

  const level3Buttons = [
    new Button(1180, height - 35, 80, 20, () => console.log("level 3 button pressed")),
  ];

  const level3Enemies = [
    new Hostile(1030, height - 315, 40, 40, 1.7, 940, 1120),
  ];

  const level3Doors = [];

  return [
    level3Platforms,
    level3Items,
    level3Traps,
    level3Boxes,
    level3Buttons,
    level3Enemies,
    level3Doors,
  ];
}
