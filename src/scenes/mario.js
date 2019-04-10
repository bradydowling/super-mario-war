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

    this.mario.sprite = this.add.sprite(50, 50, 'mario');
    this.mario.sprite.setScale(0.47);
    this.mario.sprite.setOrigin(0.5, 0.5);

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
    debugger;
  }
}
