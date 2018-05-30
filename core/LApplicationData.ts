
/// <reference path="../LCommon.ts" />

namespace core
{

    export class LApplicationData
    {

        public assets : LTextureAssetInfo[];
        public shaders : LShaderAssetInfo[];
        public models : LModelInfo[];

        constructor( assetsList : LTextureAssetInfo[],
                     shadersList : LShaderAssetInfo[],
                     modelsList : LModelInfo[] )
        {
            this.assets = assetsList;
            this.shaders = shadersList;
            this.models = modelsList;
        }
    }



}