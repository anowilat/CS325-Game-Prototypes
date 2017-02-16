
window.onload = function() {

   "use strict";



   var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

   function preload() {

      game.load.image('hospital', 'assets/world.jpg');
      game.load.image('walls', 'assets/walls.png');
      game.load.image('room', 'assets/room.png');
      game.load.image('keyroom', 'assets/keyroom.png');
      game.load.image('door', 'assets/door.png');
      game.load.image('screen', 'assets/screen.jpg');
      game.load.spritesheet('player', 'assets/player.png', 61, 95, 16);
      game.load.spritesheet('guard', 'assets/guard.png', 175, 198, 16);
      game.load.audio('music', 'assets/music.mp3');
      game.load.audio('flatline', 'assets/monitor.mp3');
   }

   var cursors;
   var world;
   var walls;
   var room;
   var keyroom;
   var door;
   var fade;
   var message;
   var music;
   var flatline;

   var player;
   var guards;
   var guard1;
   var guard2;
   var guard3;
   var guard4;

   var upWalk;
   var downWalk;
   var rightWalk;
   var leftWalk;
   var guardWalkUp;
   var guardWalkDown;
   var guardWalkRight;
   var guardWalkLeft;

   var haveKey = false;

   function create() {

      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.world.setBounds(0, 0,1408, 2640);
      cursors = game.input.keyboard.createCursorKeys();

      world = game.add.sprite(0, 0, 'hospital');
      game.physics.arcade.enable(world);
      world.body.immovable = true;
      room = game.add.sprite(26, 39, 'room');
      game.physics.arcade.enable(room);
      room.body.immovable = true;
      room.alpha = 0;
      keyroom = game.add.sprite(1192, 1939, 'keyroom');
      game.physics.arcade.enable(keyroom);
      keyroom.body.immovable = true;
      keyroom.alpha = 0;
      door = game.add.sprite(20, 288, 'door');
      game.physics.arcade.enable(door);
      door.body.immovable = true;
      door.alpha = 0;

      guards = game.add.group();
      guards.physicsBodyType = Phaser.Physics.ARCADE;
      guards.enableBody = true;
      guard1 = guards.create(10, 2050, 'guard');
      guard2 = guards.create(1000, 1730, 'guard');
      guard3 = guards.create(930, 290, 'guard');
      guard4 = guards.create(90, 290, 'guard');
      player = game.add.sprite(788, 1935, 'player');
      game.physics.arcade.enable(player);
      player.enableBody = true;
      player.anchor.setTo(0.5, 0.5);
      player.body.collideWorldBounds = true;

      downWalk = player.animations.add('downWalk', [0, 1, 2, 3, 0]);
      leftWalk = player.animations.add('leftWalk', [4, 5, 6, 7, 4]);
      rightWalk = player.animations.add('rightWalk', [8, 9, 10, 11, 8]);
      upWalk = player.animations.add('upWalk', [12, 13, 14, 15, 12]);
      guardWalkDown = guards.callAll('animations.add', 'animations', 'guardWalkDown', [0, 1, 2, 3, 0], 6, true);
      guardWalkLeft = guards.callAll('animations.add', 'animations', 'guardWalkLeft', [4, 5, 6, 7, 4], 6, true);
      guardWalkRight = guards.callAll('animations.add', 'animations', 'guardWalkRight', [8, 9, 10, 11, 8], 6, true);
      guardWalkUp = guards.callAll('animations.add', 'animations', 'guardWalkUp', [12, 13, 14, 15, 12], 6, true);

      message = game.add.text( game.world.centerX - 150, 16, " ", { font: "25px Lucida Console", fill: "#ffffff"} );
      message.fixedToCamera = true;
      music = game.add.audio('music');
      flatline = game.add.audio('flatline');
      music.loop = true;
      music.play();
      fade = game.add.sprite(0, 0, 'screen');
      fade.fixedToCamera = true;
      fade.visible = false;

      game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

   }

   function update() {

      game.physics.arcade.overlap(player, guards, caught);
      game.physics.arcade.overlap(player, door, lockedDoor);
      game.physics.arcade.overlap(player, keyroom, getKey);
      game.physics.arcade.overlap(player, room, end);

      if (guard1.y == 2050){
         game.add.tween(guard1.body).to( { y: 1200 }, 5000, Phaser.Easing.Linear.None, true);
         guard1.animations.play('guardWalkUp');
      }
         else if (guard1.y == 1200){
            game.add.tween(guard1.body).to( { y: 2050 }, 5000, Phaser.Easing.Linear.None, true);
            guard1.animations.play('guardWalkDown');
         }
      if (guard2.y == 1730){
         game.add.tween(guard2.body).to( { y: 2400 }, 5000, Phaser.Easing.Linear.None, true);
         guard2.animations.play('guardWalkDown');
      }
         else if (guard2.y == 2400){
            game.add.tween(guard2.body).to( { y: 1730 }, 5000, Phaser.Easing.Linear.None, true);
            guard2.animations.play('guardWalkUp');
         }
      if (guard3.y == 290){
         game.add.tween(guard3.body).to( { y: 730 }, 5000, Phaser.Easing.Linear.None, true);
         guard3.animations.play('guardWalkDown');
      }
         else if (guard3.y == 730){
            game.add.tween(guard3.body).to( { y: 290 }, 5000, Phaser.Easing.Linear.None, true);
            guard3.animations.play('guardWalkUp');
         }
      if (guard4.x == 90){
         game.add.tween(guard4.body).to( { x: 930 }, 5000, Phaser.Easing.Linear.None, true);
         guard4.animations.play('guardWalkRight');
      }
         else if (guard4.x == 930){
            game.add.tween(guard4.body).to( { x: 90 }, 5000, Phaser.Easing.Linear.None, true);
            guard4.animations.play('guardWalkLeft');
         }

      if (cursors.up.isDown && (player.overlap(door) == false || haveKey == true)){
         player.y -= 2.5;
         player.animations.play('upWalk', 8, false);
      }
      else if (cursors.down.isDown){
         player.y += 2.5;
         player.animations.play('downWalk', 8, false);
      }
      if (cursors.left.isDown){
         player.x -= 2.5;
         player.animations.play('leftWalk', 8, false);
      }
      else if (cursors.right.isDown){
         player.x += 2.5;
         player.animations.play('rightWalk', 8, false);
      }
}

   function caught(player, guard) {

      player.kill();
      message.text = "You've been apprehended.";
      game.camera.follow(guard, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
   }

   function lockedDoor(player, door) {

      if (haveKey == false){
         message.text = "The door is locked. You need a key.";
      }
   }

   function getKey(){

      haveKey = true;
      message.text = "You find a key.";
      keyroom.kill();
   }


   function end(){

      room.kill();
      game.camera.fade(0x000000, 4000);
      flatline.play();
      game.time.events.add(Phaser.Timer.SECOND * 4, playFinal, this);
   }

   function playFinal(){

      fade.visible = true;
      game.camera.resetFX();
      var text1 = game.add.text( 50, 200, "You see the target. \nThe transplant operation seems to have gone well.\n\n\nYou inject the cyanide.\n\n\n\n\nTime to report back.", { font: "15px Lucida Console", fill: "#ffffff"} );
      text1.fixedToCamera = true;
   }

};
