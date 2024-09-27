/*
    Inspiration for this visualisation as well as rotating methods: 
    https://archive.p5js.org/examples/3d-geometries.html

    Model source: 
    https://free3d.com/3d-model/heart-v1--539992.html
*/

// 3D visualisation
function ThreeDVisual() {
    // Name of the visualisation
    this.name = "3D";
    this.numCircles = 200;
    this.heartModel;

    // Clipping area definition
    this.clipX = windowWidth / 8 * 1.2;
    this.clipY = windowHeight / 8 * 1.4;
    this.clipWidth = windowWidth / 8 * 4.7;
    this.clipHeight = windowHeight / 8 * 5.2;

    // Off-screen graphics buffer
    this.pg = createGraphics(this.clipWidth, this.clipHeight);

    // Preload the 3D model
    this.preload = function () {
        this.heartModel = loadModel('assets/models/12190_Heart_v1_L3.obj');
    };

    this.preload();

    // Main draw function
    this.draw = function () {
        // Clear the graphics buffer
        this.pg.clear();

        push();

        // Get the sound spectrum and analyze frequencies
        var spectrum = fourier.analyze();
        var lowFreq = fourier.getEnergy('bass', 'lowMid');

        // Draw circles based on low frequencies
        for (var i = 1; i < this.numCircles; i++) {
            var bgHue = map(lowFreq, 0, 255, 0, 255);
            this.pg.noFill();
            this.pg.stroke(bgHue + i, 200, 200);
            this.pg.strokeWeight(1);
            this.pg.circle(this.clipWidth / 2, this.clipHeight / 2, 10 * i);
        }

        pop();

        // If sound is playing, animate the 3D model
        if (sound.isPlaying()) {
            // Analyze sound spectrum for different frequencies
            var spectrum = fourier.analyze();
            var trebleEnergy = fourier.getEnergy('treble') / 30;
            var lowFreq = fourier.getEnergy('bass', 'lowMid');

            // Set material properties
            normalMaterial();

            // Draw rotating 3D heart model
            push();
            translate(windowWidth / 2.17, windowHeight / 1.6);
            scale(10 + trebleEnergy);
            rotateX(PI / 2);
            rotateZ(-frameCount / 200 + lowFreq / 600);
            model(this.heartModel);
            pop();

            controls.draw();
        } else {
            displayStaticNoise();
        }

        // Render the graphics buffer to the main canvas
        image(this.pg, this.clipX, this.clipY);
    };
}
