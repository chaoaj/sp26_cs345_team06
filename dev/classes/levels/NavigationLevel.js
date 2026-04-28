class NavigationLevel {
    constructor(platforms, backgroundimage, floorImage, items = [], traps = [], worldWidth = null, boxes = [], buttons = [], enemies = [], doors = [], pits = [], terrain = [], laserPuzzles = {}) {
        // Defensive: ensure all arrays are valid even if null is passed
        platforms = platforms || [];
        items = items || [];
        traps = traps || [];
        boxes = boxes || [];
        buttons = buttons || [];
        enemies = enemies || [];
        doors = doors || [];
        pits = pits || [];
        terrain = terrain || [];
        laserPuzzles = laserPuzzles || {};
        this.worldWidth = worldWidth || width;
        this.platforms = [...platforms];
        this.items = [...items];
        this.traps = [...traps];
        this.doors = [...doors];
        this.boxes = [...boxes];
        this.buttons = [...buttons];
        this.enemies = [...enemies];
        this.background = backgroundimage;
        this.pits = [...pits];
        this.terrain = [...terrain];
        this.lasers = [...(laserPuzzles.lasers || [])];
        this.laserCollectors = [...(laserPuzzles.collectors || [])];
        this.laserMirrors = [...(laserPuzzles.mirrors || [])];

        // Add any NavigationLevel-specific properties here
    }
}
