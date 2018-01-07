/// <reference path="Globals.ts" />
/// <reference path="core/shader/LShaderManager.ts" />
/// <reference path="core/data/LVertexBuffer.ts" />
/// <reference path="core/data/LIndexBuffer.ts" />
/// <reference path="core/data/LVertexArray.ts" />

document.body.appendChild( app.canvas );


let _shader : LShader = LShaderManager.INSTANCE.fromFile( 'res/shaders/basicShader2d_vs.glsl', 
														  'res/shaders/basicShader2d_fs.glsl' );

let _points : Float32Array = new Float32Array( [-0.5,  0.5,
												-0.5, -0.5,
												 0.5, -0.5,
												 0.5,  0.5] );
let _colors : Float32Array = new Float32Array( [ 1.0, 1.0, 1.0,
												 1.0, 0.0, 0.0,
												 0.0, 1.0, 0.0,
												 0.0, 0.0, 1.0 ] );

let _indices : Uint16Array = new Uint16Array( [ 0, 1, 2,
												2, 3, 0 ] );

let _vboPos : LVertexBuffer = new LVertexBuffer( 2, _points );
let _vboCol : LVertexBuffer = new LVertexBuffer( 3, _colors );
let _ibo : LIndexBuffer = new LIndexBuffer( _indices.length, _indices );

let _vao : LVertexArray = new LVertexArray();
_vao.addBuffer( _vboPos, 0 );
_vao.addBuffer( _vboCol, 1 );

function onTick() : void
{
	requestAnimationFrame( onTick );

	app.render();

	_shader.bind();

	_vao.bind();
	_ibo.bind();

	gl.drawElements( gl.TRIANGLES, _ibo.getCount(), gl.UNSIGNED_SHORT, 0 );

	_ibo.unbind();
	_vao.unbind();

	_shader.unbind();
}

requestAnimationFrame( onTick );