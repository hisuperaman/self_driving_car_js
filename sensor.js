class Sensor {
    constructor(car) {
        this.car = car;
        this.rayLength = 100;
        this.rays = [];
        this.rayCount = 5;
        this.raySpread = Math.PI/4;

        this.readings = [];
    }

    update(roadBorders, traffic) {
        this.#castRays();

        this.readings = [];
        for(let i=0; i<this.rays.length; i++) {
            this.readings.push(this.#getReading(this.rays[i], roadBorders, traffic));
        }
    }

    draw(ctx) {
        for(let i=0; i<this.rays.length; i++) {
            const ray = this.rays[i];
            let end = ray[1];
            if(this.readings[i]) {
                end = this.readings[i]
            }
            
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black"
            ctx.beginPath();
            ctx.moveTo(ray[0].x, ray[0].y)
            ctx.lineTo(end.x, end.y)
            ctx.stroke()
            ctx.closePath();


            ctx.strokeStyle = "red"
            ctx.beginPath();
            ctx.moveTo(ray[1].x, ray[1].y)
            ctx.lineTo(end.x, end.y)
            ctx.stroke()
            ctx.closePath();
        }
    }

    #getReading(ray, roadBorders, traffic) {
        let touches = [];

        for(let i=0; i<roadBorders.length; i++) {
            const touch = getIntersection(
                ray[0],
                ray[1],
                roadBorders[i][0],
                roadBorders[i][1]
            )

            if (touch) {
                touches.push(touch);
            }
        }
        for(let i=0; i<traffic.length; i++) {
            const trafficPoly = traffic[i].polygon;
            for(let j=0; j<trafficPoly.length; j++) {
                const touch = getIntersection(
                    ray[0],
                    ray[1],
                    trafficPoly[j],
                    trafficPoly[(j+1) % trafficPoly.length]
                )
    
                if (touch) {
                    touches.push(touch);
                }
            }
        }

        if (touches.length==0) {
            return null;
        }
        else {
            const offsets = touches.map(t=>t.offset);
            const minOffset = Math.min(...offsets);
            return touches.find(e=>e.offset == minOffset);
        }

    }

    #castRays() {
        this.rays = [];

        for(let i=0; i<this.rayCount; i++) {
            const rayAngle = lerp(
                -this.raySpread,
                this.raySpread,
                (this.rayCount>1) ? (i/(this.rayCount-1)) : (0.5)
            ) - this.car.angle
            
            const start = {
                x: this.car.x, y: this.car.y
            };
            const end = {
                x: this.car.x + Math.sin(rayAngle) * this.rayLength,
                y: this.car.y - Math.cos(rayAngle) * this.rayLength
            };

            this.rays.push([start, end]);
        }
    }
}