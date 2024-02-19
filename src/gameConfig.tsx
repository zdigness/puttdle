import Phaser from 'phaser';

const sizes = {
    width: 700,
    height: 700,
};

const speedDown = 300;

class GameScene extends Phaser.Scene {
    constructor() {
        super('game');
    }

    preload() {
        this.load.image('bg', 'assets/bg.jpg')
        this.load.image('ball', 'assets/ball.png');
        this.load.image('hole', 'assets/hole.jpg');
    }

    create() {
        this.add.image(0, 0, 'bg').setOrigin(0, 0).setScale(0.5);
        this.add.image(0, 0, 'ball').setOrigin(-5, -5).setScale(0.1);
    }

    update() {
    }
}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: sizes.width,
    height: sizes.height,
    parent: 'gameCanvas',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: speedDown },
            debug: false,
        },
    },
    scene: GameScene,
};

export default config;
