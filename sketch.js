var ground, ground_image, invisible_ground;
var girl, girl_running, girl_collided, girlImage, zombie, zombie_running, zombie_attack;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var jumpSound, dieSound, checkpointSound;
var score;
var gameOver, restart, gameOverImage, restartImage;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

function preload() {
  //By mistake you have taken run pictures
  ground_image = loadImage("Background.png");

  girl_running = loadAnimation(
    "Run1.png",
    "Run2.png",
    "Run3.png",
    "Run4.png",
    "Run5.png",
    "Run6.png",
    "Run7.png",
    "Run8.png",
    "Run9.png",
    "Run10.png",
    "Run11.png",
    "Run12.png",
    "Run14.png",
    "Run15.png",
    "Run16.png",
    "Run17.png",
    "Run18.png",
    "Run19.png",
    "Run20.png"
  );
  zombie_running = loadAnimation(
    "Walk1.png",
    "Walk2.png",
    "Walk3.png",
    "Walk4.png",
    "Walk5.png",
    "Walk6.png",
    "Walk7.png",
    "Walk8.png",
    "Walk9.png",
    "Walk10.png"
  );
  zombie_attack = loadAnimation(
    "Attack2.png",
    "Attack3.png",
    "Attack4.png",
    "Attack5.png",
    "Attack6.png",
    "Attack7.png",
    "Attack8.png"
  );
  obstacle1 = loadImage("obstacle1.png");
  //obstacle2 = loadImage("obstacle2.png");
  //obstacle3 = loadImage("obstacle3.png");
  //obstacle4 = loadImage("obstacle4.png");

  zombie_idle = loadImage("Stand.png");

  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");

  gameOverImage = loadImage("gameOver1.png");
  restartImage = loadImage("restart1.png");
  girl_collided = loadImage("Dead30.png");
  girlImage = loadImage("Idle1.png");
}

function setup() {
  createCanvas(600, 550);

  ground = createSprite(0, 0, 0, 0);
  //ground.shapeColor="white";
  ground.addImage("ground_image", ground_image);
  ground.scale = 1.5;
  ground.velocityX = -1;


  girl = createSprite(300, 420, 60, 10);
  girl.addAnimation("running", girl_running);
  girl.addImage(girlImage);
  girl.addImage(girl_collided);
  girl.addImage("girl_collided", girl_collided);
  girl.debug = false;
  girl.setCollider("rectangle", 0, 0, girl.width, girl.height);
  //girl.velocityX=2;
  girl.scale = 0.2;
  //spelling of create was "creat"
  zombie = createSprite(50, 410, 600, 10);
  zombie.addAnimation(zombie_running);
  zombie.addAnimation(zombie_attack);
  zombie.addImage(zombie_idle);
  zombie.debug = false;
  zombie.scale = 0.2;



  invisible_ground = createSprite(300, 510, 600, 10);
  invisible_ground.visible = false;

  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImage);

  restart = createSprite(300, 180);
  restart.addImage(restartImage);

  obstaclesGroup = new Group();

  score = 0;
}

function draw() {
  //background("black");

  // console.log(girl.y);
  //Gravity
  girl.velocityY = girl.velocityY + 0.8;
  girl.collide(invisible_ground);

  //Gravity
  zombie.velocityY = zombie.velocityY + 0.8;
  zombie.collide(invisible_ground);

  if (gameState === PLAY) {
    gameOver.visible = false;
    restart.visible = false;
    //  zombie.y=girl.y;
    score = score + Math.round(getFrameRate() / 60);

    spawnObstacles();
    if (obstaclesGroup.isTouching(zombie)) {
      zombie.velocityY = -12;
    }
    ground.velocityX = -(4 + (3 * score) / 100);

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (score > 0 && score % 100 === 0) {
      checkPointSound.play();
    }

    if (keyDown("space") && girl.y >= 220) {
      girl.velocityY = -12;
      jumpSound.play();
    }

    if (girl.isTouching(obstaclesGroup)) {
      gameState = END;
      dieSound.play();
    }
  }
   else if (gameState === END)
    {
    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    girl.velocityY = 0;
    girl.changeImage(girlImage);
    zombie.changeAnimation("zombie_attack", zombie_attack);
    zombie.x = girl.x;
    if (zombie.isTouching(girl)) {
      girl.changeImage("girl_collided",girl_collided);
      zombie.changeImage("zombie_idle", zombie_idle);
    }
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);

    if (mousePressedOver(restart)) {
      reset();
    }
  }

  drawSprites();
  fill("lightpink");
  textSize(20);
  text("Score: " + score, 500, 50);
}

function reset() {
  //gameStart spelling mistake
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  girl.changeAnimation("running", girl_running);
  obstaclesGroup.destroyEach();
  score = 0;
  zombie.x = 50;
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 490, 10, 40);
    obstacle.velocityX = -6; //+ score/100);

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    //obstacle picture missing
    obstacle.addImage(obstacle1);
    obstacle.scale = 0.1;
    obstaclesGroup.add(obstacle);
    obstacle.debug = false;
    //obstacle dot was missing.
    obstacle.setCollider("circle", 0, 0, 1);
  }
}