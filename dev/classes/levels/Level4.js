function getLevel4Template() {
    const platforms = [
        new BrickPlatform(396, height - 192, 128, 32, brickTileImage),
        new BrickPlatform(524, height - 320, 128, 32, brickTileImage),
        new BrickPlatform(332, height - 448, 128, 32, brickTileImage),
        new BrickPlatform(524, height - 544, 128, 32, brickTileImage),

    ];

    const items = [];
    const traps = [];
    const boxes = [];
    const buttons = [];
    const enemies = [];
    const doors = [];
    const pits = [];
    const terrain = [];

    const pipePuzzles = [
        new Pipe(300, height - 64, 64, 64, "straight", 0),
        new Pipe(300, height - 128, 64, 64, "straight", 0),
        new Pipe(300, height - 192, 64, 64, "straight", 0),

    
        new RotatablePipe(300, height - 256, 64, 64, "elbow", 0,1),
        new Pipe(364, height - 256, 64, 64, "straight", 1),
        new RotatablePipe(428, height - 256, 64, 64, "t", 2, 1),

        new Pipe(428, height - 320, 64, 64, "straight", 0),
        new Pipe(428, height - 384, 64, 64, "straight", 0),
        new Pipe(428, height - 448, 64, 64, "straight", 0),
        new Pipe(428, height - 512, 64, 64, "straight", 0),
        new RotatablePipe(428, height - 576, 64, 64, "straight", 0, 1),


        new Pipe(492, height - 256, 64, 64, "straight", 1),
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
        pipePuzzles,
    ];
}