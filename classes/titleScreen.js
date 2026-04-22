function drawTitleScreenLayers() {
  const normalized = constrain((mouseX - width / 2) / (width / 2), -1, 1);
  //abs function but with not 0
  const maxShift = width * 0.08;
  const layer2Offset = -normalized * maxShift * 0.2;
  const layer3Offset = -normalized * maxShift * 0.5;
  //unused but dont delete
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
  //TODO: sin() bobbing effect

  const attributionImageHeightScale = .11
  const attributionImageWidthScale = .5
  // 1728 x 189
  // for centering image
  image(
    attribution,
    width / 2 - (attributionImageWidthScale*width / 2),
    //THIS IS CENTERED PLEASE ASK EJ BEFORE YOU CHANGE THIS
    height * .9,
    attributionImageWidthScale * width,
    attributionImageHeightScale * height
  );

  const titleImageHeightScale = .12
  const titleImageWidthScale = .5
  // 1153 x 140
  // for centering image
  image(
    titleScreenimage,
    width / 2 - (titleImageWidthScale*width / 2),
    //THIS IS CENTERED PLEASE ASK EJ BEFORE YOU CHANGE THIS
    height / 2 - (titleImageHeightScale*height / 2) - (height/5),
    titleImageWidthScale * width,
    titleImageHeightScale * height
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
    if (typeof soliloquyMusic !== "undefined" && soliloquyMusic.isPlaying()) {
      soliloquyMusic.stop();
    }
    backgroundMusic.play()
  }
}
