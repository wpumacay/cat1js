
/// <reference path="../../Globals.ts" />
/// <reference path="../../LCommon.ts" />
/// <reference path="../data/LTexture.ts" />

namespace core
{

    export class LTexturesManager
    {

        private m_textures : { [id: string] : LTexture };
        private m_batchLoadedCallback : Function;

        private m_numTexturesToLoad : number;
        private m_numTexturesLoaded : number;
        private m_isWorking : boolean;

        constructor()
        {
            this.m_textures = {};
            this.m_batchLoadedCallback = null;

            this.m_numTexturesToLoad = 0;
            this.m_numTexturesLoaded = 0;
            this.m_isWorking = false;
        }

        public loadBatch( imgsInfo : LTextureAssetInfo[], callback : Function ) : void
        {
            if ( imgsInfo.length < 1 )
            {
                callback();
                return;
            }

            this.m_batchLoadedCallback = callback;
            this.m_numTexturesToLoad = imgsInfo.length;
            this.m_numTexturesLoaded = 0;
            this.m_isWorking = true;

            let q : number;
            for ( q = 0; q < imgsInfo.length; q++ )
            {
                this._loadImage( imgsInfo[q] );
            }
        }

        private _loadImage( assetInfo : LTextureAssetInfo ) : void
        {
            var _self : LTexturesManager = this;

            this.m_textures[ assetInfo.assetId ] = new LTexture();
            this.m_textures[ assetInfo.assetId ].setTexAssetInfo( assetInfo );

            var _img = new Image();
            _img['assetInfo'] =  assetInfo;
            _img.onload = () => 
            {
                let _assetInfo : LTextureAssetInfo = _img['assetInfo'];
                _self.m_textures[ _assetInfo.assetId ].setData( _img, gl.RGBA );
                _self.m_numTexturesLoaded++;
            };

            _img.src = assetInfo.fileName;
        }

        public getTexture( textureId : string ) : LTexture
        {
            if ( !this.m_textures[textureId] )
            {
                console.warn( 'LTexturesManager> texture with id ' + 
                              textureId + ' does not exist' );
                return null;
            }

            return this.m_textures[textureId];
        }

        public update() : void
        {
            if ( this.m_isWorking )
            {
                if ( this.m_numTexturesToLoad == this.m_numTexturesLoaded )
                {
                    this.m_isWorking = false;
                    if ( this.m_batchLoadedCallback )
                    {
                        this.m_batchLoadedCallback();
                    }
                }
            }
        }
    }



}