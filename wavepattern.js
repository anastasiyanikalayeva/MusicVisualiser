// Waveform visualisation
function WavePattern() {
    // Visualization name
    this.name = "wavepattern";

    // Declare the graphics buffer
    this.pg = createGraphics(windowWidth / 8 * 4.7, windowHeight / 8 * 5.2);

    // Position of the waveform on the canvas
    this.clipX = windowWidth / 8 * 1.2;
    this.clipY = windowHeight / 8 * 1.4;

    // Draw waveform on screen
    this.draw = function () {
        this.pg.clear();
        this.pg.fill(0, 194, 194);
        this.pg.stroke(0, 194, 194);
        this.pg.strokeWeight(1);
        
        this.pg.beginShape();

        var wave = fourier.waveform(); // Get waveform data

        // Loop through the waveform data
        for (var i = 0; i < wave.length; i++) {
            var x = map(i, 0, wave.length, 0, this.pg.width);
            var y = map(wave[i], -1, 1, this.pg.height, 0);
            
            this.pg.vertex(x, y);

            this.pg.rect(x, y, this.pg.width / wave.length, this.pg.height - y); 
        }

        // End the shape for the waveform
        this.pg.endShape();

        // Render the graphics buffer to the main canvas
        image(this.pg, this.clipX, this.clipY);
    };
}
