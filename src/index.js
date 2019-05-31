import './index.css';
import './font-loader';

import Phaser from 'phaser';

import constants from './config/constants';
import Gameplay from './scenes/gameplay';
import StartScreen from './scenes/start-screen';

window.Phaser = Phaser;

const config = {
  type: Phaser.AUTO,
  width: constants.WIDTH,
  height: constants.HEIGHT,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
      debug: false
    }
  },
  scene: [StartScreen, Gameplay],
  pixelArt: true,
  antialias: false
};

const game = new Phaser.Game(config);

window.game = game;
