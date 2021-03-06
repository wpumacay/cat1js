/// <reference path="../Globals.ts" />
/// <reference path="../core/math/LMath.ts" />
/// <reference path="../core/assets/LShadersManager.ts" />
/// <reference path="../engine3d/graphics/LMesh.ts" />
/// <reference path="../engine3d/geometry/LGeometryBuilder.ts" />
/// <reference path="../engine3d/material/LMaterial3d.ts" />
/// <reference path="../engine3d/camera/LFixedPointCamera.ts" />

let _shader : engine3d.LShaderBasic3d = <engine3d.LShaderBasic3d> core.LShadersManager.INSTANCE.programs['basic3d'];

// let _cubeGeometry : engine3d.LGeometry3d = engine3d.LGeometryBuilder.createBox( 1.0, 1.0, 1.0 );
// let _cubeGeometry : engine3d.LGeometry3d = engine3d.LGeometryBuilder.createSphere( 1.0, 20, 20 );
let _cubeGeometry : engine3d.LGeometry3d = engine3d.LGeometryBuilder.createCapsule( 0.5, 2, 10, 10 );
// let _cubeGeometry : engine3d.LGeometry3d = engine3d.LGeometryBuilder.createCylinder( 0.5, 2, 10 );
let _cubeMaterial : engine3d.LMaterial3d = new engine3d.LMaterial3d( new core.LVec3( 0.0, 0.0, 1.0 ) );
let _cubeMesh : engine3d.LMesh = new engine3d.LMesh( _cubeGeometry, _cubeMaterial );

let _camera : engine3d.LFixedPointCamera = new engine3d.LFixedPointCamera( new core.LVec3( 3.0, 3.0, 3.0 ),
                                                                           new core.LVec3( 0.0, 0.0, 0.0 ),
                                                                           new core.LVec3( 0.0, 1.0, 0.0 ),
                                                                           app.width(), app.height(),
                                                                           1.0, 100.0,
                                                                           45.0, core.ProjectionMode.PERSPECTIVE,
                                                                           "cam1" );

function onTick() : void
{
    requestAnimationFrame( onTick );

    _cubeMesh.rot.x += 0.025;
    _cubeMesh.rot.y += 0.025;
    _cubeMesh.rot.z += 0.025;

    _cubeMesh.update();

    gl.clear( gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT );

    _shader.bind();

    _shader.setMatProj( _camera.getProjectionMatrix() );
    _shader.setMatView( _camera.getViewMatrix() );

    _shader.setMatModel( _cubeMesh.getModelMatrix() );
    _shader.setColor( _cubeMesh.getMaterial().color );

    _cubeMesh.render();

    _shader.unbind();
}

requestAnimationFrame( onTick );