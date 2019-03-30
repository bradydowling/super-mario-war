import { HEIGHT, SCALE, WIDTH } from '../config/constants';

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
    this.scene.start('Mario');
    // this.physics.startSystem(Phaser.Physics.ARCADE);
    // this.stage.backgroundColor = '#5C94FC';

    this.map = this.make.tilemap({ key: 'map' });
    console.log(this.map);
    const tiles = this.map.addTilesetImage('items', 'tiles');
    this.layer = this.map.createStaticLayer('Capa de Patrones 1', tiles, 0, 0);
    // this.mapLayerGround = this.map.createStaticLayer('moss-rock', tiles, 0, 0);

    // this.layer.resizeWorld();
    this.layer.wrap = true;

    // this.layer.setCollisionBetween(14, 16);
    // this.layer.setCollisionBetween(21, 22);
    // this.layer.setCollisionBetween(27, 28);
    // this.layer.setCollisionByIndex(10);
    // this.layer.setCollisionByIndex(13);
    // this.layer.setCollisionByIndex(17);
    // this.layer.setCollisionByIndex(40);

    this.physics.add.collider(this.mario, this.layer);

    //this.physics.p2.convertTilemap(map, this.layer);
    //this.physics.p2.gravity.y = 300;
    //this.physics.p2.friction = 5;

    this.mario.sprite = this.add.sprite(50, 50, 'mario');
    this.mario.sprite.scale.setTo(0.47, 0.47);
    this.mario.sprite.anchor.x = 0.5;
    this.mario.sprite.anchor.y = 0.5;
    this.mario.sprite.animations.add('walk');

    this.physics.enable(this.mario.sprite);
    this.physics.arcade.gravity.y = 700;
    this.mario.sprite.body.bounce.y = 0;
    this.mario.sprite.body.linearDamping = 1;
    this.mario.sprite.body.collideWorldBounds = true;
    //mario.sprite.body.acceleration.x = 120;

    this.mario.sprite.animations.add('left', [2, 4, 5], 10, true);
    this.mario.sprite.animations.add('wait', [0], 10, true);
    this.mario.sprite.animations.add('jump', [6], 10, true);

    this.mario.sprite.body.fixedRotation = true;
    //mario.sprite.body.onBeginContact.add(blockHit, this);

    this.camera.follow(this.mario.sprite);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.runButton = this.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
  }

  update() {
    this.physics.arcade.collide(this.mario.sprite, this.layer);
    this.mario.doNothing = true;
    if (this.cursors.left.isDown) {
      //mario.sprite.body.acceleration.x = -120;
      if (this.mario.direction != 'left') {
        this.mario.sprite.scale.x *= -1;
        this.mario.direction = 'left';
      }
      if (
        this.mario.sprite.body.velocity.x == 0 ||
        (this.mario.sprite.animations.currentAnim.name != 'left' &&
          this.mario.sprite.body.onFloor())
      ) {
        this.mario.sprite.animations.play('left', 10, true);
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
    } else if (this.cursors.right.isDown) {
      if (this.mario.direction != 'right') {
        this.mario.sprite.scale.x *= -1;
        this.mario.direction = 'right';
      }
      if (
        this.mario.sprite.body.velocity.x == 0 ||
        (this.mario.sprite.animations.currentAnim.name != 'left' &&
          this.mario.sprite.body.onFloor())
      ) {
        this.mario.sprite.animations.play('left', 10, true);
      }
      this.mario.sprite.body.velocity.x += 5;
      if (this.runButton.isDown) {
        if (this.mario.sprite.body.velocity.x > 200) {
          this.mario.sprite.body.velocity.x = 200;
        }
      } else {
        if (this.mario.sprite.body.velocity.x > 120) {
          this.mario.sprite.body.velocity.x = 120;
        }
      }
      this.mario.doNothing = false;
    }
    if (this.cursors.up.justDown) {
      if (this.mario.sprite.body.onFloor()) {
        this.mario.sprite.body.velocity.y = -310;
        this.mario.sprite.animations.play('jump', 20, true);
        this.mario.doNothing = false;
      }
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
        this.mario.sprite.animations.play('wait', 20, true);
      }
    }
  }
  render() {
    this.debug.bodyInfo(this.mario.sprite, 32, 32);
  }
}
