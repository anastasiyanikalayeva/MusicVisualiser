// Handles playback button
function PlaybackButton() {

	// Button position and size
	this.x = windowWidth / 8 * 6 + (windowWidth / 8 * 0.8) / 2;
	this.y = windowHeight / 8 * 1.4 + windowHeight / 8 * 5.2 - (windowWidth / 8 * 0.8) / 2;
	this.radius = (windowWidth / 8 * 0.8) / 3;

	// Flag for play/pause state
	this.playing = false;

	// Draw the play/pause button
	this.draw = function () {
		noStroke();
		fill(108, 193, 193);

		circle(this.x, this.y, this.radius);
		image(playPauseImg,
			this.x - this.radius * 0.8 / 2,
			this.y - this.radius * 0.8 / 2,
			this.radius * 0.8,
			this.radius * 0.8);
	};

	// Check if the button is clicked
	this.hitCheck = function () {
		if (dist(mouseX, mouseY, this.x, this.y) < this.radius) {
			// Toggle play/pause state and play/pause sound
			if (sound.isPlaying()) {
				sound.pause();
			} else {
				sound.loop();
			}
			this.playing = !this.playing;
			return true;
		}
		return false;
	};
}
