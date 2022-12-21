import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';

class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.goundMargin = 80;
        this.speed = 0;
        this.maxSpeed = 3;
        this.background = new Background(this);
        this.player = new Player(this);
        this.input = new InputHandler();
    }

    update(deltaTime){
        this.background.update();
        this.player.update(this.input.keys, deltaTime);
    }

    draw(context) {
        this.background.draw(context);
        this.player.draw(context);
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