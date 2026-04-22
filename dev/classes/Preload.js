function preload() {
  //can only have one preload function across all files
  // so preload here

  //Music
  backgroundMusic = loadSound("assets/BackgroundMusic.mp3")
  soliloquyMusic = loadSound("assets/Soliloquy.mp3")

  //Sound Effects

  //Items
  featherImage = loadImage("assets/Feather.png")
  healthImage = loadImage("assets/heart.png")
  speedImage = loadImage("assets/SpeedPotion.png")
  shieldImage = loadImage("assets/Shield.png")
  
  //Ability UI
  doublejumpui = loadImage("assets/doublejumpui.png")
  dashui = loadImage("assets/dashui.png")

  //Ability Items
  doubleJumpAmuletImage = loadImage("assets/DoubleJumpAmulet.png")
  dashAmuletImage = loadImage("assets/DashAmulet.png")

  //Terrain
  step1 = loadImage("assets/step1.png")
  step2 = loadImage("assets/step2.png")
  step3 = loadImage("assets/step3.png")
  step4 = loadImage("assets/step4.png")
  box1 = loadImage("assets/box1.png")
  box2 = loadImage("assets/box2.png")
  box3 = loadImage("assets/box3.png")
  box4 = loadImage("assets/box4.png")

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
  floorTileLevel1 = loadImage("assets/FloorTileLvl1.png")
  floorTileLevel2 = loadImage("assets/FloorTileLvl2.png")
  floorTileLevel3 = loadImage("assets/FloorTileLvl3.png")
  lavaImage = loadImage("assets/Lava.png")

  //Platforms
  brickPlatformImage = loadImage("assets/BrickPlatform.png")
  brickTileImage = loadImage("assets/bricktile.png")

  //Object Sprites
  woodenBox = loadImage("assets/WoodenBox.png")
  spikeTrap = loadImage("assets/SpikeTrap.png")
  doorImage = loadImage("assets/door.png")

  //Player Sprites
  playerIdleSheet = loadImage("assets/chacter_sprite/1/Idle.png");
  playerWalkSheet = loadImage("assets/chacter_sprite/1/Walk.png");
  playerRunSheet  = loadImage("assets/chacter_sprite/1/Run.png");
  playerJumpSheet = loadImage("assets/chacter_sprite/1/Jump.png");
  playerHurtSheet = loadImage("assets/chacter_sprite/1/Hurt.png");

  //Enemy Sprites
  greenslimeimage = loadImage("assets/SlimeWalk.png")

  //UI
  heartImage = loadImage("assets/heart.png")
}
