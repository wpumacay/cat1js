

let LEntryPointFiles : string[] = 
[
    /*@begin*/
    // Core functionality
    'core/math/LMath.js',
    'core/data/LVertexBuffer.js',
    'core/data/LIndexBuffer.js',
    'core/data/LTexture.js',
    'core/shader/LShader.js',
    'core/assets/LShadersManager.js',
    'core/assets/LTexturesManager.js',
    'core/assets/LAssetsManager.js',
    'core/material/LBaseMaterial.js',
    'core/geometry/LBaseGeometry.js',
    'core/graphics/LIRenderable.js',
    'core/graphics/LBaseMesh.js',
    'core/lights/LBaseLight.js',
    'core/camera/LBaseCamera.js',
    'core/scene/LScene.js',
    // Engine3d functionality
    'engine3d/geometry/LGeometry3d.js',
    'engine3d/geometry/LGeometryBuilder.js',
    'engine3d/material/LMaterial3d.js',
    'engine3d/material/LPhongMaterial.js',
    'engine3d/material/LTexturedMaterial.js',
    'engine3d/graphics/LMesh.js',
    'engine3d/lights/LLight3d.js',
    'engine3d/lights/LDirectionalLight.js',
    'engine3d/lights/LPointLight.js',
    'engine3d/camera/LFixedPointCamera.js',
    'engine3d/camera/LFixedDirectionCamera.js',
    'engine3d/shaders/LShaderBasic3d.js',
    'engine3d/shaders/LShaderPhongLighting.js',
    'engine3d/shaders/LShaderDebugDrawer3d.js',
    'engine3d/shaders/LShaderSimpleTexture.js',
    'engine3d/shaders/LShaderTextureLighting.js',
    'engine3d/debug/LDebugSystem.js',
    'engine3d/debug/LDebugDrawer.js',
    'engine3d/renderers/LMeshRenderer.js',
    // App functionality
    'core/renderer/LMasterRenderer.js',
    'core/LApplicationData.js',
    'core/LApplication.js',
    // Global stuff
    'Globals.js',
    'main.js'
    /*@end*/
];