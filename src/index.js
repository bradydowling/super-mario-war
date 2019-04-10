import './index.css';
import './font-loader';

import Phaser from 'phaser';

import constants from './config/constants';
import MarioScene from './scenes/mario';

window.Phaser = Phaser;

const config = {
  type: Phaser.AUTO,
  width: constants.WIDTH,
  height: constants.HEIGHT,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 700 },
      debug: false
    }
  },
  scene: [MarioScene],
  pixelArt: true,
  antialias: false
};

const game = new Phaser.Game(config);

window.game = game;
