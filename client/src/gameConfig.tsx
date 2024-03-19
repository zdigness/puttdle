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

    // score
    private stroke: number = 0;
    private scoreText!: Phaser.GameObjects.Text;

    bg!: Phaser.GameObjects.Image;

    private modal!: Phaser.GameObjects.Container;

    constructor() {
        super('game');
    }

    preload() {
        // assets
        this.load.image('bg', 'assets/bg.png')
        this.load.image('ball', 'assets/ball.png');
        this.load.image('hole', 'assets/hole1.png');
    }

    create() {
        // green boundaries
        this.physics.world.setBounds(sizes.width / 2 - 400, sizes.height / 2 - 325, 800, 650);
        
        // game background
        this.bg = this.add.image(0, 0, 'bg').setOrigin(0.5).setPosition(sizes.width / 2 - 5, sizes.height / 2 + 10);
        const maskShape = this.make.graphics({fillStyle: {color: 0x000000}});
        maskShape.fillRect(sizes.width / 2 - 400, sizes.height / 2 - 325, 800, 650);
        const mask = maskShape.createGeometryMask();
        this.bg.setMask(mask);

        // hole
        this.hole = this.add.graphics({ fillStyle: { color: 0x000000 } });
        this.hole.fillCircle(this.holePosition.x, this.holePosition.y, this.holeRadius);

        // ball
        this.ball = this.physics.add.sprite(sizes.width / 2 - 200, sizes.height / 2 - 200, 'ball').setOrigin(0.5, 0.5);
        if (this.ball) {
            this.ball.setCollideWorldBounds(true);
            this.ball.setBounce(1);
            this.ball.setInteractive();
        }

        // putting
        this.input.on('pointerdown', this.startDrag, this);
        this.input.on('pointermove', this.updateDrag, this);
        this.input.on('pointerup', this.shootBall, this);

        // screen resizing
        this.scale.on('resize', this.resize, this);

        // score
        this.scoreText = this.add.text(sizes.width / 2 - 380 , sizes.height / 2 - 310, 'Strokes: ' + this.stroke, { fontSize: '30px', color: '#000000', fontStyle: 'bold', fontFamily: 'Arial', padding: { x: 10, y: 10 }, align: 'center'});

        // win modal
        /*
        this.modal = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY)
        .add([
        this.add.rectangle(0, 0, 200, 150, 0xffffff), // Modal background
        this.add.text(0, -50, "Modal Content", { fontSize: '24px' }), 
        this.add.text(0, 30, "Close", { color: 'black' })
            .setInteractive()
            .on('pointerdown', () => {
                console.log('close');
                this.closeModal();
            })
        ]);
        this.modal.setVisible(false);
        */

    }

    win() {
        this.game.events.emit('win', { score: this.stroke });
        this.stroke = 0;
        this.scoreText.setText('Strokes: ' + this.stroke);
        // this.modal.setVisible(true);
    }

    closeModal() {
        this.modal.setVisible(false);
    }

    resize() {
        const width = window.innerWidth
        const height = window.innerHeight

        this.bg.setPosition(width / 2 - 5, height / 2 + 10);
        const maskShape = this.make.graphics({fillStyle: {color: 0x000000}});
        maskShape.fillRect(width / 2 - 400, height / 2 - 325, 800, 650);
        const mask = maskShape.createGeometryMask();
        this.bg.setMask(mask);

        this.holePosition = new Phaser.Math.Vector2(width / 2 + 100, height / 2 + 100);
        this.hole.clear()
        this.hole.fillCircle(this.holePosition.x, this.holePosition.y, this.holeRadius);

        this.ball.setPosition(width / 2 - 200, height / 2 - 200);

        this.physics.world.setBounds(width / 2 - 400, height / 2 - 325, 800, 650);
        this.scoreText.setPosition(width / 2 - 380 , height / 2 - 310);
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

            this.stroke++;
            this.scoreText.setText('Strokes: ' + this.stroke);
    
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
    
        this.ball.setPosition(window.innerWidth / 2 - 200, window.innerHeight / 2 - 200); // Example respawn position
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
            this.scoreText.setText('Strokes: ' + this.stroke);
            this.win();
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
