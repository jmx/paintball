import {vertexNormals} from "normals";

let positions = [
	// top unique faces
	[-0.5, 0.5, 1.0],
	[0.5, 0.5, 1.0],
	[0.5, -0.5, 1.0],
	[-0.5, -0.5, 1.0],
	// bottom unique faces
	[-0.5, 0.5, 0.0],
	[0.5, 0.5, 0.0],
	[0.5, -0.5, 0.0],
	[-0.5, -0.5, 0.0]
];

let cells = [
	// top face
	[0, 2, 1],
	[0, 3, 2],
	// south face
	[3, 6, 2],
	[3, 7, 6],
	// east face
	[2, 5, 1],
	[2, 6, 5],
	// west face
	[0, 4, 7],
	[0, 7, 3],
	// north face
	[0, 1, 5],
	[0, 5, 4],
];

let norms = vertexNormals(cells, positions);

console.log(norms);

let colours = [
	[1.0, 0.0, 0.0, 1.0],
	[1.0, 1.0, 0.0, 1.0],
	[1.0, 0.0, 1.0, 1.0],
	[0.0, 1.0, 0.0, 1.0],
	[0.0, 0.0, 1.0, 1.0],
	[0.0, 1.0, 1.0, 1.0],
	[1.0, 1.0, 1.0, 1.0],
	[0.0, 0.0, 0.0, 1.0]
];

let texcoord0 = [
	[0.5, 0.5],
	[0.5, 1.0],
	[1.0, 0.75],
	[1.0, 0.25],
	[0.5, 0.0],
	[0.0, 0.25],
	[0.0, 0.75]
];

export default {
	"positions": positions,
	"cells": cells,
	"normals": norms,
	"colours": colours
};