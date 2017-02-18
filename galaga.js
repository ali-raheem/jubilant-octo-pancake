class Sprite {
    constructor(ctx, image, x, y, width, height, speed) {
        this.ctx = ctx;
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
//        this.frames = frames;
//        this.frameIndex = frameIndex;
//        this.tickPerFrame = tickPerFrame;
//        this.ticks = 0;
    }
    render() {
        this.ctx.drawImage(this.image, this.x, this.y);
    }
}

class Bullet extends Sprite {
    update () {
        this.y -= this.speed;
    }    
}

class Enemy extends Sprite {
    update () {
        if ((this.x + this.width >= canvas.width && this.speed > 0) || (this.x <= 0 && this.speed <0)) {
            this.y += this.height;
            this.speed = -this.speed;
        } else {
            this.x += this.speed;
            
        }   
    }
}

function gameSetup(canvasId) {
    canvas = document.getElementById(canvasId);
    ctx = canvas.getContext('2d');
    canvas.width = 1280;
    canvas.height = 520;

    canvas.addEventListener("mousemove", function(e){player.x = e.pageX - player.width/2});
    canvas.addEventListener("click", shoot);
    
    playerShipImage = new Image();
    playerShipImage.src = 'player.png';

    greenLaser = new Image();
    greenLaser.src = 'laserGreen.png';

    enemyShipImage = new Image();
    enemyShipImage.src = 'enemyShip.png';

    enemies = [];
    addEnemy(1, 1);
    addEnemy(101, 1)
    addEnemy(201, 1)
    
    bullets = [];

    player = new Sprite(
        ctx,
        playerShipImage,
        (canvas.width-99)/2,
        (canvas.height - 75 - 10),
        99,
        75,
        1
    );

    loop();
}

function loop() {
    requestAnimationFrame(loop);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    animateBullets();
    animateEnemies();
    player.render();    
}

function animateBullets() {
    numBullets = bullets.length;
    for (i = 0; i <numBullets; i++) {
        bullets[i].update();
        bullets[i].render();
        if(bullets[i].y+bullets[i].width <= 0) {
            bullets.splice(i, 1);
         }
    }
}

function shoot () {
    var bullet = new Bullet(
        ctx,
        greenLaser,
        player.x + player.width/2 - 4,
        player.y + player.height/2,
        9,
        33,
        3
    );
    bullets.push(bullet);
}

function addEnemy (x, y) {
    var enemy = new Enemy (
        ctx,
        enemyShipImage,
        x,
        y,
        98,
        50,
        3
    );
    enemies.push(enemy);
}

function animateEnemies() {
    numEnemies = enemies.length;
    for (i = 0; i <numEnemies; i++) {
        enemies[i].update();
        enemies[i].render();
//        for (j = 0; i < bullets.length; j++)
//            if(rectCollision(enemies[i], bullets[j])) {
//                enemies.splice(i, 1);
//                break;
//            }
    }
}




function rectCollision(rect1, rect2) {
    return ((rect1.x < rect2.x + rect2.width) &&
            (rect1.x + rect1.width > rect2.x) &&
            (rect1.y < rect2.y + rect2.height) &&
            (rect1.height + rect1.y > rect2.y));
}
