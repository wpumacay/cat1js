


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
}
    
