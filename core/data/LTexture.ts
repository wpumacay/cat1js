

/// <reference path="../../Globals.ts" />

namespace core
{


    export class LTexture
    {
        private m_textureObj : WebGLTexture;
        private m_textureIndx : number;
        private m_width : number;
        private m_height : number;

        constructor()
        {
            this.m_textureObj = gl.createTexture();
        }

        public setData( data : ImageBitmap | ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement ) : void
        {

            // gl.texImage2D();
        }




    }






}