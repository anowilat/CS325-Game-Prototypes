
window.onload = function() {

   "use strict";

   var game = new Phaser.Game(840, 1000, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

   function preload() {

      game.load.image('road', 'assets/road_840x3256.png');
      game.load.image('crasher', 'assets/car_side.png');
      game.load.image('intersection', 'assets/intersection_840x246.png');
      game.load.image('tutorial', 'assets/tutorial.png');
      game.load.spritesheet('car', 'assets/car_top.png', 100, 180, 5);
      game.load.spritesheet('stoplight', 'assets/stoplight_424x50.png', 424, 75, 4);
      game.load.spritesheet('brake', 'assets/brake_119x111.png', 119, 111, 2);
      game.load.spritesheet('accelerate', 'assets/accelerate98x150.png', 97, 150, 2);
      game.load.spritesheet('explosion', 'assets/explosion.png', 125, 125, 8);
      game.load.spritesheet('reset', 'assets/reset-sheet.png', 299, 130, 2);
      game.load.spritesheet('start', 'assets/start-sheet.png', 299, 130, 2);
      game.load.audio('music', 'assets/music.mp3');
      game.load.audio('explodeSound', 'assets/crash.mp3');
      game.load.audio('startSound', 'assets/ignition.wav');
      game.load.audio('win', 'assets/win.wav');
   }

   var intersection;
   var player;
   var opponents;
   var opponent1;
   var opponent2;
   var crasher;
   var explosion;
   var stoplight;
   var brake;
   var accelerate;

   var tutorial;
   var startButton;
   var resetButton;
   var time;
   var lap;
   var music;
   var startSound;
   var explodeSound;
   var winSound;

   var started;
   var lightState;
   var crashState;
   var playerWrap = 0;
   var seconds = 0;
   var redWait;
   var redTag = false;
   var yellowWait;
   var yellowTag = false;
   var oppIsCrashing1;
   var oppIsCrashing2;
   var oppIsAlive1 = true;
   var oppIsAlive2 = true;
   var oppTag1;
   var oppTag2;
   var oppWrap1 = 0;
   var oppWrap2 = 0;

   function create(){

      game.physics.startSystem(Phaser.Physics.ARCADE);
      game.world.setBounds(0, 0, 840, 3256);

      game.add.sprite(0, 0, 'road');
      intersection = game.add.sprite(0, 290, 'intersection');
      game.physics.arcade.enable(intersection);

      player = game.add.sprite(435, 3100, 'car');
      player.animations.frame = 3;
      game.physics.arcade.enable(player);
      player.anchor.setTo(0.5, 0.5);
      game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 1, 1);
      player.body.maxVelocity.y = 800;

      opponents = game.add.group();
      opponents.physicsBodyType = Phaser.Physics.ARCADE;
      opponents.enableBody = true;
      opponent1 = opponents.create(120, 3010, 'car');
      opponent1.animations.frame = 1;
      opponent1.body.maxVelocity.y = 800;
      opponent2 = opponents.create(635, 3010, 'car');
      opponent2.animations.frame = 2;
      opponent2.body.maxVelocity.y = 800;

      crasher = game.add.sprite(-490, 420, 'crasher');
      game.physics.arcade.enable(crasher);
      crasher.anchor.setTo(0.5, 0.5);

      explosion = game.add.sprite(380, 350, 'explosion');
      explosion.animations.add('explode');
      explosion.visible = false;
      explodeSound = game.add.audio('explodeSound');

      stoplight = game.add.sprite(435, 100, 'stoplight');
      stoplight.anchor.setTo(0.5, 0.5);
      stoplight.fixedToCamera = true;
      stoplight.animations.frame = 0;

      brake = game.add.button(20, 880, 'brake', brake, this, 1, 2, 0);
      brake.fixedToCamera = true;
      accelerate = game.add.button(720, 840, 'accelerate', accelerate, this, 1, 2, 0);
      accelerate.fixedToCamera = true;

      startButton = game.add.button(280, 600, 'start', startGame, this, 1, 2, 0);
      startButton.fixedToCamera = true;
      resetButton = game.add.button(280, 800, 'reset', null, this, 1, 2, 0);
      resetButton.fixedToCamera = true;
      resetButton.visible = false;
      time = game.add.text( 16, 16, "TIME: 0", { font: "25px Lucida Console", fill: "#ffffff"} );
      time.fixedToCamera = true;
      lap = game.add.text( 230, 150, "LAP: 1", { font: "30px Lucida Console", fill: "#ffffff"} );
      lap.fixedToCamera = true;
      tutorial = game.add.sprite(170, 10, 'tutorial');
      tutorial.fixedToCamera = true;

      music = game.add.audio('music');
      winSound = game.add.audio('win');
      startSound = game.add.audio('startSound');

      setLapState();
      oppIsCrashing1 = game.rnd.integerInRange(0, 1);
      oppIsCrashing2 = game.rnd.integerInRange(0, 1);
   }

   function update(){

      if (started && player.alive == true){

         game.physics.arcade.overlap(player, crasher, crash);
         time.text = "TIME: " + seconds++;

         // Player based functions
         if (player.body.y < -200){
            wrapPlayer();
            lap.text = "LAP: " + (playerWrap + 1);
         }
         if (player.body.y < 2000){
            stoplight.animations.frame = lightState;
            setIntersectionState();
         }
         if (yellowWait < game.time.now && yellowTag == false){
            lightState = 3;
         }
         if (redWait < game.time.now && redTag == false){
            lightState = 1;
         }
         if (playerWrap == 10 && player.body.y > 0 && player.body.y < 3000){
            lap.text = "FINAL TIME: " + seconds;
            music.pause();
            winSound.play();
            player.body.acceleration.y = 0;
            player.body.velocity.y = 0;
            started = false;
         }

         // Opponent based functions
         manageOpponentAI();
         if (opponent1.body.y < -200){
            wrapOpponent1();
         }
         if (opponent2.body.y < -200){
            wrapOpponent2();
         }
      }
   }

   function startGame(){

      startSound.play();
      music.loopFull();
      tutorial.kill();
      startButton.kill();
      started = true;
   }

   function setLapState() {

      lightState = game.rnd.integerInRange(1, 3);
      if (lightState == 2){
         yellowTag = true;
         redTag = true;
         crashState = game.rnd.integerInRange(0, 1);
      }
      else if (lightState == 3){
         redTag = true;
      }
      stoplight.animations.frame = 0;
   }

   function setIntersectionState(){

      if (lightState == 2 && yellowTag == true){
         yellowWait = game.time.now + 3500;
         yellowTag = false;
         if (crashState == 1){
            runCrasher();
         }
      }
      else if (lightState == 3 && redTag == true){
         redWait = game.time.now + 3500;
         redTag = false;
         runCrasher();
      }
   }

   function wrapPlayer(){

      player.body.y = 3256;
      playerWrap++;
      setLapState();
   }

   function brake() {

      if (started == true){
         player.body.acceleration.y = 0;
         player.body.velocity.y = 0;
      }
   }

   function accelerate(){

      if (started == true){
         player.body.acceleration.y = -300;
      }
   }

   function runCrasher() {

      crasher.body.x = -580;
      crasher.body.velocity.x = 0;
      crasher.body.acceleration.x = 500;
   }

   function crash(player, crasher){

      music.pause();
      player.kill();
      crasher.kill();
      explosion.visible = true;
      explosion.animations.play('explode', 15, false);
      explodeSound.play();
      resetButton.visible = true;
   }

   function manageOpponentAI(){

      if (oppIsAlive1 == true || oppIsAlive2 == true){
         if (oppIsAlive1 == true){
            oppGo(opponent1);
            game.physics.arcade.overlap(opponent1, intersection, intersectionAI1);
         }
         if (oppIsAlive2 == true){
         oppGo(opponent2);
            game.physics.arcade.overlap(opponent2, intersection, intersectionAI2);
         }
      }
   }

   function intersectionAI1(opponent1, intersection){

      if (lightState == 3){
         oppStop(opponent1);
      }
      if (lightState == 2){
         if (crashState == 1 && oppIsCrashing1 == 1){
            game.physics.arcade.overlap(opponent1, intersection, killOpponent);
            oppIsAlive1 = false;
         }
         else {
            oppStop(opponent2);
         }
      }
      if (lightState == 1){
         oppGo(opponent1);
      }
   }

   function intersectionAI2(opponent2, intersection){

      if (lightState == 3){
         oppStop(opponent2);
      }
      if (lightState == 2){
         if (crashState == 1 && oppIsCrashing2 == 1){
            game.physics.arcade.overlap(opponent2, intersection, killOpponent);
            oppIsAlive2 = false;
         }
         else {
            oppStop(opponent2);
         }
      }
      if (lightState == 1){
         oppGo(opponent2);
      }
   }

   function wrapOpponent1(){

      opponent1.body.y = 3256;
      oppWrap1++;
      oppIsCrashing1 = game.rnd.integerInRange(0, 1);
   }

   function wrapOpponent2(){

      opponent2.body.y = 3256;
      oppWrap2++;
      oppIsCrashing2 = game.rnd.integerInRange(0, 1);
   }

   function oppGo(opponent){

      opponent.body.acceleration.y = -300;
   }

   function oppStop(opponent){

      if (opponent.body.y < 550){
         opponent.body.acceleration.y = 0;
         opponent.body.velocity.y = 0;
      }
   }

   function killOpponent(opponent, intersection){

      opponent.body.y = 340;
      opponent.loadTexture('explosion', 0);
      opponent.animations.add('explode');
      opponent.animations.play('explode', 15, false);
      oppStop(opponent);
   }
};
