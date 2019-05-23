import Phaser from 'phaser/src/phaser.js';
import menu_smw from '../assets/menu_smw.png';
import menu_background from '../assets/menu_background.png';
import menu_music from '../assets/sounds/menu/menu.ogg';

export default class sceneTemplate extends Phaser.Scene {
  constructor() {
    super({ key: 'Start' });

    this.startButton;
    this.music;
  }
  preload() {
    this.load.image('smw', menu_smw);
    this.load.image('background', menu_background);
    this.load.audio('menu_music', menu_music);
  }
  create() {
    this.bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.smw_menu = this.add.image(
      game.config.width / 2,
      game.config.height / 2 - 140,
      'smw'
    );

    this.music = this.sound.add('menu_music');
    this.music.play('', 0, 1, true);

    this.startButton = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
  }
  update() {
    if (Phaser.Input.Keyboard.JustDown(this.startButton)) {
      this.registry.set('player1img', 'sprites/players/Bowser.png');
      this.music.stop();
      this.scene.start('Gameplay');
    }
  }
  render() {}
}
