
window.onload = function() {

   "use strict";

   var game = new Phaser.Game(1024, 715, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

   function preload() {

      game.load.image('TV', 'assets/tv_1024x715.png');
      game.load.image('alley', 'assets/alley_612x432.png');
      game.load.image('crate', 'assets/crate_80x50.png');
      game.load.image('fade', 'assets/fade.png');
      game.load.spritesheet('cityscape', 'assets/cityscape_612x432.png', 612, 432, 10);
      game.load.spritesheet('player', 'assets/player_79x77.png', 79, 77, 9);
      game.load.spritesheet('thug', 'assets/soldier_70x77.png', 70, 77, 10);
      game.load.spritesheet('start', 'assets/buttons/start-sheet.png', 149, 64);
      game.load.audio('static', 'assets/sounds/static.wav');
      game.load.audio('intro', 'assets/sounds/intro.mp3');
      game.load.audio('ambient', 'assets/sounds/ambient_loop.mp3');
      game.load.audio('footsteps', 'assets/sounds/running_concrete.mp3');
      game.load.audio('click', 'assets/sounds/click.wav');
      game.load.audio('gunshot', 'assets/sounds/gunshot.wav');
      game.load.audio('hey', 'assets/sounds/hey.wav');
      game.load.audio('ignition', 'assets/sounds/ignition.wav');
      game.load.audio('timeout', 'assets/sounds/timeout.wav');
   }

   var cityscape;
   var alley;
   var player;
   var thugs;
   var thug;
   var crates;
   var fade;

   var distanceText;
   var timeText;
   var startButton;

   var introSound;
   var staticSound;
   var footstepsSound;
   var gunshotSound;
   var heySound;
   var ignitionSound;
   var clickSound;
   var timeOutSound;

   var gameStarted;
   var cursors;
   var hiding = false;
   var thugRate = 5000;
   var nextThug = 0;
   var crateRate = 3000;
   var nextCrate = 0;
   var stopCrateSpawn = false;
   var stopThugSpawn = false;
   var distance = 3000;
   var time = 5000;
   var winStatus = false;

   function create(){

      game.physics.startSystem(Phaser.Physics.ARCADE);
      game.world.setBounds(0, 0, 1024, 715);
      cursors = game.input.keyboard.createCursorKeys();

      alley = game.add.tileSprite(116, 116, 612, 432, 'alley');
      alley.visible = false;

      crates = game.add.group();
      crates.enableBody = true;
      crates.physicsBodyType = Phaser.Physics.ARCADE;
      crates.createMultiple(5, 'crate');
      crates.setAll('outOfBoundsKill', true);
      crates.setAll('checkWorldBounds', true);

      player = game.add.sprite(130, 380, 'player');
      game.physics.arcade.enable(player);
      player.enableBody = true;
      player.body.collideWorldBounds = true;
      player.animations.add('run', [0, 1, 2, 3, 4, 5, 6, 7]);
      player.animations.play('run', 10, true);

      thugs = game.add.group();
      thugs.enableBody = true;
      thugs.physicsBodyType = Phaser.Physics.ARCADE;
      thugs.createMultiple(3, 'thug');
      thugs.setAll('outOfBoundsKill', true);
      thugs.setAll('checkWorldBounds', true);
      thugs.callAll('animations.add', 'animations', 'thugRun', [9, 8, 7, 6, 5, 4, 3, 2, 1, 0], 12, true);

      cityscape = game.add.sprite(116, 116, 'cityscape');
      cityscape.animations.add('noise');
      cityscape.animations.play('noise', 2, false);

      distanceText = game.add.text(540, 130, "Distance: ", { font: "20px Lucida Console", fill: "#ffffff"} );
      timeText = game.add.text(130, 130, "Time: ", { font: "20px Lucida Console", fill: "#ffffff"} );
      startButton = game.add.button(350, 450, 'start', startGame, this, 1, 2, 0);
      distanceText.visible = false;
      timeText.visible = false;
      startButton.visible = false;

      fade = game.add.sprite(116, 116, 'fade');
      fade.alpha = 0;
      game.add.sprite(0, 0, 'TV');

      introSound = game.add.audio('intro');
      staticSound = game.add.audio('static');
      footstepsSound = game.add.audio('footsteps');
      clickSound = game.add.audio('click');
      gunshotSound = game.add.audio('gunshot');
      heySound = game.add.audio('hey');
      ignitionSound = game.add.audio('ignition');
      timeOutSound = game.add.audio('timeout');
      introSound.volume = 0.2;
      introSound.loopFull();
      staticSound.play();
   }

   function update(){

      if (cityscape.animations.frame == 9){
         startButton.visible = true;
      }
      if (gameStarted == true){
         playerMovement();
         spawnThug();
         spawnCrate();

         if (time != 0 && distance != 0){
            time--;
            timeText.text = "Time: " + time;
         }
         if (hiding == false && distance != 0 && time != 0){
            distance--;
            distanceText.text = "Distance: " + distance;
         }
         if (hiding == false && thug.body.x < 300 && thug.body.x > 116 && time != 0){
            heySound.play();
            killPlayer();
            game.time.events.add(Phaser.Timer.SECOND * 2, fadeOut, this);
         }
         if (time == 0){
            playerLose();
         }
         if (distance == 0){
            winStatus = true;
            playerWin();
         }
         if (player.body.x > 715 && winStatus == false){
            timeOutSound.play();
            gameStarted = false;
            game.time.events.add(Phaser.Timer.SECOND * 4, fadeOut, this);
         }
         if (player.body.x > 715 && winStatus == true){
            ignitionSound.play();
            gameStarted = false;
            game.time.events.add(Phaser.Timer.SECOND * 4, fadeOut, this);
         }
      }
   }

   function startGame(){

      clickSound.play();
      cityscape.animations.frame = 0;
      startButton.kill();
      cityscape.kill();
      alley.visible = true;
      distanceText.visible = true;
      timeText.visible = true;
      alley.autoScroll(-120, 0);
      nextThug = game.time.now + thugRate;
      nextCrate = game.time.now + crateRate;
      thug = thugs.getFirstExists(false);
      gameStarted = true;
   }

   function playerMovement(){

      if (cursors.up.isDown && player.y != 270 && hiding == false){
         player.y -= 2.5;
      }
      else if (cursors.down.isDown && player.y != 450 & hiding == false){
         player.y += 2.5;
      }
      else if (cursors.left.isDown && hiding == false){
         game.physics.arcade.overlap(player, crates, hide);
      }
      else if (cursors.right.isDown && hiding == true){
         game.physics.arcade.overlap(player, crates, stopHide);
      }
   }

   function spawnThug(){

      if (game.time.now > nextThug && stopThugSpawn == false){

         thug = thugs.getFirstExists(false);
         thug.animations.play('thugRun');

         if (thug){
            footstepsSound.play();
            thug.reset(800, game.rnd.integerInRange(270, 450));
            thug.body.velocity.x = -200;
            nextThug = game.time.now + (thugRate * game.rnd.integerInRange(2, 3));
         }
      }
   }

   function spawnCrate(){

      if (game.time.now > nextCrate && stopCrateSpawn == false){

         var crate = crates.getFirstExists(false);

         if (crate){
            crate.reset(700, game.rnd.integerInRange(270, 450));
            crate.body.velocity.x = -200;
            nextCrate = game.time.now + (crateRate * game.rnd.integerInRange(1, 2));
         }
      }
   }

   function hide(player, crate){

      alley.autoScroll(0, 0);
      player.animations.paused = true;
      player.animations.frame = 8;
      crate.body.velocity.x  = 0;
      stopCrateSpawn = true;
      hiding = true;
   }

   function stopHide(player, crate){

      alley.autoScroll(-120, 0);
      player.animations.paused = false;
      crate.body.velocity.x = -200;
      nextCrate = game.time.now + crateRate;
      stopCrateSpawn = false;
      hiding = false;
   }

   function killPlayer(){

      gameStarted = false;
      alley.autoScroll(0, 0);
      crates.setAll('body.velocity.x', 0);
      player.kill();
      thug.body.velocity.x = 0;
      thug.animations.paused = true;
      thug.animations.frame = 9;
      gunshotSound.play();
   }

   function playerWin(){

      alley.autoScroll(0, 0);
      crates.setAll('body.velocity.x', 0);
      player.body.velocity.x = 200;
      stopCrateSpawn = true;
      stopThugSpawn = true;
   }

   function playerLose(){

      playerWin();
   }

   function fadeOut(){

      game.add.tween(fade).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 0, false);
   }

};
