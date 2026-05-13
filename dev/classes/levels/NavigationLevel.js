class NavigationLevel extends Level {

    constructor(...args) {
        super(...args);
    }

    drawBackground() {
        super.drawBackground();
    }

    drawWorld() {
        push();
        noStroke();
        fill(130, 40, 15);
        rectMode(CORNER);
        rect(-1000, height, 10000, 2000);
        pop();
        super.drawWorld();
    }

    getSpawnPoint() {
        const spawnPlatformY = height - 400;
        return {
            x: 625,
            y: spawnPlatformY - 76
        };
    }
    setSpawnPoint() {
        this.spawnPoint = this.getSpawnPoint();
    }
}
function getNavigationLevelTemplate() {
    let beatLevel1 = typeof hasBeatenLevel === "function" ? hasBeatenLevel(1) : false;
    let beatLevel2 = typeof hasBeatenLevel === "function" ? hasBeatenLevel(2) : false;
    let beatLevel3 = typeof hasBeatenLevel === "function" ? hasBeatenLevel(3) : false;
    let beatLevel4 = typeof hasBeatenLevel === "function" ? hasBeatenLevel(4) : false;
    let las1 = false;

    // Declare LaserDoor ONCE at the top of the function
    const LaserDoor = new Door(625, height - 315, 75, 100, 3);
    LaserDoor.isVisible = typeof isLevelUnlocked === "function" ? isLevelUnlocked(3) : false;

    const unlock1 = new MovingPlatform(800, height - 1200, 128, 32, brickTileImage, "y", 700, 2, false);
    const DoorUnlock1 = new Terrain(1026, height - 72, 192, 256, step4);
  const platforms = [
    new BrickPlatform(625, height - 400, 250, 32, brickTileImage),
    new DisappearingPlatform(350, height - 500, 128, 32, brickTileImage, 1000, 500),
    new DisappearingPlatform(500, height - 1200, 64, 64, brickTileImage, 2000, 1000),
    ...(beatLevel2 ? [new DisappearingPlatform(450, height - 1350, 64, 64, brickTileImage, 1000, 1000)] : []),
    ...(beatLevel2 ? [new DisappearingPlatform(500, height - 1500, 64, 64, brickTileImage, 1000, 1000)] : []),
    ...(beatLevel2 ? [new DisappearingPlatform(450, height - 1650, 64, 64, brickTileImage, 1000, 1000)] : []),
    ...(beatLevel2 ? [new DisappearingPlatform(500, height - 1800, 64, 64, brickTileImage, 1000, 1000)] : []),
    ...(beatLevel2 ? [new DisappearingPlatform(450, height - 1950, 64, 64, brickTileImage, 1000, 1000)] : []),
    new BrickPlatform(625, height - 250, 130, 32, brickTileImage),
    new BrickPlatform(950, height - 1200, 128, 32, brickTileImage),
    ...(beatLevel1 ? [new MovingPlatform(2800, height - 150, 128, 32, brickTileImage, "x", 700, 2, false)] : []),
    ...(beatLevel1 ? [new HarmfulPlatform(3350, height - 200, 64, 32, 1, 1)] : []),
    ...(beatLevel1 ? [new HarmfulPlatform(3200, height - 200, 96, 32, 1, 1)] : []),
    ...(beatLevel1 ? [new HarmfulPlatform(3000, height - 200, 64, 32, 1, 1)] : []),
    ...(beatLevel1 ? [new HarmfulPlatform(2800, height - 200, 32, 32, 1, 1)] : []),
    ...(beatLevel1 ? [new MovingPlatform(1200, height - 200, 128, 32, brickTileImage, "x", 1200, 3, true)] : []),
    ...(beatLevel1 ? [new BrickPlatform(1800, height - 250, 768, 32, brickTileImage)] : []),
    ...(beatLevel2 ? [new BrickPlatform(600, height - 2050, 128, 32, brickTileImage)] : []),
    ...(beatLevel2 ? [new BrickPlatform(800, height - 2050, 128, 32, brickTileImage)] : []),
    ...(beatLevel2 ? [new BrickPlatform(1000, height - 2150, 128, 32, brickTileImage)] : []),
    ...(beatLevel2 ? [new BrickPlatform(700, height - 2300, 128, 32, brickTileImage)] : []),
    ...(beatLevel2 ? [] : [new BrickPlatform(675, height - 325, 32, 150, brickTileImage)]),
    ...(beatLevel2 ? [] : [new BrickPlatform(575, height - 325, 32, 150, brickTileImage)]),
    ...(beatLevel3 ? [unlock1] : []),
    // placeholder after this

    new BrickPlatform(850, height - 185, 160, 32, brickTileImage),
    new BrickPlatform(-130, height - 374, 32, 5000, brickTileImage), // left boundary wall
    new BrickPlatform(-466, height - 374, 640, 5000, brickTileImage), // dark fill to the left of boundary wall
  ];

  const items = [
    new Items(900, height - 1230, "potion"),
    new Items(1026, height - 172, "shield"),
    // new Items(420, height - 40, "potion"),
    // new Items(400, height - 40, "feather"),
    // new Items(300, height - 40, "dashAbility"),
    // new Items(280, height - 40, "doubleJumpAbility"),

  ];
  const laserTrap1 = new LaserTrap(675, height - 325, 10, 110, 3, 2000, 2000, 800, "y");
  const laserTrap2 = new LaserTrap(575, height - 325, 10, 110, 3, 2000, 2000, 800, "y");
  const traps = [
    ... (beatLevel2 ? [laserTrap1] : []),
    ... (beatLevel2 ? [laserTrap2] : []),
    ...(beatLevel1 ? [new SpikeTrap(1600, height - 282, 160, 32, 1)] : []),
    ...(beatLevel1 ? [new SpikeTrap(1850, height - 282, 160, 32, 1)] : []),
    ...(beatLevel1 ? [new SpikeTrap(2050, height - 282, 160, 32, 1)] : []),

  ];

  const boxes = [

  ];
  const navMirror1 = new LaserMirror(600, height - 2100, 24, -45);
  const navMirror2 = new LaserMirror(800, height - 2100, 24, 45);
  const navMirror3 = new LaserMirror(700, height - 2325, 24, 45);
  const navMirror4 = new LaserMirror(850, height - 2100, 24, -45);
  navMirror1.respawnIfDropped = true; navMirror1.respawnDropDistance = 140;
  navMirror2.respawnIfDropped = true; navMirror2.respawnDropDistance = 140;
  navMirror3.respawnIfDropped = true; navMirror3.respawnDropDistance = 140;
  navMirror4.respawnIfDropped = true; navMirror4.respawnDropDistance = 140;

  const laserPuzzles = {
    lasers: [
      ...(beatLevel2 ? [new Laser(1000, height - 2075, "left", color(255, 0, 0), 10, 2000)] : []),
    ],
    collectors: [
      ...(beatLevel2 ? [new LaserCollector(
        675,
        height - 2525,
        30,
        30,
        () => { LaserDoor.isVisible = typeof isLevelUnlocked === "function" ? isLevelUnlocked(3) : false; },
        () => { LaserDoor.isVisible = false; }
      )] : [])
    ],
    mirrors: [
    ...(beatLevel2 ? [navMirror1] : []), // 32 is half platform height, 12 is half mirror size
    ...(beatLevel2 ? [navMirror2] : []),
    ...(beatLevel2 ? [navMirror3] : []),
    ...(beatLevel2 ? [navMirror4] : []),
    ...(beatLevel2 ? [new StaticLaserMirror(575, height - 2325, 25, 45, 3, 2000, 2000, 800, "y")] : []),
    ...(beatLevel2 ? [new StaticLaserMirror(825, height - 2425, 25, 45, 3, 2000, 2000, 800, "y")] : []),
    ...(beatLevel2 ? [new StaticLaserMirror(850, height - 2425, 25, -45, 3, 2000, 2000, 800, "y")] : []),
    ] // Add LaserMirror/StaticLaserMirror here if you want them managed separately
  };
  const buttons = [

  ];

  const enemies = [
    ...(beatLevel1 ? [new Hostile(1600, height - 288, 40, 40, 2, 1450, 2150)] : []),
    ...(beatLevel1 ? [new Hostile(1500, height - 288, 40, 40, 1.4, 1450, 2150)] : []),
    ...(beatLevel1 ? [new Hostile(1700, height - 288, 40, 40, 2.6, 1450, 2150)] : []),
    ...(beatLevel1 ? [new JumpingHostile(3725, height - 282, 40, 40, 1, 3725, 3725, 1, 220, 3000)] : []),
  ]
  const spawnDoorNav = new Door(width * 0.12, height - 76, 75, 100);
  spawnDoorNav.isVisible = false;
  const level1Door = new Door(0, height - 648, 75, 100, 1);
  level1Door.isVisible = typeof isLevelUnlocked === "function" ? isLevelUnlocked(1) : true;
  const level2Door = new Door(3800, height - 278, 75, 100, 2);
  level2Door.isVisible = typeof isLevelUnlocked === "function" ? isLevelUnlocked(2) : false;
  const doors = [
    spawnDoorNav,
    LaserDoor,
    level2Door,
    level1Door,
  ];

  const pits = [
    [0, 400],
  ];

  const terrain = [
    new Terrain(0, height - 300, 300, 600, step4),
    ...(beatLevel1 ? [DoorUnlock1] : []),
    new Terrain(2600, height - 100, 192, 256, step4),
    new Terrain(3800, height - 100, 192, 256, step4),
  ];

  // Return array matching Level constructor: platforms, items, traps, boxes, buttons, enemies, doors, pits, terrain, pipePuzzles, laserPuzzles
  return [
    platforms,   // 0
    items,       // 1
    traps,       // 2
    boxes,       // 3
    buttons,     // 4
    enemies,     // 5
    doors,       // 6
    pits,        // 7
    terrain,     // 8
    null,        // 9: worldWidth (optional, can be null)
    null,        // 10: unused (for alignment)
    null,        // 11: unused (for alignment)
    [],          // 12: pipePuzzles (empty array)
    laserPuzzles // 13: laserPuzzles
  ];
}
