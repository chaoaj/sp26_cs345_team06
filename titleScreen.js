function drawTitleScreen() {
  background(30, 40, 70);

  // Title text box
  fill(245);
  stroke(40);
  strokeWeight(2);
  rect(width / 2, height / 2 - 50, 280, 70, 10);

  noStroke();
  fill(25);
  textSize(30);
  text("Rush the Temple", width / 2, height / 2 - 52);

  // Start prompt text box
  fill(245);
  stroke(40);
  strokeWeight(2);
  rect(width / 2, height / 2 + 45, 280, 60, 10);

  noStroke();
  fill(25);
  textSize(18);
  text("Press Space to Start", width / 2, height / 2 + 45);
}

function handleTitleKeyPressed() {
  if (keyCode === " ") {
    return "playing";
  }

  return "title";
}
