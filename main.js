import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from './enemies.js';

class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.groundMargin = 80;
        this.speed = 0;
        this.maxSpeed = 3;
        this.background = new Background(this);
        this.player = new Player(this);
        this.input = new InputHandler();
        this.enemies = new Set();
        this.enemyTimer = 0;
        this.enemyInterval = 1000;
    }

    update(deltaTime){
        this.background.update();
        this.player.update(this.input.keys, deltaTime);
        if (this.enemyTimer > this.enemyInterval) {
            this.addEnemy();
            this.enemyTimer = 0;
        } else {
            this.enemyTimer += deltaTime
        }
        this.enemies.forEach(enemy => {
            enemy.update(deltaTime)
            if (enemy.markForDeletion) { 
                this.enemies.delete(enemy);
            }
        })
    }

    draw(context) {
        this.background.draw(context);
        this.player.draw(context);
        this.enemies.forEach(enemy => enemy.draw(context))
    }

    addEnemy() {
        if (this.speed > 0 && Math.random() < 0.5) {
            this.enemies.add(new GroundEnemy(this))
        } else if (this.speed > 0) this.enemies.add(new ClimbingEnemy(this))
        this.enemies.add(new FlyingEnemy(this));
    }
}



window.addEventListener('load', () => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d')

    canvas.width = 500;
    canvas.height = 500;

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;


    (function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        requestAnimationFrame(animate)

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        game.update(deltaTime);
        game.draw(ctx);
    })(0);
})