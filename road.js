class Road {
    constructor(laneCount=4, canvasWidth, canvasHeight) {
        this.margin = 10;
        
        this.canvasHeight = canvasHeight;
        this.buffer = 1000;
        this.top = -this.buffer;
        this.bottom = canvasHeight;
        this.left = 0+this.margin;
        this.right = canvasWidth - this.margin;

        this.laneCount = laneCount;

        const topLeft = {x: this.left, y: this.top};
        const topRight = {x: this.right, y: this.top};
        const bottomLeft = {x: this.left, y: this.bottom};
        const bottomRight = {x: this.right, y: this.bottom};

        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ]
    }

    update(carY) {
        if(carY <= this.top+(this.canvasHeight*0.9)) {
            this.top -= this.buffer;
        }
        if(carY >= this.bottom-(this.canvasHeight*0.9)) {
            this.bottom += this.buffer;
        }

        const topLeft = {x: this.left, y: this.top};
        const topRight = {x: this.right, y: this.top};
        const bottomLeft = {x: this.left, y: this.bottom};
        const bottomRight = {x: this.right, y: this.bottom};

        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ]
    }

    draw(ctx) {
        ctx.save();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;

        ctx.setLineDash([20, 20])
        for (let i = 1; i <= this.laneCount-1; i++) {
            const x = lerp(
                this.left, this.right, i/this.laneCount
            )
            
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom)
            ctx.stroke()
            ctx.closePath();    
        }

        ctx.setLineDash([]);

        this.borders.forEach(border=>{
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke()
        })

        ctx.restore();
    }

    getLaneCenter(lane) {
        let laneWidth = (this.right + this.left) / this.laneCount;
        let laneCenter = (laneWidth * lane) + laneWidth/2;
    
        if(lane==0) {
            laneCenter = laneCenter + this.margin;
        }
        else if(lane == this.laneCount-1) {
            laneCenter = laneCenter - this.margin;
        }
        return laneCenter;
    }

}