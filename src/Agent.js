let hBoundary = 100 ;
let vBoundary = 50;

class Vehicle{
  constructor(x, y){
    this.pos = createVector(x, y);
    this.vel = p5.Vector.fromAngle(random(TAU));
    this.acc = createVector();

    this.maxSpeed = 5;
    this.maxForce = 0.1;

    this.vel.setMag(this.maxSpeed);

    this.perceptionRadius = 100;

    this.bunchedness = 0;

    this.sepForce = createVector()
    this.alignForce = createVector()
    this.cohForce = createVector()
  }

  applyForce(f){
    this.acc.add(f);
  }

  steer(desired){
    let steering = p5.Vector.sub(desired, this.vel);
    return steering;
  }


  seperation(boid, steering){

    // calculate distance to check if it's close enough
    let d = dist(this.pos.x, this.pos.y,
                 boid.pos.x, boid.pos.y)

    // if we are not looking at ourself and the distance is close enough
    if (boid != this && d < this.perceptionRadius){

      // calculate desired opposing vector
      let desired = p5.Vector.sub(this.pos, boid.pos)
      // generate steering force away
      steering.add(this.steer(desired))
      // limit to make it more realistic
      steering.limit(this.maxForce)
    }
    // }

    return steering

  }


  alignment(boid, avg, NBC, steering){

    // calculate distance to check if it's close enough
    let d = dist(this.pos.x, this.pos.y,
                 boid.pos.x, boid.pos.y)

    // if we are not looking at ourself and the distance is close enough
    if (boid != this && d < this.perceptionRadius){

      avg.add(boid.vel)
      NBC++;
    }
    // }

    return steering, avg, NBC

  }

  cohesion(boid, avg, nearBoidCount, steering){

    // calculate distance to check if it's close enough
    let d = dist(this.pos.x, this.pos.y,
                 boid.pos.x, boid.pos.y)

    // if we are not looking at ourself and the distance is close enough
    if (boid != this && d < this.perceptionRadius){

      avg.add(boid.pos)
      //nearBoidCount++;
    }

    return steering, avg, nearBoidCount

  }


  flock(chunkMap, sAmount, aAmount, cAmount){
    let adjBoids = [];
    adjBoids = chunkMap.Query(this, 1);

    this.bunchedness = (adjBoids.length * adjBoids.length) % 360;

    let sep = createVector()
    let align = createVector()
    let coh = createVector()
    let avg = createVector()
    let nearBoidCount = 0;
    let avgPos = createVector()

    for (let boid of adjBoids){
      sep = this.seperation(boid, sep);
      align, avg, nearBoidCount = this.alignment(boid, avg, nearBoidCount, align);
      coh, avgPos, nearBoidCount = this.cohesion(boid, avgPos, nearBoidCount, coh);
    }

    ///////////////////////////////////////////////////////////////////
    if (nearBoidCount){
      avg.div(nearBoidCount)
      align.add(this.steer(avg))
      align.limit(this.maxForce)
    }

    ///////////////////////////////////////////////////////////////////

    // if there are boids around us
    if (nearBoidCount){
      avgPos.div(nearBoidCount)
    }

    let desired = p5.Vector.sub(avgPos, this.pos)

    coh.add(this.steer(desired))
    coh.limit(this.maxForce)

    sep.mult(sAmount)
    align.mult(aAmount)
    coh.mult(cAmount)

    this.sepForce = sep;
    this.alignForce = align;
    this.cohForce = coh;
  }


  showChunk(chunkMap){
    let currChunk = chunkMap.gridCoords(this.pos);

    colorMode(RGB)
    stroke(110)
    rect(currChunk.x * chunkMap.cellSize, currChunk.y * chunkMap.cellSize, chunkMap.cellSize)
  }

  edges(){
    let steering = createVector();

    if (this.pos.x > width-hBoundary){

      let pointOnWall = createVector(width+200, this.pos.y);

      let desired = p5.Vector.sub(this.pos, pointOnWall);
      steering.add(this.steer(desired));
      steering.limit(this.maxForce);

    }
    if (this.pos.x < hBoundary){

      let pointOnWall = createVector(-200, this.pos.y);

      let desired = p5.Vector.sub(this.pos, pointOnWall);
      steering.add(this.steer(desired));
      steering.limit(this.maxForce);

    }
    if (this.pos.y > height-vBoundary){

      let pointOnWall = createVector(this.pos.x, height+100);

      let desired = p5.Vector.sub(this.pos, pointOnWall);
      steering.add(this.steer(desired));
      steering.limit(this.maxForce);

    }
    if (this.pos.y < vBoundary){

      let pointOnWall = createVector(this.pos.x, -100);

      let desired = p5.Vector.sub(this.pos, pointOnWall);
      steering.add(this.steer(desired));
      steering.limit(this.maxForce);

    }

    this.applyForce(p5.Vector.mult(steering, 100));



    if (this.pos.x > width+200){
      this.pos.x = width/2;
    }
    if (this.pos.x < -200){
      this.pos.x = width/2;
    }
    if (this.pos.y > height+200){
      this.pos.y = height/2;
    }
    if (this.pos.y < -200){
      this.pos.y = height/2;
    }

  }

  update(){
    this.vel.setMag(this.maxSpeed)
    this.vel.mult(deltaTime/10)
    this.pos.add(this.vel)
    this.vel.add(this.acc)

    this.acc.mult(0)
  }

  show(cVal){
    colorMode(HSB)

    stroke(cVal, 100, 100, 1)
    noFill()
    //fill(cVal, 100, 100, 1)
    strokeWeight(1)

    push()

    translate(this.pos.x, this.pos.y)
    rotate(atan2(this.vel.y, this.vel.x))
    // rotate((colIDX%360) * (TAU/180))
    
    //circle(0, 0, 50)
    // line(0, 0, 30, 0)  // shows direction of boid
    
    //triangle(-1, -1, -1, 1, 3, 0)  // really small boid
    triangle(-5, -5, -5, 5, 15, 0)   // medium boid
    //triangle(-10, -10, -10, 10, 30, 0)  // large boid
    
    //rectMode(CENTER)
    //rect(0, 0, 50, 50)
    pop()

    // rect(this.pos.x, this.pos.y, 3, 3)
  }
}
