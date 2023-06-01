let res = 10;
let grid_X;
let grid_Y;
let lines = 3000; // 3000 field lines by default
let mode = "line"; // default mode is lines

// if arrowMode button is clicked, change mode variable
arrowMode.addEventListener("click", () => {
  mode = arrowMode.getAttributeNode("val").value;
});

// if lineMode button is clicked, change mode variable
lineMode.addEventListener("click", () => {
  mode = lineMode.getAttributeNode("val").value;
});

function setup() {
  createCanvas(750, 750);
  frameRate(30); // default FPS
  grid_X = new Array(width / res);
  grid_Y = new Array(width / res);
  for (let i = 0; i < width / res; i++) {
    grid_X[i] = new Array(height / res);
    grid_Y[i] = new Array(height / res);
  }
  c1 = new Charge(400, 200, 30);
  c2 = new Charge(400, 500, -30);
  // when button is clicked, changes charge1 to negative charge
  charge1.addEventListener("click", () => {
    if (c1.v > 0) {
      // if positive charge -> set to negative charge
      c1 = new Charge(400, 200, -30);
    } else {
      c1 = new Charge(400, 200, 30);
    }
    vectorGrid(); // re-render charge
  });

  // repeat for charge 2

  charge2.addEventListener("click", () => {
    if (c2.v > 0) {
      // if positive charge -> set to negative charge
      c2 = new Charge(400, 500, -30);
    } else {
      c2 = new Charge(400, 500, 30);
    }
    vectorGrid(); // re-render charge
  });

  // set 5fps button
  slowBtn.addEventListener("click", () => {
    frameRate(5); // slow FPS
  });
  // set 30fps button
  fastBtn.addEventListener("click", () => {
    frameRate(30); // slow FPS
  });
  // set 60fps button
  fastestBtn.addEventListener("click", () => {
    frameRate(60); // slow FPS
  });

  vectorGrid();
}

function draw() {
  // repeatedly gets called
  background(220);
  drawGrid();
  c1.display();
  c2.display();

  if (mode == "arrow") {
    drawArrows(25);
  } else if (mode == "line") {
    drawLines(lines);
  }
}

function Charge(x, y, v) {
  this.x = x;
  this.y = y;
  this.v = v;

  this.display = () => {
    // v is positive (charge is positive) => red
    if (this.v > 0) {
      fill(255, 0, 0, 150);
    } else if (this.v < 0) {
      // v is negative (charge is negative) => blue
      fill(0, 0, 255, 150);
    }
    stroke(0);
    strokeWeight(2);
    ellipse(this.x, this.y, 15, 15);
  };
}

function drawGrid() {
  stroke(0, 50);
  for (let i = 0; i < width; i += 20) {
    line(0, i, width, i);
    line(i, 0, i, height);
  }
}

function vectorGrid() {
  // math stuff
  for (let i = 0; i < height / res; i++) {
    for (let j = 0; j < height / res; j++) {
      x = res / 2 + i * res;
      y = res / 2 + j * res;
      dx = x - c1.x;
      dy = y - c1.y;
      d1 = sqrt(dx * dx + dy * dy);
      E1 = c1.v / (d1 * d1);
      E1x = (dx * E1) / d1;
      E1y = (dy * E1) / d1;

      dxn = x - c2.x;
      dyn = y - c2.y;
      d2 = sqrt(dxn * dxn + dyn * dyn);
      E2 = c2.v / (d2 * d2);
      E2x = (dxn * E2) / d2;
      E2y = (dyn * E2) / d2;

      EEx = E1x + E2x;
      EEy = E1y + E2y;
      EE = sqrt(EEx * EEx + EEy * EEy);

      deltax = (15 * EEx) / EE;
      deltay = (15 * EEy) / EE;
      grid_X[i][j] = deltax;
      grid_Y[i][j] = deltay;
    }
  }
}

// arrow mode
function arrow(x1, y1, x2, y2) {
  line(x1, y1, x2, y2);
  push();
  translate(x2, y2);
  var a = atan2(x1 - x2, y2 - y1);
  rotate(a);
  line(0, 0, -5, -5);
  line(0, 0, 5, -5);
  pop();
}

function drawArrows(length) {
  for (var i = 0; i < 1000; i += 30) {
    for (var j = 0; j < height; j += 30) {
      x = i;
      y = j;
      dx = x - c1.x;
      dy = y - c1.y;
      d1 = sqrt(dx * dx + dy * dy);
      E1 = c1.v / (d1 * d1);
      E1x = (dx * E1) / d1;
      E1y = (dy * E1) / d1;

      dxn = x - c2.x;
      dyn = y - c2.y;
      d2 = sqrt(dxn * dxn + dyn * dyn);
      E2 = c2.v / (d2 * d2);
      E2x = (dxn * E2) / d2;
      E2y = (dyn * E2) / d2;

      EEx = E1x + E2x;
      EEy = E1y + E2y;
      EE = sqrt(EEx * EEx + EEy * EEy);

      deltax = (length * EEx) / EE;
      deltay = (length * EEy) / EE;
      strokeWeight(2);
      stroke(0, 70);
      arrow(x, y, x + deltax, y + deltay);
    }
  }
}

function drawLines(lines) {
  // draw out 3000 field lines
  for (let i = 0; i < lines; i++) {
    x = random(width);
    let xf = floor(x / res);
    y = random(height);
    let yf = floor(y / res);

    stroke(0, 80);
    line(x, y, x + grid_X[xf][yf], y + grid_Y[xf][yf]);
  }
}
