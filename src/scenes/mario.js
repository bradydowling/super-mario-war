import Phaser from 'phaser/src/phaser.js';
import levelMap from '../assets/map1-1.json';
import tileItems from '../assets/items.png';
import marioSmall from '../assets/marioSmall.png';

export default class MarioGame extends Phaser.Scene {
  constructor() {
    super({ key: 'Mario' });

    this.map;
    this.layer;
    this.cursors;
    this.jumpButton;
    this.runButton;

    this.player1 = {
      sprite: undefined,
      direction: 'right',
      doNothing: true
    };
  }

  preload() {
    console.log(this.registry.get('player1'));
    this.load.tilemapTiledJSON('map', levelMap);
    this.load.image('tiles', tileItems);
    const spritesheetConfig = {
      frameWidth: 34,
      frameHeight: 34
    };
    this.load.spritesheet('mario', marioSmall, spritesheetConfig);
  }

  create() {
    this.map = this.make.tilemap({ key: 'map' });
    const tiles = this.map.addTilesetImage('items', 'tiles');
    this.layer = this.map.createStaticLayer('Capa de Patrones 1', tiles, 0, 0);
    this.layer.wrap = true;

    this.physics.add.collider(this.player1, this.layer);

    this.player1.sprite = this.physics.add.sprite(50, 50, 'mario');
    this.player1.sprite.setScale(0.47);
    this.player1.sprite.setOrigin(0.5, 0.5);
    this.player1.sprite.setBounce(0);
    this.player1.sprite.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('mario', { frames: [2, 4, 5] }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('mario', { frames: [2, 4, 5] }),
      frameRate: 60,
      repeat: -1
    });
    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('mario', { frames: [6] }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'wait',
      frames: this.anims.generateFrameNumbers('mario', { frames: [0] }),
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
  }

  update() {
    this.player1.doNothing = true;
    if (this.cursors.left.isDown) {
      //mario.sprite.body.acceleration.x = -120;
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

      this.player1.sprite.body.velocity.x -= 5;
      if (this.runButton.isDown) {
        if (this.player1.sprite.body.velocity.x < -200) {
          this.player1.sprite.body.velocity.x = -200;
        }
      } else {
        if (this.player1.sprite.body.velocity.x < -120) {
          this.player1.sprite.body.velocity.x = -120;
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
      this.player1.sprite.body.velocity.x += 5;
      if (this.runButton.isDown) {
        if (this.player1.sprite.body.velocity.x > 200) {
          this.player1.sprite.body.velocity.x = 200;
        }
      } else {
        if (this.player1.sprite.body.velocity.x > 120) {
          this.player1.sprite.body.velocity.x = 120;
        }
      }
      this.player1.doNothing = false;
    }
    if (Phaser.Input.Keyboard.JustDown(this.jumpButton)) {
      if (this.player1.sprite.body.onFloor()) {
        this.player1.sprite.body.velocity.y = -310;
        this.player1.sprite.anims.play('jump', true);
        this.player1.doNothing = false;
      }
    }
    if (this.player1.doNothing) {
      if (this.player1.sprite.body.velocity.x > 10) {
        //mario.sprite.body.acceleration.x = 10;
        this.player1.sprite.body.velocity.x -= 10;
      } else if (this.player1.sprite.body.velocity.x < -10) {
        //mario.sprite.body.acceleration.x = -10;
        this.player1.sprite.body.velocity.x += 10;
      } else {
        //mario.sprite.body.acceleration.x = 0;
        this.player1.sprite.body.velocity.x = 0;
      }
      if (this.player1.sprite.body.onFloor()) {
        this.player1.sprite.anims.play('wait', true);
      }
    }
  }
}
