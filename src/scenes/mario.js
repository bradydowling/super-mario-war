import { HEIGHT, SCALE, WIDTH } from "../config/constants";

import Phaser from "phaser/src/phaser.js";

export default class MarioGame extends Phaser.Scene {
  constructor() {
    super({ key: "Game" });

    this.map;
    this.layer;
    this.cursors;
    this.jumpButton;
    this.runButton;

    this.mario = {
      sprite: undefined,
      direction: "right",
      doNothing: true
    };
  }

  preload() {
    this.load.tilemap(
      "objects",
      "assets/map1-1.json",
      null,
      Phaser.Tilemap.TILED_JSON
    );
    this.load.image("tiles", "assets/items2.png");
    this.load.spritesheet("mario", "assets/marioSmall.png", 34, 34, 7);
  }

  create() {
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.stage.backgroundColor = "#5C94FC";

    this.map = this.add.tilemap("objects");
    this.map.addTilesetImage("items", "tiles");
    this.layer = this.map.createLayer("Capa de Patrones 1");
    this.layer.resizeWorld();
    this.layer.wrap = true;
    this.map.setCollisionBetween(14, 16);
    this.map.setCollisionBetween(21, 22);
    this.map.setCollisionBetween(27, 28);
    this.map.setCollisionByIndex(10);
    this.map.setCollisionByIndex(13);
    this.map.setCollisionByIndex(17);
    this.map.setCollisionByIndex(40);

    //this.physics.p2.convertTilemap(map, this.layer);
    //this.physics.p2.gravity.y = 300;
    //this.physics.p2.friction = 5;

    this.mario.sprite = this.add.sprite(50, 50, "mario");
    this.mario.sprite.scale.setTo(0.47, 0.47);
    this.mario.sprite.anchor.x = 0.5;
    this.mario.sprite.anchor.y = 0.5;
    this.mario.sprite.animations.add("walk");

    this.physics.enable(this.mario.sprite);
    this.physics.arcade.gravity.y = 700;
    this.mario.sprite.body.bounce.y = 0;
    this.mario.sprite.body.linearDamping = 1;
    this.mario.sprite.body.collideWorldBounds = true;
    //mario.sprite.body.acceleration.x = 120;

    this.mario.sprite.animations.add("left", [2, 4, 5], 10, true);
    this.mario.sprite.animations.add("wait", [0], 10, true);
    this.mario.sprite.animations.add("jump", [6], 10, true);

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
      if (this.mario.direction != "left") {
        this.mario.sprite.scale.x *= -1;
        this.mario.direction = "left";
      }
      if (
        this.mario.sprite.body.velocity.x == 0 ||
        (this.mario.sprite.animations.currentAnim.name != "left" &&
          this.mario.sprite.body.onFloor())
      ) {
        this.mario.sprite.animations.play("left", 10, true);
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
      if (this.mario.direction != "right") {
        this.mario.sprite.scale.x *= -1;
        this.mario.direction = "right";
      }
      if (
        this.mario.sprite.body.velocity.x == 0 ||
        (this.mario.sprite.animations.currentAnim.name != "left" &&
          this.mario.sprite.body.onFloor())
      ) {
        this.mario.sprite.animations.play("left", 10, true);
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
        this.mario.sprite.animations.play("jump", 20, true);
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
        this.mario.sprite.animations.play("wait", 20, true);
      }
    }
  }
  render() {
    this.debug.bodyInfo(this.mario.sprite, 32, 32);
  }
}
