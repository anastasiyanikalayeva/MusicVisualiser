/*
The inspiration for The Dancing Bugs extension comes from our exercise in 
Introduction to Programming I - Programming exercise 9: Hack it: Bouncing robots.

Bugs Images sources:
1. https://www.flaticon.com/free-icons/insect
2. https://www.flaticon.com/free-icons/beetle
3. https://www.flaticon.com/free-icons/bug
4. https://www.flaticon.com/free-icons/bed-bug
*/

// Dancing Bugs visualisation
function DancingBugs() {
    // Name of the visualisation
    this.name = "dancingBugs";

    // Array to store bug objects and bug images
    this.bugs = [];
    this.bugImages = [];
    this.numBugs = 15; // Number of bugs
    this.fft = new p5.FFT(); // FFT for analyzing sound

    // Clipping area definition
    this.clipX = windowWidth / 8 * 1.2;
    this.clipY = windowHeight / 8 * 1.4;
    this.clipWidth = windowWidth / 8 * 4.7;
    this.clipHeight = windowHeight / 8 * 5.2;

    // Off-screen graphics buffer
    this.pg = createGraphics(this.clipWidth, this.clipHeight);

    // Load bug images
    this.preload = () => {
        for (var i = 1; i < 5; i++) {
            this.bugImages.push(loadImage(`assets/images/bug${i}.png`));
        }
    };

    // Initialize bugs
    this.setup = () => {
        for (var i = 0; i < this.numBugs; i++) {
            var img = random(this.bugImages);
            // Spawn bugs randomly within the clipping area
            this.bugs.push(new Bug(img, random(this.clipWidth), random(this.clipHeight)));
        }
    };

    // Preload and setup calls
    this.preload();
    this.setup();

    // Main draw function
    this.draw = () => {
        // Clear the buffer
        this.pg.background(90, 42, 122);

        // Analyze sound and get bass energy for bug speed
        this.fft.analyze();
        var speed = this.fft.getEnergy('bass') / 100;

        // Move and display bugs
        for (var bug of this.bugs) {
            // Pass the clipping area
            bug.move(speed, this.clipX, this.clipY, this.clipWidth, this.clipHeight);
            bug.display(this.pg);
        }

        // Draw the buffer to the main canvas
        image(this.pg, this.clipX, this.clipY);
    };
}

// Bug class for managing each bug
class Bug {
    constructor(img, x, y) {
        // Store image, position, and velocity
        this.img = img;
        this.x = x;
        this.y = y;
        this.vx = random(-1, 1);
        this.vy = random(-1, 1);
    }

    // Move bug with boundary checks
    move(speed, clipWidth, clipHeight) {
        if (this.x < 0) this.vx *= -1;
        if (this.x > clipWidth) this.vx *= -1;
        if (this.y < 0) this.vy *= -1;
        if (this.y > clipHeight) this.vy *= -1;

        this.x += this.vx * speed * random(20);
        this.y += this.vy * speed * random(20);
    }

    // Display bug on the off-screen buffer
    display(pg) {
        // Draw the bug image at its current position
        pg.image(this.img, this.x, this.y);
    }
}
