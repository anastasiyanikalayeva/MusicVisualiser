/*
    The design of TV set comes from the source: 
    https://www.freepik.com/free-vector/90s-element-set-illustration_74882811.htm

    Settings for shaders:
    https://www.reedbeta.com/blog/quick-and-easy-gpu-random-numbers-in-d3d11/

    Icons sources: 
    https://www.flaticon.com/free-icons/pause-play - Pause play icons created by Angelo Troiano - Flaticon
    https://www.flaticon.com/free-icons/next - Next icons created by Jesus Chavarria - Flaticon
    https://www.flaticon.com/free-icons/music - Music icons created by Becris - Flaticon
*/

// Global variables
var controls = null;
var vis = null;
var sound = null;
var fourier;
var prevVis = null;
var fontFamily = null;

function preload() {
  // Load sound and assets (fonts, shaders, images)
  sound = loadSound('assets/music/stomper_reggae_bit.mp3');
  fontFamily = loadFont('assets/fonts/Roboto-Medium.ttf');
  staticShader = loadShader('shaders/static.vert', 'shaders/static.frag');
  playPauseImg = loadImage('assets/images/pause-play.png');
  modeImg = loadImage('assets/images/mode.png');
  musicImg = loadImage('assets/images/music.png');
}

function setup() {
  // Create canvas and setup environment
  var canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.position(0, 0);
  background(0);

  controls = new ControlsAndInput();

  // Initialize FFT for sound analysis
  fourier = new p5.FFT();

  // Add available visualisations
  vis = new Visualisations();
  vis.add(new Spectrum());
  vis.add(new WavePattern());
  vis.add(new Needles());
  vis.add(new Noise());
  vis.add(new Firework());
  vis.add(new DancingBugs());
  vis.add(new ThreeDVisual());

  prevVis = vis.selectedVisual;

  // Setup file input for uploading music files
  inputbtn = createFileInput(handleFile);
  inputbtn.position(windowWidth / 8 * 6 + (windowWidth / 8 * 0.8) / 3,
    windowHeight / 8 * 1.4 + windowHeight / 8 * 5.2 - (windowWidth / 8 * 0.8) * 1.9,
    (windowWidth / 8 * 0.8) / 5.5);
  inputbtn.style('width', `${(windowWidth / 8 * 0.8) / 3}` + 'px');
}

function draw() {
  resetShader();
  background(0);
  textFont(fontFamily);
  translate(-windowWidth / 2, -windowHeight / 2);

  // Draw TV components
  drawAntenna();
  drawTVLegs();
  drawTVBody();
  drawControls();
  drawSoundBar();

  // Check if the visualisation has changed and handle GUI updates
  if (vis.selectedVisual !== prevVis) {
    if (prevVis && prevVis.name === 'noise') {
      prevVis.destroyGUI();
    }
    if (vis.selectedVisual.name === 'noise') {
      vis.selectedVisual.createGUI();
    }

    prevVis = vis.selectedVisual;
  }

  // Draw the current visualisation
  vis.selectedVisual.draw();

  controls.draw();

  if (!sound.isPlaying()) {
    displayStaticNoise();  // Display static noise if the music isn't playing
  }
}

function displayStaticNoise() {
  shader(staticShader);

  // Set uniform values for shader variables
  staticShader.setUniform('u_time', millis() / 1000.0);
  staticShader.setUniform('uRectX', windowWidth / 8 * 1.2);
  staticShader.setUniform('uRectY', windowHeight / 8 * 1.4);
  staticShader.setUniform('uRectWidth', windowWidth / 8 * 4.7);
  staticShader.setUniform('uRectHeight', windowHeight / 8 * 5.2);
  staticShader.setUniform('u_width', width);
  staticShader.setUniform('u_height', height);

  rect(0, 0, 1, 1);
}

function mouseClicked() {
  controls.mousePressed();
}

function keyPressed() {
  controls.keyPressed(keyCode);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (vis.selectedVisual.hasOwnProperty('onResize')) {
    vis.selectedVisual.onResize();
  }
}

// Drawing functions for the TV components
function drawAntenna() {
  fill(103, 142, 232);
  stroke(103, 142, 232);
  strokeWeight(10);
  line(windowWidth / 8 * 4,
    windowHeight / 8 - 20,
    windowWidth / 8 * 4 - 30,
    windowHeight / 8 - 70);
  line(windowWidth / 8 * 4,
    windowHeight / 8 - 20,
    windowWidth / 8 * 4 + 30,
    windowHeight / 8 - 70);
  ellipse(windowWidth / 8 * 4 - 30, windowHeight / 8 - 70, 10, 10);
  ellipse(windowWidth / 8 * 4 + 30, windowHeight / 8 - 70, 10, 10);
}

function drawTVLegs() {
  fill(232, 163, 40);
  stroke(232, 163, 40);
  strokeJoin(ROUND);
  strokeWeight(20);
  triangle(windowWidth / 8 * 2,
    windowHeight / 8 * 7 - 3,
    windowWidth / 8 * 2.3,
    windowHeight / 8 * 7 - 3,
    windowWidth / 8 * 2,
    windowHeight / 8 * 7.8);
  triangle(windowWidth / 8 * 6,
    windowHeight / 8 * 7 - 3,
    windowWidth / 8 * 6.3,
    windowHeight / 8 * 7 - 3,
    windowWidth / 8 * 6.3,
    windowHeight / 8 * 7.8);
  strokeJoin(MITER);
  stroke(251, 107, 72);
  fill(251, 107, 72);
  beginShape();
  vertex(windowWidth / 8 * 2,
    windowHeight / 8 * 7.3);
  vertex(windowWidth / 8 * 2,
    windowHeight / 8 * 7);
  vertex(windowWidth / 8 * 2.3,
    windowHeight / 8 * 7);
  vertex(windowWidth / 8 * 2.183,
    windowHeight / 8 * 7.3);
  endShape(CLOSE);
  beginShape();
  vertex(windowWidth / 8 * 6.12,
    windowHeight / 8 * 7.3);
  vertex(windowWidth / 8 * 6,
    windowHeight / 8 * 7);
  vertex(windowWidth / 8 * 6.3,
    windowHeight / 8 * 7);
  vertex(windowWidth / 8 * 6.3,
    windowHeight / 8 * 7.3);
  endShape(CLOSE);
}

function drawTVBody() {
  noStroke();
  fill(236, 149, 239);
  rect(windowWidth / 8,
    windowHeight / 8,
    windowWidth / 8 * 6,
    windowHeight / 8 * 6,
    50);
  arc(windowWidth / 8 * 4,
    windowHeight / 8 + 1,
    80,
    80,
    PI,
    TWO_PI);
  fill(254, 182, 246);
  rect(windowWidth / 8,
    windowHeight / 8,
    windowWidth / 8 * 6,
    windowHeight / 8 * 3,
    50);
  rect(windowWidth / 8,
    windowHeight / 8 * 2,
    windowWidth / 8 * 6,
    windowHeight / 8 * 3);
  fill(250, 204, 250);
  rect(windowWidth / 8 * 2.5,
    windowHeight / 8,
    windowWidth / 8 * 3,
    windowHeight / 8 * 6);
  fill(90, 42, 122);
  rect(windowWidth / 8 * 1.2,
    windowHeight / 8 * 1.4,
    windowWidth / 8 * 4.7,
    windowHeight / 8 * 5.2);
  rect(windowWidth / 8 * 6,
    windowHeight / 8 * 1.4,
    windowWidth / 8 * 0.8,
    windowHeight / 8 * 5.2);
}

function drawControls() {
  fill(170, 226, 229);
  circle(windowWidth / 8 * 6 + (windowWidth / 8 * 0.8) / 2,
    windowHeight / 8 * 1.4 + windowHeight / 8 * 5.2 - (windowWidth / 8 * 0.8) / 2,
    (windowWidth / 8 * 0.8) / 1.8);
  fill(108, 193, 193);
  circle(windowWidth / 8 * 6 + (windowWidth / 8 * 0.8) / 2,
    windowHeight / 8 * 1.4 + windowHeight / 8 * 5.2 - (windowWidth / 8 * 0.8) / 2,
    (windowWidth / 8 * 0.8) / 3);

  fill(244, 205, 118);
  circle(windowWidth / 8 * 6 + (windowWidth / 8 * 0.8) / 2,
    windowHeight / 8 * 1.4 + windowHeight / 8 * 5.2 - (windowWidth / 8 * 0.8) * 1.15,
    (windowWidth / 8 * 0.8) / 1.8);
  fill(232, 163, 40);
  circle(windowWidth / 8 * 6 + (windowWidth / 8 * 0.8) / 2,
    windowHeight / 8 * 1.4 + windowHeight / 8 * 5.2 - (windowWidth / 8 * 0.8) * 1.15,
    (windowWidth / 8 * 0.8) / 3);
  image(modeImg, windowWidth / 8 * 6 + (windowWidth / 8 * 0.8) / 2.5,
    windowHeight / 8 * 1.4 + windowHeight / 8 * 5.2 - (windowWidth / 8 * 0.8) * 1.27,
    (windowWidth / 8 * 0.8) / 4.3,
    (windowWidth / 8 * 0.8) / 4.3);

  fill(253, 130, 99);
  circle(windowWidth / 8 * 6 + (windowWidth / 8 * 0.8) / 2,
    windowHeight / 8 * 1.4 + windowHeight / 8 * 5.2 - (windowWidth / 8 * 0.8) * 1.8,
    (windowWidth / 8 * 0.8) / 1.8);
  fill(251, 107, 72);
  circle(windowWidth / 8 * 6 + (windowWidth / 8 * 0.8) / 2,
    windowHeight / 8 * 1.4 + windowHeight / 8 * 5.2 - (windowWidth / 8 * 0.8) * 1.8,
    (windowWidth / 8 * 0.8) / 3);
  image(musicImg, windowWidth / 8 * 6 + (windowWidth / 8 * 0.8) / 2.55,
    windowHeight / 8 * 1.4 + windowHeight / 8 * 5.2 - (windowWidth / 8 * 0.8) * 1.9,
    (windowWidth / 8 * 0.8) / 5.5,
    (windowWidth / 8 * 0.8) / 5.5);
}

function drawSoundBar() {
  fill(0, 194, 194);
  rect(windowWidth / 8 * 6 + (windowWidth / 8 * 0.8) / 5,
    windowHeight / 8 * 1.4 + windowHeight / 15,
    windowWidth / 35,
    windowHeight / 17);
  fill(80, 143, 236);
  rect(windowWidth / 8 * 6 + (windowWidth / 8 * 0.8) / 5,
    windowHeight / 8 * 1.4 + windowHeight / 7.4,
    windowWidth / 35,
    windowHeight / 17);
  fill(80, 143, 236);
  rect(windowWidth / 8 * 6 + (windowWidth / 8 * 0.8) / 1.9,
    windowHeight / 8 * 1.4 + windowHeight / 15,
    windowWidth / 35,
    windowHeight / 17);
  fill(0, 194, 194);
  rect(windowWidth / 8 * 6 + (windowWidth / 8 * 0.8) / 1.9,
    windowHeight / 8 * 1.4 + windowHeight / 7.4,
    windowWidth / 35,
    windowHeight / 17);
}

function handleFile(file) {
  // Handle uploaded audio file
  if (file.type === 'audio') {
    if (sound && sound.isPlaying()) {
      sound.stop();
    }

    loadSound(file.data, (soundFile) => {
      sound = soundFile;
      sound.loop();
    });
  }
}