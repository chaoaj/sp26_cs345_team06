function getLevel3Template() {
  const stairPlatform1 = new MovingPlatform(260, height - 150, 220, 30, brickPlatformImage, "x", 60, 1.2, false);
  const stairPlatform2 = new MovingPlatform(520, height - 220, 160, 30, brickPlatformImage, "x", 60, 1.2, true);
  const stairPlatform3 = new MovingPlatform(800, height - 290, 200, 30, brickPlatformImage, "x", 60, 1.2, false);
  const stairPlatform4 = new MovingPlatform(1080, height - 360, 140, 30, brickPlatformImage, "x", 60, 1.2, true);
  const stairPlatform5 = new MovingPlatform(1370, height - 430, 210, 30, brickPlatformImage, "x", 60, 1.2, false);
  const stairPlatform6 = new MovingPlatform(1660, height - 500, 170, 30, brickPlatformImage, "x", 60, 1.2, true);
  const stairPlatform7 = new MovingPlatform(1940, height - 560, 230, 30, brickPlatformImage, "y", 80, 1, false);

  const level3Platforms = [
    // Connected moving staircase with larger gaps and varied step sizes.
    stairPlatform1,
    stairPlatform2,
    stairPlatform3,
    stairPlatform4,
    stairPlatform5,
    stairPlatform6, // end of platform staircase
    stairPlatform7,
    // Long stationary platforms at the top of the staircase.
    new Platform(2450, height - 700, 700, 30, brickPlatformImage), // stationary 1
    new Platform(2450, height - 900, 700, 30, brickPlatformImage), // stationary 2
    // Double-jump gate at ground level: wall plus elevated platform.
    new Platform(2100, height - 142.5, 30, 285, brickPlatformImage),
    new Platform(2175, height - 300, 180, 30, brickPlatformImage), // double jump platform
    // Post-double-jump section: two vertical movers with large travel, then a final platform.
    new MovingPlatform(2450, height - 430, 180, 30, brickPlatformImage, "y", 260, 1.6, false),
    new MovingPlatform(2720, height - 580, 180, 30, brickPlatformImage, "y", 260, 1.6, true),
    new Platform(2920, height - 620, 220, 30, brickPlatformImage), // final platform / level end
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
    // Two spike sections on stationary 1; gap between them is intended for dash timing.
    new SpikeTrap(2300, height - 735, 140, 40),
    new LaserTrap(2450, height - 805, 14, 180, 1, 2000, 5000, 800, "y"), // V Laser on S1
    new SpikeTrap(2600, height - 735, 140, 40),
  ];

  const movingTrapA = new SpikeTrap(0, 0, 90, 35);
  movingTrapA.attachToPlatform(stairPlatform3, 0, -(stairPlatform3.h + movingTrapA.h) / 2);
  level3Traps.push(movingTrapA);

  const movingTrapB = new SpikeTrap(0, 0, 90, 35);
  movingTrapB.attachToPlatform(stairPlatform5, 0, -(stairPlatform5.h + movingTrapB.h) / 2);
  level3Traps.push(movingTrapB);

  const level3Boxes = [
    new Box(2750, height - 930, 30, 30),
  ];

  const level3Buttons = [
    new Button(1180, height - 35, 80, 20, () => console.log("level 3 button pressed")),
  ];

  const level3Enemies = [];

  const level3Doors = [];

  // Floor pits under the two post-double-jump vertical moving platforms.
  // Format: [startTileIndex, tileCount], with each floor tile being 32px wide.
  const level3Pits = [
    [73, 7],
    [81, 8],
  ];

  return [
    level3Platforms,
    level3Items,
    level3Traps,
    level3Boxes,
    level3Buttons,
    level3Enemies,
    level3Doors,
    level3Pits,
  ];
}
