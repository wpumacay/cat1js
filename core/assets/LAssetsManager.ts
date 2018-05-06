
/// <reference path="../../Globals.ts" />
/// <reference path="LTexturesManager.ts" />


namespace core
{

    export class LAssetsManager
    {


        public static INSTANCE : LAssetsManager = null;

        private m_texturesManager : LTexturesManager;


        private m_texturesLoadedCallback : Function;
        private m_soundsLoadedCallback : Function;

        constructor()
        {
            this.m_texturesManager = new LTexturesManager();

            this.m_texturesLoadedCallback = null;
            this.m_soundsLoadedCallback = null;
        }

        public static create() : LAssetsManager
        {
            if ( !LAssetsManager.INSTANCE )
            {
                LAssetsManager.INSTANCE = new LAssetsManager();
            }

            return LAssetsManager.INSTANCE;
        }

        public static release() : void
        {
            LAssetsManager.INSTANCE = null;
        }

        public update() : void
        {
            this.m_texturesManager.update();
        }

        public loadTextures( imgsInfo : LTextureAssetInfo[], texturesCallback : Function ) : void
        {
            this.m_texturesManager.loadBatch( imgsInfo, texturesCallback );
        }

        public getTexture( textureId : string ) : LTexture
        {
            return this.m_texturesManager.getTexture( textureId );
        }
    }


}