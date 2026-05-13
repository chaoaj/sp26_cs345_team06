function getLevel4Template() {
    const platforms = [
        new BrickPlatform(396, height - 190, 128, 32, brickTileImage),
        new BrickPlatform(524, height - 320, 128, 32, brickTileImage),
        new BrickPlatform(332, height - 448, 128, 32, brickTileImage),
        new BrickPlatform(524, height - 544, 128, 32, brickTileImage),
        new BrickPlatform(812, height - 400, 128, 32, brickTileImage),
        new BrickPlatform(812, height - 190, 128, 32, brickTileImage),
        new BrickPlatform(950, height - 300, 128, 32, brickTileImage),

    ];

    const items = [];
    const traps = [];
    const boxes = [];
    const buttons = [];
    const enemies = [];
    const spawnDoor4 = new Door(width * 0.12, height - 76, 75, 100);
    spawnDoor4.isVisible = false;
    const endGameDoor4 = new Door(1388, height - 100, 75, 100);
    endGameDoor4.isVisible = false;
    const doors = [spawnDoor4, endGameDoor4];
    const pits = [];
    const terrain = [];

    const pipePuzzles = [
        new Pipe(300, height - 64, 64, 64, "straight", 0, 1, []), // 1
        new Pipe(300, height - 128, 64, 64, "straight", 0, 2, [1]), // 2
        new Pipe(300, height - 192, 64, 64, "straight", 0, 3, [2]), // 3

        new RotatablePipe(300, height - 256, 64, 64, "elbow", 0, 1, 4, [3]), // 4
        new Pipe(364, height - 256, 64, 64, "straight", 1, 5, [4]), // 5
        new RotatablePipe(428, height - 256, 64, 64, "t", 2, 1, 6, [5]), // 6

        new Pipe(428, height - 320, 64, 64, "straight", 0, 7, [6]), // 7
        new Pipe(428, height - 384, 64, 64, "straight", 0, 8, [7]), // 8
        new Pipe(428, height - 448, 64, 64, "straight", 0, 9, [8]), // 9
        new Pipe(428, height - 512, 64, 64, "straight", 0, 10, [9]), // 10
        new RotatablePipe(428, height - 576, 64, 64, "straight", 0, 3, 11, [10]), // 11

        new Pipe(492, height - 256, 64, 64, "straight", 1, 12, [6]), // 12
        new Pipe(556, height - 256, 64, 64, "straight", 1, 13, [12]), // 13

        new RotatablePipe(620, height - 256, 64, 64, "elbow", 2, 1, 14, [13]), // 14
        new Pipe(620, height - 320, 64, 64, "straight", 0, 15, [14]), // 15
        new Pipe(620, height - 384, 64, 64, "straight", 0, 16, [15]), // 16
        new RotatablePipe(620, height - 448, 64, 64, "elbow", 0, 1, 17, [16]), // 17

        new Pipe(684, height - 448, 64, 64, "straight", 1, 18, [17]), // 18
        new Pipe(748, height - 448, 64, 64, "straight", 1, 19, [18]), // 19
        new RotatablePipe(812, height - 448, 64, 64, "straight", 1, 0, 20, [19]), // 20
        new Pipe(876, height - 448, 64, 64, "straight", 1, 21, [20]), // 21
        new Pipe(940, height - 448, 64, 64, "straight", 1, 22, [21]), // 22
        new Pipe(1004, height - 448, 64, 64, "straight", 1, 23, [22]), // 23
        new Pipe(1068, height - 448, 64, 64, "straight", 1, 24, [23]), // 24

        new RotatablePipe(1132, height - 448, 64, 64, "elbow", 1, 3, 25, [24]), // 25
        new Pipe(1132, height - 384, 64, 64, "straight", 0, 26, [25]), // 26
        new Pipe(1132, height - 320, 64, 64, "straight", 0, 27, [26]), // 27
        new RotatablePipe(1132, height - 256, 64, 64, "elbow", 3, 2, 28, [27]), // 28

        new Pipe(1196, height - 256, 64, 64, "straight", 1, 29, [28]), // 29
        new Pipe(1260, height - 256, 64, 64, "straight", 1, 30, [29]), // 30
        new RotatablePipe(1324, height - 256, 64, 64, "elbow", 1, 2, 31, [30]), // 31

        new Pipe(1324, height - 192, 64, 64, "straight", 0, 32, [31]), // 32
        new Pipe(1324, height - 128, 64, 64, "straight", 0, 33, [32]), // 33
        new Pipe(1324, height - 64, 64, 64, "straight", 0, 34, [33]), // 34
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
        endGameDoor4, 
    ];
}
