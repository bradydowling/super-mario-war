import './index.css';
import './font-loader';

import Phaser from 'phaser';

import constants from './config/constants';
import MarioScene from './scenes/mario';
import StartScreen from './scenes/start-screen';

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
  scene: [StartScreen, MarioScene],
  pixelArt: true,
  antialias: false
};

const game = new Phaser.Game(config);

window.game = game;
