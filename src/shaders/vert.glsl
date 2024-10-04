#version 300 es
precision highp float;

in vec3 position;
in vec3 color;

out vec3 fragColor;

uniform mat4 uPM;
uniform mat4 uMVM;

void main() {
    gl_Position = uPM * uMVM * vec4(position, 1.0);
	gl_PointSize = 3.0;
    fragColor = color;
}
