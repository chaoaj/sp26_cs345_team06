function preload() {
  //can only have one preload function across all files
  // so preload here

  //Music
  backgroundMusic = loadSound("assets/audio/BackgroundMusic.mp3")
  soliloquyMusic = loadSound("assets/audio/Soliloquy.mp3")

  //Sound Effects

  //Items
  featherImage = loadImage("assets/abilities/collectibles/Feather.png")
  healthImage = loadImage("assets/abilities/collectibles/heart.png")
  speedImage = loadImage("assets/abilities/collectibles/SpeedPotion.png")
  shieldImage = loadImage("assets/abilities/collectibles/Shield.png")

  //Ability UI
  doublejumpui = loadImage("assets/abilities/UI_icons/doublejumpui.png")
  dashui = loadImage("assets/abilities/UI_icons/dashui.png")

  //Ability Items
  doubleJumpAmuletImage = loadImage("assets/abilities/collectibles/DoubleJumpAmulet.png")
  dashAmuletImage = loadImage("assets/abilities/collectibles/DashAmulet.png")

  //Terrain
  step1 = loadImage("assets/terrain/step1.png")
  step2 = loadImage("assets/terrain/step2.png")
  step3 = loadImage("assets/terrain/step3.png")
  step4 = loadImage("assets/terrain/step4.png")
  box1 = loadImage("assets/objects/box1.png")
  box2 = loadImage("assets/objects/box2.png")
  box3 = loadImage("assets/objects/box3.png")
  box4 = loadImage("assets/objects/box4.png")
  box4long = loadImage("assets/objects/box4-long.png")

  //Title Screen
  titleScreenimage = loadImage("assets/title_screen/Title.png")
  startInstructionImage = loadImage("assets/title_screen/Start.png")
  layer1 = loadImage("assets/title_screen/Layer1.png")
  layer2 = loadImage("assets/title_screen/Layer2.png")
  layer3 = loadImage("assets/title_screen/Layer3.png")
  layer4 = loadImage("assets/title_screen/Layer4.png")
  layer5 = loadImage("assets/title_screen/Layer5.png")
  attribution = loadImage("assets/title_screen/attribution.png")

  //Backgrounds
  backgroundImage = loadImage("assets/title_screen/Background1.png");

  //Floors
  brickFloorImage = loadImage("assets/tiles/Floor1.png");
  floorTileLevel1 = loadImage("assets/tiles/FloorTileLvl1.png")
  floorTileLevel2 = loadImage("assets/tiles/FloorTileLvl2.png")
  floorTileLevel3 = loadImage("assets/tiles/FloorTileLvl3.png")
  lavaImage = loadImage("assets/tiles/Lava.png")

  //Platforms
  brickPlatformImage = loadImage("assets/tiles/BrickPlatform.png")
  brickTileImage = loadImage("assets/tiles/bricktile.png")

  //Object Sprites
  woodenBox = loadImage("assets/objects/WoodenBox.png")
  spikeTrap = loadImage("assets/objects/SpikeTrap.png")
  doorImage = loadImage("assets/objects/door.png")

  //Player Sprites
  playerIdleSheet = loadImage("assets/characters/player/1/Idle.png");
  playerWalkSheet = loadImage("assets/characters/player/1/Walk.png");
  playerRunSheet  = loadImage("assets/characters/player/1/Run.png");
  playerJumpSheet = loadImage("assets/characters/player/1/Jump.png");
  playerHurtSheet = loadImage("assets/characters/player/1/Hurt.png");

  //Enemy Sprites
  greenslimeimage = loadImage("assets/enemies/SlimeWalk.png")
  jumpingHostileImage = loadImage("assets/enemies/Jump.png")

  const loadFrameSequence = (basePath, filePrefix, frameCount) => {
    const frames = []
    for (let i = 0; i < frameCount; i++) {
      const frameNumber = String(i).padStart(3, "0")
      frames.push(loadImage(`${basePath}/${filePrefix}${frameNumber}.png`))
    }
    return frames
  }

  flyingHostileIdleFrames = loadFrameSequence(
    "assets/enemies/Wraith_02/PNG Sequences/Idle",
    "Wraith_02_Idle_",
    12
  )
  flyingHostileAttackFrames = loadFrameSequence(
    "assets/enemies/Wraith_02/PNG Sequences/Attacking",
    "Wraith_02_Attack_",
    12
  )
  flyingHostileDeathFrames = loadFrameSequence(
    "assets/enemies/Wraith_02/PNG Sequences/Dying",
    "Wraith_02_Dying_",
    15
  )
  flyingHostileImage = flyingHostileIdleFrames[0]

  //UI
  heartImage = loadImage("assets/abilities/collectibles/heart.png")
}
