// Constructor for Noise visualisation
function Noise() {
     // Name of the visualisation
    this.name = "noise";

    // FFT instance for frequency analysis
    var fft = new p5.FFT();

    // Variables for GUI and settings
    var gui;
    this.noiseStep;        // Step size for noise function
    this.rotateThresh;     // Rotation threshold for energy
    this.progThresh;       // Progress threshold for energy
    this.seedThresh;       // Seed threshold for noise generation
    var guiCreated = false; // Flag to track if GUI is created

    // Initialize settings for noise and energy thresholds
    noiseStep = 0.01;
    rotateThresh = 67;
    progThresh = 180;
    seedThresh = 100;

    // Variables for rotation and progress
    var rot = 0;
    var prog = 0;

    // Define the clipping area
    var clipX = windowWidth / 8 * 1.2;
    var clipY = windowHeight / 8 * 1.4;
    var clipWidth = windowWidth / 8 * 4.7;
    var clipHeight = windowHeight / 8 * 5.2;

    // Create an off-screen graphics buffer
    var pg = createGraphics(clipWidth, clipHeight);

    // Draw the visualisation
    this.draw = function () {
        pg.background(90, 42, 122);

        fft.analyze(); // Analyze the sound frequencies
        var bassEnergy = fft.getEnergy('bass'); // Get bass energy
        var trebleEnergy = fft.getEnergy('treble'); // Get treble energy

        // Call functions to render rotating blocks and noise line
        rotatingBlocks(pg, trebleEnergy, clipWidth, clipHeight);
        noiseLine(pg, bassEnergy, trebleEnergy, clipWidth, clipHeight);

        // Create the GUI
        if (!guiCreated) {
            this.createGUI();
        }

        // Draw the graphics buffer
        image(pg, clipX, clipY);

        // Destroy the GUI
        if (!sound.isPlaying()) {
            this.destroyGUI();
        }
    };

    // Create the GUI for user controls
    this.createGUI = function () {
        gui = createGui('Adjustable Settings');
        sliderRange(0, 255);
        gui.addGlobals('rotateThresh', 'progThresh', 'seedThresh');
        guiCreated = true;
        moveGui(clipX, clipY);
    };

    // Destroy the GUI when the sound stops
    this.destroyGUI = function () {
        if (guiCreated) {
            var guiElement = document.querySelector('.qs_main');
            if (guiElement) {
                guiElement.remove();
            }
            guiCreated = false;
        }
    };

    // Draw the noise line based on sound energy
    function noiseLine(pg, energy, energy2, clipWidth, clipHeight) {
        pg.push();
        pg.translate(clipWidth / 2, clipHeight / 2); // Center the noise line
        pg.beginShape();
        pg.noFill();
        pg.stroke(0, 194, 194);
        pg.strokeWeight(3);

        // Generate noise vertices based on energy
        for (var i = 0; i < 100; i++) {
            var x = pg.map(noise(i * noiseStep + prog), 0, 1, -clipWidth / 2, clipWidth / 2);
            var y = pg.map(noise(i * noiseStep + prog * 1000), 0, 1, -clipHeight / 2, clipHeight / 2);
            pg.vertex(x, y);
        }
        pg.endShape();

        // Adjust the progress of the noise based on energy levels
        if (energy > progThresh) {
            prog += 0.05;
        }

        // Reseed the noise if treble energy exceeds the threshold
        if (energy2 > seedThresh) {
            noiseSeed();
        }

        pg.pop();
    }

    // Draw rotating blocks based on energy
    function rotatingBlocks(pg, energy, clipWidth, clipHeight) {
        if (energy < rotateThresh && sound.isPlaying()) {
            rot += 0.01;
        }

        var r = pg.map(energy, 0, 255, 20, 100);

        pg.push();
        pg.rectMode(pg.CENTER);
        pg.translate(clipWidth / 2, clipHeight / 2);
        pg.rotate(rot);
        pg.fill(255, 206, 113);

        var incr = clipWidth / (10 - 1);

        // Draw the rotating blocks
        for (var i = 0; i < 10; i++) {
            pg.rect(i * incr - clipWidth / 2, 0, r, r);
        }

        pg.pop();
    }

    // Position the GUI on the screen
    function moveGui(x, y) {
        var guiElement = document.querySelector('.qs_main');
        guiElement.style.position = 'absolute';
        guiElement.style.left = `${x}px`;
        guiElement.style.top = `${y}px`;
    }
}
