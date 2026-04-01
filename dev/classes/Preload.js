function preload() {
  //can only have one preload function across all files
  // so preload here

  //Title Screen
  titleScreenimage = loadImage("assets/Title.png")
  startInstructionImage = loadImage("assets/Start.png")
  layer1 = loadImage("assets/Layer1.png")
  layer2 = loadImage("assets/Layer2.png")
  layer3 = loadImage("assets/Layer3.png")
  layer4 = loadImage("assets/Layer4.png")
  layer5 = loadImage("assets/Layer5.png")

  //Backgrounds
  backgroundImage = loadImage("assets/Background1.png");

  //Floors
  brickFloorImage = loadImage("assets/Floor1.png");

  //Platforms
  brickPlatformImage = loadImage("assets/BrickPlatform.png");

}