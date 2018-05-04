/// <reference path="Globals.ts" />
/// <reference path="core/math/LMath.ts" />
/// <reference path="core/shader/LShaderManager.ts" />
/// <reference path="engine3d/graphics/LMesh.ts" />
/// <reference path="engine3d/geometry/LGeometryBuilder.ts" />
/// <reference path="engine3d/material/LMaterial3d.ts" />
/// <reference path="engine3d/camera/LFixedPointCamera.ts" />
/// <reference path="engine3d/lights/LDirectionalLight.ts" />
/// <reference path="engine3d/lights/LPointLight.ts" />
/// <reference path="ext/monaco.d.ts" />

// monaco.languages.typescript.javascriptDefaults.addExtraLib()

let _shader : engine3d.LShaderPhongLighting = <engine3d.LShaderPhongLighting> core.LShaderManager.INSTANCE.programs['phongLighting'];

let _cubeGeometry : engine3d.LGeometry3d = engine3d.LGeometryBuilder.createBox( 1.0, 1.0, 1.0 );
// let _cubeGeometry : engine3d.LGeometry3d = engine3d.LGeometryBuilder.createSphere( 1.0, 20, 20 );
// let _cubeGeometry : engine3d.LGeometry3d = engine3d.LGeometryBuilder.createCapsule( 0.5, 2, 10, 10 );
// let _cubeGeometry : engine3d.LGeometry3d = engine3d.LGeometryBuilder.createCylinder( 0.5, 2, 10 );
let _cubeMaterial : engine3d.LMaterial3d = new engine3d.LPhongMaterial( new core.LVec3( 1.0, 0.5, 0.31 ),
                                                                        new core.LVec3( 1.0, 0.5, 0.31 ),
                                                                        new core.LVec3( 0.5, 0.5, 0.5 ),
                                                                        32 );
let _cubeMesh : engine3d.LMesh = new engine3d.LMesh( _cubeGeometry, _cubeMaterial );

let _camera : engine3d.LFixedPointCamera = new engine3d.LFixedPointCamera( new core.LVec3( 3.0, 3.0, 3.0 ),
                                                                           new core.LVec3( 0.0, 0.0, 0.0 ),
                                                                           new core.LVec3( 0.0, 1.0, 0.0 ),
                                                                           app.width(), app.height(),
                                                                           1.0, 100.0,
                                                                           45.0, core.ProjectionMode.PERSPECTIVE,
                                                                           "cam1" );

// let _light : engine3d.LDirectionalLight = new engine3d.LDirectionalLight( new core.LVec3( 0.0, -1.0, -1.0 ),
//                                                                           new core.LVec3( 0.2, 0.2, 0.2 ),
//                                                                           new core.LVec3( 0.5, 0.5, 0.5 ),
//                                                                           new core.LVec3( 0.5, 0.5, 0.5 ) );

let _light : engine3d.LPointLight = new engine3d.LPointLight( new core.LVec3( 1.2, 1.0, 2.0 ),
                                                              new core.LVec3( 0.2, 0.2, 0.2 ),
                                                              new core.LVec3( 0.5, 0.5, 0.5 ),
                                                              new core.LVec3( 0.5, 0.5, 0.5 ) );

function onResizeCallback( appWidth : number, appHeight : number ) : void
{
    _camera.onResize( appWidth, appHeight );
}

app.addUserResizeCallback( onResizeCallback );

function onTick() : void
{
    requestAnimationFrame( onTick );

    _cubeMesh.rot.x += 0.025;
    _cubeMesh.rot.y += 0.025;
    _cubeMesh.rot.z += 0.025;

    _cubeMesh.update();

    app.render();

    _shader.bind();

    _shader.setMatProj( _camera.getProjectionMatrix() );
    _shader.setMatView( _camera.getViewMatrix() );
    _shader.setViewPos( _camera.getPosition() );
    // _shader.setNumDirectionalLights( 1 );
    // _shader.setLightDirectional( _light, 0 );
    _shader.setNumPointLights( 1 );
    _shader.setLightPoint( _light, 0 );

    _shader.setMatModel( _cubeMesh.getModelMatrix() );
    _shader.setMaterial( <engine3d.LPhongMaterial> _cubeMesh.getMaterial() );

    _cubeMesh.render();

    _shader.unbind();

    engine3d.DebugSystem.drawLine( core.ORIGIN, new core.LVec3( 3, 0, 0 ), core.RED );
    engine3d.DebugSystem.drawLine( core.ORIGIN, new core.LVec3( 0, 3, 0 ), core.GREEN );
    engine3d.DebugSystem.drawLine( core.ORIGIN, new core.LVec3( 0, 0, 3 ), core.BLUE );

    engine3d.DebugSystem.begin( _camera.getViewMatrix(), _camera.getProjectionMatrix() );
    engine3d.DebugSystem.render();
}

requestAnimationFrame( onTick );