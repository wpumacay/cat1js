/// <reference path="../Globals.ts" />
/// <reference path="../core/math/LMath.ts" />
/// <reference path="../core/assets/LShadersManager.ts" />
/// <reference path="../engine3d/graphics/LMesh.ts" />
/// <reference path="../engine3d/geometry/LGeometryBuilder.ts" />
/// <reference path="../engine3d/material/LTexturedMaterial.ts" />
/// <reference path="../engine3d/camera/LFixedPointCamera.ts" />
/// <reference path="../core/assets/LAssetsManager.ts" />

var _shader : engine3d.LShaderSimpleTexture = null;
var _cubeGeometry : engine3d.LGeometry3d = null;
var _cubeMaterial : engine3d.LTexturedMaterial = null;
var _cubeMesh : engine3d.LMesh = null;
var _camera : engine3d.LFixedPointCamera = null;

var _ready : boolean = false;

function onAssetsLoaded() : void
{
    _shader = <engine3d.LShaderSimpleTexture> core.LShadersManager.INSTANCE.programs['simpleTexture'];

    // _cubeGeometry = engine3d.LGeometryBuilder.createBox( 1.0, 1.0, 1.0 );
    // _cubeGeometry = engine3d.LGeometryBuilder.createPlane( 1.0, 1.0 );
    // _cubeGeometry = engine3d.LGeometryBuilder.createSphere( 1.0, 20, 20 );
    // _cubeGeometry = engine3d.LGeometryBuilder.createCapsule( 0.5, 2, 10, 10 );
    // _cubeGeometry = engine3d.LGeometryBuilder.createCylinder( 0.5, 2, 10 );
    _cubeGeometry = engine3d.LGeometryBuilder.createCone( 0.5, 2, 10 );

    let _texture : core.LTexture = core.LAssetsManager.INSTANCE.getTexture( 'img_container' );
    _cubeMaterial = new engine3d.LTexturedMaterial( _texture,
                                                    core.DEFAULT_SPECULAR,
                                                    core.DEFAULT_SHININESS );

    _cubeMesh = new engine3d.LMesh( _cubeGeometry, _cubeMaterial );

    _camera = new engine3d.LFixedPointCamera( new core.LVec3( 3.0, 3.0, 3.0 ),
                                                              new core.LVec3( 0.0, 0.0, 0.0 ),
                                                              new core.LVec3( 0.0, 1.0, 0.0 ),
                                                              app.width(), app.height(),
                                                              1.0, 100.0,
                                                              45.0, core.ProjectionMode.PERSPECTIVE,
                                                              "cam1" );

    _ready = true;
}

function onResizeCallback( appWidth : number, appHeight : number ) : void
{
    if ( _camera )
    {
        _camera.onResize( appWidth, appHeight );
    }
}

app.addUserResizeCallback( onResizeCallback );

var _assetsManager : core.LAssetsManager = core.LAssetsManager.create();
_assetsManager.loadTextures( assets.Textures, onAssetsLoaded );


function onTick() : void
{
    requestAnimationFrame( onTick );

    _assetsManager.update();

    if ( !_ready )
    {
        return;
    }

    _cubeMesh.rot.x += 0.025;
    _cubeMesh.rot.y += 0.025;
    _cubeMesh.rot.z += 0.025;

    _cubeMesh.update();

    gl.clear( gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT );

    _shader.bind();

    let _programObj : WebGLProgram = _shader.getObj();

    let _foo1 : number = gl.getAttribLocation( _programObj, 'vPos' );
    let _foo2 : number = gl.getAttribLocation( _programObj, 'vNormal' );
    let _foo3 : number = gl.getAttribLocation( _programObj, 'vTexCoords' );

    _shader.setMatProj( _camera.getProjectionMatrix() );
    _shader.setMatView( _camera.getViewMatrix() );

    _shader.setMatModel( _cubeMesh.getModelMatrix() );
    _shader.setTexture( ( <engine3d.LTexturedMaterial>_cubeMesh.getMaterial() ).getTexture() );

    _cubeMesh.render();

    _shader.unbind();
}

requestAnimationFrame( onTick );