import * as Arrows from "./constants.js";

export class Player {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height;
        this.vy = 0;
        this.weight = 1;
        this.speed = 0;
        this.maxSpeed = 10;
        this.image = document.querySelector('#player');
    }

    update(input) {
        this.x += this.speed;
        if (input.has(Arrows.ArrowRight)) this.speed = this.maxSpeed;
        else if (input.has(Arrows.ArrowLeft)) this.speed = -this.maxSpeed;
        else this.speed = 0;

        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

        // vertical movement
        if (input.has(Arrows.ArrowUp) && this.onGround()) this.vy -= 30;
        this.y += this.vy;
        if (!this.onGround()) this.vy += this.weight;
        else this.vy = 0;
    }

    onGround() {
        return this.y >= this.game.height - this.height;
    }

    draw(context) {
        context.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height)
    }
}