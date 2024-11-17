class Car {
    constructor(x, y, canvasWidth) {
        this.x = x;
        this.y = y;

        this.width = 30;
        this.height = 50;

        this.canvasWidth = canvasWidth;

        this.controls = new Controls();

        this.speed = 0;
        this.maxSpeed = 3;
        this.acceleration = 0.2;
        this.friction = 0.05;

        this.angle = 0;
        this.angleInterval = 0.03;
        this.directionFactor = 1;

        this.sprite = new Image();
        this.sprite.src = "./car.png";
    }

    update() {
        this.#move();

    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);
        ctx.drawImage(this.sprite, -this.width/2, -this.height/2, this.width, this.height);
        ctx.restore();
    }

    #move() {
        if(this.controls.forward) {
            this.speed += this.acceleration;
            this.directionFactor = 1;
        }
        if(this.controls.reverse) {
            this.speed -= this.acceleration;
            this.directionFactor = -1;
        }

        if(this.speed != 0){
            if(this.controls.left) {
                this.angle += this.angleInterval/(this.directionFactor==-1 ? 2 : 1) * this.directionFactor;
            }
            if(this.controls.right) {
                this.angle -= this.angleInterval/(this.directionFactor==-1 ? 2 : 1) * this.directionFactor;
            }
        }

        if(this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }
        if(this.speed < -this.maxSpeed/2) {
            this.speed = -this.maxSpeed/2;
        }

        if(this.speed > 0) {
            this.speed -= this.friction;
        }
        if(this.speed < 0) {
            this.speed += this.friction;
        }

        if(Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        this.y -= Math.cos(this.angle) * this.speed;
        this.x -= Math.sin(this.angle) * this.speed;
    }
}