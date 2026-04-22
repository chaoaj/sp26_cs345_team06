function drawTitleScreenLayers() {
  const normalized = constrain((mouseX - width / 2) / (width / 2), -1, 1);
  const maxShift = width * 0.08;
  const layer2Offset = -normalized * maxShift * 0.2;
  const layer3Offset = -normalized * maxShift * 0.5;
  const layer4Offset = -normalized * maxShift * 0.75;
  
  image(layer5, 0, 0, width, height);
  image(layer4, layer4Offset, 0, width, height);
  image(layer2, layer2Offset, 0, width, height);
  image(layer1, 0, 0, width, height);
}

function drawTitleScreen() {

  drawTitleScreenLayers();
  //TODO: sin() bobbing effect

  const attributionImageHeightScale = .11
  const attributionImageWidthScale = .5
  image(
    attribution,
    width / 2 - (attributionImageWidthScale*width / 2),
    height * .9,
    attributionImageWidthScale * width,
    attributionImageHeightScale * height
  );

  const titleImageHeightScale = .12
  const titleImageWidthScale = .5

  image(
    titleScreenimage,
    width / 2 - (titleImageWidthScale*width / 2),
    height / 2 - (titleImageHeightScale*height / 2) - (height/5),
    titleImageWidthScale * width,
    titleImageHeightScale * height
  );

  const startImageHeightScale = .05
  const startImageWidthScale = .3
  image(
    startInstructionImage,
    width / 2 - (startImageWidthScale*width / 2),
    height / 2 - (startImageHeightScale*height / 2),
    startImageWidthScale * width,
    startImageHeightScale * height
  );
}

function handleTitleKeyPressed() {
  if (keyCode === 32) {
    runStartedAt = getGameMillis();
    runCompletedAt = null;
    gameState = "playing";
    if (typeof soliloquyMusic !== "undefined" && soliloquyMusic.isPlaying()) {
      soliloquyMusic.stop();
    }
    backgroundMusic.play()

    print("Game Started");
  }
}
