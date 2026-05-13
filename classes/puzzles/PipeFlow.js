const PIPE_INTERACTION_RADIUS = 80

function isPipePuzzleSolved(pipes) {
  const rotatables = pipes.filter(p =>
    p.correctOrientation !== undefined
  );
  if (rotatables.length === 0) return false;

  const allCorrect = rotatables.every(p => {
    if (p.pipeType === "straight") {
      return p.currentOrientation % 2 === p.correctOrientation % 2;
    }
    return p.currentOrientation === p.correctOrientation;
  });

  if (allCorrect) {
    updatePipeFlow(pipes);
    const allFull = pipes.every(p => p.fillAmount >= 1);
    return allFull;
  }

  return false;
}

function updatePipeFlow(pipes) {
  const fillSpeed = 0.05;
  // Build id->pipe map once per call instead of find() per pipe
  const pipeById = {};
  for (const pipe of pipes) {
    if (pipe.id != null) pipeById[pipe.id] = pipe;
  }

  for (const pipe of pipes) {
    if (pipe.fillAmount >= 1) continue;
    const canFill = !pipe.parentIds || pipe.parentIds.length === 0 ||
                    pipe.parentIds.some(parentId => {
                      const parent = pipeById[parentId];
                      return parent && parent.fillAmount >= 1;
                    });
    if (canFill) {
      pipe.fillAmount = Math.min(1, pipe.fillAmount + fillSpeed);
    }
  }
}

function mapTypeToImage(pipeType) {
  switch (pipeType) {
    case "straight": return pipeStraightImg;
    case "elbow": return pipeElbowImg;
    case "t": return pipeTpieceImg;
    case "quad": return pipeQuadImg;
  }
}

function mapTypeToWaterImage(pipeType) {
  switch (pipeType) {
    case "straight": return pipeStraightWaterImg;
    case "elbow": return pipeElbowWaterImg;
    case "t": return pipeTpieceWaterImg;
    case "quad": return pipeQuadWaterImg;
  }
}

class Pipe {
  constructor(x, y, width, height, pipeType, orientation = 0, id = null, parentIds = []) {
    this.currentOrientation = orientation;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.id = id;
    this.parentIds = parentIds;
    this.fillAmount = 0; // 0 to 1
    this.pipeType = pipeType;
    this.image = mapTypeToImage(this.pipeType);
    this.waterImage = mapTypeToWaterImage(this.pipeType);
    this.wasEHeld = false;
  }

  update(player) { }

  drawPipe() {
    push();
    translate(this.x, this.y);
    rotate(this.currentOrientation * HALF_PI);
    imageMode(CENTER);

    image(this.image, 0, 0, this.width, this.height);

    if (this.fillAmount > 0) {
      drawingContext.globalAlpha = this.fillAmount;
      image(this.waterImage, 0, 0, this.width, this.height);
      drawingContext.globalAlpha = 1.0;
    }
    pop();
  }
}

class RotatablePipe extends Pipe {
  constructor(x, y, width, height, pipeType, correctOrientation, startOrientation = null, id = null, parentIds = []) {
    const initial = startOrientation !== null ? startOrientation : (correctOrientation + 1) % 4;
    super(x, y, width, height, pipeType, initial, id, parentIds);
    this.correctOrientation = correctOrientation;
  }

  isSolved() {
    if (this.pipeType === "straight") {
      return this.currentOrientation % 2 === this.correctOrientation % 2;
    }
    return this.currentOrientation === this.correctOrientation;
  }

  update(player) {
    if (this.fillAmount > 0) return;

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
