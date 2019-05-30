import Phaser from 'phaser/src/phaser.js';
import menu_smw from '../assets/menu_smw.png';
import menu_background from '../assets/menu_background.png';
import menu_music from '../assets/sounds/menu/menu.ogg';
import menu_font_large from '../assets/fonts/font_large.png';

export default class sceneTemplate extends Phaser.Scene {
  constructor() {
    super({ key: 'Start' });

    this.startButton;
    this.music;
    this.menuFont;
    this.currentCharacterIndex = 0;
    this.characters = [
      {
        name: 'Boo',
        filename: 'Boo.png'
      },
      {
        name: 'Bowser',
        filename: 'Bowser.png'
      },
      {
        name: 'BubBob',
        filename: 'BubBob.png'
      },
      {
        name: 'DonkeyKong',
        filename: 'DonkeyKong.png'
      },
      {
        name: 'Mario',
        filename: 'Mario.png'
      }
    ];
    this.cursors;
  }

  preload() {
    this.load.image('smw', menu_smw);
    this.load.image('background', menu_background);
    this.load.audio('menu_music', menu_music);
    this.load.image('menu_font_large', menu_font_large);
  }

  setMenuText(text) {
    this.menuFont.text = text;
  }

  setupFont(key) {
    const config = {
      image: key,
      width: 16,
      height: 19,
      chars: Phaser.GameObjects.RetroFont.TEXT_SET1,
      charsPerRow: 10,
      spacing: { x: 0, y: 0 }
    };

    this.cache.bitmapFont.add(
      key,
      Phaser.GameObjects.RetroFont.Parse(this, config)
    );

    const textPosition = {
      x: 100,
      y: 200
    };

    const currentCharacter = this.characters[this.currentCharacterIndex].name;
    this.menuFont = this.add.bitmapText(
      textPosition.x,
      textPosition.y,
      key,
      `< Select your character: ${currentCharacter}>`
    );

    this.menuFont.setScale(1);
    this.menuFont.setLetterSpacing(-1);
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

    this.cursors = this.input.keyboard.createCursorKeys();

    this.startButton = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    // Move this stuff elsewhere
    this.setupFont('menu_font_large');
    // this.setMenuText('I kinda know how to use GIMP');
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.startButton)) {
      const filename = this.characters[this.currentCharacterIndex].filename;
      this.registry.set('player1img', `sprites/players/${filename}`);
      this.music.stop();
      this.scene.start('Gameplay');
      return;
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      console.log('change the character');
      const lastCharacterIndex = this.characters.length - 1;
      if (this.currentCharacterIndex >= lastCharacterIndex) {
        return console.log('last character');
      }
      this.currentCharacterIndex++;
      const currentCharacter = this.characters[this.currentCharacterIndex].name;
      this.setMenuText(`< Select your character: ${currentCharacter}>`);
      return;
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      console.log('change the character');
      if (this.currentCharacterIndex <= 0) {
        return console.log('first character');
      }
      this.currentCharacterIndex--;
      const currentCharacter = this.characters[this.currentCharacterIndex].name;
      this.setMenuText(`< Select your character: ${currentCharacter}>`);
      return;
    }
  }
  render() {}
}
