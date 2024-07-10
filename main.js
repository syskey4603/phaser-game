var config = {
    type: Phaser.AUTO,
    scale: {
        // Fit to window
        mode: Phaser.Scale.RESIZE,
        // Center vertically and horizontally
        autoCenter: Phaser.Scale.CENTER_BOTH
        },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    }
  };
  
  var keys;
  var player;
  var text;
  var platforms;
  var spaceBar;
  var lasers;
  var box;
  var game = new Phaser.Game(config);
  var lastFired = 0; 
  var facingRight = true;
  var score = 0;
  var scoreText;
  var livesText;
  var timeskilled = 0;
  var lives = 3;
  var boxgravity = 10;
  var boxX = 300;
  var boxY = 0;
  var stringY = boxY - 100;
  var pauseButton;
  var resumeButton;
  var baloon;
  var baloonY = stringY - 100;
  var numofbaloons = 1;
  var gameOverText;
  var jumpPower = -500;
  var jumpPowerForText = 500;
  var jumPowerText;
  var gameWonText;
  var playerx;
  var playery;
  var pauseboxX;
  var pauseboxY;
  var pausestringX;
  var pausestringY;
  var pausebaloonX;
  var pausebaloonY;
  
  function preload() {
    this.load.spritesheet("dude", "assets/dude.png", { frameWidth: 32, frameHeight: 48 });
    this.load.image('ground', 'assets/platform.png');
    this.load.image('box', 'assets/box.png');
    this.load.image('laser', 'assets/laser.png');
    this.load.image('string', 'assets/string.png')
    this.load.image('baloon', 'assets/baloon.png')
    console.log("loaded");
  }
  
  function loselive(box, platform) {
    if(lives > 0) {
      lives -= 1;
      resetBox(box)
      livesText.setText('lives: ' + lives);
    }
    else {
      box.disableBody(true, true);
      string.disableBody(true, true);
      baloon.disableBody(true, true);
      gameOverText.visible = true;
      jumPowerText.visible = false;
      game.scene.pause('default')
      
    }
  
  }
  
  function create() {
    pauseButton = this.add.text(400, 30, 'pause', { fill: '#0f0' });
    pauseButton.setInteractive();
    pauseButton.on('pointerdown', () => pause());
    resumeButton = this.add.text(500, 30, 'resume', {fill: '#0f0'});
    resumeButton.setInteractive();
    resumeButton.on('pointerdown', () => resume());
    platforms = this.physics.add.sprite(window.screen.width/2, window.screen.height-200, 'ground')
    platforms.displayWidth = window.screen.width
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#FFFFFF' });
    livesText = this.add.text(600, 16, 'lives: 3', { fontSize: '32px', fill: '#FFFFFF' });
    gameOverText = this.add.text(180, 250, 'GAME OVER', {font: '80px bold', fill: '#FF0000'})
    gameOverText.visible = false;
    gameWonText = this.add.text(180, 250, 'GAME WON', {font: '80px bold', fill: '#FFD700'})
    gameWonText.visible = false;
    jumPowerText = this.add.text(630, 300, 'jump power: 500%', {fontSize: '15px', fill: '#FFFFFF'})
    keys = this.input.keyboard.addKeys("W,A,S,D");
    spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    downArrow = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    upArrow = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
  
  
    console.log("keys", keys);
  
    player = this.physics.add.sprite(200, 500, "dude");
    player.body.setGravityY(300);
    box = this.physics.add.sprite(boxX, boxY, 'box');
    string = this.physics.add.sprite(boxX, stringY, 'string');
    baloon = this.physics.add.sprite(boxX, baloonY, 'baloon')
    box.body.setGravityY(boxgravity);
    player.setCollideWorldBounds(true);
    platforms.setCollideWorldBounds(true);
    platforms.body.setDrag(500, 1000);
    platforms.body.setAllowGravity(false);
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(box, platforms, loselive);
    this.physics.add.collider(box, player);
    box.setCollideWorldBounds(true);
    box.body.setDrag(1000,0)
    lasers = this.physics.add.group({
        defaultKey: 'laser',
        maxSize: 20
    });
  
    lasers.createMultiple({
        quantity: 20,
        key: 'laser',
        active: false,
        visible: false
    });
  
    this.physics.world.on('worldbounds', function (body) {
      if (body.gameObject.texture.key === 'laser') {
          resetLaser(body.gameObject);
      }
    });
  
    this.physics.add.collider(lasers, box, boxhit);
    this.physics.add.collider(lasers, baloon, baloonhit);
  
  
  
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
  });
  
  this.anims.create({
      key: 'turn',
      frames: [ { key: 'dude', frame: 4 } ],
      frameRate: 20
  });
  
  this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
  });
  
  }
  
  function resetLaser(laser) {
    laser.disableBody(true, true);
  }
  
  function randomInt(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  
  function resetBox(box) {
    box.disableBody(true, true);
    baloon.disableBody(true, true);
    string.disableBody(true, true);
    setTimeout(50000)
    boxgravity += 15
    box.body.setGravityY(boxgravity);
    boxX = randomInt(15, window.screen.width)
    box.enableBody(true, boxX, 0, true, true);
    string.enableBody(true, boxX, 0, true, true);
    baloon.enableBody(true, boxX, 0, true, true);
    numofbaloons = 1;
    
    
  }
  
  function boxhit(box, laser) {
    if(laser.active) {
      resetLaser(laser)
    }
  }
  
  function resetBaloon(baloon) {
    string.disableBody(true, true);
    baloon.disableBody(true, true);
  
  
  }
  function baloonhit(baloon, laser) {
    if(score == 150) {
      box.disableBody(true, true);
      string.disableBody(true, true);
      baloon.disableBody(true, true);
      gameWonText.visible = true;
      jumPowerText.visible = false;
      game.scene.pause('default')
  
    }
    if(laser.active) {
      resetLaser(laser)
      numofbaloons -= 1
      resetBaloon(baloon)
      console.log(numofbaloons)
      if (numofbaloons == 0) {
        score += 10
        scoreText.setText('Score: ' + score);
        timeskilled += 1
        resetBox(box)
        
      }
    }
  }
  
  function pause() {
    game.scene.pause('default')
  
  }
  function resume() {
    game.scene.resume('default')
    
  }
  function restartGame() {
    game.scene.start('default')
  }
  
  function update(time, delta) {
    stringY = box.body.position.y - 20;
    string.setPosition(box.body.position.x+50, stringY);
    baloonY = string.body.position.y - 25;
    baloon.setPosition(string.body.position.x, baloonY);
  
    if (keys.A.isDown) {
        player.setVelocityX(-300);
        facingRight = false; 
        player.anims.play('left', true);
    } else if (keys.D.isDown) {
        player.setVelocityX(300);
        facingRight = true; 
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }
  
    if (keys.W.isDown && player.body.touching.down) {
        player.setVelocityY(jumpPower);
    }
    if (keys.S.isDown) {
      player.setVelocityY(200);
    }
    if (downArrow.isDown) {
      if (jumpPower < 200)  {
        jumpPower += 10
        jumpPowerForText -= 10;
        jumPowerText.setText('jump power: ' + jumpPowerForText + "%");
      }
  
    }
    if (upArrow.isDown) {
      if (jumpPower > -550)  {
        jumpPower -= 10
        jumpPowerForText += 10
        jumPowerText.setText('jump power: ' + jumpPowerForText + "%");
        }
    }
    
  
    if (spaceBar.isDown && time > lastFired) {
        fireLaser();
        lastFired = time + 300;
        console.log("shooting");
    }
  }
  
  function fireLaser() {
    var laser = lasers.getFirstDead(false);
    if (laser) {
        laser.enableBody(true, player.x, player.y - 5, true, true);
        laser.body.setAllowGravity(false);
        laser.body.velocity.x = facingRight ? 500 : -500;
        laser.body.onWorldBounds = true;
        laser.setCollideWorldBounds(true);
    }
  }