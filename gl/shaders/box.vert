attribute vec3 position;
attribute vec3 normal;

uniform mat4 model;
uniform mat4 projection;
uniform mat4 view;
uniform mat4 normalMatrix;
uniform vec4 color;

varying vec3 v_normal;
varying vec3 v_position;
varying vec4 v_color;

void main() {
	gl_Position = projection * view * model * vec4(position, 1.0);
	v_position = vec3(model * vec4(position, 1.0));
	v_normal = normalize(vec3(normalMatrix * vec4(normal, 1.0)));
	v_color = color;
}
