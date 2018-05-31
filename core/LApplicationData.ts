
/// <reference path="../LCommon.ts" />

namespace core
{

    export class LApplicationData
    {

        public assets : LTextureAssetInfo[];
        public shaders : LShaderAssetInfo[];
        public models : LModelInfo[];
        public textAssets : LTextAssetInfo[]

        constructor( assetsList : LTextureAssetInfo[],
                     shadersList : LShaderAssetInfo[],
                     modelsList : LModelInfo[],
                     textAssetsList : LTextAssetInfo[] )
        {
            this.assets = assetsList;
            this.shaders = shadersList;
            this.models = modelsList;
            this.textAssets = textAssetsList;
        }
    }



}