
/// <reference path="../../Globals.ts" />
/// <reference path="LTexturesManager.ts" />


namespace core
{

    export class LAssetsManager
    {


        public INSTANCE : LAssetsManager = null;

        private m_texturesManager : LTexturesManager;


        private m_texturesLoadedCallback : Function;
        private m_soundsLoadedCallback : Function;

        constructor()
        {
            this.m_texturesManager = new LTexturesManager();
        }


        public static create() : void
        {

        }

        public static release() : void
        {

        }

        public loadTextures( imgsList : string[], texturesCallback : Function ) : void
        {
            this.m_texturesLoadedCallback = texturesCallback;

            this.m_texturesManager
        }


    }


}