var playerX = 25
var playerY = 300

function setupPlayfield() {
  background(220)
  rect(0, 350, 400, 50)
  rect(playerX, playerY, 50, 50)
}

function setup() {
  createCanvas(400, 400);
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