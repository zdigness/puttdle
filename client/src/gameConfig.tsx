import Phaser from 'phaser';

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,

    greenLeft: window.innerWidth,
    greenRight: window.innerWidth,
    greenTop: window.innerHeight,
    greenBottom: window.innerHeight
};

class Sandtrap {
    private scene: Phaser.Scene;
    x: number;
    y: number;
    radius: number;
    graphics: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, x: number, y: number, radius: number) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.radius = radius;

        this.graphics = this.scene.add.graphics({ fillStyle: { color: 0xf0e68c } }); // Tan color for sand
        this.graphics.fillCircle(this.x, this.y, this.radius);
    }
}

class MovingBarrier {
    private scene: Phaser.Scene;
    x: number;
    y: number;
    width: number;
    height: number;
    right: boolean = true;
    graphics: Phaser.GameObjects.Graphics;
    sprite: Phaser.Physics.Arcade.Sprite;

    constructor(scene: Phaser.Scene, x: number, y: number, height: number, width: number) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.graphics = this.scene.add.graphics({ fillStyle: { color: 0x000000 } }); // Black color for hole
        this.graphics.fillRect(this.x, this.y, this.width, this.height);

        this.sprite = this.scene.physics.add.sprite(this.x, this.y, '').setOrigin(0, 0);
        this.sprite.displayWidth = this.width;
        this.sprite.displayHeight = this.height;
        this.sprite.setImmovable(true);
        this.sprite.visible = false; // Set to true if you want to see the barrier
    }

    setCollision(ball: Phaser.Physics.Arcade.Sprite) {
        this.scene.physics.add.collider(ball, this.sprite, this.handleCollision as unknown as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);
        this.scene.physics.add.overlap(ball, this.sprite, this.handleOverlap as unknown as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);
    }

    handleCollision(ball: Phaser.Physics.Arcade.Sprite) {
        // hitting side of barrier while ball is moving
        if (ball.body && (ball.body.velocity.x !== 0 || ball.body.velocity.y !== 0)) {
            if (ball.body.touching.right) {
                ball.body.velocity.x = -300;
                ball.body.velocity.y = -300;
            }
            else if (ball.body.touching.left) {
                ball.body.velocity.x = 300;
                ball.body.velocity.y = 300;
            }
        }

        if (ball.body && ball.body.velocity.x === 0 && ball.body.velocity.y === 0) {
            if (this.right) {
                ball.body.velocity.x = 300;
            }
            else {
                ball.body.velocity.x = -300;
            }

            if (ball.body.y < this.y) {
                ball.body.velocity.y = -300;
            }
            else {
                ball.body.velocity.y = 300;
            }
        }
    }

    handleOverlap(ball: Phaser.Physics.Arcade.Sprite) {
        // hitting side of barrier while ball is moving
        if (ball.body && (ball.body.velocity.x !== 0 || ball.body.velocity.y !== 0)) {
            if (ball.body.touching.right) {
                ball.body.velocity.x = 300;
            }
            else if (ball.body.touching.left) {
                ball.body.velocity.x = -300;
            }

            if (ball.body.y <= this.y) {
                ball.body.velocity.y = -300;
            }
            else {
                ball.body.velocity.y = 300;
            }
        }

        if (ball.body && ball.body.velocity.x === 0 && ball.body.velocity.y === 0) {
            if (this.right) {
                ball.body.velocity.x = -300;
            }
            else {
                ball.body.velocity.x = 300;
            }

            if (ball.body.y < this.y) {
                ball.body.velocity.y = -300;
            }
            else {
                ball.body.velocity.y = 300;
            }
        }
    }

    moveRight() {
        this.graphics.x += 1;
        this.sprite.x += 1;
    }

    moveLeft() {
        this.graphics.x -= 1;
        this.sprite.x -= 1;
    }
}

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

    private sandtrap: Sandtrap;
    private movingBarrier: MovingBarrier;

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

        // sand traps
        this.sandtrap = new Sandtrap(this, sizes.width / 2 + 250, sizes.height / 2 + 150, 50);

        // moving barrier
        this.movingBarrier = new MovingBarrier(this, sizes.width / 2 - 400, sizes.height / 2, 25, 200);

        // hole
        this.hole = this.add.graphics({ fillStyle: { color: 0x000000 } });
        this.hole.fillCircle(this.holePosition.x, this.holePosition.y, this.holeRadius);

        // ball
        this.ball = this.physics.add.sprite(sizes.width / 2 - 200, sizes.height / 2 - 200, 'ball').setOrigin(0.5, 0.5);
        if (this.ball) {
            this.ball.setCollideWorldBounds(true);
            this.ball.setBounce(1);
        }

        // collision
        this.movingBarrier.setCollision(this.ball);

        this.physics.add.collider(this.ball, this.movingBarrier.sprite);

        // putting
        this.input.on('pointerdown', this.startDrag, this);
        this.input.on('pointermove', this.updateDrag, this);
        this.input.on('pointerup', this.shootBall, this);

        // screen resizing
        this.scale.on('resize', this.resize, this);

        // score
        this.scoreText = this.add.text(sizes.width / 2 - 380 , sizes.height / 2 - 310, 'Strokes: ' + this.stroke, { fontSize: '30px', color: '#000000', fontStyle: 'bold', fontFamily: 'Arial', padding: { x: 10, y: 10 }, align: 'center'});
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
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;
        const width = window.innerWidth
        const height = window.innerHeight

        this.bg.setPosition(width / 2 - 5, height / 2 + 10);
        const maskShape = this.make.graphics({fillStyle: {color: 0x000000}});
        maskShape.fillRect(width / 2 - 400, height / 2 - 325, 800, 650);
        const mask = maskShape.createGeometryMask();
        this.bg.setMask(mask);

        this.sandtrap.graphics.clear();
        this.sandtrap.graphics.fillCircle(width / 2 + 250, height / 2 + 150, 50);

        this.movingBarrier.graphics.clear();
        this.movingBarrier.sprite.destroy();
        this.movingBarrier = new MovingBarrier(this, width / 2 - 400, height / 2, 25, 200);

        this.physics.add.collider(this.ball, this.movingBarrier.sprite);

        this.holePosition = new Phaser.Math.Vector2(width / 2 + 100, height / 2 + 100);
        this.hole.clear()
        this.hole.fillCircle(this.holePosition.x, this.holePosition.y, this.holeRadius);

        this.ball.setPosition(width / 2 - 200, height / 2 - 200);

        this.physics.world.setBounds(width / 2 - 400, height / 2 - 325, 800, 650);
        this.scoreText.setPosition(width / 2 - 380 , height / 2 - 310);
    }

    startDrag(pointer: Phaser.Input.Pointer) {
        if (pointer.leftButtonDown() && this.ball.getBounds().contains(pointer.x, pointer.y)) {
            this.dragStartPoint = new Phaser.Math.Vector2(this.ball.x, this.ball.y);
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

            const distance = Phaser.Math.Distance.Between(this.dragStartPoint.x, this.dragStartPoint.y, this.dragEndPoint.x, this.dragEndPoint.y);
            const direction = new Phaser.Geom.Point();

            if (distance > 0) {
                direction.x = (this.dragEndPoint.x - this.dragStartPoint.x) / distance;
                direction.y = (this.dragEndPoint.y - this.dragStartPoint.y) / distance;
            }

            // dash calculation values
            const segmentLength = 10; // Adjust as needed
            const gapLength = 5; // Adjust as needed
            const segments = Math.floor(distance / (segmentLength + gapLength));

            // gradient color initial values
            const red = 255
            const green = 255
            const blue = 255

            for (let i = 0; i < segments; i++) {
                // dash segment
                const startX = this.dragStartPoint.x + (segmentLength + gapLength) * i * direction.x;
                const startY = this.dragStartPoint.y + (segmentLength + gapLength) * i * direction.y;
                const endX = startX + segmentLength * direction.x;
                const endY = startY + segmentLength * direction.y;

                // gradient color
                const color = Phaser.Display.Color.GetColor(red, Math.max(green - i * 17, 0), Math.max(blue - i * 17, 0)); // Adjust as needed

                // draw dash segment
                this.dragLine.lineStyle(2, color, 1);
                this.dragLine.strokeLineShape(new Phaser.Geom.Line(startX, startY, endX, endY));
            }
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

                this.ball.setDamping(true);
                this.ball.setDrag(0.2);
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
        // ball speed
        const velocityX = this.ball && this.ball.body && this.ball.body.velocity ? Math.abs(this.ball.body.velocity.x) : 0;
        const velocityY = this.ball && this.ball.body && this.ball.body.velocity ? Math.abs(this.ball.body.velocity.y) : 0;

        // slow ball more once it gets to low velocity
        if (velocityX < 100 && velocityY < 100) {
            this.ball.setDamping(true);
            this.ball.setDrag(0.05);
        }

        // moving barrier
        if (this.movingBarrier.graphics.x <= 0) {
            this.movingBarrier.right = true;
        }
        if (this.movingBarrier.graphics.x >= ( (sizes.width - (sizes.width - sizes.width / 2 - 400) - this.movingBarrier.width)) - (sizes.width - sizes.width / 2 - 400)) {
            this.movingBarrier.right = false;
        }

        if (this.movingBarrier.right) {
            this.movingBarrier.moveRight();
        }
        else {
            this.movingBarrier.moveLeft();
        }

        // check if on sand trap
        const distanceToSandtrap = Phaser.Math.Distance.Between(
            this.ball.x, this.ball.y,
            this.sandtrap.x, this.sandtrap.y
        );
        if (distanceToSandtrap <= this.sandtrap.radius) {
            this.ball.setDamping(true);
            this.ball.setDrag(0.01);
        }
        

        // make ball stop smoother
        if (velocityX < 10 && velocityY < 10) {
            this.ball.setVelocity(0, 0);
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
