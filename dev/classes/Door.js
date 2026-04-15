class Door {
    constructor(x, y, width, height) { 
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    drawDoor() {
        fill(139, 69, 19);
        rect(this.x, this.y, this.width, this.height);
        console.log("door")
    }
}