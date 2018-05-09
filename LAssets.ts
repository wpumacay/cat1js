
/// <reference path="LCommon.ts" />

namespace assets
{

    export const Textures : core.LTextureAssetInfo[] =
    [
        new core.LTextureAssetInfo( core.FORMAT_PNG, 'res/imgs/img_container.png', 'img_container' ),
        new core.LTextureAssetInfo( core.FORMAT_PNG, 'res/imgs/img_wall.png', 'img_wall' ),
        new core.LTextureAssetInfo( core.FORMAT_PNG, 'res/imgs/ss_trex.png', 'ss_trex' )
    ];

    export const Shaders : core.LShaderAssetInfo[] = 
    [
        new core.LShaderAssetInfo( 'basic3d',
                                   core.SHADER_BASIC_3D,
                                   'res/shaders/3d/basic/basicShader3d_vs.glsl',
                                   'res/shaders/3d/basic/basicShader3d_fs.glsl' ),
        new core.LShaderAssetInfo( 'phongLighting3d', 
                                   core.SHADER_PHONG_LIGHTING_3D,
                                   'res/shaders/3d/basic/phongLighting_vs.glsl',
                                   'res/shaders/3d/basic/phongLighting_fs.glsl' ),
        new core.LShaderAssetInfo( 'debugDrawer3d', 
                                   core.SHADER_DEBUG_DRAWER_3D,
                                   'res/shaders/3d/debug/debug_3d_vs.glsl',
                                   'res/shaders/3d/debug/debug_3d_fs.glsl' ),
        new core.LShaderAssetInfo( 'simpleTexture3d', 
                                   core.SHADER_SIMPLE_TEXTURE_3D,
                                   'res/shaders/3d/basic/simpleTexture_vs.glsl',
                                   'res/shaders/3d/basic/simpleTexture_fs.glsl' ),
        new core.LShaderAssetInfo( 'textureLighting3d', 
                                   core.SHADER_TEXTURE_LIGHTING_3D,
                                   'res/shaders/3d/lighting/phongLightingTexture_vs.glsl',
                                   'res/shaders/3d/lighting/phongLightingTexture_fs.glsl' ),
    ];

    export const Sounds : string[] = 
    [

    ];
    
}
