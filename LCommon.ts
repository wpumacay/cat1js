


namespace core
{
    export const FORMAT_JPG : string = "JPG";
    export const FORMAT_PNG : string = "PNG";

    export class LTextureAssetInfo
    {
        public format : string;
        public fileName : string;
        public assetId : string;

        constructor( pFormat : string,
                     pFileName : string,
                     pAssetId : string )
        {
            this.format = pFormat;
            this.fileName = pFileName;
            this.assetId = pAssetId;
        }
    }

    export const SHADER_DEFAULT : string = 'BaseShader';
    export const SHADER_BASIC_3D : string = 'ShaderBasic3d';
    export const SHADER_DEBUG_DRAWER_3D : string = 'DebugDrawer3d';
    export const SHADER_PHONG_LIGHTING_3D : string = 'PhongLighting3d';
    export const SHADER_SIMPLE_TEXTURE_3D : string = 'SimpleTexture3d';
    export const SHADER_TEXTURE_LIGHTING_3D : string = 'TextureLighting3d';

    export class LShaderAssetInfo
    {
        public fileNameVs : string;
        public fileNameFs : string;
        public shaderId : string;
        public shaderClassType : string;

        constructor( shaderId : string,
                     shaderClassType : string,
                     vsFile : string,
                     fsFile : string )
        {
            this.shaderId = shaderId;
            this.shaderClassType = shaderClassType;
            this.fileNameVs = vsFile;
            this.fileNameFs = fsFile;
        }
    }
}
    
