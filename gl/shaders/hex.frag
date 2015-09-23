precision highp float;

varying vec2 v_tex0;
uniform sampler2D texture0;

varying vec4 v_color;

void main() {
	gl_FragColor = texture2D(texture0,  v_tex0);
}