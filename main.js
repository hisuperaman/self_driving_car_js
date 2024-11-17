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


const road = new Road(3, CANVAS_WIDTH, CANVAS_HEIGHT);
const N = 1;
const cars = generateCars(N);

let bestCar = cars[0];
if(localStorage.getItem("hisuperaman-bestBrain")) {
    for(let i=0; i<cars.length; i++) {
        if(cars[i] == bestCar) {
            bestCar.brain = JSON.parse(localStorage.getItem("hisuperaman-bestBrain"))
        }
        else{
            cars[i].brain = NeuralNetwork.mutate(cars[i].brain, 0.1)
        }
    }
}

function generateCars(N) {
    const cars = [];
    for(let i=0; i<N; i++) {
        cars.push(
            new Car(road.getLaneCenter(1), CANVAS_HEIGHT/2, CANVAS_WIDTH)
        )
    }

    return cars;
}

let traffic = [
    new Car(road.getLaneCenter(0), CANVAS_HEIGHT/2-100, CANVAS_WIDTH, "DUMMY", maxSpeed=2),
    new Car(road.getLaneCenter(1), CANVAS_HEIGHT/2-100, CANVAS_WIDTH, "DUMMY", maxSpeed=1),
    new Car(road.getLaneCenter(2), CANVAS_HEIGHT/2-100, CANVAS_WIDTH, "DUMMY", maxSpeed=1.5),

    new Car(road.getLaneCenter(0), CANVAS_HEIGHT/2-200, CANVAS_WIDTH, "DUMMY", maxSpeed=2),
    new Car(road.getLaneCenter(1), CANVAS_HEIGHT/2-200, CANVAS_WIDTH, "DUMMY", maxSpeed=1),
    new Car(road.getLaneCenter(2), CANVAS_HEIGHT/2-300, CANVAS_WIDTH, "DUMMY", maxSpeed=1.5),
    new Car(road.getLaneCenter(0), CANVAS_HEIGHT/2-400, CANVAS_WIDTH, "DUMMY", maxSpeed=2),
    new Car(road.getLaneCenter(1), CANVAS_HEIGHT/2-500, CANVAS_WIDTH, "DUMMY", maxSpeed=1),
]

function animate(timestamp) {
    ctx.fillStyle = "#bababa";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const deltaTime = Math.abs(lastPaintTime - timestamp);
    elapsedTime += deltaTime;

    if(elapsedTime > gameInterval) {
        // game
        for(let i=0; i<cars.length; i++) {
            cars[i].update(road.borders, traffic);
        }
        for(let i=0; i<traffic.length; i++) {
            traffic[i].update(road.borders, []);
        }

        bestCar = cars.find(
            c => c.y == Math.min(...cars.map(
                c => c.y
            ))
        )
        
        ctx.save();
        ctx.translate(0, -bestCar.y+CANVAS_HEIGHT*0.6)
        road.draw(ctx);
        for(let i=0; i<traffic.length; i++) {
            traffic[i].draw(ctx);
        }

        for(let i=0; i<cars.length; i++) {
            if(cars[i] != bestCar) {
                ctx.globalAlpha = 0.2;
                cars[i].draw(ctx);
            }
            else{
                ctx.globalAlpha = 1;
                cars[i].draw(ctx, true);
            }
        }

        ctx.restore();
    }

    lastPaintTime = timestamp;
    
    window.requestAnimationFrame(animate);
}

function saveBestBrain() {
    localStorage.setItem(
        "hisuperaman-bestBrain", JSON.stringify(bestCar.brain)
    );
}
function clearBestBrain() {
    localStorage.setItem(
        "hisuperaman-bestBrain", ""
    );
}

animate(0);