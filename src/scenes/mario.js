import Phaser from 'phaser/src/phaser.js';
import levelMap from '../assets/map1-1.json';
import tileItems from '../assets/items2.png';
import marioSmall from '../assets/marioSmall.png';

export default class MarioGame extends Phaser.Scene {
  constructor() {
    super({ key: 'Mario' });

    this.map;
    this.layer;
    this.cursors;
    this.jumpButton;
    this.runButton;

    this.mario = {
      sprite: undefined,
      direction: 'right',
      doNothing: true
    };
  }

  preload() {
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

    this.physics.add.collider(this.mario, this.layer);

    this.mario.sprite = this.physics.add.sprite(50, 50, 'mario');
    this.mario.sprite.setScale(0.47);
    this.mario.sprite.setOrigin(0.5, 0.5);
    this.mario.sprite.setBounce(0);
    this.mario.sprite.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('mario', { frames: [2, 4, 5] }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'space',
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

    this.mario.sprite.body.fixedRotation = true;

    this.cursors = this.input.keyboard.createCursorKeys();
    this.jumpButton = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.runButton = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SHIFT
    );
  }

  update() {
    this.mario.doNothing = true;
    if (this.cursors.left.isDown) {
      //mario.sprite.body.acceleration.x = -120;
      if (this.mario.direction != 'left') {
        // FIXME: Need to turn the guy around somehow
        // this.mario.sprite.scale.x *= -1;
        this.mario.direction = 'left';
      }
      if (
        this.mario.sprite.body.velocity.x == 0 ||
        (this.mario.sprite.anims.currentAnim.key != 'left' &&
          this.mario.sprite.body.onFloor())
      ) {
        this.mario.sprite.anims.play('left', true);
      }

      this.mario.sprite.body.velocity.x -= 5;
      if (this.runButton.isDown) {
        if (this.mario.sprite.body.velocity.x < -200) {
          this.mario.sprite.body.velocity.x = -200;
        }
      } else {
        if (this.mario.sprite.body.velocity.x < -120) {
          this.mario.sprite.body.velocity.x = -120;
        }
      }
      this.mario.doNothing = false;
    }
    if (this.mario.doNothing) {
      if (this.mario.sprite.body.velocity.x > 10) {
        //mario.sprite.body.acceleration.x = 10;
        this.mario.sprite.body.velocity.x -= 10;
      } else if (this.mario.sprite.body.velocity.x < -10) {
        //mario.sprite.body.acceleration.x = -10;
        this.mario.sprite.body.velocity.x += 10;
      } else {
        //mario.sprite.body.acceleration.x = 0;
        this.mario.sprite.body.velocity.x = 0;
      }
      if (this.mario.sprite.body.onFloor()) {
        this.mario.sprite.anims.play('wait', 20, true);
      }
    }
  }
}
