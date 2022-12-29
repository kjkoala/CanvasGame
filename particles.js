class Particle {
    constructor(game) {
        this.game = game;
        this.markForDeletion = false;
    }
    update() {
        this.x -= this.speedX + this.game.speed;
        this.y += this.speedX;
        this.size *= 0.95;
        if (this.size < 0.5) this.markForDeletion = true;
    }
}

export class Dust extends Particle {
    constructor(game, x, y){
        super(game);
        this.size = Math.random() * 10 + 10;
        this.x = x;
        this.y = y;
        this.speedX = Math.random();
        this.speedY = Math.random();
        this.color = 'rgba(0,0,0,0.8)';
    }
    draw(context) {
        context.beginPath();
        context.arc(this.x + this.game.player.width * 0.5, this.y + this.game.player.height, this.size, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
    }
}

export class Fire extends Particle {
    constructor(game,x ,y){
        super(game);
        this.image = document.querySelector('#fire');
        this.size = Math.random() * 50 + 50;
        this.x = x;
        this.y = y;
        this.speedX = 1;
        this.speedY = 1;
        this.angle = 0;
        this.va = Math.random() * 0.2 - 0.1;
    }
    update() {
        super.update();
        this.angle += this.va;
    }
    draw(context) {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);
        context.drawImage(this.image, -this.size * 0.1, -this.size * 0.25, this.size, this.size);
        context.restore();
    }
}

export class Splash extends Particle {
    constructor(game, x, y) {
        super(game);
        this.size = Math.random() * 100 + 100
        this.x = x - this.size * 0.4;
        this.y = y - this.size * 0.5;
        this.speedX = Math.random() * 6 - 4;
        this.speedY = Math.random() * 2 + 1;
        this.gravity = 0;
        this.image = document.querySelector('#fire');
     }

     update() {
        super.update();
        this.gravity += 0.1;
        this.y += this.gravity;
     }

     draw(context) {
        context.drawImage(this.image, this.x, this.y, this.size, this.size)
     }
}