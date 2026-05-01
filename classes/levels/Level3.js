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
  // Move final platform so its left edge is flush with the right side of the wall at x=2800 (wall width 32)
  // Wall right edge: 2800 + 16 = 2816; Platform width = 220; center x = 2816 + 220/2 = 2926
  const finalPlatform = new BrickPlatform(2906, finalPlatformBaseY, 220, 32, brickTileImage);
  // Move the door left so it sits on the platform (platform center is 2906, width 220, so platform spans 2796 to 3016)
  // Door width is 75, so center at 2906+50 = 2956 keeps it on the right half, or 2906 for center
  // Place the door always on the platform
  const finalDoor = new Door(2906, finalPlatformBaseY - 65, 75, 100);
  const blocker = new BrickPlatform(2132, height - 985, 32, 200, brickTileImage);
  blocker.isVisible = true;

  const platforms = [
    blocker,
    new MovingPlatform(300, height - 650, 200, 32, brickTileImage, "y", 300, 2, false),
    new MovingPlatform(400, height - 800, 200, 32, brickTileImage, "x", 150, 2, false),
    new MovingPlatform(750, height - 800, 200, 32, brickTileImage, "x", 150, 2, true),
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
    new BrickPlatform (2800, height - 985, 32, 800, brickTileImage),
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
  movingTrapA.attachToPlatform(stairPlatform3, 0, -(stairPlatform3.h + movingTrapA.h) / 2);
  traps.push(movingTrapA);

  const movingTrapB = new SpikeTrap(0, 0, 90, 35);
  movingTrapB.attachToPlatform(stairPlatform5, 0, -(stairPlatform5.h + movingTrapB.h) / 2);
  traps.push(movingTrapB);

  const boxes = [
    new Box(2750, height - 930, 30, 30),
  ];

  let secondButtonActivated = false;
  const buttons = [
    // Original: must be held
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
    // Second button: press once, turns green, stays down
    new SinglePressButton(
      1300,
      height - 35,
      80,
      20,
      () => {
        // Only spawn 3 FlyingHostiles around the player
        if (typeof player !== "undefined" && player) {
          const px = player.x;
          const py = player.y;
          // Add to the current level's enemies array
          const currentLevel = typeof level !== "undefined" ? level : (levels && levels[2]);
          if (currentLevel && currentLevel.enemies) {
            currentLevel.enemies.push(
              new FlyingHostile(px - 180, py - 60, 44, 44, 2.2, px - 280, px - 80, 1, 420, 150),
              new FlyingHostile(px + 180, py - 60, 44, 44, 2.2, px + 80, px + 280, 1, 420, 150),
              new FlyingHostile(px, py - 180, 44, 44, 2.2, px - 100, px + 100, 1, 420, 150)
            );
          }
        }
      }
    ),
  ];

  const enemies = [
    new Hostile(960, height - 46, 40, 40, 1.6, 880, 2040),
    new JumpingHostile(2175, height - 387, 40, 40, 0, 2085, 2265, 1, 140, 1800, 11),
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
  const laserPuzzles = {
    lasers : [
      new Laser(250, height - 825, "right", color(255, 0, 0), 14, 2000, 5000, 800, "y"),
    ],
    collectors : [
      new LaserCollector(
        675, height - 825, 30, 30,
        () => { blocker.isVisible = false; }
      ),
    ],
    mirrors : [
      new LaserMirror(400, height - 825, 24, 45),
      new LaserMirror(750, height - 825, 24, 45),
      new StaticLaserMirror(486, height - 1050, 25, 45,),
      new StaticLaserMirror(873, height - 1050, 25, -45,),

    ]
  };

  const terrain = [
    new Terrain(2200, height - 144, 288, 384, step4),
  ];
    const pipePuzzles = []


  const level3Array = [
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
    laserPuzzles
  ];
  // Attach blocker for reset logic
  level3Array.blocker = blocker;
  return level3Array;
}
