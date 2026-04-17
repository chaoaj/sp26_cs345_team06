function getLevel3Template() {
  const level3Platforms = [
    new Platform(250, height - 170, 220, 30, brickPlatformImage),
    new Platform(510, height - 280, 220, 30, brickPlatformImage),
    new Platform(770, height - 390, 220, 30, brickPlatformImage),
    new Platform(1030, height - 280, 220, 30, brickPlatformImage),
    new Platform(1290, height - 170, 220, 30, brickPlatformImage),
    new MovingPlatform(1510, height - 300, 180, 30, brickPlatformImage, "x", 220, 2),
    new MovingPlatform(1670, height - 170, 180, 30, brickPlatformImage, "y", 150, 1.6),
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
