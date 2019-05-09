import Phaser from 'phaser/src/phaser.js';
import levelMap from '../assets/map1-1.json';
import tileItems from '../assets/items.png';
import gameplay_music from '../assets/sounds/smb3level1.ogg';
import jump_sound from '../assets/sounds/sfx/jump.wav';

export default class Gameplay extends Phaser.Scene {
  constructor() {
    super({ key: 'Gameplay' });

    this.map;
    this.layer;
    this.cursors;
    this.jumpButton;
    this.runButton;
    this.movement = {
      runDeceleration: 15,
      runAcceleration: 5,
      runSpeed: 120,
      sprintSpeed: 200,
      jump: 310
    };

    this.player1 = {
      sprite: undefined,
      direction: 'right',
      doNothing: true
    };

    this.music;
    this.soundEffects = {};
  }

  preload() {
    const p1image = require(`../assets/${this.registry.get('player1img')}`);
    this.load.tilemapTiledJSON('map', levelMap);
    this.load.image('tiles', tileItems);
    const spritesheetConfig = {
      frameWidth: 32,
      frameHeight: 32
    };
    this.load.spritesheet('player1', p1image, spritesheetConfig);

    this.load.audio('gameplay_music', gameplay_music);
    this.load.audio('jump_sound', jump_sound);
  }

  create() {
    this.map = this.make.tilemap({ key: 'map' });
    const tiles = this.map.addTilesetImage('items', 'tiles');
    this.layer = this.map.createStaticLayer('Capa de Patrones 1', tiles, 0, 0);
    this.layer.wrap = true;

    this.physics.add.collider(this.player1, this.layer);

    this.player1.sprite = this.physics.add.sprite(50, 50, 'player1');
    this.player1.sprite.setScale(1);
    this.player1.sprite.setOrigin(0.5, 0.5);
    this.player1.sprite.setBounce(0);
    // this.player1.sprite.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player1', { frames: [0, 1] }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player1', { frames: [0, 1] }),
      frameRate: 60,
      repeat: -1
    });
    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('player1', { frames: [2] }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'wait',
      frames: this.anims.generateFrameNumbers('player1', { frames: [0] }),
      frameRate: 10,
      repeat: -1
    });

    this.player1.sprite.body.fixedRotation = true;

    this.cursors = this.input.keyboard.createCursorKeys();
    this.jumpButton = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.runButton = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SHIFT
    );

    // TODO: Don't know if these two lines do anything
    this.physics.add.collider(this.player1.sprite, this.layer);
    this.layer.setCollisionByProperty({ collides: true });

    this.layer.setCollision([10, 13, 17, 40]);
    this.layer.setCollisionBetween(14, 16);
    this.layer.setCollisionBetween(21, 22);
    this.layer.setCollisionBetween(27, 28);

    this.music = this.sound.add('gameplay_music');
    this.music.play('', 0, 1, true);

    this.soundEffects.jump = this.sound.add('jump_sound');
  }

  update() {
    this.player1.doNothing = true;
    if (this.cursors.left.isDown) {
      if (this.player1.direction != 'left') {
        this.player1.sprite.flipX = true;
        this.player1.direction = 'left';
      }
      if (
        this.player1.sprite.body.velocity.x == 0 ||
        (this.player1.sprite.anims.currentAnim.key != 'left' &&
          this.player1.sprite.body.onFloor())
      ) {
        this.player1.sprite.anims.play('left', true);
      }

      this.player1.sprite.body.velocity.x -= this.movement.runAcceleration;
      if (this.runButton.isDown) {
        if (this.player1.sprite.body.velocity.x < -this.movement.sprintSpeed) {
          this.player1.sprite.body.velocity.x = -this.movement.sprintSpeed;
        }
      } else {
        if (this.player1.sprite.body.velocity.x < -this.movement.runSpeed) {
          this.player1.sprite.body.velocity.x = -this.movement.runSpeed;
        }
      }
      this.player1.doNothing = false;
    } else if (this.cursors.right.isDown) {
      if (this.player1.direction != 'right') {
        this.player1.sprite.flipX = false;
        this.player1.direction = 'right';
      }
      if (
        this.player1.sprite.body.velocity.x == 0 ||
        (this.player1.sprite.anims.currentAnim.key != 'left' &&
          this.player1.sprite.body.onFloor())
      ) {
        this.player1.sprite.anims.play('left', true);
      }
      this.player1.sprite.body.velocity.x += this.movement.runAcceleration;
      if (this.runButton.isDown) {
        if (this.player1.sprite.body.velocity.x > this.movement.sprintSpeed) {
          this.player1.sprite.body.velocity.x = this.movement.sprintSpeed;
        }
      } else {
        if (this.player1.sprite.body.velocity.x > this.movement.runSpeed) {
          this.player1.sprite.body.velocity.x = this.movement.runSpeed;
        }
      }
      this.player1.doNothing = false;
    }
    if (Phaser.Input.Keyboard.JustDown(this.jumpButton)) {
      if (this.player1.sprite.body.onFloor()) {
        this.player1.sprite.body.velocity.y = -this.movement.jump;
        this.player1.sprite.anims.play('jump', true);
        this.soundEffects.jump.play('', 0, 1, false);
        this.player1.doNothing = false;
      }
    }
    if (this.player1.doNothing) {
      if (this.player1.sprite.body.velocity.x > this.movement.runDeceleration) {
        this.player1.sprite.body.velocity.x -= this.movement.runDeceleration;
      } else if (
        this.player1.sprite.body.velocity.x < -this.movement.runDeceleration
      ) {
        this.player1.sprite.body.velocity.x += this.movement.runDeceleration;
      } else {
        this.player1.sprite.body.velocity.x = 0;
      }
      if (this.player1.sprite.body.onFloor()) {
        this.player1.sprite.anims.play('wait', true);
      }
    }

    // Loop players from the left side of the screen and vice versa
    if (this.player1.sprite.x < 0) {
      this.player1.sprite.x = 640;
    }
    if (this.player1.sprite.x > 640) {
      this.player1.sprite.x = 0;
    }
  }
}
