
/// <reference path="../../LCommon.ts" />
/// <reference path="../../Globals.ts" />

namespace core
{


    export class LTexture
    {
        private m_textureObj : WebGLTexture;
        private m_textureIndx : number;
        private m_width : number;
        private m_height : number;

        private m_texAssetInfo : LTextureAssetInfo;

        constructor()
        {
            this.m_textureObj = gl.createTexture();
            this.m_textureIndx = 0;
            this.m_width = 0;
            this.m_height = 0;

            this.m_texAssetInfo = null;
        }

        public setTexAssetInfo( assetInfo : LTextureAssetInfo ) : void
        {
            this.m_texAssetInfo = assetInfo;
        }

        public getTexAssetInfo() : LTextureAssetInfo
        {
            return this.m_texAssetInfo;
        }

        public setData( data : ImageBitmap | 
                               ImageData | 
                               HTMLVideoElement | 
                               HTMLImageElement | 
                               HTMLCanvasElement,
                        format : number ) : void
        {
            this.m_width = data.width;
            this.m_height = data.height;

            gl.bindTexture( gl.TEXTURE_2D, this.m_textureObj );

            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT );
            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT );

            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

            gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
                           gl.UNSIGNED_BYTE , data );

            // gl.generateMipmap( gl.TEXTURE_2D );
        }

        public width() : number { return this.m_width; }
        public height() : number { return this.m_height; }

        public setTextureIndx( textureIndx : number ) : void { this.m_textureIndx = textureIndx; }
        public getTextureIndx() : number { return this.m_textureIndx; }

        public bind() : void
        {
            gl.activeTexture( gl.TEXTURE0 + this.m_textureIndx );
            gl.bindTexture( gl.TEXTURE_2D, this.m_textureObj );
        }

        public unbind() : void
        {
            // gl.bindTexture( gl.TEXTURE_2D, null );
        }
    }






}