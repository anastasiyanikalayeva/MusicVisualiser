# MusicVisualiser
MusicVisualiser is an interactive, web-based application built using p5.js, that provides multiple real-time visualisations of audio playback. The visualisations respond dynamically to the beats, frequencies, and energy levels in the music, creating an immersive and engaging experience.

## Features
+ 7 Interactive Visualisations: Choose from various dynamic visualisations such as Spectrum, WavePattern, Needles, Noise, Firework, DancingBugs, and 3D.
+ Real-Time Audio Analysis: Utilizes p5.FFT() to analyze the sound spectrum in real time.
+ Audio Playback Control: Play/pause music and switch between visualisations using keyboard controls.
+ TV Set Design: Visualisations are displayed inside a styled retro TV screen on the canvas.
+ Customisable Visual Elements: Each visualisation uses unique rendering techniques, blending 2D and 3D, interactive elements, and shader effects.

## Technical Details
+ Audio Analysis: Using p5.FFT() for fast Fourier transform to get frequency and energy values in real-time.
+ 3D Rendering: WEBGL mode used for the 3D visualisation.
+ Shader Effects: Static TV screen effect applied using custom GLSL shaders.
+ Canvas Management: Off-screen buffers (createGraphics) are used in some visualisations for optimized rendering.

## Usage
To view the website, simply open the [link](https://anastasiyanikalayeva.github.io/MusicVisualiser/) in your web browser.