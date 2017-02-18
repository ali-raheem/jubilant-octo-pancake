class Sprite {
    constructor(ctx, image, x, y, width, height, speed) {
        this.ctx = ctx;
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
    }
    render() {
        this.ctx.drawImage(this.image, this.x, this.y);
    }
    static collides (A, B) {
        return (A.x + A.width > B.x && A.x < B.x + B.width &&
                A.y + A.height > B.y && A.y < B.y + B.height);
    }
}

class animatedSprite extends Sprite {
    constructor (ctx, image, x, y, width, height, speed, frames, tickPerFrame) {
        super(ctx, image, x, y, width, height, speed);        
        this.frames = frames;
        this.frameIndex = 0;
        this.tickPerFrame = tickPerFrame;
        this.ticks = 0;
    }
    render() {
        this.ctx.drawImage(this.image, this.width*this.frameIndex, this.y, this.width, this.height, this.x, this.y, this.width, this.height);
    }

}
class Bullet extends Sprite {
    update () {
        this.y -= this.speed;
    }    
}

class Enemy extends Sprite {
    constructor(ctx, image, x, y, width, height, speed) {
        super(ctx, image, x, y, width, height, speed);
        this.alive = true;
    }
    update () {
        if ((this.x + this.width >= canvas.width && this.speed > 0) || (this.x <= 0 && this.speed <0)) {
            this.y += this.height;
            this.speed = -this.speed;
        } else {
            this.x += this.speed;
        }   
    }
}

class Player extends Sprite {
    constructor(ctx, image, x, y, width, height, speed) {
        super(ctx, image, x, y, width, height, speed);
        this.bullets = 5;
        this.gun = greenLaser;
        this.alive = true;
    }
}


function gameSetup(canvasId) {
    canvas = document.getElementById(canvasId);
    ctx = canvas.getContext('2d');
    canvas.width = 1280;
    canvas.height = 520;

    canvas.addEventListener("mousemove", function(e){player.x = e.pageX - player.width/2});
    canvas.addEventListener("click", addBullet);
    
    playerShipImage = new Image();
    playerShipImage.src = 'images/player.png';

    greenLaser = new Image();
    greenLaser.src = 'images/laserGreen.png';
    redLaser = new Image();
    redLaser.src = 'images/laserRed.png';

    enemyShipImage = new Image();
    enemyShipImage.src = 'images/enemyShip.png';

    enemies = [];
    addEnemy(1, 1);
    addEnemy(111, 1);
    addEnemy(221, 1);
    addEnemy(331, 1);
    addEnemy(441, 1);

    addEnemy(1, 100);
    addEnemy(111, 100);
    addEnemy(221, 100);
    addEnemy(331, 100);
    addEnemy(441, 100);
    
    bullets = [];

    player = new Player (
        ctx,
        playerShipImage,
        (canvas.width - playerShipImage.width)/2,
        (canvas.height - playerShipImage.height - 10),
        playerShipImage.width,
        playerShipImage.height,
        1
    );

    running = true;
    loop();
}

function loop() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    animateBullets();
    animateEnemies();
    player.render();
    if(enemies.length == 0){
        ctx.fillStyle = 'white';
        ctx.font = '48px Serif';
        ctx.fillText("You win!", canvas.width/2, canvas.height/2);
        running = false;
    }
    if(player.alive == false) {
        ctx.fillStyle = 'red';
        ctx.font = '48px Serif';
        ctx.fillText("You died!", canvas.width/2, canvas.height/2);
        running = false;
    }
    if(running)
        requestAnimationFrame(loop);
}

function animateBullets() {
    for (i = 0; i < bullets.length; i++) {
        bullets[i].update();
        bullets[i].render();
        if(Sprite.collides(player, bullets[i])){
            player.alive = false;
            break;
        }
        if(bullets[i].y + bullets[i].height <= 0 || bullets[i].y >= canvas.height) {
            bullets.splice(i, 1);
        }
    }
}

function addBullet () {
    if(bullets.length >= player.bullets)
        return;
    var bullet = new Bullet(
        ctx,
        greenLaser,
        player.x + player.width/2 - 4,
        player.y - greenLaser.height,
        greenLaser.width,
        greenLaser.height,
        3
    );
    bullets.push(bullet);
}

function addEnemyBullet (enemy) {
    var bullet = new Bullet(
        ctx,
        redLaser,
        enemy.x + enemy.width/2 - 4,
        enemy.y + enemy.height,
        redLaser.width,
        redLaser.height,
        -3
    );
    bullets.push(bullet);
}


function addEnemy (x, y) {
    var enemy = new Enemy (
        ctx,
        enemyShipImage,
        x,
        y,
        enemyShipImage.width,
        enemyShipImage.height,
        3
    );
    enemies.push(enemy);
}

function animateEnemies() {
    for (i = 0; i < enemies.length; i++) {
        if(enemies[i].alive) {
            enemies[i].update();
            enemies[i].render();
            // Random chance enemy will shoot.
            if(Math.random() <= 0.001)
                addEnemyBullet(enemies[i]);
            if(0 < bullets.length) {
                for(j = 0; j < bullets.length; j++) {
                    if(Sprite.collides(bullets[j], enemies[i])){
                        enemies.splice(i, 1);
                        bullets.splice(j, 1);
                        break;
                    }
                }
            }
        }
    }
}