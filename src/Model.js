import Noise from 'noise-ts';

const seed = Math.random();
const noise = new Noise(seed);
const gaussian = (x,y,sigma) => {	
	return Math.exp(-(x*x+y*y)/(2*sigma*sigma));
}


export default class Model {
	constructor(gl) {
		this.gl = gl;
		this.vbo = null;
		this.vao = null;
	}

	static createBuffer(gl, data, usage) {
		const buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, data, usage);
		return buffer;
	}

	static createVertexArray(gl) {
		const vao = gl.createVertexArray();
		gl.bindVertexArray(vao);
		return vao;
	}
}

export class Triangle extends Model {
	setup() {
		const data = new Float32Array([
			-0.2, -0.2, 0.0, 0.0, 0.0, 1.0,
			0.2, -0.2, 0.0, 0.0, 1.0, 0.0,
			0.0, 0.2, 0.0, 1.0, 0.0, 0.0,
		]);

		this.vbo = Model.createBuffer(data, this.gl.STATIC_DRAW, this.gl);
		this.vao = Model.createVertexArray(this.gl);

		this.gl.enableVertexAttribArray(0);
		this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 24, 0);

		this.gl.enableVertexAttribArray(1);
		this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, false, 24, 12);
	}

	render() {
		this.gl.bindVertexArray(this.vao);
		this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
	}
}

export class Square extends Model {
	setup() {
		const pos = new Float32Array([
			-0.5, -0.5, 0.0, 0.5, -0.5, 0.0, 0.5, 0.5, 0.0,
			-0.5, -0.5, 0.0, 0.5, 0.5, 0.0, -0.5, 0.5, 0.0,
		]);
		const col = new Float32Array([
			1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0,
			1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0,
		]);

		this.vao = Model.createVertexArray(this.gl);

		this.positionBuffer = Model.createBuffer(pos, this.gl.STATIC_DRAW, this.gl);
		this.gl.enableVertexAttribArray(0);
		this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 24, 0);

		this.colorBuffer = Model.createBuffer(col, this.gl.STATIC_DRAW, this.gl);
		this.gl.enableVertexAttribArray(1);
		this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, false, 24, 0);
	}

	render() {
		this.gl.bindVertexArray(this.vao);
		this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
	}
}

export class Mesh extends Model {
	setup() {
		const trianglesPerSide = 5;
		const triangleSpacing = 0.3;
		const halfGridSize = ((trianglesPerSide - 1) * triangleSpacing) / 2;

		const data = new Float32Array(25 * 18);

		let index = 0;
		for (let i = 0; i < trianglesPerSide; i++) {
			for (let j = 0; j < trianglesPerSide; j++) {
				const xOffset = i * triangleSpacing - halfGridSize;
				const yOffset = j * triangleSpacing - halfGridSize;

				data.set(
					[-0.1 + xOffset, -0.1 + yOffset, 0.0, 1.0, 0.0, 0.0],
					index,
				);
				data.set(
					[0.1 + xOffset, -0.1 + yOffset, 0.0, 1.0, 0.0, 0.0],
					index + 6,
				);
				data.set(
					[0.0 + xOffset, 0.1 + yOffset, 0.0, 0.0, 0.0, 1.0],
					index + 12,
				);

				index += 18;
			}
		}

		this.vbo = Model.createBuffer(data, this.gl.STATIC_DRAW, this.gl);
		this.vao = Model.createVertexArray(this.gl);

		this.gl.enableVertexAttribArray(0);
		this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 24, 0);

		this.gl.enableVertexAttribArray(1);
		this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, false, 24, 12);
	}

	render() {
		this.gl.bindVertexArray(this.vao);
		this.gl.drawArrays(this.gl.TRIANGLES, 0, 25 * 3);
	}
}

export class Frame extends Model {
	setup() {
		const data = new Float32Array([
			-1.0, -1.0, 0.0,
			1.0, -1.0, 0.0,
			1.0, 1.0, 0.0,
			-1.0, -1.0, 0.0,
			1.0, 1.0, 0.0,
			-1.0, 1.0, 0.0,
		]);

		this.vbo = Model.createBuffer(data, this.gl.STATIC_DRAW, this.gl);
		this.vao = Model.createVertexArray(this.gl);

		this.gl.enableVertexAttribArray(0);
		this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 0, 0);
	}

	render() {
		this.gl.bindVertexArray(this.vao);
		this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
	}
}

export class TexMap extends Model {
	setup() {
		const data = new Float32Array([
			-1, -1, 0, 0, 0,
			1, -1, 0, 1, 0,
			1, 1, 0, 1, 1,
			-1, -1, 0, 0, 0,
			1, 1, 0, 1, 1,
			-1, 1, 0, 0, 1,
		]);

		this.vbo = Model.createBuffer(this.gl, data, this.gl.STATIC_DRAW);
		this.vao = Model.createVertexArray(this.gl);

		this.gl.enableVertexAttribArray(0);
		this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 20, 0);

		this.gl.enableVertexAttribArray(1);
		this.gl.vertexAttribPointer(1, 2, this.gl.FLOAT, false, 20, 12);
	}

	render() {
		this.gl.bindVertexArray(this.vao);
		this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
	}
}

export class Cube extends Model {
	setup() {
		const pos = new Float32Array([
			-0.5, -0.5, -0.5,
			-0.5, -0.5, 0.5,
			-0.5, 0.5, 0.5,

			-0.5, -0.5, -0.5,
			-0.5, 0.5, 0.5,
			-0.5, 0.5, -0.5,

			0.5, 0.5, -0.5,
			-0.5, -0.5, -0.5,
			-0.5, 0.5, -0.5,

			0.5, 0.5, -0.5,
			0.5, -0.5, -0.5,
			-0.5, -0.5, -0.5,

			0.5, -0.5, 0.5,
			-0.5, -0.5, -0.5,
			0.5, -0.5, -0.5,

			0.5, -0.5, 0.5,
			-0.5, -0.5, 0.5,
			-0.5, -0.5, -0.5,

			-0.5, 0.5, 0.5,
			-0.5, -0.5, 0.5,
			0.5, -0.5, 0.5,


			0.5, 0.5, 0.5,
			-0.5, 0.5, 0.5,
			0.5, -0.5, 0.5,

			0.5, 0.5, 0.5,
			0.5, -0.5, -0.5,
			0.5, 0.5, -0.5,

			0.5, -0.5, -0.5,
			0.5, 0.5, 0.5,
			0.5, -0.5, 0.5,

			0.5, 0.5, 0.5,
			0.5, 0.5, -0.5,
			-0.5, 0.5, -0.5,

			0.5, 0.5, 0.5,
			-0.5, 0.5, -0.5,
			-0.5, 0.5, 0.5,

		]);
		const col = new Float32Array([
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,

			1, 0, 0,
			1, 0, 0,
			1, 0, 0,

			0, 1, 0,
			0, 1, 0,
			0, 1, 0,

			0, 1, 0,
			0, 1, 0,
			0, 1, 0,

			0, 0, 1,
			0, 0, 1,
			0, 0, 1,

			0, 0, 1,
			0, 0, 1,
			0, 0, 1,

			0, 1, 1,
			0, 1, 1,
			0, 1, 1,

			0, 1, 1,
			0, 1, 1,
			0, 1, 1,

			1, 0, 1,
			1, 0, 1,
			1, 0, 1,

			1, 0, 1,
			1, 0, 1,
			1, 0, 1,

			1, 1, 0,
			1, 1, 0,
			1, 1, 0,

			1, 1, 0,
			1, 1, 0,
			1, 1, 0,

		]);

		this.vao = this.gl.createVertexArray();
		this.gl.bindVertexArray(this.vao);

		this.positionBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, pos, this.gl.STATIC_DRAW);
		this.gl.enableVertexAttribArray(0);
		this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 0, 0);

		this.colorBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, col, this.gl.STATIC_DRAW);
		this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(1);

	}
	render() {
		this.gl.bindVertexArray(this.vao);
		this.gl.drawArrays(this.gl.TRIANGLES, 0, 12 * 3);
	}
}

export class Terrain extends Model {
	constructor(gl, size) {
		super(gl);
		this.size = size;
		this.granularity = 50;
		this.noiseScale = 0.1;
		this.heightScale = 1.0;
		this.noise = new Noise(Math.random());
		this.gaussianSigma = this.size / 4;
		this.useMinecraftColors = false; // New toggle for color scheme
	}

	setup() {
		const hsize = Math.floor(this.size / 2);
		const step = 1 / this.granularity;

		const vertices = [];
		const indices = [];

		for (let z = -hsize; z < hsize; z += step) {
			for (let x = -hsize; x < hsize; x += step) {
				const height1 = this.getHeight(x, z);
				const height2 = this.getHeight(x + step, z);
				const height3 = this.getHeight(x, z + step);
				const height4 = this.getHeight(x + step, z + step);

				const color1 = this.getColor(height1);
				const color2 = this.getColor(height2);
				const color3 = this.getColor(height3);
				const color4 = this.getColor(height4);

				// First triangle
				vertices.push(x, height1, z, ...color1);
				vertices.push(x + step, height2, z, ...color2);
				vertices.push(x, height3, z + step, ...color3);

				// Second triangle
				vertices.push(x + step, height2, z, ...color2);
				vertices.push(x + step, height4, z + step, ...color4);
				vertices.push(x, height3, z + step, ...color3);
			}
		}

		this.vao = this.gl.createVertexArray();
		this.gl.bindVertexArray(this.vao);

		const buffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

		this.gl.enableVertexAttribArray(0);
		this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 24, 0);

		this.gl.enableVertexAttribArray(1);
		this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, false, 24, 12);

		this.vertexCount = vertices.length / 6;
	}

	getHeight(x, z) {
		const baseHeight = this.noise.perlin2(x*0.5, z*0.5)*gaussian(x,z,2);
		const detailNoise = this.noise.perlin2(x, z) * gaussian(x,z,3);
		return (baseHeight + detailNoise) * this.heightScale;
	}

	getColor(height) {
		const normalizedHeight = (height + this.heightScale) / (2 * this.heightScale);
		
		if (this.useMinecraftColors) {
			if (normalizedHeight < 0.3) return [0.0, 0.0, 0.5];      // Deep water
			if (normalizedHeight < 0.4) return [0.0, 0.0, 1.0];      // Water
			if (normalizedHeight < 0.5) return [0.76, 0.7, 0.5];     // Sand
			if (normalizedHeight < 0.7) return [0.0, 0.5, 0.0];      // Grass
			if (normalizedHeight < 0.8) return [0.5, 0.5, 0.5];      // Stone
			return [1.0, 1.0, 1.0];                                  // Snow
		} else {
			if (normalizedHeight < 0.3) return [0.1, 0.0, 0.3];     // Deep indigo
			if (normalizedHeight < 0.4) return [0.5, 0.0, 0.5];      // Vibrant purple
			if (normalizedHeight < 0.55) return [0.2, 0.0, 0.5];      // Vibrant purple
			if (normalizedHeight < 0.6) return [0.9, 0.0, 0.4];      // Hot pink
			if (normalizedHeight < 0.7) return [1.0, 0.4, 0.0];      // Bright orange
			return [1.0, 0.9, 0.0];                                  // Bright yellow
		}
	}

	toggleColorScheme() {
		this.useMinecraftColors = !this.useMinecraftColors;
		this.setup(); // Regenerate the terrain with the new color scheme
	}

	render() {
		this.gl.bindVertexArray(this.vao);
		this.gl.drawArrays(this.gl.POINTS, 0, this.vertexCount);
	}
}