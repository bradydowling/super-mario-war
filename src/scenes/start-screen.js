import { HEIGHT, SCALE, WIDTH } from '../config/constants';

import Phaser from 'phaser/src/phaser.js';
import menu_smw from '../assets/menu_smw.png';
import menu_background from '../assets/menu_background.png';

export default class sceneTemplate extends Phaser.Scene {
  constructor() {
    super({ key: 'Start' });

    this.startButton;
  }
  preload() {
    this.load.image('smw', menu_smw);
    this.load.image('background', menu_background);
  }
  create() {
    this.bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.smw_menu = this.add.image(
      game.config.width / 2,
      game.config.height / 2 - 140,
      'smw'
    );
    this.startButton = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
  }
  update() {
    if (Phaser.Input.Keyboard.JustDown(this.startButton)) {
      this.registry.set('player1img', 'sprites/players/SuperWario_Bowser.png');
      this.scene.start('Gameplay');
    }
  }
  render() {}
}
