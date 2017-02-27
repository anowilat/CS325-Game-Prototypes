
window.onload = function() {

   "use strict";

   var game = new Phaser.Game(800, 608, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

   function preload() {

      game.load.tilemap('reef', 'assets/reef.json', null, Phaser.Tilemap.TILED_JSON);
      game.load.image('intro', 'assets/intro.png');
      game.load.image('lose', 'assets/lose.png');
      game.load.image('water', 'assets/tiles/MS3-Mission3Underwater.png');
      game.load.image('walls', 'assets/tiles/HF1_A4_1.png');
      game.load.image('plants1', 'assets/tiles/HF2_Outside_5.png');
      game.load.image('plants2', 'assets/tiles/HF2_Outside__1.png');
      game.load.spritesheet('diver', 'assets/diver.png', 58, 39, 18);
      game.load.spritesheet('coral', 'assets/coral.png', 99, 92, 16);
      game.load.spritesheet('button', 'assets/start-sheet.png', 150, 64);
      game.load.audio('ocean', 'assets/dive_deep.mp3');
      game.load.audio('die', 'assets/die.wav');
      game.load.audio('health', 'assets/health.wav');
   }

   var reef;
   var walls;
   var diver;
   var coral;
   var coral1;
   var coral2;
   var coral3;
   var coral4;
   var coral5;
   var coral6;
   var count = 6;

   var leftSwim;
   var rightSwim;

   var intro;
   var button;
   var lose;
   var oceanSounds;
   var dieSound;
   var healthSound;

   var deathRate = 100000;
   var score = 0;
   var scoreText;

   function create() {

      game.physics.startSystem(Phaser.Physics.ARCADE);
      game.world.setBounds(0, 0, 1440, 640);

      reef = game.add.tilemap('reef');
      game.physics.arcade.enable(reef);
      reef.addTilesetImage('Water', 'water');
      reef.addTilesetImage('Wall', 'walls');
      reef.addTilesetImage('Plants', 'plants1');
      reef.addTilesetImage('Plants2', 'plants2');
      reef.createLayer('Background');
      reef.createLayer('Plants');
      walls = reef.createLayer('Walls');
      reef.setCollisionBetween(5810, 5850, true, 'Walls');

      diver = game.add.sprite(79, 95, 'diver');
      game.physics.arcade.enable(diver);
      diver.anchor.setTo(0.5, 0.5);
      diver.body.collideWorldBounds = true;

      coral = game.add.group();
      coral.physicsBodyType = Phaser.Physics.ARCADE;
      coral.enableBody = true;
      coral1 = coral.create(235, 40, 'coral'); coral1.health = 3;
      coral2 = coral.create(670, 455, 'coral'); coral2.health = 2;
      coral3 = coral.create(790, 300, 'coral'); coral3.health = 2;
      coral4 = coral.create(1000, 535, 'coral'); coral4.health = 3;
      coral5 = coral.create(1080, 30, 'coral'); coral5.health = 2;
      coral6 = coral.create(200, 535, 'coral'); coral6.health = 2;

      coral.callAll('animations.add', 'animations', 'navyShimmer', [0, 4], 2, true);
      coral.callAll('animations.add', 'animations', 'redShimmer', [1, 5], 2, true);
      coral.callAll('animations.add', 'animations', 'blueShimmer', [2, 6], 2, true);
      coral.callAll('animations.add', 'animations', 'purpleShimmer', [3, 7], 2, true);
      coral.callAll('animations.add', 'animations', 'navyDying', [8], 0, true);
      coral.callAll('animations.add', 'animations', 'redDying', [9], 0, true);
      coral.callAll('animations.add', 'animations', 'blueDying', [10], 0, true);
      coral.callAll('animations.add', 'animations', 'purpleDying', [11], 0, true);
      coral.callAll('animations.add', 'animations', 'navyDead', [12], 0, true);
      coral.callAll('animations.add', 'animations', 'redDead', [13], 0, true);
      coral.callAll('animations.add', 'animations', 'blueDead', [14], 0, true);
      coral.callAll('animations.add', 'animations', 'purpleDead', [15], 0, true);

      leftSwim = diver.animations.add('leftSwim', [0, 1, 2, 3, 4, 5, 6, 7]);
      rightSwim = diver.animations.add('rightSwim', [9, 10, 11, 12, 13, 14, 15, 16]);

      game.camera.follow(diver, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

      scoreText = game.add.text( 16, 16, "score: 0", { font: "25px Lucida Console", fill: "#ffffff"} );
      scoreText.fixedToCamera = true;
      intro = game.add.sprite(0, 0, 'intro');
      button = game.add.button(325, 425, 'button', startGame, this, 1, 2, 0);
      lose = game.add.sprite(225, 350, 'lose');
      lose.fixedToCamera = true;
      lose.visible = false;

      dieSound = game.add.audio('die');
      healthSound = game.add.audio('health');
      oceanSounds = game.add.audio('ocean');
      oceanSounds.loop = true;
      oceanSounds.play();
   }

   function update() {

      game.physics.arcade.collide(walls, diver);
      game.physics.arcade.overlap(diver, coral, healCoral);

      if (intro.visible == false && lose.visible == false){
         coral.forEach(function(corals){
            if (corals.health == 3){
               if (coral.getIndex(corals) == 0){
                  corals.animations.play('navyShimmer');
               }
               if (coral.getIndex(corals) == 1 || coral.getIndex(corals) == 4){
                  corals.animations.play('redShimmer');
               }
               if (coral.getIndex(corals) == 2){
                  corals.animations.play('purpleShimmer');
               }
               if (coral.getIndex(corals) == 3 || coral.getIndex(corals) == 5){
                  corals.animations.play('blueShimmer');
               }
            }
            if (corals.health <= 2 && corals.health > 0){
               if (coral.getIndex(corals) == 0 || coral.getIndex(corals) == 5){
                  corals.animations.play('navyDying');
               }
               if (coral.getIndex(corals) == 1 || coral.getIndex(corals) == 4){
                  corals.animations.play('redDying');
               }
               if (coral.getIndex(corals) == 2){
                  corals.animations.play('purpleDying');
               }
               if (coral.getIndex(corals) == 3 || coral.getIndex(corals) == 5){
                  corals.animations.play('blueDying');
               }
            }
            if (corals.health == 0){
               if (coral.getIndex(corals) == 0 || coral.getIndex(corals) == 5){
                  corals.animations.play('navyDead');
               }
               if (coral.getIndex(corals) == 1 || coral.getIndex(corals) == 4){
                  corals.animations.play('redDead');
               }
               if (coral.getIndex(corals) == 2){
                  corals.animations.play('purpleDead');
               }
               if (coral.getIndex(corals) == 3 || coral.getIndex(corals) == 5){
                  corals.animations.play('blueDead');
               }
            }
         }, this);


         if (game.time.now > deathRate){
            deathRate += 7000;
            var i = game.rnd.integerInRange(0, 5);
            hurtCoral(coral.children[i]);
         }

         if (count == 0){
            lose.visible = true;
         }

         if (game.input.mousePointer.isDown){
            if (game.input.activePointer.x < diver.x - game.camera.x) {
               diver.animations.play('leftSwim', 5, false);
            }
            else {
               diver.animations.play('rightSwim', 5, false);
            }
            game.physics.arcade.moveToPointer(diver, 75);

            if (Phaser.Rectangle.contains(diver.body, game.input.x, game.input.y)){
               diver.body.velocity.setTo(0, 0);
            }
         }
         else {
            diver.body.velocity.setTo(0, 0);
         }
      }
   }

   function startGame(){

      button.pendingDestroy = true;
      intro.visible = false;
      deathRate = game.time.now + 7000;
   }

   function healCoral(diver, corals){

      if (corals.health >= 1 && corals.health < 3){
         corals.health = 3;
         healthSound.play();
         score += 5;
         scoreText.text = "score: " + score;
      }
   }

   function hurtCoral(corals){

      if (corals.health > 0){
         corals.health--;
         if (corals.health == 0){
            dieSound.play();
            count--;
         }
      }
   }

};
