#ifdef GL_ES
precision mediump float;
#endif
uniform float u_width;
uniform float u_height;
uniform float u_time;

void main() {
  vec2 st = gl_FragCoord.xy / vec2(u_width, u_height);
  float noise = fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453 + u_time);

  gl_FragColor = vec4(noise * 0.9, noise * 0.7, noise * 0.9, 1.0);
}