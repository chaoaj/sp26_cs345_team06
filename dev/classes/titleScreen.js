function preload() {
  //can only have one preload function across all files
  // TODO: make class for all loaded assets
  titleScreenimage = loadImage("assets/Title.png")
  startInstructionImage = loadImage("assets/Start.png")

  layer1 = loadImage("assets/Layer1.png")
  layer2 = loadImage("assets/Layer2.png")
  layer3 = loadImage("assets/Layer3.png")
  layer4 = loadImage("assets/Layer4.png")
  layer5 = loadImage("assets/Layer5.png")

  backgroundImage = loadImage("assets/Background1.png");

}

function drawTitleScreenLayers() {
  const normalized = constrain((mouseX - width / 2) / (width / 2), -1, 1);
  //abs function but with not 0
  const maxShift = width * 0.08;
  const layer2Offset = -normalized * maxShift * 0.2;
  const layer4Offset = -normalized * maxShift * 0.75;

  //i dont know if its better to use var or const
  // i just wanted the variables to be colored

  image(layer5, 0, 0, width, height);
  image(layer4, layer4Offset, 0, width, height);
  //image(layer3, layer3Offset, 0, width*1.25, height);
  // TODO: center this layer then bring it back
  image(layer2, layer2Offset, 0, width, height);
  image(layer1, 0, 0, width, height);
}

function drawTitleScreen() {

  drawTitleScreenLayers();

  //TODO: tween in/out with bounce/rotation

  const imageHeightScale = .12
  const imageWidthScale = .5
  // 1153 x 140
  // for centering image
  image(
    titleScreenimage,
    width / 2 - (imageWidthScale*width / 2),
    //THIS IS CENTERED PLEASE ASK EJ BEFORE YOU CHANGE THIS
    height / 2 - (imageHeightScale*height / 2) - (height/5),
    imageWidthScale * width,
    imageHeightScale * height
  );

  const startImageHeightScale = .05
  const startImageWidthScale = .3
  // 1059 x 91
  image(
    startInstructionImage,
    width / 2 - (startImageWidthScale*width / 2),
    //THIS IS CENTERED PLEASE ASK EJ BEFORE YOU CHANGE THIS
    height / 2 - (startImageHeightScale*height / 2),
    startImageWidthScale * width,
    startImageHeightScale * height
  );
}

function handleTitleKeyPressed() {
  if (keyCode === 32) {
    gameState = "playing";
    print("Game Started");
  }
}
