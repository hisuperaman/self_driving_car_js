class Car {
    constructor(x, y, canvasWidth, carType="AI", maxSpeed=3) {
        this.x = x;
        this.y = y;

        this.width = 30;
        this.height = 50;

        this.canvasWidth = canvasWidth;


        this.speed = 0;
        this.maxSpeed = maxSpeed;
        this.acceleration = 0.2;
        this.friction = 0.05;

        this.angle = 0;
        this.angleInterval = 0.03;
        this.directionFactor = 1;

        this.sprite = new Image();
        this.sprite.src = "./car.png";

        this.trafficSprite = new Image();
        this.trafficSprite.src = "./traffic_car.png";

        this.polygon = [];
        this.damaged = false;

        this.controls = new Controls(carType);

        this.useBrain = carType=="AI";
        if(carType!="DUMMY") {
            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork(
                [this.sensor.rayCount, 6, 4]
            )
        }
        this.carType = carType;
    }

    update(roadBorders, traffic) {
        if(!this.damaged) {
            this.#move();
    
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }

        if(this.sensor) {
            this.sensor.update(roadBorders, traffic);
            const offsets = this.sensor.readings.map(
                r => r==null ? 0 : r.offset
            )
            const outputs = NeuralNetwork.feedForward(offsets, this.brain);
            if(this.useBrain) {
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.reverse = outputs[3];
            }
        }
    }

    draw(ctx, drawSensor=false) {
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for(let i=1; i<this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        if(this.carType=="DUMMY") {
            ctx.fillStyle = "green";
            ctx.fill()

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(-this.angle);
            ctx.drawImage(this.trafficSprite, -this.width/2, -this.height/2, this.width, this.height);
            ctx.restore();
        }
        if(this.carType != "DUMMY") {
            ctx.fillStyle = (this.damaged) ? "gray" : "black";
            ctx.fill();

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(-this.angle);
            ctx.drawImage(this.sprite, -this.width/2, -this.height/2, this.width, this.height);
            ctx.restore();
        }
        ctx.closePath();

        if(this.sensor && drawSensor) {
            this.sensor.draw(ctx);
        }
    }

    #assessDamage(roadBorders, traffic) {
        for(let i=0; i<roadBorders.length; i++) {
            if(polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }
        for(let i=0; i<traffic.length; i++) {
            if(polysIntersect(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }
        return false;
    }

    #createPolygon() {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);
        points.push({
            x: this.x-Math.sin(this.angle-alpha)*rad,
            y: this.y-Math.cos(this.angle-alpha)*rad
        })
        points.push({
            x: this.x-Math.sin(this.angle+alpha)*rad,
            y: this.y-Math.cos(this.angle+alpha)*rad
        })
        points.push({
            x: this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y: this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        })
        points.push({
            x: this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y: this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        })

        return points;
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