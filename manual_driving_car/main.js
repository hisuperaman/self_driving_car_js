const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let CANVAS_WIDTH = canvas.width = canvas.scrollWidth;
let CANVAS_HEIGHT = canvas.height = canvas.scrollHeight;

const gameInterval = 100;
let elapsedTime = 0;
let lastPaintTime = 0;


function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;

    const width = canvas.scrollWidth;
    const height = canvas.scrollHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    CANVAS_WIDTH = width;
    CANVAS_HEIGHT = height;

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';


    ctx.scale(dpr, dpr)
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();


const car = new Car(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, CANVAS_WIDTH)
const road = new Road(4, CANVAS_WIDTH, CANVAS_HEIGHT);

function animate(timestamp) {
    ctx.fillStyle = "#bababa";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const deltaTime = Math.abs(lastPaintTime - timestamp);
    elapsedTime += deltaTime;

    if(elapsedTime > gameInterval) {
        // game
        
        car.update();
        
        road.draw(ctx);
        car.draw(ctx);
    }

    lastPaintTime = timestamp;
    
    window.requestAnimationFrame(animate);
}

animate(0);