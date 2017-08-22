
window.onload = function() {

   "use strict";

   var game = new Phaser.Game(840, 1000, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

   function preload() {

      game.load.image('road', 'assets/road_840x3256.png');
      game.load.image('intersection', 'assets/intersection.png');
      game.load.image('tutorial', 'assets/tutorial.png');
      game.load.image('customize', 'assets/customize.png');
      game.load.image('message', 'assets/message.png');
      game.load.spritesheet('car', 'assets/car_top.png', 100, 180, 5);
      game.load.spritesheet('crasher', 'assets/car_side_180x80.png', 180, 80, 6);
      game.load.spritesheet('stoplight', 'assets/stoplight_424x50.png', 424, 75, 4);
      game.load.spritesheet('brake', 'assets/buttons/brake_119x111.png', 119, 111, 2);
      game.load.spritesheet('accelerate', 'assets/buttons/accelerate98x150.png', 97, 150, 2);
      game.load.spritesheet('explosion', 'assets/explosion.png', 125, 125, 8);
      game.load.spritesheet('start', 'assets/buttons/start-sheet.png', 299, 130, 2);
      game.load.spritesheet('custom', 'assets/buttons/custom-sheet.png', 298, 123, 2);
      game.load.spritesheet('tutorialB', 'assets/buttons/tutorial-sheet.png', 298, 123, 2);
      game.load.spritesheet('medals', 'assets/medals_204x290.png', 203, 290, 3);
      game.load.spritesheet('red', 'assets/buttons/red.png', 50, 27, 2);
      game.load.spritesheet('black', 'assets/buttons/black.png', 50, 27, 2);
      game.load.spritesheet('blue', 'assets/buttons/blue.png', 50, 27, 2);
      game.load.spritesheet('green', 'assets/buttons/green.png', 50, 27, 2);
      game.load.spritesheet('yellow', 'assets/buttons/yellow.png', 50, 27, 2);
      game.load.spritesheet('five', 'assets/buttons/5.png', 50, 27, 2);
      game.load.spritesheet('ten', 'assets/buttons/10.png', 50, 27, 2);
      game.load.spritesheet('twenty', 'assets/buttons/25.png', 50, 27, 2);
      game.load.spritesheet('fifty', 'assets/buttons/50.png', 50, 27, 2);
      game.load.spritesheet('infinity', 'assets/buttons/in.png', 50, 27, 2);
      game.load.audio('music', 'assets/sounds/music.mp3');
      game.load.audio('explodeSound', 'assets/sounds/crash.mp3');
      game.load.audio('startSound', 'assets/sounds/ignition.wav');
      game.load.audio('win', 'assets/sounds/win.wav');
      game.load.audio('click', 'assets/sounds/click.wav');
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
   var medals;
   var medal1;
   var medal2;

   var tutorial;
   var custom;
   var message;
   var startButton;
   var customButton;
   var tutorialButton;
   var red;
   var black;
   var blue;
   var green;
   var yellow;
   var five;
   var ten;
   var twenty;
   var fifty;
   var infinity;
   var time;
   var lap;
   var music;
   var startSound;
   var explodeSound;
   var winSound;
   var clickSound;

   var started = false;
   var oppStarted = false;
   var lightState;
   var crashState;
   var playerWrap = 0;
   var seconds = 0;
   var totalLaps = 10;
   var redWait;
   var redTag = false;
   var yellowWait;
   var yellowTag = false;
   var oppIsCrashing1;
   var oppIsCrashing2;
   var oppIsAlive1 = true;
   var oppIsAlive2 = true;
   var oppTag1 = false;
   var oppTag2 = false;
   var oppWrap1 = 0;
   var oppWrap2 = 0;
   var place = 0;

   function create(){

      game.physics.startSystem(Phaser.Physics.ARCADE);
      game.world.setBounds(0, 0, 840, 3256);

      game.add.sprite(0, 0, 'road');
      intersection = game.add.sprite(0, 350, 'intersection');
      game.physics.arcade.enable(intersection);
      intersection.alpha = 0;

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

      crasher = game.add.sprite(-530, 280, 'crasher');
      game.physics.arcade.enable(crasher);
      crasher.anchor.setTo(0.5, 0.5);

      explosion = game.add.sprite(380, 230, 'explosion');
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

      startButton = game.add.button(440, 600, 'start', startGame, this, 1, 2, 0);
      startButton.fixedToCamera = true;
      customButton = game.add.button(123, 606, 'custom', customMenu, this, 1, 2, 0);
      customButton.fixedToCamera = true;
      tutorialButton = game.add.button(123, 606, 'tutorialB', tutorialMenu, this, 1, 2, 0);
      tutorialButton.fixedToCamera = true;
      tutorialButton.visible = false;
      time = game.add.text( 16, 16, "TIME: 0", { font: "25px Lucida Console", fill: "#ffffff"} );
      time.fixedToCamera = true;
      lap = game.add.text( 230, 150, "LAP: 1", { font: "30px Lucida Console", fill: "#ffffff"} );
      lap.fixedToCamera = true;
      tutorial = game.add.sprite(170, 10, 'tutorial');
      tutorial.fixedToCamera = true;
      custom = game.add.sprite(85, 300, 'customize');
      custom.visible = false;
      custom.fixedToCamera = true;
      message = game.add.sprite(85, 580, 'message');
      message.visible = false;
      message.fixedToCamera = true;

      red = game.add.button(400, 390, 'red', red, this, 1, 2, 0);
      red.fixedToCamera = true;
      red.visible = false;
      black = game.add.button(460, 390, 'black', black, this, 1, 2, 0);
      black.fixedToCamera = true;
      black.visible = false;
      blue = game.add.button(520, 390, 'blue', blue, this, 1, 2, 0);
      blue.fixedToCamera = true;
      blue.visible = false;
      green = game.add.button(580, 390, 'green', green, this, 1, 2, 0);
      green.fixedToCamera = true;
      green.visible = false;
      yellow = game.add.button(640, 390, 'yellow', yellow, this, 1, 2, 0);
      yellow.fixedToCamera = true;
      yellow.visible = false;
      five = game.add.button(400, 460, 'five', five, this, 1, 2, 0);
      five.fixedToCamera = true;
      five.visible = false;
      ten = game.add.button(460, 460, 'ten', ten, this, 1, 2, 0);
      ten.fixedToCamera = true;
      ten.visible = false;
      twenty = game.add.button(520, 460, 'twenty', twenty, this, 1, 2, 0);
      twenty.fixedToCamera = true;
      twenty.visible = false;
      fifty = game.add.button(580, 460, 'fifty', fifty, this, 1, 2, 0);
      fifty.fixedToCamera = true;
      fifty.visible = false;
      infinity = game.add.button(640, 460, 'infinity', infinity, this, 1, 2, 0);
      infinity.fixedToCamera = true;
      infinity.visible = false;

      medals = game.add.sprite(330, 2650, 'medals');
      medals.visible = false;
      medal1 = game.add.sprite(60, 2650, 'medals');
      medal1.visible = false;
      medal2 = game.add.sprite(580, 2650, 'medals');
      medal2.visible = false;

      music = game.add.audio('music');
      winSound = game.add.audio('win');
      startSound = game.add.audio('startSound');
      clickSound = game.add.audio('click');

      setLapState();
      oppIsCrashing1 = game.rnd.integerInRange(0, 1);
      oppIsCrashing2 = game.rnd.integerInRange(0, 1);
   }

   function update(){

      // Player based functions
      if (started == true && player.alive == true){

         game.physics.arcade.overlap(player, crasher, crash);
         time.text = "TIME: " + seconds++;

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
         if (playerWrap == totalLaps && player.body.y > 0 && player.body.y < 3000){
            lap.text = "FINAL TIME: " + seconds;
            music.pause();
            winSound.play();
            player.body.acceleration.y = 0;
            player.body.velocity.y = 0;
            started = false;
            medals.visible = true;
            medals.frame = place;
            lightState = 1;
         }
      }

      // Opponent based functions
      if (oppStarted == true){

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

      lap.text = "LAP: " + (playerWrap + 1);
      startSound.play();
      music.loopFull();
      tutorial.visible = false;
      startButton.visible = false;
      customButton.visible = false;
      tutorialButton.visible = false;
      custom.visible = false;
      started = true;
      oppStarted = true;
      red.visible = false;
      black.visible = false;
      blue.visible = false;
      green.visible = false;
      yellow.visible = false;
      five.visible = false;
      ten.visible = false;
      twenty.visible = false;
      fifty.visible = false;
      infinity.visible = false;
   }

   function customMenu(){

      lap.text = "TOTAL LAPS: " + totalLaps;
      clickSound.play();
      customButton.visible = false;
      tutorialButton.visible = true;
      tutorial.visible = false;
      custom.visible = true;
      red.visible = true;
      black.visible = true;
      blue.visible = true;
      green.visible = true;
      yellow.visible = true;
      five.visible = true;
      ten.visible = true;
      twenty.visible = true;
      fifty.visible = true;
      infinity.visible = true;
   }

   function tutorialMenu(){

      lap.text = "LAP: " + (playerWrap + 1);
      clickSound.play();
      tutorialButton.visible = false;
      customButton.visible = true;
      custom.visible = false;
      tutorial.visible = true;
      red.visible = false;
      black.visible = false;
      blue.visible = false;
      green.visible = false;
      yellow.visible = false;
      five.visible = false;
      ten.visible = false;
      twenty.visible = false;
      fifty.visible = false;
      infinity.visible = false;
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

      crasher.animations.frame = game.rnd.integerInRange(0, 5);
      crasher.body.x = -720;
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
      message.visible = true;
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
         if (oppWrap1 == totalLaps && opponent1.body.y > 0 && opponent1.body.y < 3000){
            opponent1.body.acceleration.y = 0;
            opponent1.body.velocity.y = 0;
            if (oppTag1 == false){
               medal1.visible = true;
               medal1.frame = place;
               place++;
               oppTag1 = true;
            }
         }
         if (oppWrap2 == totalLaps && opponent2.body.y > 0 && opponent2.body.y < 3000){
            opponent2.body.acceleration.y = 0;
            opponent2.body.velocity.y = 0;
            if (oppTag2 == false){
               medal2.visible = true;
               medal2.frame = place;
               place++;
               oppTag2 = true;
            }
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

      opponent.body.y = 230;
      opponent.loadTexture('explosion', 0);
      opponent.animations.add('explode');
      opponent.animations.play('explode', 15, false);
      oppStop(opponent);
   }

   function red(){

      clickSound.play();
      player.frame = 3;
      opponent1.frame = game.rnd.integerInRange(0, 2);
      opponent2.frame = game.rnd.integerInRange(4, 5);
   }

   function black(){

      clickSound.play();
      player.frame = 0;
      opponent1.frame = game.rnd.integerInRange(3, 4);
      opponent2.frame = game.rnd.integerInRange(1, 2);
   }

   function blue(){

      clickSound.play();
      player.frame = 2;
      opponent1.frame = game.rnd.integerInRange(0, 1);
      opponent2.frame = game.rnd.integerInRange(3, 5);
   }

   function green(){

      clickSound.play();
      player.frame = 1;
      opponent1.frame = game.rnd.integerInRange(2, 3);
      opponent2.frame = game.rnd.integerInRange(4, 5);
   }

   function yellow(){

      clickSound.play();
      player.frame = 4;
      opponent1.frame = game.rnd.integerInRange(0, 1);
      opponent2.frame = game.rnd.integerInRange(2, 3);
   }

   function five(){

      clickSound.play();
      totalLaps = 5;
      lap.text = "TOTAL LAPS: " + totalLaps;
   }

   function ten(){

      clickSound.play();
      totalLaps = 10;
      lap.text = "TOTAL LAPS: " + totalLaps;
   }

   function twenty(){

      clickSound.play();
      totalLaps = 25;
      lap.text = "TOTAL LAPS: " + totalLaps;
   }

   function fifty(){

      clickSound.play();
      totalLaps = 50;
      lap.text = "TOTAL LAPS: " + totalLaps;
   }

   function infinity(){

      clickSound.play();
      totalLaps = -1;
      lap.text = "TOTAL LAPS: ENDLESS MODE";
   }
};
