// Firework visualisation
function Firework() {
    // Name of the visualisation
    this.name = "firework";

    // Clipping area definition
    this.clipX = windowWidth / 8 * 1.2;
    this.clipY = windowHeight / 8 * 1.4;
    this.clipWidth = windowWidth / 8 * 4.7;
    this.clipHeight = windowHeight / 8 * 5.2;

    // Off-screen graphics buffer
    this.pg = createGraphics(this.clipWidth, this.clipHeight);

    // Initialize beat detection and fireworks management
    var beatDetect = new BeatDetect();
    var fireworks = new Fireworks(this.clipWidth, this.clipHeight); // Pass clipping dimensions

    this.draw = function () {
        // Clear buffer
        this.pg.background(90, 42, 122);

        // Analyze sound spectrum
        var spectrum = fourier.analyze();
        if (beatDetect.detectBeat(spectrum)) {
            fireworks.addFireworks();
        }
        fireworks.update(this.pg);

        // Draw buffer to main canvas
        image(this.pg, this.clipX, this.clipY);
    };

    // Beat detection
    function BeatDetect() {
        var sampleBuffer = [];
        var initialBufferSize = 60;

        // Initialize buffer
        for (var i = 0; i < initialBufferSize; i++) {
            sampleBuffer.push(0);
        }

        this.detectBeat = function (spectrum) {
            var sum = 0;
            for (var i = 0; i < spectrum.length; i++) {
                sum += spectrum[i] * spectrum[i];
            }

            if (sampleBuffer.length == initialBufferSize) {
                var sampleSum = 0;
                var isBeat = false;
                for (var i = 0; i < sampleBuffer.length; i++) {
                    sampleSum += sampleBuffer[i];
                }

                var sampleAverage = sampleSum / sampleBuffer.length;

                var c = calculateConstant(sampleAverage);
                if (sum > sampleAverage * c) {
                    isBeat = true; // Beat detected
                }

                sampleBuffer.splice(0, 1);
                sampleBuffer.push(sum);
            } else {
                sampleBuffer.push(sum);
            }

            return isBeat;
        };

        function calculateConstant(sampleAverage) {
            // Calculate variance
            var varianceSum = 0;
            for (var i = 0; i < sampleBuffer.length; i++) {
                varianceSum += sampleBuffer[i] - sampleAverage;
            }
            var variance = varianceSum / sampleBuffer.length;
            var m = -0.15 / (25 - 200);
            var b = 1 + (m * 200);

            return (m * variance) + b;
        }
    }

    // Manage fireworks
    function Fireworks(clipWidth, clipHeight) {
        var fireworks = [];

        this.addFireworks = function () {
            var f_color = color(random(0, 255), random(0, 255), random(0, 255));
            var f_x = random(clipWidth * 0.2, clipWidth * 0.8);
            var f_y = random(clipHeight * 0.2, clipHeight * 0.8);

            fireworks.push(new FireworkObject(f_color, f_x, f_y));
        };

        this.update = function (pg) {
            for (var i = 0; i < fireworks.length; i++) {
                fireworks[i].draw(pg);

                if (fireworks[i].depleted) {
                    fireworks.splice(i, 1);
                    i--;
                }
            }
        };
    }

    // Firework object
    function FireworkObject(color, x, y) {
        var particles = [];
        this.depleted = false;

        for (var i = 0; i < 360; i += 18) {
            particles.push(new Particle(x, y, color, i, 10));
        }

        this.draw = function (pg) {
            for (var i = 0; i < particles.length; i++) {
                particles[i].draw(pg);
            }
            if (particles[0].speed <= 0) {
                this.depleted = true; // Firework is depleted
            }
        };
    }

    // Particle object
    function Particle(x, y, color, angle, speed) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.angle = angle;
        this.speed = speed;

        this.draw = function (pg) {
            this.update();
            pg.fill(this.color);
            pg.noStroke();
            pg.ellipse(this.x, this.y, 10, 10);
        };

        this.update = function () {
            this.speed -= 0.1;
            this.x += cos(this.angle) * this.speed;
            this.y += sin(this.angle) * this.speed;
        };
    }
}
