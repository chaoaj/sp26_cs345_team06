let gameState = "title";

level1Platforms = {
  platform1: new Platform(200, 400, 300, 20),
  platform2: new Platform(500, 300, 200, 20),
  platform3: new Platform(800, 500, 250, 20),
  platform4: new Platform(1100, 350, 150, 20),
  platform5: new Platform(1400, 450, 300, 20)
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);

  rectMode(CENTER);
  //platform = new Platform(200, 400, 300, 20);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() { // change to wanted game state.
  if (gameState === "title") {
    drawTitleScreen();
  } else if (gameState === "playing") {
    background(220);
    level1 = new Level(level1Platforms);
    level1.drawPlatforms()
    //platform.draw();
  }
}

function drawGamePrototype() {
  background(220);
  fill(20);
  noStroke();
  textSize(24);
  text("Game Prototype Running", width / 2, height / 2);
}



function keyPressed() {
  if (gameState === "title") {
    handleTitleKeyPressed()
  }
}
