import Phaser from 'phaser/src/phaser.js';
import levelMap from '../assets/levels/map2.json';
import tiles_classic from '../assets/levels/tilesets/classic-large.png';
import tiles_smb1 from '../assets/levels/tilesets/smb1-large.png';
import gameplay_music from '../assets/sounds/smb3level1.ogg';
import jump_sound from '../assets/sounds/sfx/jump.wav';
import start_sound from '../assets/sounds/sfx/announcer/enter-stage.wav';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

export default class Gameplay extends Phaser.Scene {
  constructor() {
    super({ key: 'Gameplay' });

    this.map;
    this.visualLayer;
    this.collidesLayer;
    this.cursors;
    this.jumpButton;
    this.runButton;
    this.movement = {
      runDeceleration: 15,
      runAcceleration: 5,
      runSpeed: 120,
      sprintSpeed: 200,
      jump: 500
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
    this.load.image('tiles', tiles_smb1);
    const spritesheetConfig = {
      frameWidth: 32,
      frameHeight: 32
    };
    this.load.spritesheet('player1', p1image, spritesheetConfig);

    this.load.audio('gameplay_music', gameplay_music);
    this.load.audio('jump_sound', jump_sound);
    this.load.audio('start_sound', start_sound);
  }

  create() {
    this.map = this.make.tilemap({ key: 'map' });
    const tiles = this.map.addTilesetImage('smb1-large', 'tiles');
    this.visualLayer = this.map.createStaticLayer('TileLayer', tiles, 0, 0);
    this.collidesLayer = this.map.createStaticLayer(
      'CollidesLayer',
      tiles,
      0,
      0
    );
    this.visualLayer.wrap = true;

    this.player1.sprite = this.physics.add.sprite(50, 50, 'player1');
    this.player1.sprite.setScale(1);
    this.player1.sprite.setOrigin(0.5, 0.5);
    this.player1.sprite.setBounce(0);

    this.physics.add.collider(this.player1.sprite, this.collidesLayer);
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

    // This makes it so I can enable collisions with player1 and this layer in the coming lines
    this.physics.add.collider(this.player1.sprite, this.collidesLayer);
    // This enables collisions on Tiled layers that have the 'collides' property set to true
    this.collidesLayer.setCollisionByProperty({ collides: true });

    const debugGraphics = this.add.graphics().setAlpha(0.75);
    this.collidesLayer.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });

    const music_config = {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0
    };
    this.music = this.sound.add('gameplay_music', music_config);
    this.music.play();

    this.soundEffects.jump = this.sound.add('jump_sound');
    this.soundEffects.start_sound = this.sound.add('start_sound');

    this.soundEffects.start_sound.play();
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
