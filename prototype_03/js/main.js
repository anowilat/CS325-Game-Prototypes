
window.onload = function() {

   "use strict";

   var game = new Phaser.Game(800, 428, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

   function preload() {

      game.load.image('stage', 'assets/stage.jpg');
      game.load.spritesheet('wheel', 'assets/wheel-sheet.png', 600, 601, 10);
      game.load.spritesheet('red', 'assets/redbutton.jpg', 40, 34);
      game.load.spritesheet('blue', 'assets/bluebutton.jpg', 40, 34);
      game.load.spritesheet('green', 'assets/greenbutton.jpg', 40, 34);
      game.load.spritesheet('yellow', 'assets/yellowbutton.jpg', 40, 34);
      game.load.spritesheet('orange', 'assets/orangebutton.jpg', 40, 34);
      game.load.spritesheet('purple', 'assets/purplebutton.jpg', 40, 34);
      game.load.spritesheet('pink', 'assets/pinkbutton.jpg', 40, 34);
      game.load.spritesheet('white', 'assets/whitebutton.jpg', 40, 34);
      game.load.spritesheet('grey', 'assets/greybutton.jpg', 40, 34);
      game.load.spritesheet('black', 'assets/blackbutton.jpg', 40, 34);
      game.load.spritesheet('chameleon', 'assets/chameleon-sheet.png', 93, 154, 11);
      game.load.image('startNote', 'assets/startNote.jpg');
      game.load.image('endNote', 'assets/endNote.jpg');
      game.load.audio('win', 'assets/win.wav');
      game.load.audio('theme', 'assets/theme.mp3');

   }

   var wheel;
   var chameleon;

   var red;
   var blue;
   var green;
   var yellow;
   var orange;
   var purple;
   var pink;
   var white;
   var grey;
   var black;

   var startNote;
   var endNote;

   var spin;
   var stopSpin = 4000;
   var nextSpin = 6000;

   var winSound;
   var theme;

   var wheelState;
   var chamState;
   var score = 0;
   var scoreText;
   var scoreNum;
   var play = true;


   function create() {

      game.add.sprite(0, 0, 'stage');
      wheel = game.add.sprite(182, 118, 'wheel');
      chameleon = game.add.sprite(430, 115, 'chameleon');

      red = game.add.button(26, 17, 'red', red, this, 1, 2, 0);
      blue = game.add.button(87, 17, 'blue', blue, this, 1, 2, 0);
      green = game.add.button(26, 77, 'green', green, this, 1, 2, 0);
      yellow = game.add.button(26, 138, 'yellow', yellow, this, 1, 2, 0);
      orange = game.add.button(87, 77, 'orange', orange, this, 1, 2, 0);
      purple = game.add.button(26, 259, 'purple', purple, this, 1, 2, 0);
      pink = game.add.button(87, 138, 'pink', pink, this, 1, 2, 0);
      white = game.add.button(26, 199, 'white', white, this, 1, 2, 0);
      grey = game.add.button(87, 199, 'grey', grey, this, 1, 2, 0);
      black = game.add.button(87, 259, 'black', black, this, 1, 2, 0);

      scoreText = game.add.text(33, 335, "score", { font: "28px Lucida Console", fill: "#000000"} );
      scoreNum = game.add.text(42, 382, "0", { font: "28px Lucida Console", fill: "#ffffff"} );
      startNote = game.add.sprite(215, 100, 'startNote');
      endNote = game.add.sprite(220, 330, 'endNote');
      endNote.visible = false;

      winSound = game.add.audio('win');
      theme = game.add.audio('theme');
      theme.loop = true;
      theme.play();

      wheel.animations.add('spin');

   }

   function update() {

      if (startNote.visible == false){
         if (game.time.now > stopSpin && play == true){
            stopSpin += 6000;
            stopWheel();
         }
         if (game.time.now > nextSpin && play == true){
            nextSpin += 6000;
            isMatch();
         }
         if (play == false){
            endNote.visible = true;
            chameleon.animations.frame = 0;
            wheel.animations.paused = true;

         }
      }
      if (game.input.activePointer.isDown && startNote.visible == true){
         startNote.visible = false;
         wheel.animations.play('spin', 10, true);
         stopSpin = game.time.now + 4000;
         nextSpin = game.time.now + 6000;
      }

   }

   function stopWheel() {

      wheelState = game.rnd.integerInRange(0, 9);
      wheel.animations.paused = true;
      wheel.animations.frame = wheelState;
   }

   function isMatch() {

      wheel.animations.paused = false;

      if (wheelState == chamState){
         score += 10;
         scoreNum.text = "" + score;
         winSound.play();
      }
      else {
         play = false;
      }
   }

   function orange() {
      chamState = 0;
      chameleon.animations.frame = chamState + 1;
   }

   function purple() {
      chamState = 1;
      chameleon.animations.frame = chamState + 1;
   }

   function black() {
      chamState = 2;
      chameleon.animations.frame = chamState + 1;
   }

   function yellow() {
      chamState = 3;
      chameleon.animations.frame = chamState + 1;
   }

   function red() {
      chamState = 4;
      chameleon.animations.frame = chamState + 1;
   }

   function pink() {
      chamState = 5;
      chameleon.animations.frame = chamState + 1;
   }

   function green() {
      chamState = 6;
      chameleon.animations.frame = chamState + 1;
   }

   function white() {
      chamState = 7;
      chameleon.animations.frame = chamState + 1;
   }

   function grey() {
      chamState = 8;
      chameleon.animations.frame = chamState + 1;
   }

   function blue() {
      chamState = 9;
      chameleon.animations.frame = chamState + 1;
   }
};
