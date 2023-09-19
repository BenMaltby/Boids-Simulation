// With Chunk Optimisations
// Runs really poor in browser but runs way better from local file
// I managed to run simulation with 10,000 boids from local file
// the framerate was terrible of course
// The boids are coloured by how dense the flock is.

let vehicles = []
let nBoids = 400;  // number of boids
let gSize = 30;  // size of each chunk cell in pixels
// the size has to be really small in browser

let chunks;

let sepSlider;
let alignSlider;
let cohSlider;

let colIDX = 0;

function setup() {
  createCanvas(1500, 700)
  frameRate(144)

  background(50)

  for (let i = 0; i < nBoids; i++){
    vehicles.push(new Vehicle(random(width), random(height)));
  }

  chunks = new ChunkSystem(gSize);

  sepSlider = createSlider(0, 4, 2, 0.05)
  alignSlider = createSlider(0, 4, 4, 0.05)
  cohSlider = createSlider(0, 4, 0.5, 0.05)
}

function draw() {
  //colorMode(RGB)
  //background(28)
  background(colIDX%359, 0, 15, 0.5);

  generateChunks(vehicles);

  for (let vehicle of vehicles){
    vehicle.flock(chunks, sepSlider.value(), alignSlider.value(), cohSlider.value())

    //vehicle.showChunk(chunks)
    vehicle.edges();
    vehicle.update();
    vehicle.show(vehicle.bunchedness);
  }

  applyFlockingForces(vehicles)

  chunks.chunkMap.clear()

  textSize(20)
  text(round(frameRate()), 10, 25)
  colIDX += 1;
}

function applyFlockingForces(boids){
  for (let boid of boids){
    boid.applyForce(boid.sepForce);
    boid.applyForce(boid.alignForce);
    boid.applyForce(boid.cohForce);
  }
}

function generateChunks(boids){
  for (let boid of boids){
        chunks.insert(boid);
  }
}
