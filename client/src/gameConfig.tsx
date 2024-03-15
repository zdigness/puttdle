import Phaser from 'phaser';

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,

    greenLeft: window.innerWidth,
    greenRight: window.innerWidth,
    greenTop: window.innerHeight,
    greenBottom: window.innerHeight
};

class GameScene extends Phaser.Scene {
    private ball!: Phaser.Physics.Arcade.Sprite;
    private dragStartPoint: Phaser.Math.Vector2 | null = null; 
    private dragEndPoint: Phaser.Math.Vector2 | null = null;
    private dragLine: Phaser.GameObjects.Graphics | null = null;
    
    private hole!: Phaser.GameObjects.Graphics;
    private holePosition: Phaser.Math.Vector2 = new Phaser.Math.Vector2(sizes.width / 2 + 100, sizes.height / 2 + 100);
    private holeRadius: number = 20;

    bg!: Phaser.GameObjects.Image;

    constructor() {
        super('game');
    }

    preload() {
        this.load.image('bg', 'assets/bg.png')
        this.load.image('ball', 'assets/ball.png');
        this.load.image('hole', 'assets/hole1.png');
        this.load.image('backdrop', 'assets/backdrop.png');
    }

    create() {

        this.physics.world.setBounds(sizes.width / 2 - 300, sizes.height / 2 - 325, 600, 650);
        
        //Ball
        this.bg = this.add.image(0, 0, 'bg').setOrigin(0.5).setPosition(sizes.width / 2, sizes.height / 2);
        const maskShape = this.make.graphics({fillStyle: {color: 0x000000}});
        maskShape.fillRect(sizes.width / 2 - 300, sizes.height / 2 - 325, 600, 650);
        const mask = maskShape.createGeometryMask();
        this.bg.setMask(mask);

        //Hole 
        this.hole = this.add.graphics({ fillStyle: { color: 0x000000 } });
        this.hole.fillCircle(this.holePosition.x, this.holePosition.y, this.holeRadius);

        this.ball = this.physics.add.sprite(sizes.width / 2 - 200, sizes.height / 2 - 200, 'ball').setOrigin(0.5, 0.5);
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

    private respawnBall() {
        if (this.ball.body instanceof Phaser.Physics.Arcade.Body) {
            this.ball.body.setVelocity(0, 0);
            this.ball.body.setAcceleration(0, 0);
        }
    
        const respawnPosition = new Phaser.Math.Vector2(250, 250); // Example respawn position
        this.ball.setPosition(respawnPosition.x, respawnPosition.y);
    }

    update() {
        if (this.ball && this.ball.body && this.ball.body instanceof Phaser.Physics.Arcade.Body && (this.ball.body as Phaser.Physics.Arcade.Body).speed === 0 && this.ball.body.velocity.x === 0 && this.ball.body.velocity.y === 0) {
            this.ball.body.velocity.set(0, 0); // Fix: Replace 'setVelocity' with 'velocity'
            (this.ball.body as Phaser.Physics.Arcade.Body).setAcceleration(0, 0); // Fix: Add type assertion
            this.ball.body.setDrag(0, 0);
        }

        // MADE SHOT
        
        // Find distance between ball center and hole edge
        const distanceToHole = Phaser.Math.Distance.Between(
            this.ball.x, this.ball.y,
            this.holePosition.x, this.holePosition.y
        );
        // Check if the ball's center has reached the edge of the hole
        if (distanceToHole <= this.holeRadius) {
            this.respawnBall(); // Call respawnBall method
        }
    }
}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: sizes.width,
    height: sizes.height,
    backgroundColor: '#1a1a1a',
    parent: 'gameCanvas',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
    scene: [GameScene],
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
};

export default config;
