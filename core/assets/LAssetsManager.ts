
/// <reference path="../../Globals.ts" />
/// <reference path="LTexturesManager.ts" />
/// <reference path="LShadersManager.ts" />
/// <reference path="LModelsManager.ts" />


namespace core
{

    export class LAssetsManager
    {


        public static INSTANCE : LAssetsManager = null;

        private m_texturesManager : LTexturesManager;
        private m_shadersManager : LShadersManager;
        private m_modelsManager : LModelsManager;

        constructor()
        {
            this.m_texturesManager = new LTexturesManager();
            this.m_shadersManager = new LShadersManager();
            this.m_modelsManager = new LModelsManager();
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
            this.m_modelsManager.update();
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

        public loadModels( modelsInfo : LModelInfo[], modelsCallback : Function ) : void
        {
            this.m_modelsManager.loadBatch( modelsInfo, modelsCallback );
        }
        public getModel( modelId : string ) : LModelConstructInfo
        {
            return this.m_modelsManager.getModel( modelId );
        }
    }


}