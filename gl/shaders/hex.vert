attribute vec3 position;
attribute vec2 texcoord0;
attribute vec2 texcoordWorld;

uniform mat4 model;
uniform mat4 projection;
uniform mat4 view;
uniform vec4 color;

varying vec2 v_tex0;
varying vec2 v_tex_world;
varying vec4 v_color;

void main() {
	vec4 pos = projection * view * model * vec4(position, 1.0);
	gl_Position = pos;
	v_tex0 = texcoord0;
	v_color = color;
}