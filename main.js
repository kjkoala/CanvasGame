import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from './enemies.js';
import { UI } from './UI.js';

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
        this.UI = new UI(this);
        this.enemies = new Set();
        this.particles = new Set();
        this.collisions = new Set();
        this.time = 0;
        this.maxTime = 2000;
        this.enemyTimer = 0;
        this.enemyInterval = 1000;

        this.fontColor = 'black';
        this.score = 0;
        this.gameOver = false;

        this.player.currentState = this.player.states[0];
        this.player.currentState.enter();
    }

    update(deltaTime){
        this.time += deltaTime;
        // if (this.time > this.maxTime) this.gameOver = true;
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
            if (enemy.markForDeletion) this.enemies.delete(enemy);
        })

        this.particles.forEach(particle => {
            particle.update()
            if (particle.markForDeletion) this.particles.delete(particle);
        })
        
        this.collisions.forEach(collision => {
            collision.update(deltaTime);
            if (collision.markForDeletion) this.collisions.delete(collision);
        })
    }

    draw(context) {
        this.background.draw(context);
        this.player.draw(context);
        this.enemies.forEach(enemy => enemy.draw(context))
        this.particles.forEach(particle => particle.draw(context))
        this.collisions.forEach(collision => collision.draw(context))
        this.UI.draw(context);
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
        if (!game.gameOver) requestAnimationFrame(animate)

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        game.update(deltaTime);
        game.draw(ctx);
    })(0);
})