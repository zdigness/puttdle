import Phaser from 'phaser';

const sizes = {
    width: 700,
    height: 700,
};

class GameScene extends Phaser.Scene {
    private ball!: Phaser.Physics.Arcade.Sprite;
    private dragStartPoint: Phaser.Math.Vector2 | null = null; 
    private dragEndPoint: Phaser.Math.Vector2 | null = null;
    private dragLine: Phaser.GameObjects.Graphics | null = null;
    bg!: Phaser.GameObjects.Image;

    constructor() {
        super('game');
    }

    preload() {
        this.load.image('bg', 'assets/bg.png')
        this.load.image('ball', 'assets/ball.png');
        this.load.image('hole', 'assets/hole1.png');
    }

    create() {
        this.bg = this.add.image(0, 0, 'bg').setOrigin(0, 0).setScale(1);
        this.add.image(0, 0, 'hole').setOrigin(-10, -10).setScale(1);
        this.ball = this.physics.add.sprite(0, 0, 'ball').setOrigin(-5, -5);
        if (this.ball) {
            this.ball.setCollideWorldBounds(true);
            this.ball.setBounce(1);
            this.ball.setInteractive();
        }

        this.input.on('pointerdown', this.startDrag, this);
        this.input.on('pointermove', this.updateDrag, this);
        this.input.on('pointerup', this.shootBall, this);
    }

    startDrag(pointer: Phaser.Input.Pointer) {
        if (pointer.leftButtonDown() && this.ball.getBounds().contains(pointer.x, pointer.y)) {
            this.dragStartPoint = new Phaser.Math.Vector2(pointer.x, pointer.y);
            this.dragLine = this.add.graphics();
        }
    }

    updateDrag(pointer: Phaser.Input.Pointer) {
        if (this.dragStartPoint) {
            this.dragEndPoint = new Phaser.Math.Vector2(pointer.x, pointer.y);
            this.drawDragLine(); 
        }
    }

    drawDragLine() {
        if (this.dragLine && this.dragStartPoint && this.dragEndPoint) {
            this.dragLine.clear();
            this.dragLine.lineStyle(2, 0xffffff); // White line, adjust as needed
            this.dragLine.strokeLineShape(new Phaser.Geom.Line(
                this.dragStartPoint.x, 
                this.dragStartPoint.y, 
                this.dragEndPoint.x ?? 0, // Add null check and provide a default value
                this.dragEndPoint.y ?? 0 // Add null check and provide a default value
            ));
        }
    }

    shootBall() {
        if (this.dragStartPoint && this.dragEndPoint) {
            const initialVelocity = new Phaser.Math.Vector2(
                this.dragStartPoint.x - this.dragEndPoint.x,
                this.dragStartPoint.y - this.dragEndPoint.y 
            ).scale(5);

            if (this.ball.body instanceof Phaser.Physics.Arcade.Body) {
            this.ball.body.setVelocity(initialVelocity.x, initialVelocity.y);

            const dragCoefficient = 0.5;
            const speed = this.ball.body.speed;
            const dragForce = speed * dragCoefficient;
    
            const dragForceX = dragForce * (Math.abs(this.ball.body.velocity.x) / speed);
            const dragForceY = dragForce * (Math.abs(this.ball.body.velocity.y) / speed);
    
            this.ball.body.setDrag(dragForceX, dragForceY);
            }
    
            // Clear drag state
            this.dragStartPoint = null;
            this.dragEndPoint = null;
            this.dragLine?.destroy();
        }
    }

    update() {
        if (this.ball && this.ball.body && this.ball.body instanceof Phaser.Physics.Arcade.Body && (this.ball.body as Phaser.Physics.Arcade.Body).speed === 0 && this.ball.body.velocity.x === 0 && this.ball.body.velocity.y === 0) {
            this.ball.body.velocity.set(0, 0); // Fix: Replace 'setVelocity' with 'velocity'
            (this.ball.body as Phaser.Physics.Arcade.Body).setAcceleration(0, 0); // Fix: Add type assertion
            this.ball.body.setDrag(0, 0);
        }
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
            debug: false,
        },
    },
    scene: [GameScene],
};

export default config;
