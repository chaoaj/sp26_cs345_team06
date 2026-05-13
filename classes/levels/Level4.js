function getLevel4Template() {
    const platforms = [
        new BrickPlatform(396, height - 190, 128, 32, brickTileImage),
        new BrickPlatform(524, height - 320, 128, 32, brickTileImage),
        new BrickPlatform(332, height - 448, 128, 32, brickTileImage),
        new BrickPlatform(524, height - 544, 128, 32, brickTileImage),
        new BrickPlatform(812, height - 400, 128, 32, brickTileImage),
        new BrickPlatform(812, height - 190, 128, 32, brickTileImage),
        new BrickPlatform(950, height - 300, 128, 32, brickTileImage),
        new BrickPlatform(1200, height - 190, 128, 32, brickTileImage),
        new BrickPlatform(625, height - 190, 128, 32, brickTileImage),


    ];

    const items = [];
    const traps = [];
    const boxes = [];
    const buttons = [];
    const enemies = [
        new FlyingHostile(850, height - 400, 44, 44, 2.2, 700, 1000, 1, 420, 150),
        new FlyingHostile(1300, height - 300, 44, 44, 2.2, 700, 1000, 1, 420, 150)

    ];
    const spawnDoor4 = new Door(width * 0.12, height - 76, 75, 100);
    spawnDoor4.isVisible = false;
    const endGameDoor4 = new Door(1500, height - 76, 75, 100);
    endGameDoor4.isVisible = false;
    const doors = [spawnDoor4, endGameDoor4];
    const pits = [
        [13,27]
    ];
    const terrain = [];
    const decorations = [
        new Decoration(140, height - 280, 213, 60, presse)
    ];

    const pipePuzzles = [
        new Pipe(300, height - 57, 64, 64, "straight", 0, 1, []), // 1
        new Pipe(300, height - 121, 64, 64, "straight", 0, 2, [1]), // 2
        new Pipe(300, height - 185, 64, 64, "straight", 0, 3, [2]), // 3

        new RotatablePipe(300, height - 249, 64, 64, "elbow", 0, 1, 4, [3]), // 4
        new Pipe(364, height - 249, 64, 64, "straight", 1, 5, [4]), // 5
        new RotatablePipe(428, height - 249, 64, 64, "t", 2, 1, 6, [5]), // 6

        new Pipe(428, height - 313, 64, 64, "straight", 0, 7, [6]), // 7
        new Pipe(428, height - 377, 64, 64, "straight", 0, 8, [7]), // 8
        new Pipe(428, height - 441, 64, 64, "straight", 0, 9, [8]), // 9
        new Pipe(428, height - 505, 64, 64, "straight", 0, 10, [9]), // 10
        new RotatablePipe(428, height - 569, 64, 64, "straight", 0, 3, 35, [10]), // 35
        new Pipe(428, height - 633, 64, 64, "straight", 0, 36, [35]), // 36
        new Pipe(428, height - 697, 64, 64, "straight", 0, 37, [36]), // 37
        new Pipe(428, height - 761, 64, 64, "straight", 0, 38, [37]), // 38
        new Pipe(428, height - 825, 64, 64, "straight", 0, 39, [38]), // 39
        new Pipe(428, height - 889, 64, 64, "straight", 0, 40, [39]), // 40
        new Pipe(428, height - 953, 64, 64, "straight", 0, 41, [40]), // 41
        new Pipe(428, height - 1017, 64, 64, "straight", 0, 42, [41]), // 42
        new Pipe(428, height - 1081, 64, 64, "straight", 0, 43, [42]), // 43
        new Pipe(428, height - 1145, 64, 64, "straight", 0, 44, [43]), // 44
        new Pipe(428, height - 1209, 64, 64, "straight", 0, 11, [44]), // 11

        new Pipe(492, height - 249, 64, 64, "straight", 1, 12, [6]), // 12
        new Pipe(556, height - 249, 64, 64, "straight", 1, 13, [12]), // 13

        new RotatablePipe(620, height - 249, 64, 64, "elbow", 2, 1, 14, [13]), // 14
        new Pipe(620, height - 313, 64, 64, "straight", 0, 15, [14]), // 15
        new Pipe(620, height - 377, 64, 64, "straight", 0, 16, [15]), // 16
        new RotatablePipe(620, height - 441, 64, 64, "elbow", 0, 1, 17, [16]), // 17

        new Pipe(684, height - 441, 64, 64, "straight", 1, 18, [17]), // 18
        new Pipe(748, height - 441, 64, 64, "straight", 1, 19, [18]), // 19
        new RotatablePipe(812, height - 441, 64, 64, "straight", 1, 0, 20, [19]), // 20
        new Pipe(876, height - 441, 64, 64, "straight", 1, 21, [20]), // 21
        new Pipe(940, height - 441, 64, 64, "straight", 1, 22, [21]), // 22
        new Pipe(1004, height - 441, 64, 64, "straight", 1, 23, [22]), // 23
        new Pipe(1068, height - 441, 64, 64, "straight", 1, 24, [23]), // 24

        new RotatablePipe(1132, height - 441, 64, 64, "elbow", 1, 3, 25, [24]), // 25
        new Pipe(1132, height - 377, 64, 64, "straight", 0, 26, [25]), // 26
        new Pipe(1132, height - 313, 64, 64, "straight", 0, 27, [26]), // 27
        new RotatablePipe(1132, height - 249, 64, 64, "elbow", 3, 2, 28, [27]), // 28

        new Pipe(1196, height - 249, 64, 64, "straight", 1, 29, [28]), // 29
        new Pipe(1260, height - 249, 64, 64, "straight", 1, 30, [29]), // 30
        new RotatablePipe(1324, height - 249, 64, 64, "elbow", 1, 2, 31, [30]), // 31

        new Pipe(1324, height - 185, 64, 64, "straight", 0, 32, [31]), // 32
        new Pipe(1324, height - 121, 64, 64, "straight", 0, 33, [32]), // 33
        new Pipe(1324, height - 57, 64, 64, "straight", 0, 34, [33]), // 34
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
        decorations,
    ];
}
