precision highp float;

uniform vec3 ambient;
uniform vec3 lightColor;
uniform vec3 pointLightPosition;

varying vec4 v_color;
varying vec3 v_normal;
varying vec3 v_position;

void main() {
	vec3 normal = normalize(v_normal);
	vec3 lightDirection = normalize(pointLightPosition - v_position);
	float nDotL = max(dot(lightDirection, normal), 0.0);
	vec3 diffuse = lightColor * v_color.rgb * nDotL;
	vec3 amb = ambient * v_color.rgb;
	gl_FragColor = vec4(diffuse + amb, v_color.a);
}