import * as Keys from "./constants.js";
import { Dust, Fire, Splash } from "./particles.js";

export const states = {
    SITTING: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
    ROLLING: 4,
    DIVING: 5,
    HIT: 6,
}

class State {
    constructor(state, game) {
        this.state = state;
        this.game = game;
    }
}

export class Sitting extends State {
    constructor(game) {
        super('SITTING', game);
    }
    enter() {
        const { player } = this.game;
        player.frameX = 0;
        player.frameY = 5;
        player.maxFrame = 4;
    }
    handleInput(input) {
        const { player } = this.game;
        if (input.has(Keys.ArrowLeft) || input.has(Keys.ArrowRight)) {
            player.setState(states.RUNNING, 1);
        } else if (input.has(Keys.Enter)) {
            player.setState(states.ROLLING, 2);
        }
    }
}

export class Running extends State {
    constructor(game) {
        super('RUNNING', game);
    }
    enter() {
        const { player } = this.game;
        player.frameX = 0;
        player.frameY = 3;
        player.maxFrame = 7;
    }
    handleInput(input) {
        const { particles, player } = this.game;
        particles.add(new Dust(this.game, player.x, player.y));
        if (input.has(Keys.ArrowDown) && !(input.has(Keys.ArrowLeft) || input.has(Keys.ArrowRight))) {
            player.setState(states.SITTING, 0);
        } else if (input.has(Keys.ArrowUp)) {
            player.setState(states.JUMPING, 1);
        } else if (input.has(Keys.Enter)) {
            player.setState(states.ROLLING, 2);
        }
    }
}

export class Jumping extends State {
    constructor(game) {
        super('JUMPING', game);
    }
    enter() {
        const { player } = this.game;
        if (player.onGround()) player.vy -= 20;
        player.frameX = 0;
        player.frameY = 1;
        player.maxFrame = 6;
    }
    handleInput(input) {
        const { player } = this.game;
        if (player.vy > player.weight) {
            player.setState(states.FALLING, 1);
        } else if (input.has(Keys.Enter)) {
            player.setState(states.ROLLING, 2);
        } else if (input.has(Keys.ArrowDown)) {
            player.setState(states.DIVING, 0);
        }
    }
}

export class Falling extends State {
    constructor(game) {
        super('FALLING', game);
    }
    enter() {
        const { player } = this.game;
        player.frameX = 0;
        player.frameY = 2;
        player.maxFrame = 6;
    }
    handleInput(input) {
        const { player } = this.game;
        if (player.onGround()) {
            player.setState(states.RUNNING, 1);
        } else if (input.has(Keys.ArrowDown)) {
            player.setState(states.DIVING, 0);
        }
    }
}

export class Rolling extends State {
    constructor(game) {
        super('ROLLING', game);
    }
    enter() {
        const { player } = this.game
        player.frameX = 0;
        player.frameY = 6;
        player.maxFrame = 3;
    }
    handleInput(input) {
        const { particles, player } = this.game;
        particles.add(new Fire(this.game, player.x, player.y))
        if (!input.has(Keys.Enter) && player.onGround()) {
            player.setState(states.RUNNING, 1);
        } else if (!input.has(Keys.Enter) && !player.onGround()) {
            player.setState(states.FALLING, 1);
        } else if (input.has(Keys.Enter) && input.has(Keys.ArrowUp) && player.onGround()) {
            player.vy -= 26;
        } else if (input.has(Keys.ArrowDown) && !player.onGround()) {
            player.setState(states.DIVING, 0);
        }
    }
}

export class Diving extends State {
    constructor(game) {
        super('DIVING', game);
    }
    enter() {
        const { player } = this.game
        player.frameX = 0;
        player.frameY = 6;
        player.maxFrame = 3;
        player.vy = 15;
    }
    handleInput() {
        const { player, particles } = this.game;
        particles.add(new Fire(this.game, player.x, player.y))
        if (player.onGround()) {
            player.setState(states.ROLLING, 2);
            for(let i = 0; i < 30; i++) {
                particles.add(new Splash(this.game, player.x + player.width * 0.5, player.y + player.height * 0.5 ))
            }
        }
    }
}

export class Hit extends State {
    constructor(game) {
        super('HIT', game);
    }
    enter() {
        const { player } = this.game
        player.frameX = 0;
        player.frameY = 4;
        player.maxFrame = 10;
    }
    handleInput() {
        const { player } = this.game;
        if (player.frameX >= player.maxFrame && player.onGround()) {
            player.setState(states.RUNNING, 1);
        } else if (player.frameX >= player.maxFrame && !player.onGround()) {
            player.setState(states.FALLING, 1);
        }
    }
}