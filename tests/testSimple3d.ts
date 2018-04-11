/// <reference path="../Globals.ts" />
/// <reference path="../core/shader/LShaderManager.ts" />
/// <reference path="../core/data/LVertexBuffer.ts" />
/// <reference path="../core/data/LIndexBuffer.ts" />

let _shader : LShader = LShaderManager.INSTANCE.fromFile( 'res/shaders/3d/basic/basicShader3d_vs.glsl', 
                                                          'res/shaders/3d/basic/basicShader3d_fs.glsl' );

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

let _vboPos : LVertexBuffer = new LVertexBuffer( 2, _points, 0 );
let _vboCol : LVertexBuffer = new LVertexBuffer( 3, _colors, 1 );
let _ibo : LIndexBuffer = new LIndexBuffer( _indices.length, _indices );

function onTick() : void
{
    requestAnimationFrame( onTick );

    app.render();

    _shader.bind();

    _vboPos.bind();
    _vboCol.bind();
    _ibo.bind();

    gl.drawElements( gl.TRIANGLES, _ibo.getCount(), gl.UNSIGNED_SHORT, 0 );

    _ibo.unbind();
    _vboPos.unbind();
    _vboCol.unbind();

    _shader.unbind();
}

requestAnimationFrame( onTick );