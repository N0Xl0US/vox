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
	}

	heightFunc(x, z) {
		const amplitude = 1.5;
		const frequency = 0.1;

		let height = amplitude * (
			Math.sin(frequency * x) +
			Math.cos(frequency * z)+
			Math.sin(2 * frequency * x) +
			Math.cos(2 * frequency * z)

		);

		return height;
	}

	setup() {
		const hsize = Math.floor(this.size / 2);

		const positions = [];
		const colors = [];

		let minHeight = Infinity;
		let maxHeight = -Infinity;

		for (let z = -hsize; z < hsize; z++) {
			for (let x = -hsize; x < hsize; x++) {
				const height = this.heightFunc(x, z);
				minHeight = Math.min(minHeight, height);
				maxHeight = Math.max(maxHeight, height);
			}
		}


		this.granularity = 5;

		for (let z = -hsize; z < hsize; z+=1/this.granularity) {
			for (let x = -hsize; x < hsize; x+=1/this.granularity) {
				const height = this.heightFunc(x, z);
				positions.push(x, Math.exp(height/2), z);

				const normalizedHeight = (height - minHeight) / (maxHeight - minHeight);

				const color = normalizedHeight;
				colors.push(color*color, color, 1-color);
			}
		}


		this.vao = this.gl.createVertexArray();
		this.gl.bindVertexArray(this.vao);

		this.positionBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
		this.gl.enableVertexAttribArray(0);
		this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 0, 0);

		this.colorBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
		this.gl.enableVertexAttribArray(1);
		this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, false, 0, 0);
	}

	render() {
		this.gl.bindVertexArray(this.vao);
		this.gl.drawArrays(this.gl.POINTS, 0, this.size * this.size*this.granularity*this.granularity);
	}
}
