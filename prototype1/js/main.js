
window.onload = function() {

    "use strict";

    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

    function preload() {

      game.load.image('background', 'assets/space.jpg');
      game.load.image('earth', 'assets/globe.png');
      game.load.image('meteor', 'assets/meteor.png');
      game.load.image('horseshoe', 'assets/horseshoe.png');
      game.load.audio('collision', 'assets/boom7.wav');
      game.load.audio('impact', 'assets/boom9.wav');
    }

    var score = 0;
    var scoreText;
    var firingRate = 700;
    var nextFire = 0;
    var meteorRate = 2000;
    var nextMeteor = 0;

    var earth;
    var horseshoes;
    var meteors;

    var collisionFX;
    var impactFX;

    function create() {

      game.add.sprite(0, 0, 'background');
      scoreText = game.add.text( 16, 16, "score: 0", { font: "25px Lucida Console", fill: "#ffffff"} );

      earth = game.add.sprite(game.world.centerX, game.world.centerY, 'earth');
      earth.anchor.setTo(0.5, 0.5);
      game.physics.arcade.enable(earth);
      earth.health = 3;

      horseshoes = game.add.group();
      horseshoes.enableBody = true;
      horseshoes.physicsBodyType = Phaser.Physics.ARCADE;
      horseshoes.createMultiple(200, 'horseshoe');

      meteors = game.add.group();
      meteors.enableBody = true;
      meteors.physicsBodyType = Phaser.Physics.ARCADE;
      meteors.createMultiple(200, 'meteor');

      collisionFX = game.add.audio('collision');
      impactFX = game.add.audio('impact');


    }

    function update() {

      if (game.time.now > nextMeteor){
         nextMeteor = game.time.now + meteorRate;
         spawn();
      }
      if (game.input.activePointer.isDown && earth.alive == true){
         fire();
      }
      game.physics.arcade.overlap(meteors, horseshoes, collision);
      game.physics.arcade.overlap(earth, meteors, impact);
    }

    function spawn() {

      var meteor = meteors.getFirstDead();
      meteor.revive();
      var rand = game.rnd.integerInRange(0, 3);
      switch(rand) {
         case 0:
            meteor.reset(0, game.rnd.integerInRange(0, game.world.height));
            break;
         case 1:
            meteor.reset(game.world.width, game.rnd.integerInRange(0, game.world.height));
            break;
         case 2:
            meteor.reset(game.rnd.integerInRange(0, game.world.width), 0);
            break;
         case 3:
            meteor.reset(game.rnd.integerInRange(0, game.world.width), game.world.height);
            break;
      }
      game.physics.arcade.moveToObject(meteor, earth, game.rnd.integerInRange(70, 280));

   }

    function fire() {

      if (game.time.now > nextFire){
         nextFire = game.time.now + firingRate;
         var horseshoe = horseshoes.getFirstDead();
         horseshoe.reset(earth.centerX, earth.centerY);
         game.physics.arcade.moveToPointer(horseshoe, 300);
      }
   }

   function collision(meteor, horseshoe) {

      collisionFX.play();
      meteor.kill();
      horseshoe.kill();
      score += 5;
      scoreText.text = "score: " + score;
   }

   function impact(earth, meteor) {

      impactFX.play();
      meteor.kill();
      earth.health--;
      if (earth.health == 0){
         earth.kill();
      }

   }

};
