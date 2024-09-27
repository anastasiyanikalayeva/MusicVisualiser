// Handles menu, keyboard, mouse
function ControlsAndInput() {

	this.menuDisplayed = false;

	// Playback button instance
	this.playbackButton = new PlaybackButton();

	// Mouse click handler
	this.mousePressed = function () {
		if (dist(mouseX, mouseY, windowWidth / 8 * 6 + (windowWidth / 8 * 0.8) / 2, windowHeight / 8 * 1.4 + windowHeight / 8 * 5.2 - (windowWidth / 8 * 0.8) * 1.15) < (windowWidth / 8 * 0.8) / 3 && sound.isPlaying()) {
			this.visCheck();
		} 
		else {
			this.playbackButton.hitCheck();
		}
	};

	// Keyboard press handler
	this.keyPressed = function (keycode) {
		if (keycode == 32) {
			this.menuDisplayed = !this.menuDisplayed;
		}

		if (keycode > 48 && keycode < 58) {
			var visNumber = keycode - 49;
			vis.selectVisual(vis.visuals[visNumber].name);
		}
	};

	// Visualisation check and switch
	this.visCheck = function () {
		for (var i = 0; i < vis.visuals.length; i++) {
			if (prevVis.name == vis.visuals[i].name) {
				if (i < 6) {
					vis.selectVisual(vis.visuals[i + 1].name);
				} else {
					vis.selectVisual(vis.visuals[0].name);
				}
			}
		}
	};

	// Draw playback button and menu
	this.draw = function () {
		push();

		// Draw playback button
		this.playbackButton.draw();
		
		// Draw menu if displayed
		if (this.menuDisplayed) {
			fill("white");
			stroke("black");
			strokeWeight(2);
			textSize(22);
			text("Select a visualisation:", 10, 30);
			this.menu();
		}
		pop();
	};

	// Draw menu items
	this.menu = function () {
		for (var i = 0; i < vis.visuals.length; i++) {
			var yLoc = 60 + i * 30;
			text((i + 1) + ":  " + vis.visuals[i].name, 10, yLoc);
		}
	};
}
