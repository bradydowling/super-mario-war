import { HEIGHT, SCALE, WIDTH } from '../config/constants';

import Phaser from 'phaser/src/phaser.js';
import menu_smw from '../assets/menu_smw.png';
import menu_background from '../assets/menu_background.png';

export default class sceneTemplate extends Phaser.Scene {
  constructor() {
    super({ key: 'Start' });
  }
  preload() {
    this.load.image('smw', menu_smw);
    this.load.image('background', menu_background);
  }
  create() {
    this.bg = this.add.image(
      game.config.width / 2,
      game.config.height / 2,
      'background'
    );
    this.smw_menu = this.add.image(
      game.config.width / 2,
      game.config.height / 2,
      'smw'
    );
  }
  update() {}
  render() {}
}
