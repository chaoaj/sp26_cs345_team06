function getLevel3Template() {
  const level3Platforms = [
    // Connected moving staircase with larger gaps and varied step sizes.
    new MovingPlatform(260, height - 150, 220, 30, brickPlatformImage, "x", 60, 1.2, false),
    new MovingPlatform(520, height - 220, 160, 30, brickPlatformImage, "x", 60, 1.2, true),
    new MovingPlatform(800, height - 290, 200, 30, brickPlatformImage, "x", 60, 1.2, false),
    new MovingPlatform(1080, height - 360, 140, 30, brickPlatformImage, "x", 60, 1.2, true),
    new MovingPlatform(1370, height - 430, 210, 30, brickPlatformImage, "x", 60, 1.2, false),
    new MovingPlatform(1660, height - 500, 170, 30, brickPlatformImage, "x", 60, 1.2, true), // end of platform staircase
    new MovingPlatform(1940, height - 560, 230, 30, brickPlatformImage, "y", 80, 1, false),
    // Long stationary platforms at the top of the staircase.
    new Platform(2450, height - 700, 700, 30, brickPlatformImage), // stationary 1
    new Platform(2450, height - 900, 700, 30, brickPlatformImage), // stationary 2
    // Wall blocking the right end of the stationary platforms.
    new Platform(2815, height - 985, 30, 800, brickPlatformImage), // wall S1/s2
  ];

  const level3Items = [
    new Items(770, height - 420, "health"),
    new Items(510, height - 310, "shield"),
    new Items(2750, height - 800, "doubleJumpAbility"),
  ];

  const level3Traps = [
    new SpikeTrap(880, height - 45, 120, 40),
    new LaserTrap(640, height - 305, 170, 14),
    // Two spike sections on stationary 1; gap between them is intended for dash timing.
    new SpikeTrap(2300, height - 735, 140, 40),
    new LaserTrap(2450, height - 805, 14, 180, 1, 2000, 5000, 800, "y"),
    new SpikeTrap(2600, height - 735, 140, 40),
  ];

  const level3Boxes = [
    new Box(2750, height - 930, 30, 30),
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
