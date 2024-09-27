// Vertex shader
attribute vec3 aPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uRectX;
uniform float uRectY;
uniform float uRectWidth;
uniform float uRectHeight;

void main() {
    float x = aPosition.x * uRectWidth + uRectX;
    float y = aPosition.y * uRectHeight + uRectY;
    vec4 positionVec = vec4(x, y, 0.0, 1.0);

    gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec;
}
