function preload() {
  //can only have one preload function across all files
  // so preload here
  
  //Music
  backgroundMusic = loadSound("assets/BackgroundMusic.mp3")

  //Sound Effects


  //Title Screen
  titleScreenimage = loadImage("assets/Title.png")
  startInstructionImage = loadImage("assets/Start.png")
  layer1 = loadImage("assets/Layer1.png")
  layer2 = loadImage("assets/Layer2.png")
  layer3 = loadImage("assets/Layer3.png")
  layer4 = loadImage("assets/Layer4.png")
  layer5 = loadImage("assets/Layer5.png")
  attribution = loadImage("assets/attribution.png")

  //Backgrounds
  backgroundImage = loadImage("assets/Background1.png");

  //Floors
  brickFloorImage = loadImage("assets/Floor1.png");

  //Platforms
  brickPlatformImage = loadImage("assets/BrickPlatform.png")

  //Object Sprites
  woodenBox = loadImage("assets/WoodenBox.png")

  //Player Sprites
  playerIdleSheet = loadImage("assets/chacter_sprite/1/Idle.png");
  playerWalkSheet = loadImage("assets/chacter_sprite/1/Walk.png");
  playerRunSheet  = loadImage("assets/chacter_sprite/1/Run.png");
  playerJumpSheet = loadImage("assets/chacter_sprite/1/Jump.png");
  playerHurtSheet = loadImage("assets/chacter_sprite/1/Hurt.png");

  //UI
  heartImage = loadImage("assets/heart.png")
}
