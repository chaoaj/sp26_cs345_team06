function mapTypeToImage(pipe) {
  switch (pipe.type) {
    case "straight":
      return pipeStraightImg;
    case "elbow":
      return pipeElbowImg;
    case "t":
      return pipeTpieceImg;
    case "quad":
      return pipeQuadImg;
  }
}

class Pipe{
  constructor(x, y, width, height, pipeType = "straight", correctOrientation) {
    this.correctOrientation = correctOrientation
    this.currentOrientation = 0;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isFlowing = false
    this.pipeType = pipeType;
    this.image = mapTypeToImage(this.pipeType);
  }
  drawPipe() {
    image(this.image, this.x, this.y, this.width, this.height);
  }
}

class PipeFlow { 
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

}