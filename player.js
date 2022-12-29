import { CollisionAnimation } from "./collisionAnimation.js";
import * as Arrows from "./constants.js";
import { Diving, Falling, Hit, Jumping, Rolling, Running, Sitting, states as PlayerStates } from "./playerState.js";

export class Player {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 92;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;
        this.weight = 1;
        this.speed = 0;
        this.maxSpeed = 10;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame;
        this.fps = 20;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.image = document.querySelector('#player');
        this.states = [new Sitting(game), new Running(game), new Jumping(game), new Falling(game), new Rolling(game), new Diving(game), new Hit(game)];
    }

    update(input, deltaTime) {
        this.checkCollision();
        this.currentState.handleInput(input)
        this.x += this.speed;
        if (input.has(Arrows.ArrowRight) && this.states[PlayerStates.HIT] !== this.currentState) this.speed = this.maxSpeed;
        else if (input.has(Arrows.ArrowLeft) && this.states[PlayerStates.HIT] !== this.currentState) this.speed = -this.maxSpeed;
        else this.speed = 0;

        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        // vertical movement
        this.y += this.vy;
        if (!this.onGround()) this.vy += this.weight;
        else this.vy = 0;
        // sprite animation
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }
    }

    onGround() {
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }

    draw(context) {
        context.drawImage(this.image, this.frameX * this.width, this.frameY *this.height, this.width, this.height, this.x, this.y, this.width, this.height)
    }
    setState(state, speed) {
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }

    checkCollision() {
        const onGround = this.game.height - this.height - this.game.groundMargin
        if (this.y > onGround) {
            this.y = onGround;
        }
    
        this.game.enemies.forEach(enemy => {
            if (
                enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y
            ) {
                enemy.markForDeletion = true;
                this.game.collisions.add(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5 ))
                if (this.currentState === this.states[PlayerStates.ROLLING] || this.currentState === this.states[PlayerStates.DIVING]) {
                    this.game.score++;
                } else {
                    this.setState(PlayerStates.HIT, 0);
                }
            }
        })
    }
}