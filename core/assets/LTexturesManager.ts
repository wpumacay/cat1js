
/// <reference path="../../Globals.ts" />
/// <reference path="../data/LTexture.ts" />

namespace core
{


    export class LTexturesManager
    {

        private m_textures : { [id: string] : LTexture };
        private m_batchLoadedCallback : Function;

        constructor()
        {
            this.m_textures = {};
        }

        public loadBatch( imgsList : string[], callback : Function ) : void
        {
            this.m_batchLoadedCallback = callback;
        }

        private _loadImage( fileName : string ) : void
        {
            var _self : LTexturesManager = this;

            this.m_textures[ fileName ] = new LTexture();

            var _img = new Image();
            _img.onload = () => 
            {
                _self.m_textures[ fileName ].setData( _img );
            };
        }

        public getTexture() : LTexture
        {
            return null;
        }

    }



}