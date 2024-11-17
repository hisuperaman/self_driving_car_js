class Road {
    constructor(laneCount, canvasWidth, canvasHeight) {
        this.margin = 10;
        
        this.top = 0;
        this.bottom = canvasHeight;
        this.left = 0+this.margin;
        this.right = canvasWidth - this.margin;

        this.laneCount = laneCount;
    }

    update() {

    }

    draw(ctx) {
        ctx.save();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;

        for (let i = 0; i <= this.laneCount; i++) {
            const x = this.#lerp(
                this.left, this.right, i/this.laneCount
            )
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom)

            if(i>0 && i<this.laneCount) {
                ctx.setLineDash([20, 20])
            }
            else{
                ctx.setLineDash([]);
            }

            ctx.stroke()
            ctx.closePath();    
        }

        ctx.restore();
    }

    #lerp(start, end, t) {
        return start + (end - start) * t;
    }
}