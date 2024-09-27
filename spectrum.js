// Spectrum visualisation
function Spectrum() {
    // Visualization name
    this.name = "spectrum";

    // Position and size of the spectrum visualization on the canvas
    this.clipX = windowWidth / 8 * 1.2;
    this.clipY = windowHeight / 8 * 1.4;
    this.clipWidth = windowWidth / 8 * 4.7;
    this.clipHeight = windowHeight / 8 * 5.2;

    // Declare the graphics buffer
    this.pg = createGraphics(this.clipWidth, this.clipHeight);

    // Analyze sound spectrum and draw visualization
    this.draw = function () {
        this.pg.background(90, 42, 122);
        var spectrum = fourier.analyze();

        this.pg.noStroke();

        // Loop through spectrum bins and draw the bars
        for (var i = 0; i < spectrum.length; i++) {
            var g = map(spectrum[i], 0, 255, 255, 0);
            this.pg.fill(spectrum[i], g, 236);

            var x = map(i, 0, spectrum.length, 0, this.pg.width);
            var h = map(spectrum[i], 0, 255, 0, this.pg.height);

            this.pg.rect(x, this.pg.height - h, this.pg.width / spectrum.length, h);
        }

        // Render the graphics buffer to the main canvas
        image(this.pg, this.clipX, this.clipY);
    };
}