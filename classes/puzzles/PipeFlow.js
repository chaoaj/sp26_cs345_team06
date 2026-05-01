const PIPE_INTERACTION_RADIUS = 80

function isPipePuzzleSolved(pipes) {
  const rotatables = pipes.filter(p =>
    p.correctOrientation !== undefined
  );
  console.log("rotatables:", rotatables.length, rotatables.map(p =>
    `${p.currentOrientation} | ${p.correctOrientation}`
  ));
  if (rotatables.length === 0) return false;
  return rotatables.every(p =>
    p.currentOrientation === p.correctOrientation
  );
}

function mapTypeToImage(pipeType) {
  switch (pipeType) {
    case "straight": return pipeStraightImg;
    case "elbow": return pipeElbowImg;
    case "t": return pipeTpieceImg;
    case "quad": return pipeQuadImg;
  }
}

class Pipe {
  constructor(x, y, width, height, pipeType, orientation = 0) {
    this.currentOrientation = orientation;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isFlowing = false;
    this.pipeType = pipeType;
    this.image = mapTypeToImage(this.pipeType);
    this.wasEHeld = false;
  }

  update(player) { }

  drawPipe() {
    push();
    translate(this.x, this.y);
    rotate(this.currentOrientation * HALF_PI);
    imageMode(CENTER);
    image(this.image, 0, 0, this.width, this.height);
    pop();
  }
}

class RotatablePipe extends Pipe {
  constructor(x, y, width, height, pipeType, correctOrientation, startOrientation = null) {
    const initial = startOrientation !== null ? startOrientation : (correctOrientation + 1) % 4;
    super(x, y, width, height, pipeType, initial);
    this.correctOrientation = correctOrientation;
  }

  isSolved() {
    return this.currentOrientation === this.correctOrientation;
  }

  update(player) {
    const eHeld = keyIsDown(69);
    if (this.isPlayerNearby(player) && eHeld && !this.wasEHeld) {
      this.currentOrientation = (this.currentOrientation + 1) % 4;
    }
    this.wasEHeld = eHeld;
  }

  isPlayerNearby(player) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    return Math.sqrt(dx * dx + dy * dy) < PIPE_INTERACTION_RADIUS;
  }

  drawPrompt() {
    push();
    textAlign(CENTER, BOTTOM);
    textSize(14);
    fill(255);
    stroke(0);
    strokeWeight(3);
    text("E", this.x, this.y - this.height / 2 - 8);
    pop();
  }
}