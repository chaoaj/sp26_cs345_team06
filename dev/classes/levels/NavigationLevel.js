class NavigationLevel extends Level {
    constructor(...args) {
        super(...args);
        // Add any NavigationLevel-specific logic here
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
    const BeatLevel1 = false; // Set to true to test the door unlock platform
    const unlock1 = new MovingPlatform(800, height - 1200, 128, 32, brickTileImage, "y", 700, 2, false);
    const DoorUnlock1 = new Terrain(1026, height - 72, 192, 256, step4);

  const platforms = [
    new BrickPlatform(625, height - 400, 250, 32, brickTileImage),
    new DisappearingPlatform(350, height - 500, 128, 32, brickTileImage, 1000, 500),
    new BrickPlatform(625, height - 250, 100, 32, brickTileImage),
    unlock1,
    // placeholder after this

    new BrickPlatform(850, height - 185, 160, 32, brickTileImage),
    new MovingPlatform(1200, height - 185, 160, 32, brickTileImage, "x", 900, 3, true),
    new BrickPlatform(2300, height - 185, 160, 32, brickTileImage),

    new MovingPlatform(2750, height - 200, 128, 32, brickTileImage, "y", 200, 1),
    new BrickPlatform(2900, height - 210, 128, 32, brickTileImage),
    new BrickPlatform(3100, height - 240, 128, 32, brickTileImage),
    new BrickPlatform(3300, height - 270, 128, 32, brickTileImage),
  ];

  const items = [
    // new Items(420, height - 40, "potion"),
    // new Items(400, height - 40, "feather"),
    // new Items(300, height - 40, "dashAbility"),
    // new Items(280, height - 40, "doubleJumpAbility"),

  ];

  const traps = [
    new LaserTrap(665, height - 325, 10, 110, 3, 2000, 2000, 800, "y"),
    new LaserTrap(585, height - 325, 10, 110, 3, 2000, 2000, 800, "y"),

  ];

  const boxes = [

  ];

  const buttons = [

  ];

  const enemies = [
    new Hostile(3600, height - 248, 40, 40, 1.6, 3500, 3900),
  ];

  const doors = [
    new Door(4000, height - 278, 75, 100),
  ];

  const pits = [
    [36, 40],
  ];

  const terrain = [
    new Terrain(0, height - 300, 300, 600, step4),
    ...(BeatLevel1 ? [DoorUnlock1] : []),
    new Terrain(2600, height - 100, 192, 256, step4),
    new Terrain(3800, height - 100, 704, 256, box4long),
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
