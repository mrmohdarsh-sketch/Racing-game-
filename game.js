const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: { preload: preload, create: create, update: update }
};

let car, cursors, statsText;
let speed = 0;
let maxSpeed = 380;
let acceleration = 7;
let friction = 0.95;

const game = new Phaser.Game(config);

function preload() {
    // No images needed, we draw the car in Create
}

function create() {
    // 1. Draw Neon Track
    let track = this.add.graphics();
    track.lineStyle(8, 0x00ffcc, 1);
    track.strokeRoundedRect(50, 50, 700, 500, 150);
    
    // 2. Create F1 Car Texture (Red Triangle Shape)
    let carGraphic = this.make.graphics();
    carGraphic.fillStyle(0xff1801, 1);
    // Drawing a simple aerodynamic F1 shape
    carGraphic.fillTriangle(0, 0, 40, 15, 0, 30); 
    carGraphic.generateTexture('f1car', 40, 30);

    // 3. Setup Car Physics
    car = this.physics.add.sprite(400, 100, 'f1car');
    car.setOrigin(0.5, 0.5);
    car.setCollideWorldBounds(true);

    // 4. Inputs
    cursors = this.input.keyboard.createCursorKeys();
    shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    statsText = document.getElementById('stats');
}

function update() {
    // Acceleration & Braking
    if (cursors.up.isDown) {
        if (speed < maxSpeed) speed += acceleration;
    } else if (cursors.down.isDown) {
        if (speed > -100) speed -= acceleration;
    } else {
        speed *= friction;
    }

    // Steering Logic
    if (Math.abs(speed) > 10) {
        let rotationSpeed = shiftKey.isDown ? 6 : 4;
        if (cursors.left.isDown) car.angle -= rotationSpeed;
        if (cursors.right.isDown) car.angle += rotationSpeed;
    }

    // Velocity Update
    const angleRad = car.rotation;
    car.body.velocity.x = Math.cos(angleRad) * speed;
    car.body.velocity.y = Math.sin(angleRad) * speed;

    // UI Update
    statsText.innerText = `Speed: ${Math.round(Math.abs(speed))} km/h`;
}

