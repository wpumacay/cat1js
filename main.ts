
/// <reference path="Globals.ts" />
/// <reference path="core/LApplication.ts" />
/// <reference path="core/LApplicationData.ts" />
/// <reference path="engine3d/graphics/LMesh.ts" />
/// <reference path="engine3d/graphics/LModel.ts" />
/// <reference path="engine3d/geometry/LGeometryBuilder.ts" />
/// <reference path="LAssets.ts" />

// Define globals
canvas = <HTMLCanvasElement> document.getElementById( 'glCanvas' );
gl = canvas.getContext( 'webgl' );

var appData = new core.LApplicationData( assets.Textures, 
                                         assets.Shaders,
                                         assets.Models,
                                         assets.TextAssets );
var app : core.LApplication = null;

var _mesh : engine3d.LMesh = null;

function onAppInitialized() : void
{
    // Create a simple scene
    let _scene : core.LScene = new core.LScene( 'main' );

    let _modelConstructInfo = core.LAssetsManager.INSTANCE.getModel( 'kuka_kr210_base_link' );
    // let _modelConstructInfo = core.LAssetsManager.INSTANCE.getModel( 'kuka_kr210_link_1' );
    // let _modelConstructInfo = core.LAssetsManager.INSTANCE.getModel( 'kuka_kr210_link_2' );
    // let _modelConstructInfo = core.LAssetsManager.INSTANCE.getModel( 'kuka_kr210_link_3' );
    // let _modelConstructInfo = core.LAssetsManager.INSTANCE.getModel( 'kuka_kr210_link_4' );
    // let _modelConstructInfo = core.LAssetsManager.INSTANCE.getModel( 'kuka_kr210_link_5' );
    // let _modelConstructInfo = core.LAssetsManager.INSTANCE.getModel( 'kuka_kr210_link_6' );

    // let _geometry = engine3d.LGeometryBuilder.createBox( 1.0, 1.0, 1.0 );
    // let _geometry = engine3d.LGeometryBuilder.createPlane( 1.0, 1.0 );
    // let _geometry = engine3d.LGeometryBuilder.createSphere( 1.0, 20, 20 );
    // let _geometry = engine3d.LGeometryBuilder.createCapsule( 0.5, 2, 10, 10 );
    // let _geometry = engine3d.LGeometryBuilder.createCylinder( 0.5, 2, 10 );
    // let _geometry = engine3d.LGeometryBuilder.createArrow( 1.0 );

    let _geometry : engine3d.LGeometry3d = new engine3d.LGeometry3d( _modelConstructInfo.geometryInfo.vertices,
                                                                     _modelConstructInfo.geometryInfo.normals,
                                                                     _modelConstructInfo.geometryInfo.texCoords,
                                                                     _modelConstructInfo.geometryInfo.indices );

    // let _texture : core.LTexture = core.LAssetsManager.INSTANCE.getTexture( 'img_container' );
    // let _material : engine3d.LTexturedMaterial = new engine3d.LTexturedMaterial( _texture,
    //                                                                              core.DEFAULT_SPECULAR,
    //                                                                              core.DEFAULT_SHININESS );
    let _material : engine3d.LMaterial3d = new engine3d.LPhongMaterial( new core.LVec3( 1.0, 0.5, 0.31 ),
                                                                        new core.LVec3( 1.0, 0.5, 0.31 ),
                                                                        new core.LVec3( 0.5, 0.5, 0.5 ),
                                                                        32 );
    _mesh = new engine3d.LModel( _geometry, _material, _modelConstructInfo.correctionMat );

    let _camera : engine3d.LFixedPointCamera = new engine3d.LFixedPointCamera( new core.LVec3( 3.0, 3.0, 3.0 ),
                                                                               new core.LVec3( 0.0, 0.0, 0.0 ),
                                                                               new core.LVec3( 0.0, 0.0, 1.0 ),
                                                                               app.width(), app.height(),
                                                                               1.0, 100.0,
                                                                               45.0, core.ProjectionMode.PERSPECTIVE,
                                                                               "mainCam" );

    let _light : engine3d.LPointLight = new engine3d.LPointLight( new core.LVec3( 0.0, 3.0, 0.0 ),
                                                                  new core.LVec3( 0.3, 0.3, 0.3 ),
                                                                  new core.LVec3( 0.7, 0.7, 0.7 ),
                                                                  new core.LVec3( 0.85, 0.85, 0.85 ) );

    _scene.addCamera( _camera );
    _scene.addLight( _light );
    _scene.addRenderable( _mesh );

    app.addScene( _scene );

    // _mesh.setRotEulerZ( -0.5 * Math.PI );
    // _mesh.setRotEulerY( 0 );
    // _mesh.setRotEulerX( 0.5 * Math.PI );
}


function onUpdateCallback( dt : number ) : void
{
    _mesh.setRotEulerX( _mesh.getRotEulerX() + dt * 0.001 );
    _mesh.setRotEulerY( _mesh.getRotEulerY() + dt * 0.001 );
    _mesh.setRotEulerZ( _mesh.getRotEulerZ() + dt * 0.001 );

    // _mesh.setRotMat( core.mulMatMat44( _mesh.getRotMat(), core.LMat4.rotationZ( dt * 0.001 ) ) );

    engine3d.DebugSystem.drawLine( core.ORIGIN, new core.LVec3( 3, 0, 0 ), core.RED );
    engine3d.DebugSystem.drawLine( core.ORIGIN, new core.LVec3( 0, 3, 0 ), core.GREEN );
    engine3d.DebugSystem.drawLine( core.ORIGIN, new core.LVec3( 0, 0, 3 ), core.BLUE );
}

app = new core.LApplication( canvas, gl, appData, onAppInitialized, onUpdateCallback );