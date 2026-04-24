function getLevel3Template() {
  const stairPlatform1 = new MovingPlatform(260, height - 150, 220, 32, brickTileImage, "x", 60, 1.2, false);
  const stairPlatform2 = new MovingPlatform(520, height - 220, 160, 32, brickTileImage, "x", 60, 1.2, true);
  const stairPlatform3 = new MovingPlatform(800, height - 290, 200, 32, brickTileImage, "x", 60, 1.2, false);
  const stairPlatform4 = new MovingPlatform(1080, height - 360, 140, 32, brickTileImage, "x", 60, 1.2, true);
  const stairPlatform5 = new MovingPlatform(1370, height - 430, 210, 32, brickTileImage, "x", 60, 1.2, false);
  const stairPlatform6 = new MovingPlatform(1660, height - 500, 170, 32, brickTileImage, "x", 60, 1.2, true);
  const stairPlatform7 = new MovingPlatform(1940, height - 560, 230, 32, brickTileImage, "y", 80, 1, false);
  const finalPlatformBaseY = height - 620;
  const finalPlatformLoweredY = finalPlatformBaseY + 150;
  const finalPlatform = new BrickPlatform(2920, finalPlatformBaseY, 220, 32, brickTileImage);
  const finalDoor = new Door(3000, finalPlatformBaseY - 65, 75, 100);

  const platforms = [
    stairPlatform1,
    stairPlatform2,
    stairPlatform3,
    stairPlatform4,
    stairPlatform5,
    stairPlatform6,
    stairPlatform7,
    new BrickPlatform(2450, height - 700, 700, 32, brickTileImage),
    new BrickPlatform(2450, height - 900, 700, 32, brickTileImage),
    new BrickPlatform(2100, height - 142.5, 30, 285, brickTileImage),
    new BrickPlatform(2175, height - 300, 180, 32, brickTileImage),
    new MovingPlatform(2450, height - 430, 180, 32, brickTileImage, "y", 260, 1.6, false),
    new MovingPlatform(2720, height - 580, 180, 32, brickTileImage, "y", 260, 1.6, true),
    finalPlatform,
    new BrickPlatform (2815, height - 985, 32, 800, brickTileImage),
  ];

  const items = [
    new Items(770, height - 420, "health"),
    new Items(510, height - 310, "shield"),
    new Items(2750, height - 800, "doubleJumpAbility"),
  ];

  const traps = [
    new SpikeTrap(880, height - 45, 120, 40),
    new SpikeTrap(2300, height - 735, 140, 40),
    new LaserTrap(2450, height - 805, 14, 180, 1, 2000, 5000, 800, "y"),
    new SpikeTrap(2600, height - 735, 140, 40),
  ];

  const movingTrapA = new SpikeTrap(0, 0, 90, 35);
  movingTrapA.attachToPlatform(stairPlatform3, 0, -(stairPlatform3.height + movingTrapA.height) / 2);
  traps.push(movingTrapA);

  const movingTrapB = new SpikeTrap(0, 0, 90, 35);
  movingTrapB.attachToPlatform(stairPlatform5, 0, -(stairPlatform5.height + movingTrapB.height) / 2);
  traps.push(movingTrapB);

  const boxes = [
    new Box(2750, height - 930, 30, 30),
  ];

  const buttons = [
    new Button(
      1180,
      height - 35,
      80,
      20,
      () => {
        finalPlatform.y = finalPlatformLoweredY;
        finalDoor.y = finalPlatformLoweredY - 65;
      },
      () => {
        finalPlatform.y = finalPlatformBaseY;
        finalDoor.y = finalPlatformBaseY - 65;
      }
    ),
  ];

  const enemies = [
    new Hostile(960, height - 46, 40, 40, 1.6, 880, 2040),
    new Hostile(2400, height - 935, 40, 40, 1.6, 2150, 2755),
    new FlyingHostile(1680, height - 560, 44, 44, 2.2, 1500, 2000, 1, 420, 150),
  ];

  const doors = [
    finalDoor,
  ];

  const pits = [
    [73, 7],
    [81, 8],
  ];

  const terrain = [
    new Terrain(2200, height - 144, 288, 384, step4),
  ];

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
