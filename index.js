import createGeometry from "gl-geometry";
import glNow from "gl-now";
import createShader from "gl-shader";
import glMatrix from "gl-matrix";
import attachCamera from "game-shell-orbit-camera";
import createTexture from "gl-texture2d";

let mat4 = glMatrix.mat4;
let vec3 = glMatrix.vec3;

import hex from "./hex";
import box from "./box";

let shell = glNow({
	clearColor: [0.0, 0.0, 0.0, 0.0]
});

document.body.style.backgroundColor = "#000";
var scratch = mat4.create(), model = mat4.create(),
	normalMatrix = mat4.create();
let hexShader, hexObj, boxShader, boxObj, tex;

var camera = attachCamera(shell);

camera.lookAt([0, 0, 30], [0, 0, 0], [0, 1, 0]);

shell.on("gl-init", function () {
	let GL = shell.gl;
	GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, 1);
	GL.enable(GL.CULL_FACE);

	let img = new Image();
	img.onload = function () {
		tex = createTexture(GL, img, GL.RGBA)
	};
	img.src = "/img/foursquare.png";

	hexShader = createShader(GL,`
		attribute vec3 position;
		attribute vec2 texcoord0;

		uniform mat4 model;
		uniform mat4 projection;
		uniform mat4 view;
		uniform vec4 color;

		varying vec2 v_tex0;
		varying vec4 v_color;

		void main() {
			vec4 pos = projection * view * model * vec4(position, 1.0);
			gl_Position = pos;
			v_tex0 = texcoord0;
			v_color = color;
		}
	`,`
		precision highp float;

		varying vec2 v_tex0;
		uniform sampler2D texture0;

		varying vec4 v_color;

		void main() {
			gl_FragColor = texture2D(texture0,  v_tex0);
		}
	`);

	hexObj = createGeometry(GL);
	hexObj.attr("positions", hex.positions);
	hexObj.attr("texcoord0", hex.texcoord0, {size: 2});
	hexObj.faces(hex.cells, {size: 3});

	boxShader = createShader(GL,`
		attribute vec3 position;
		attribute vec3 normal;
		uniform vec3 ambient;

		uniform mat4 model;
		uniform mat4 projection;
		uniform mat4 view;
		uniform mat4 normalMatrix;
		uniform vec4 color;
		uniform vec3 lightColor;
		uniform vec3 lightDirection;

		varying vec4 v_color;

		void main() {
			gl_Position = projection * view * model * vec4(position, 1.0);
			vec3 nnormal = normalize(vec3(normalMatrix * vec4(normal, 1.0)));
			float nDotL = max(dot(lightDirection, nnormal), 0.0);
			vec3 amb = ambient * color.rgb;
			vec3 diffuse = lightColor * vec3(color) * nDotL;
			v_color = vec4(diffuse + amb, color.a);
		}
	`,`
		precision highp float;

		varying vec4 v_color;

		void main() {
			gl_FragColor = v_color;
		}
	`);

	boxObj = createGeometry(GL)
		.attr("position", box.positions)
		.attr("normal", box.normals);
	boxObj.faces(box.cells);
});

let wave = 0;
let lightDirection = [0.5, 3.0, 10.0];
let lightDirectionNorm = [];

shell.on("gl-render", () => {

	let GL = shell.gl;
	lightDirection = [0.5+wave, 3.0, 10.0];
	vec3.normalize(lightDirectionNorm, lightDirection);
	hexObj.bind(hexShader);
	hexShader.uniforms.projection = mat4.perspective(scratch, Math.PI/4.0, shell.width/shell.height, 0.1, 1000.0);
	hexShader.uniforms.view = camera.view(scratch);
	for (let x=0; x<20; x++) {
		for (let y=0; y<20; y++) {
			let offset = (y%2==0) ? 0 : 1.0;
			mat4.identity(model);
			mat4.identity(scratch);
			mat4.translate(model, scratch, [(10-x*2+offset), (10-y*1.5), 0.0]);
			//tex.bind();
			hexShader.uniforms.model = model;
			hexShader.uniforms.color = [x/100, y/100, x/100, 1.0];
			hexObj.draw();

		}
	}
	hexObj.unbind();

	boxObj.bind(boxShader);
	boxShader.uniforms.projection = mat4.perspective(scratch, Math.PI/4.0, shell.width/shell.height, 0.1, 1000.0);
	boxShader.uniforms.view = camera.view(scratch);
	mat4.identity(model);
	mat4.rotate(model, model, wave/90, [0, 0, 1]);
	mat4.invert(normalMatrix, model);
	mat4.transpose(normalMatrix, normalMatrix);

	boxShader.uniforms.model = model;
	boxShader.uniforms.normalMatrix = normalMatrix;
	boxShader.uniforms.color = [1,0,1,1];
	boxShader.uniforms.ambient = [0.2, 0.2, 0.2];
	boxShader.uniforms.lightColor = [1.0, 1.0, 1.0];
	boxShader.uniforms.lightDirection = lightDirectionNorm;
	boxObj.draw();

	wave++;
});