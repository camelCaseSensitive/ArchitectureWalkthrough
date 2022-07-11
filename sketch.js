let p = {
    x: 500,
    y: 0,
    z: 0, 
    th: Math.PI,
    phi: 0,
    mX: 0,
    my: 0,
    clicked: false,
    keys:{
      up: false,
      down: false,
      left: false,
      right: false
    },
    v: 5,
    hit: false,
    hitPt: {
      x: 0,
      y: 0,
      z: 0
    },
    hitNorm: {
      x: 0, 
      y: 0, 
      z: 0
    },
    jump: false,
    jumpV: 50,
    jumping: false,
    camera: 'first'  // third
  }
  let frame = 0;
  let hitDist = 5;
  let scl= 0.1;
  
  function preload(){
    sky = loadImage("skybox.jpg")
    wallsTexture = loadImage('Walls.png')
    ceilingTexture = loadImage('Ceiling2.png')
    carpetTexture = loadImage('Carpet.png')
    // cube = loadModel("prism.obj")
    cube = loadModel("Walls.obj")
    ceiling = loadModel("Ceiling.obj");
    carpet = loadModel("Carpet.obj");
  }
  
  function setup() {
    createCanvas(1920, 1080, WEBGL).parent('sketch-holder');
    // setAttributes('antialias', true);
    // frustum(0.1, -0.1, 0.1, -0.1, 0.1, 200);
    perspective(PI / 2.5, width / height, 0.1, 50000);
    // textureWrap(REPEAT, REPEAT)
  }
  
  function draw() {
    frame += 0.01
    background(255);
    lights()
    pointLight(100, 100, 100, 1000, 2050, 5000)
    scale(scl)
    // pointLight(255, 255, 255, -500, -1050, 5000)
    // noStroke()
    // stroke(0)
    texture(wallsTexture)
    model(cube)

    texture(carpetTexture)
    model(carpet)

    texture(ceilingTexture)
    model(ceiling)
    stroke(0)
  
    
    noStroke()
    
    // sphere(100)
    
    // Skybox
    // push()
    //   texture(sky)
    //   rotateX(-PI/2)
    //   sphere(5000)
    // pop()
    
    // Ground plane
    // push()
    //   translate(0, 0, -500)
    //   fill(184, 170, 112)
    //   plane(50000, 50000, 100, 100)
    // pop()
    
    // Ceiling Plane
    // push()
    //   translate(0, 0, 300)
    //   fill('#F6E59B')
    //   plane(5000, 5000, 100, 100)
    // pop()
    
    // push()
    //   translate(0, 1000, 0)
    //   rotateX(PI/2)
    //   plane(1005)
    // pop()
    
    // Camera(location, lookAtPt, UpVector)
    if(p.camera == 'first'){
      camera(p.x, p.y, p.z, 
           p.x + 10 * cos(p.th), p.y + 10 * sin(p.th), 10*sin(p.phi) + p.z, 
           0, 0, -1);
    } 
    if(p.camera == 'third'){
      camera(p.x - 500 * cos(p.th), p.y - 500 * sin(p.th), p.z - 500 *sin(p.phi), 
           p.x, p.y, p.z, 
           0, 0, -1);
      push()
        translate(p.x, p.y, p.z)
      rotateX(PI/2)
        sphere(10)
      pop()
    }
    
    
    // Mouse look around controls
    if(abs(p.mX - mouseX) > 0.1 && p.clicked){
      p.mX += (mouseX - p.mX)/10
      p.th += (mouseX - p.mX)/1000
    }
    if(abs(p.mY - mouseY) > 0.1 && p.clicked ){
      p.mY += (mouseY - p.mY)/10
      p.phi -= (mouseY - p.mY)/1000
      if(abs(p.phi) >= PI/2) p.phi += (mouseY - p.mY)/1000
    }
    
    // Strafe and movement controls
    if(p.keys.down){
      p.x += p.v*cos(p.th);
      p.y += p.v*sin(p.th);
      collisionCheck()
      if(p.hit){
        let A = p.hitNorm.x;
        let B = p.hitNorm.y;
        let C = p.hitNorm.z;

        let x0 = p.x;
        let y0 = p.y;
        let z0 = p.z;

        p.x -= p.v*cos(p.th);
        p.y -= p.v*sin(p.th);
 
        let x1 = p.x;
        let y1 = p.y;
        let z1 = p.z;
        
        let D = -( A*x1 + B*y1 + C*z1);
        
        let d = abs(A*x0 + B*y0 + C*z0 + D) / sqrt(A**2 + B**2 + C**2);
        
        let t = ( A*x1 - A*x0 + B*y1 - B*y0 + C*z1 - C*z0 ) / (A**2 + B**2 + C**2)

        let pPrev = {
          x: p.x,
          y: p.y,
          z: p.z
        }
        
        p.x = x0 + t*A;
        p.y = y0 + t*B;
        p.z = z0 + t*C;
        collisionCheck()
        if(p.hit){
          p.x = pPrev.x;
          p.y = pPrev.y;
          p.z = pPrev.z
        }
      }
    }
    if(p.keys.up){
      p.x -= p.v*cos(p.th);
      p.y -= p.v*sin(p.th);
      collisionCheck()
      if(p.hit){
        let A = p.hitNorm.x;
        let B = p.hitNorm.y;
        let C = p.hitNorm.z;

        let x0 = p.x;
        let y0 = p.y;
        let z0 = p.z;

        p.x += p.v*cos(p.th);
        p.y += p.v*sin(p.th);
 
        let x1 = p.x;
        let y1 = p.y;
        let z1 = p.z;
        
        let D = -( A*x1 + B*y1 + C*z1);
        
        let d = abs(A*x0 + B*y0 + C*z0 + D) / sqrt(A**2 + B**2 + C**2);
        
        let t = ( A*x1 - A*x0 + B*y1 - B*y0 + C*z1 - C*z0 ) / (A**2 + B**2 + C**2)

        let pPrev = {
          x: p.x,
          y: p.y,
          z: p.z
        }
        
        p.x = x0 + t*A;
        p.y = y0 + t*B;
        p.z = z0 + t*C;
        collisionCheck()
        if(p.hit){
          p.x = pPrev.x;
          p.y = pPrev.y;
          p.z = pPrev.z
        }
      }
    }
    if(p.keys.right){
      p.x += p.v*cos(p.th + PI/2);
      p.y += p.v*sin(p.th + PI/2);
      collisionCheck()
      if(p.hit){
        let A = p.hitNorm.x;
        let B = p.hitNorm.y;
        let C = p.hitNorm.z;

        let x0 = p.x;
        let y0 = p.y;
        let z0 = p.z;

        p.x -= p.v*cos(p.th + PI/2);
        p.y -= p.v*sin(p.th + PI/2);
 
        let x1 = p.x;
        let y1 = p.y;
        let z1 = p.z;
        
        let D = -( A*x1 + B*y1 + C*z1);
        
        let d = abs(A*x0 + B*y0 + C*z0 + D) / sqrt(A**2 + B**2 + C**2);
        
        let t = ( A*x1 - A*x0 + B*y1 - B*y0 + C*z1 - C*z0 ) / (A**2 + B**2 + C**2)

        let pPrev = {
          x: p.x,
          y: p.y,
          z: p.z
        }
        
        p.x = x0 + t*A;
        p.y = y0 + t*B;
        p.z = z0 + t*C;
        collisionCheck()
        if(p.hit){
          p.x = pPrev.x;
          p.y = pPrev.y;
          p.z = pPrev.z
        }
      }
    }
    if(p.keys.left){
      p.x -= p.v*cos(p.th + PI/2);
      p.y -= p.v*sin(p.th + PI/2);
      collisionCheck()
      if(p.hit){
        let A = p.hitNorm.x;
        let B = p.hitNorm.y;
        let C = p.hitNorm.z;

        let x0 = p.x;
        let y0 = p.y;
        let z0 = p.z;

        p.x += p.v*cos(p.th + PI/2);
        p.y += p.v*sin(p.th + PI/2);
 
        let x1 = p.x;
        let y1 = p.y;
        let z1 = p.z;
        
        let D = -( A*x1 + B*y1 + C*z1);
        
        let d = abs(A*x0 + B*y0 + C*z0 + D) / sqrt(A**2 + B**2 + C**2);
        
        let t = ( A*x1 - A*x0 + B*y1 - B*y0 + C*z1 - C*z0 ) / (A**2 + B**2 + C**2)

        let pPrev = {
          x: p.x,
          y: p.y,
          z: p.z
        }
        
        p.x = x0 + t*A;
        p.y = y0 + t*B;
        p.z = z0 + t*C;
        collisionCheck()
        if(p.hit){
          p.x = pPrev.x;
          p.y = pPrev.y;
          p.z = pPrev.z
        }
      }
    }

    // Gravity
    if(p.jump){
      p.jump = false;
      p.jumping = true;
      p.z += p.jumpV;
    } else if(p.jumping){
      p.jumpV -= 0.25;
      p.z += p.jumpV
    }
    p.z -= 1;
    floorCheck()
    if(p.hit){
      p.jumping = false;
      p.jumpV = 7;
      let A = p.hitNorm.x;
      let B = p.hitNorm.y;
      let C = p.hitNorm.z;

      let x0 = p.x;
      let y0 = p.y;
      let z0 = p.z;

      p.z += 1

      let x1 = p.x;
      let y1 = p.y;
      let z1 = p.z;
      
      let D = -( A*x1 + B*y1 + C*z1);
      
      let d = abs(A*x0 + B*y0 + C*z0 + D) / sqrt(A**2 + B**2 + C**2);
      
      let t = ( A*x1 - A*x0 + B*y1 - B*y0 + C*z1 - C*z0 ) / (A**2 + B**2 + C**2)

      let pPrev = {
        x: p.x,
        y: p.y,
        z: p.z
      }
      
      p.x = x0 + t*A;
      p.y = y0 + t*B;
      p.z = z0 + t*C;
      collisionCheck()
      if(p.hit){
        p.x = pPrev.x;
        p.y = pPrev.y;
        p.z = pPrev.z
      }
    }

    
  }
  
  function mousePressed(){
    // console.log(cube)
    // console.log(cube._getFaceNormal(0).x)
    p.clicked = !p.clicked;
    p.mX = mouseX;
    p.mY = mouseY;
    if(p.clicked){
      document.getElementById("sketch-holder").style.cursor = "none"
    } else {
      document.getElementById("sketch-holder").style.cursor = "default"
    }
  }
  
  function keyPressed() {
    if(keyCode == 37 || keyCode == 65){
      p.keys.left = true;
    }
    if(keyCode == 39 || keyCode == 68){
      p.keys.right = true;
    }
    if(keyCode == 38 || keyCode == 87){
      p.keys.down = true;
    }
    if(keyCode == 40 || keyCode == 83){
      p.keys.up = true;
    }
    if(keyCode == 32){
      p.jump = true;
    }
  }
  
  function keyReleased() {
    if(keyCode == 37 || keyCode == 65){
      p.keys.left = false;
    }
    if(keyCode == 39 || keyCode == 68){
      p.keys.right = false;
    }
    if(keyCode == 38 || keyCode == 87){
      p.keys.down = false;
    }
    if(keyCode == 40 || keyCode == 83){
      p.keys.up = false;
    }
  }
  
  function dotProd(a, b) {
    return (a.x * b.x + a.y * b.y + a.z * b.z)
  }
  
  function vecMag(a){
    return (Math.sqrt(a.x**2 + a.y**2 + a.z**2))
  }
  
  function vecSub(a, b) {
    return {
      x: a.x - b.x, 
      y: a.y - b.y,
      z: a.z - b.z
    }
  }
  
  function collisionCheck() {
    let ptOnPlane;
    p.hit = false;
    
    // Find distance from player to each face of a model 'cube'
    for(i = 0; i < cube.faces.length; i++){
      // console.log(cube.faces[i])
      let n = cube._getFaceNormal(i)
      let A = n.x;
      let B = n.y;
      let C = n.z;
      
      let q = cube.vertices[ cube.faces[i][0] ];
      q = vScale(q, scl);
      let r = cube.vertices[ cube.faces[i][1] ];
      r = vScale(r, scl)
      let s = cube.vertices[ cube.faces[i][2] ];
      s = vScale(s, scl)
      
      let x1 = q.x;
      let y1 = q.y;
      let z1 = q.z;
      
      let x0 = p.x;
      let y0 = p.y;
      let z0 = p.z;
      
      let D = -( A*x1 + B*y1 + C*z1);
      
      let d = abs(A*x0 + B*y0 + C*z0 + D) / sqrt(A**2 + B**2 + C**2);
      
      let t = ( A*x1 - A*x0 + B*y1 - B*y0 + C*z1 - C*z0 ) / (A**2 + B**2 + C**2)
      
      ptOnPlane = {
        x: x0 + t*A,
        y: y0 + t*B,
        z: z0 + t*C
      }
    
      
      if(true){
        // ******* COLLISION DEBUG *******************
        // Lines to each vertice
        // stroke(2)
        // line(ptOnPlane.x, ptOnPlane.y, ptOnPlane.z, 
        //   q.x, q.y, q.z)
        // line(ptOnPlane.x, ptOnPlane.y, ptOnPlane.z, 
        //     r.x, r.y, r.z)
        // line(ptOnPlane.x, ptOnPlane.y, ptOnPlane.z, 
        //     s.x, s.y, s.z)
        
        let pq = vecSub(q, ptOnPlane)
        let pr = vecSub(r, ptOnPlane)
        let ps = vecSub(s, ptOnPlane)
        
        if( (thBetween(pq, pr) + thBetween(pr, ps) + thBetween(ps, pq)) > 2*PI-0.05){
          // console.log("HIT")
          
          p.hitPt = ptOnPlane;
          
          if(dist(p.x, p.y, p.z, p.hitPt.x, p.hitPt.y, p.hitPt.z) < hitDist ) {
            p.hit = true;
            p.hitNorm = {
              x: A,
              y: B,
              z: C
            }
          }
    
          // ******* COLLISION DEBUG *******************
          // push()
          //   translate(ptOnPlane.x, ptOnPlane.y, ptOnPlane.z)
          //   fill(255, 0, 0)
          //   sphere(15)
          // pop()
        }
      }
      
      
      // ******* COLLISION DEBUG *******************
      // push()
      //   translate(ptOnPlane.x, ptOnPlane.y, ptOnPlane.z)
      //   sphere(10)
      // pop()
      
      // console.log(i + " is " + round(d))
    }
  }

  function floorCheck() {
    let ptOnPlane;
    p.hit = false;
    
    // Find distance from player to each face of a model 'cube'
    for(i = 0; i < carpet.faces.length; i++){
      // console.log(cube.faces[i])
      let n = carpet._getFaceNormal(i)
      let A = n.x;
      let B = n.y;
      let C = n.z;
      
      let q = carpet.vertices[ carpet.faces[i][0] ];
      q = vScale(q, scl);
      let r = carpet.vertices[ carpet.faces[i][1] ];
      r = vScale(r, scl)
      let s = carpet.vertices[ carpet.faces[i][2] ];
      s = vScale(s, scl)
      
      let x1 = q.x;
      let y1 = q.y;
      let z1 = q.z;
      
      let x0 = p.x;
      let y0 = p.y;
      let z0 = p.z;
      
      let D = -( A*x1 + B*y1 + C*z1);
      
      let d = abs(A*x0 + B*y0 + C*z0 + D) / sqrt(A**2 + B**2 + C**2);
      
      let t = ( A*x1 - A*x0 + B*y1 - B*y0 + C*z1 - C*z0 ) / (A**2 + B**2 + C**2)
      
      ptOnPlane = {
        x: x0 + t*A,
        y: y0 + t*B,
        z: z0 + t*C
      }
    
      
      if(true){
        // ******* COLLISION DEBUG *******************
        // Lines to each vertice
        // stroke(2)
        // line(ptOnPlane.x, ptOnPlane.y, ptOnPlane.z, 
        //   q.x, q.y, q.z)
        // line(ptOnPlane.x, ptOnPlane.y, ptOnPlane.z, 
        //     r.x, r.y, r.z)
        // line(ptOnPlane.x, ptOnPlane.y, ptOnPlane.z, 
        //     s.x, s.y, s.z)
        
        let pq = vecSub(q, ptOnPlane)
        let pr = vecSub(r, ptOnPlane)
        let ps = vecSub(s, ptOnPlane)
        
        if( (thBetween(pq, pr) + thBetween(pr, ps) + thBetween(ps, pq)) > 2*PI-0.05){
          // console.log("HIT")
          
          p.hitPt = ptOnPlane;
          
          if(dist(p.x, p.y, p.z, p.hitPt.x, p.hitPt.y, p.hitPt.z) < 100 ) {
            p.hit = true;
            p.hitNorm = {
              x: A,
              y: B,
              z: C
            }
          }
    
          // ******* COLLISION DEBUG *******************
          // push()
          //   translate(ptOnPlane.x, ptOnPlane.y, ptOnPlane.z)
          //   fill(255, 0, 0)
          //   sphere(15)
          // pop()
        }
      }
      
      
      // ******* COLLISION DEBUG *******************
      // push()
      //   translate(ptOnPlane.x, ptOnPlane.y, ptOnPlane.z)
      //   sphere(10)
      // pop()
      
      // console.log(i + " is " + round(d))
    }
  }
  
  function thBetween(a, b){
    return Math.acos(  dotProd(a, b) / ( vecMag(a) * vecMag(b) )  )
  }

  function vScale(v, s) {
    return {
      x: v.x*s,
      y: v.y*s, 
      z: v.z*s
    }
  }

  // function projToPlane(v, q, n){
  //   // v is the movement vector
  //   // q is the players's current position (pt on the plane)
  //   // n is the normal vector


  //   let n = cube._getFaceNormal(i)
  //   let A = n.x;
  //   let B = n.y;
  //   let C = n.z;
    
  //   let x1 = q.x;
  //   let y1 = q.y;
  //   let z1 = q.z;
    
  //   let x0 = p.x;
  //   let y0 = p.y;
  //   let z0 = p.z;
    
  //   let D = -( A*x1 + B*y1 + C*z1);
    
  //   let d = abs(A*x0 + B*y0 + C*z0 + D) / sqrt(A**2 + B**2 + C**2);
    
  //   let t = ( A*x1 - A*x0 + B*y1 - B*y0 + C*z1 - C*z0 ) / (A**2 + B**2 + C**2)
    
  //   ptOnPlane = {
  //     x: x0 + t*A,
  //     y: y0 + t*B,
  //     z: z0 + t*C
  //   }
  // }