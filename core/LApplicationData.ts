
/// <reference path="../LCommon.ts" />

namespace core
{

    export class LApplicationData
    {

        public assets : LTextureAssetInfo[];
        public shaders : LShaderAssetInfo[];

        constructor( assetsList : LTextureAssetInfo[],
                     shadersList : LShaderAssetInfo[] )
        {
            this.assets = assetsList;
            this.shaders = shadersList;
        }
    }



}