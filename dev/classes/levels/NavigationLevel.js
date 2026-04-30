class NavigationLevel extends Level {
        // Add a wide dirt terrain at the bottom to visually cover empty space

    constructor(...args) {
        super(...args);
        // Add a wide dirt terrain at the bottom to visually cover empty space
        // Do not call drawTerrain() here; Level will handle terrainPlatforms/platforms if needed
    }
    // Add/override methods if needed
    getSpawnPoint() {
        // Center of the world, or customize as needed
        return {
            x: (this.worldWidth || width) / 2,
            y: 200
        };
    }
    setSpawnPoint() {
        this.spawnPoint = { x: width/2, y: height -500 };
    }
}
function getNavigationLevelTemplate() {
    const BeatLevel1 = true; // Set to true to test the door unlock platform
    const beatLevel2 = false; // Set to true to test the laser traps
    const beatLevel3 = false; // Set to true to test the moving platforms with traps on them
    const beatLevel4 = false; // Set to true to test the final door and platform
    const unlock1 = new MovingPlatform(800, height - 1200, 128, 32, brickTileImage, "y", 700, 2, false);
    const DoorUnlock1 = new Terrain(1026, height - 72, 192, 256, step4);
  const platforms = [
    new BrickPlatform(625, height - 400, 250, 32, brickTileImage),
    new DisappearingPlatform(350, height - 500, 128, 32, brickTileImage, 1000, 500),
    new DisappearingPlatform(500, height - 1200, 64, 64, brickTileImage, 2000, 1000),
    new DisappearingPlatform(450, height - 1350, 64, 64, brickTileImage, 1000, 1000),
    new DisappearingPlatform(500, height - 1500, 64, 64, brickTileImage, 1000, 1000),
    new DisappearingPlatform(450, height - 1650, 64, 64, brickTileImage, 1000, 1000),
    new DisappearingPlatform(500, height - 1800, 64, 64, brickTileImage, 1000, 1000),
    new DisappearingPlatform(450, height - 1950, 64, 64, brickTileImage, 1000, 1000),
    new BrickPlatform(625, height - 250, 130, 32, brickTileImage),
    new BrickPlatform(950, height - 1200, 128, 32, brickTileImage),
    ...(BeatLevel1 ? [new MovingPlatform(2800, height - 150, 128, 32, brickTileImage, "x", 700, 2, false)] : []),
    ...(BeatLevel1 ? [new HarmfulPlatform(3350, height - 200, 64, 32, 1000, 1000)] : []),
    ...(BeatLevel1 ? [new HarmfulPlatform(3200, height - 200, 96, 32, 1000, 1000)] : []),
    ...(BeatLevel1 ? [new HarmfulPlatform(3000, height - 200, 64, 32, 1000, 1000)] : []),
    ...(BeatLevel1 ? [new HarmfulPlatform(2800, height - 200, 32, 32, 1000, 1000)] : []),
    ...(BeatLevel1 ? [new MovingPlatform(1200, height - 200, 128, 32, brickTileImage, "x", 1200, 3, true)] : []),
    ...(BeatLevel1 ? [new BrickPlatform(1800, height - 250, 768, 32, brickTileImage)] : []),
    ...(beatLevel2 ? [new BrickPlatform(600, height - 2050, 128, 32, brickTileImage)] : []),
    ...(beatLevel2 ? [new BrickPlatform(800, height - 2050, 128, 32, brickTileImage)] : []),
    ...(beatLevel2 ? [new BrickPlatform(1000, height - 2150, 128, 32, brickTileImage)] : []),
    ...(beatLevel2 ? [new BrickPlatform(700, height - 2300, 128, 32, brickTileImage)] : []),
    ...(beatLevel2 ? [] : [new BrickPlatform(675, height - 325, 32, 150, brickTileImage)]),
    ...(beatLevel2 ? [] : [new BrickPlatform(575, height - 325, 32, 150, brickTileImage)]),
    ...(beatLevel3 ? [unlock1] : []),
    // placeholder after this

    new BrickPlatform(850, height - 185, 160, 32, brickTileImage),
  ];

  const items = [
    new Items(900, height - 1230, "potion"),
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
    new SpikeTrap(1600, height - 282, 160, 32, 1000, 1000),
    new SpikeTrap(1850, height - 282, 160, 32, 1000, 1000),
    new SpikeTrap(2050, height - 282, 160, 32, 1000, 1000),

  ];

  const boxes = [

  ];
  const laserPuzzles = {
    lasers: [
      ...(beatLevel2 ? [new Laser(1000, height - 2075, "left", color(255, 0, 0), 10, 2000)] : []),
    ],
    collectors: [
      ...(beatLevel2 ? [new LaserCollector(675, height - 2525, 30, 30)] : [])
    ],
    mirrors: [
    ...(beatLevel2 ? [new LaserMirror(600, height - 2100, 24, -45)] : []), // 32 is half platform height, 12 is half mirror size
    ...(beatLevel2 ? [new LaserMirror(800, height - 2100, 24, 45)] : []),
    ...(beatLevel2 ? [new LaserMirror(700, height - 2325, 24, 45)] : []),
    ...(beatLevel2 ? [new LaserMirror(850, height - 2100, 24, -45)] : []),
    ...(beatLevel2 ? [new StaticLaserMirror(575, height - 2325, 25, 45, 3, 2000, 2000, 800, "y")] : []),
    ...(beatLevel2 ? [new StaticLaserMirror(825, height - 2425, 25, 45, 3, 2000, 2000, 800, "y")] : []),
    ...(beatLevel2 ? [new StaticLaserMirror(850, height - 2425, 25, -45, 3, 2000, 2000, 800, "y")] : []),
    ] // Add LaserMirror/StaticLaserMirror here if you want them managed separately
  };
  const buttons = [

  ];

  const enemies = [
    new Hostile(1600, height - 288, 40, 40, 2, 1450, 2150),
    new Hostile(1500, height - 288, 40, 40, 1.4, 1450, 2150),
    new Hostile(1700, height - 288, 40, 40, 2.6, 1450, 2150),
    new JumpingHostile(3725, height - 282, 40, 40, 1, 3725, 3725, 1, 220, 3000),
  ]
  const doors = [
    new Door(4000, height - 278, 75, 100),
  ];

  const pits = [
    [0, 400],
  ];

  const terrain = [
    new Terrain(0, height - 300, 300, 600, step4),
    ...(BeatLevel1 ? [DoorUnlock1] : []),
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
