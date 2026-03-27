var playerX = 25
var playerY = -100

//USE RELATIVE SCALE NOT PIXEL VALUES

function setupPlayfield() {
  background(220)
  rect(0, .8*height, width, .2*height)
  rect(playerX, playerY, .2*height, .2*height)
  //.2*height is 50 in standard 400x400 frame,
  // refactor other scales if changed
}

function setup() {
  createCanvas(1066, 600);
  playerY = .6*height
  //bigger than normal because it loads in a webpage, more detail
  //keep 16:9 ratio
}

function draw() {
  setupPlayfield()
  if (keyIsDown(65)) {
    playerX -= 5;
  }
  if (keyIsDown(68)) {
    playerX += 5;
  }

}