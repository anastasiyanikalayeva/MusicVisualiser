// Constructor for Needles visualisation
function Needles() {
	// Name of the visualisation
	this.name = "needles";

	// Arc angles for needle plot
	var minAngle = PI + PI / 10;
	var maxAngle = TWO_PI - PI / 10;

	this.plotsAcross = 2;
	this.plotsDown = 2;

	// Frequency bins for energy
	this.frequencyBins = ["bass", "lowMid", "highMid", "treble"];

	// Resize plots
	this.onResize = function () {
		this.pad = windowWidth / 8 * 1.2;
		this.plotWidth = (windowWidth / 8 * 4.7) / 2;
		this.plotHeight = (windowHeight / 8 * 5.2) / 2;
		this.dialRadius = (this.plotWidth - this.pad) / 2 - 5;
	};

	// Initial resize
	this.onResize();

	// Draw plots on the screen
	this.draw = function () {
		strokeWeight(1);
		var spectrum = fourier.analyze(); // Get spectrum
		var currentBin = 0;
		push();
		fill('#f0f2d2');

		// Loop through the grid
		for (var i = 0; i < this.plotsDown; i++) {
			for (var j = 0; j < this.plotsAcross; j++) {

				//calculate the size of the plots
				var x = this.pad + j * this.plotWidth;
				var y = windowHeight / 8 * 1.4 + i * this.plotHeight;
				var w = this.plotWidth;
				var h = this.plotHeight;

				rect(x, y, w, h); // Draw rectangle

				// Add ticks
				this.ticks(x + w / 2, y + h, this.frequencyBins[currentBin]);

				var energy = fourier.getEnergy(this.frequencyBins[currentBin]);

				// Draw needle
				this.needle(energy, x + w / 2, y + h);
				currentBin++;
			}
		}

		pop();
	};

	// Draw needle for a plot
	this.needle = function (energy, centreX, bottomY) {
		push();
		stroke('#333333');
		translate(centreX, bottomY); // Translate to needle origin
		theta = map(energy, 0, 255, minAngle, maxAngle);
		var x = this.dialRadius * cos(theta);
		var y = this.dialRadius * sin(theta);
		line(0, 0, x, y); // Draw needle
		pop();
	};

	// Draw ticks on a plot
	this.ticks = function (centreX, bottomY, freqLabel) {
		var nextTickAngle = minAngle;
		push();
		stroke('#333333');
		fill('#333333');
		translate(centreX, bottomY);
		arc(0, 0, 20, 20, PI, 2 * PI); // Draw semi-circle
		textAlign(CENTER);
		textSize(12);
		text(freqLabel, 0, -(this.plotHeight / 2)); // Label

		// Draw ticks
		for (var i = 0; i < 9; i++) {
			var x = this.dialRadius * cos(nextTickAngle);
			var x1 = (this.dialRadius - 5) * cos(nextTickAngle);
			var y = (this.dialRadius) * sin(nextTickAngle);
			var y1 = (this.dialRadius - 5) * sin(nextTickAngle);
			line(x, y, x1, y1);
			nextTickAngle += PI / 10;
		}
		pop();
	};
}