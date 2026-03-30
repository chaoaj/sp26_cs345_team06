function preload() {
  titleScreenimage = loadImage("assets/Title.png")
  startInstructionImage = loadImage("assets/Start.png")
}


function drawTitleScreen() {

  background(30, 40, 70);

  // Title text box
  // fill(245);
  // stroke(40);
  // strokeWeight(2);
  // rect(width / 2, height / 2 - 50, 280, 70, 10);

  // noStroke();
  // fill(25);
  // textSize(30);
  // text("Rush the Temple", width / 2, height / 2 - 52);

  // Start prompt text box
  // fill(245);
  // stroke(40);
  // strokeWeight(2);
  // rect(width / 2, height / 2 + 45, 280, 60, 10);

  // noStroke();
  // fill(25);
  // textSize(18);
  // text("Press Space to Start", width / 2, height / 2 + 45);

  //TODO: tween in/out with bounce/rotation

  imageHeightScale = .12
  imageWidthScale = .5
  // 1153 x 140
  // for centering image
  image(titleScreenimage,
    width / 2 - (imageWidthScale*width / 2),
    //THIS IS CENTERED PLEASE ASK EJ BEFORE YOU CHANGE THIS
    height / 2 - (imageHeightScale*height / 2) - (height/5),
    imageWidthScale * width,
    imageHeightScale * height);

  startImageHeightScale = .05
  startImageWidthScale = .3
  // 1059 x 91
  image(startInstructionImage,
    width / 2 - (startImageWidthScale*width / 2),
    //THIS IS CENTERED PLEASE ASK EJ BEFORE YOU CHANGE THIS
    height / 2 - (startImageHeightScale*height / 2),
    startImageWidthScale * width,
    startImageHeightScale * height);

}

function handleTitleKeyPressed() {
  if (keyCode === 32) {
    gameState = "playing";
    print("Game Started");
  }
}
