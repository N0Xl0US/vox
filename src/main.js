import Shader from "./Shader";
import Model from "./Model"
import { TexMap } from "./Model";
import Texture from "./Texture"
import Framebuffer from "./Framebuffer"

import updateVS from "./shaders/updateVS.glsl";
import updateFS from "./shaders/updateFS.glsl";
import drawVS from "./shaders/drawVS.glsl";
import drawFS from "./shaders/drawFS.glsl";
import copyVS from "./shaders/copyVS.glsl";
import copyFS from "./shaders/copyFS.glsl";

const canvas = document.querySelector("#glcanvas");
const fpsElem = document.querySelector("#fps");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const resolution = [canvas.width, canvas.height];

const gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("webgl2"));

if (gl === null) {
	alert("Unable to initialize WebGL.");
} else {
	// SHADER
	const updateVertexShader = Shader.compileShader(gl, updateVS, gl.VERTEX_SHADER);
	const updateFragmentShader = Shader.compileShader(gl, updateFS, gl.FRAGMENT_SHADER);
	const drawVertexShader = Shader.compileShader(gl, drawVS, gl.VERTEX_SHADER);
	const drawFragmentShader = Shader.compileShader(gl, drawFS, gl.FRAGMENT_SHADER);
	const copyVertexShader = Shader.compileShader(gl, copyVS, gl.VERTEX_SHADER);
	const copyFragmentShader = Shader.compileShader(gl, copyFS, gl.FRAGMENT_SHADER);

	const updateProgram = new Shader(gl);
	updateProgram.createShaders(updateVertexShader, updateFragmentShader, ['newPosition']);
	const drawProgram = new Shader(gl);
	drawProgram.createShaders(drawVertexShader, drawFragmentShader);
	const copyProgram = new Shader(gl);
	copyProgram.createShaders(copyVertexShader, copyFragmentShader);

	// TEXTURE
	var texture1 = new Texture(gl, 0);
	texture1.createEmptyTex(resolution[0], resolution[1]);

	var texture2 = new Texture(gl, 1);
	texture2.createEmptyTex(resolution[0], resolution[1]);

	// FB
	const fb = new Framebuffer(gl);
	fb.createFramebuff(texture1.texture, resolution[0], resolution[1]);

	function swapTextures() {
		let temp = texture1;
		texture1 = texture2;
		texture2 = temp;

		texture1.unit = 0;
		texture1.bind();
		texture2.unit = 1;
		texture2.bind();
		fb.setTexture(texture1.texture);
	}

	// MODEL
	const model = new TexMap(gl);
	model.setup();

	// DATA
	const rand = (min, max) => {
		if (max === undefined) {
			max = min;
			min = 0;
		}
		return Math.random() * (max - min) + min;
	};

	const createInterleavedPoints = (num, ranges) => {
		return new Array(num).fill(0).map(() => {
			const position = ranges[0].map(range => rand(...range));
			const velocity = ranges[1].map(range => rand(...range));
			return [...position, ...velocity];
		}).flat();
	};

	const numParticles = 10;

	// const ranges = [
	// 	[[-1, 1], [-1, 1]],
	// 	[[-0.1, 0.1], [-0.1, 0.1]]
	// ];
	// const interleavedData = new Float32Array(createInterleavedPoints(numParticles, ranges));

	const interleavedData = new Float32Array([
		0.5, 0.2, 0.01, -0.02,
		-0.3, 0.8, 0.03, -0.01,
		0.1, -0.4, -0.02, 0.04,
		0.9, -0.7, 0.01, 0.01,
		-0.6, 0.3, -0.03, -0.02,
		0.4, 0.9, 0.02, -0.03,
		-0.8, -0.5, 0.03, 0.01,
		0.6, -0.3, -0.01, -0.02,
		-0.2, 0.7, 0.02, 0.02,
		0.3, -0.6, -0.03, 0.01
	]);

	// BUFFER
	const interleavedBuffer1 = Model.createBuffer(gl, interleavedData, gl.DYNAMIC_DRAW);
	const interleavedBuffer2 = Model.createBuffer(gl, interleavedData, gl.DYNAMIC_DRAW);

	// VAO SEUP
	function makeUpdateVertexArray(gl, buffer) {
		const va = gl.createVertexArray();
		gl.bindVertexArray(va);

		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

		const stride = 4 * 4;

		// Position attribute
		gl.enableVertexAttribArray(updatePositionPrgLocs.oldPosition);
		gl.vertexAttribPointer(
			updatePositionPrgLocs.oldPosition,
			2,
			gl.FLOAT,
			false,
			stride,
			0
		);

		// Velocity attribute
		gl.enableVertexAttribArray(updatePositionPrgLocs.velocity);
		gl.vertexAttribPointer(
			updatePositionPrgLocs.velocity,
			2,
			gl.FLOAT,
			false,
			stride,
			2 * 4
		);

		return va;
	}

	function makeDrawVertexArray(gl, buffer) {
		const va = gl.createVertexArray();
		gl.bindVertexArray(va);

		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

		const stride = 4 * 4;

		// Position attribute
		gl.enableVertexAttribArray(drawParticlesProgLocs.position);
		gl.vertexAttribPointer(
			drawParticlesProgLocs.position,
			2,
			gl.FLOAT,
			false,
			stride,
			0
		);

		return va;
	}

	const updatePositionPrgLocs = {
		oldPosition: gl.getAttribLocation(updateProgram.program, 'oldPosition'),
		velocity: gl.getAttribLocation(updateProgram.program, 'velocity'),
		canvasDimensions: gl.getUniformLocation(updateProgram.program, 'canvasDimensions'),
		deltaTime: gl.getUniformLocation(updateProgram.program, 'deltaTime'),
	};

	const drawParticlesProgLocs = {
		position: gl.getAttribLocation(drawProgram.program, 'position'),
	};

	const copyProgLocs = {
		uSampler: gl.getUniformLocation(drawProgram.program, "uSampler"),
	};

	const updatePositionVAO1 = makeUpdateVertexArray(gl, interleavedBuffer1);
	const updatePositionVAO2 = makeUpdateVertexArray(gl, interleavedBuffer2);
	const drawVAO = makeDrawVertexArray(gl, interleavedBuffer1);

	function makeTransformFeedback(gl, buffer) {
		const tf = gl.createTransformFeedback();
		gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);
		gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffer);
		return tf;
	}

	const tf1 = makeTransformFeedback(gl, interleavedBuffer1);
	const tf2 = makeTransformFeedback(gl, interleavedBuffer2);

	let current = {
		updateVA: updatePositionVAO1,
		tf: tf2,
		drawVA: drawVAO,
	};
	let next = {
		updateVA: updatePositionVAO2,
		tf: tf1,
		drawVA: drawVAO,
	};


	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);

	gl.useProgram(copyProgram.program)
	gl.uniform1i(copyProgLocs.uSampler, 1);

	gl.useProgram(updateProgram.program);
	gl.uniform2f(updatePositionPrgLocs.canvasDimensions, resolution[0], resolution[1]);

	gl.clearColor(0, 0, 0, 0);

	let lastTime = performance.now() * .001;
	function renderLoop() {
		const currentTime = performance.now() * .001;
		const deltaTime = currentTime - lastTime;
		lastTime = currentTime;
		const fps = 1 / deltaTime;
		fpsElem.textContent = fps.toFixed(1);

		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.useProgram(updateProgram.program);
		gl.bindVertexArray(current.updateVA);
		gl.uniform1f(updatePositionPrgLocs.deltaTime, deltaTime);

		gl.enable(gl.RASTERIZER_DISCARD);

		gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, current.tf)
		gl.beginTransformFeedback(gl.POINTS);
		gl.drawArrays(gl.POINTS, 0, numParticles);
		gl.endTransformFeedback();
		gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

		gl.disable(gl.RASTERIZER_DISCARD);


		fb.bind();
		gl.useProgram(drawProgram.program);
		gl.bindVertexArray(current.drawVA);
		gl.viewport(0, 0, resolution[0], resolution[1]);
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.drawArrays(gl.POINTS, 0, numParticles);

		{
			const temp = current;
			current = next;
			next = temp;
		}

		swapTextures();
		fb.unbind();

		gl.useProgram(copyProgram.program);
		gl.viewport(0, 0, resolution[0], resolution[1]);
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		model.render();

		requestAnimationFrame(renderLoop);
	}

	renderLoop();
}
