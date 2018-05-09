
/// <reference path="../../Globals.ts" />
/// <reference path="LTexturesManager.ts" />
/// <reference path="LShadersManager.ts" />


namespace core
{

    export class LAssetsManager
    {


        public static INSTANCE : LAssetsManager = null;

        private m_texturesManager : LTexturesManager;
        private m_shadersManager : LShadersManager;

        private m_shadersLoadedCallback : Function;
        private m_texturesLoadedCallback : Function;
        private m_soundsLoadedCallback : Function;

        constructor()
        {
            this.m_texturesManager = new LTexturesManager();
            this.m_shadersManager = new LShadersManager();

            this.m_texturesLoadedCallback = null;
            this.m_shadersLoadedCallback = null;
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
            // TODO: Release children here
            LAssetsManager.INSTANCE = null;
        }

        public update() : void
        {
            this.m_texturesManager.update();
            this.m_shadersManager.update();
        }

        public loadTextures( imgsInfo : LTextureAssetInfo[], texturesCallback : Function ) : void
        {
            this.m_texturesManager.loadBatch( imgsInfo, texturesCallback );
        }
        public getTexture( textureId : string ) : LTexture
        {
            return this.m_texturesManager.getTexture( textureId );
        }

        public loadShaders( shadersInfo : LShaderAssetInfo[], shadersCallback : Function ) : void
        {
            this.m_shadersManager.loadBatch( shadersInfo, shadersCallback );
        }
        public getShader( shaderId : string ) : LShader
        {
            return this.m_shadersManager.getShader( shaderId );
        }
    }


}