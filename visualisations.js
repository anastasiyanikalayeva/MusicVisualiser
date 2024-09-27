// Container for visualisations
function Visualisations() {
	// Store visualisations
	this.visuals = [];
	// Currently selected visual
	this.selectedVisual = null;

	// Add new visualisation
	this.add = function (vis) {
		this.visuals.push(vis);
		// Set first visual as default
		if (this.selectedVisual == null) {
			this.selectVisual(vis.name);
		}
	};

	// Select visualisation by name
	this.selectVisual = function (visName) {
		for (var i = 0; i < this.visuals.length; i++) {
			if (visName == this.visuals[i].name) {
				this.selectedVisual = this.visuals[i];
			}
		}
	};
}