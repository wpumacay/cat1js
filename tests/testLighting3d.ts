/// <reference path="../Globals.ts" />
/// <reference path="../core/math/LMath.ts" />
/// <reference path="../core/shader/LShaderManager.ts" />
/// <reference path="../engine3d/graphics/LMesh.ts" />
/// <reference path="../engine3d/geometry/LGeometryBuilder.ts" />
/// <reference path="../engine3d/material/LMaterial3d.ts" />
/// <reference path="../engine3d/camera/LFixedPointCamera.ts" />
/// <reference path="../engine3d/lights/LDirectionalLight.ts" />

let _shader : engine3d.LShaderPhongLighting = <engine3d.LShaderPhongLighting> core.LShaderManager.INSTANCE.programs['phongLighting'];

let _cubeGeometry : engine3d.LGeometry3d = engine3d.LGeometryBuilder.createBox( 1.0, 1.0, 1.0 );
let _cubeMaterial : engine3d.LMaterial3d = new engine3d.LPhongMaterial( new core.LVec3( 0.0, 0.0, 1.0 ),
                                                                        new core.LVec3( 0.0, 0.0, 1.0 ),
                                                                        new core.LVec3( 0.0, 0.0, 1.0 ),
                                                                        50 );
let _cubeMesh : engine3d.LMesh = new engine3d.LMesh( _cubeGeometry, _cubeMaterial );

let _camera : engine3d.LFixedPointCamera = new engine3d.LFixedPointCamera( new core.LVec3( 3.0, 3.0, 3.0 ),
                                                                           new core.LVec3( 0.0, 0.0, 0.0 ),
                                                                           new core.LVec3( 0.0, 1.0, 0.0 ),
                                                                           app.width(), app.height(),
                                                                           1.0, 100.0,
                                                                           45.0, core.ProjectionMode.PERSPECTIVE,
                                                                           "cam1" );

let _light : engine3d.LDirectionalLight = new engine3d.LDirectionalLight( new core.LVec3( 0.0, -1.0, -1.0 ),
                                                                          new core.LVec3( 0.15, 0.15, 0.15 ),
                                                                          new core.LVec3( 0.5, 0.5, 0.5 ),
                                                                          new core.LVec3( 0.1, 0.1, 0.1 ) );

function onTick() : void
{
    requestAnimationFrame( onTick );

    gl.clear( gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT );

    _shader.bind();

    _shader.setMatProj( _camera.getProjectionMatrix() );
    _shader.setMatView( _camera.getViewMatrix() );
    _shader.setViewPos( _camera.getPosition() );
    _shader.setNumDirectionalLights( 1 );
    _shader.setLightDirectional( _light, 0 );

    _shader.setMatModel( _cubeMesh.getModelMatrix() );
    _shader.setMaterial( <engine3d.LPhongMaterial> _cubeMesh.getMaterial() );

    _cubeMesh.render();

    _shader.unbind();
}

requestAnimationFrame( onTick );