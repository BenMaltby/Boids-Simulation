class pointOBJ{
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
}

class ChunkSystem{
  constructor(cellSize){
    // map to store grid cells
    this.chunkMap = new Map();

    // width and height of each cell in pixels
    this.cellSize = cellSize;
  }

  // Method to insert into ChunkSystem
  insert(boid){

    // Create Grid pointOBJ
    let currChunk = new pointOBJ(floor(boid.pos.x / this.cellSize), floor(boid.pos.y / this.cellSize))

    // Make unique chunk Key for grid coordinate
    let chunkKey = ("" + currChunk.x + " " + currChunk.y + "")

    // if chunk map does not yet contain points at chunk Key index
    if ( !(this.chunkMap.has(chunkKey)) ){
      // create array of boid obj's at chunk coordinate
      this.chunkMap.set(chunkKey, [boid]);

    // if chunk map already contains boids at chunk Key index
    }else{
      // retrieve current boid array
      let boidArray = this.chunkMap.get(chunkKey);
      // add current boid to obj array
      boidArray.push(boid);
      // update the chunk map with new boid array
      this.chunkMap.set(chunkKey, boidArray);
    }

  }

  // Method to find all points within a given radius of "Query Point"
  Query(boid, radius){

    // array containing all points within the radius
    let adjascentBoids = [];

    let currChunk = new pointOBJ(floor(boid.pos.x / this.cellSize), floor(boid.pos.y / this.cellSize))

    for (let y = currChunk.y - radius; y < currChunk.y + radius; y++){
      for (let x = currChunk.x - radius; x < currChunk.x + radius; x++){

        // Make unique chunk Key for grid coordinate
        let chunkKey = ("" + x + " " + y + "")

        // if there are boids in the chunk,
        // and we aren't looking at our own chunk
        if (this.chunkMap.has(chunkKey) /*&& !(x == currChunk.x && y == currChunk.y) */){

          // add all boids to final array
          adjascentBoids = adjascentBoids.concat(this.chunkMap.get(chunkKey));
        }

      }
    }

    return adjascentBoids;

  }

  gridCoords(point){
    let currChunk = new pointOBJ(point.x / this.cellSize, point.y / this.cellSize)

    // floor decimal values
    currChunk.x = floor(currChunk.x);
    currChunk.y = floor(currChunk.y);

    return currChunk;
  }
}
