
/// <reference path="../../Globals.ts" />
/// <reference path="../../LCommon.ts" />

namespace core
{


    export class LTextAssetsManager
    {

        private m_textAssets : { [id:string] : string }
        private m_batchLoadedCallback : Function;

        private m_isWorking : boolean;

        constructor()
        {
            this.m_textAssets = {};
            this.m_batchLoadedCallback = null;

            this.m_isWorking = false;
        }

        public getTextAsset( textId : string ) : string
        {
            if ( !this.m_textAssets[ textId ] )
            {
                console.warn( 'LTextAssetsManager> text with id ' +
                              textId + ' does not exist' );
                return null;
            }

            return this.m_textAssets[ textId ];
        }

        public loadBatch( textAssetsInfo : LTextAssetInfo[],
                          callback : Function ) : void
        {
            if ( textAssetsInfo.length < 1 )
            {
                callback();
                return;
            }

            this.m_batchLoadedCallback = callback;
            this.m_isWorking = true;

            for ( let i = 0; i < textAssetsInfo.length; i++ )
            {
                this._loadTextAsset( textAssetsInfo[i] );
            }
        }

        private _loadTextAsset( textAssetInfo : LTextAssetInfo ) : void
        {
            var _self : LTextAssetsManager = this;

            this.m_textAssets[ textAssetInfo.textId ] = null;

            let _xhttp : XMLHttpRequest = new XMLHttpRequest();
            _xhttp['textAssetInfo'] = textAssetInfo;
            _xhttp.onreadystatechange = function()
            {
                if ( this.readyState == 4 && this.status == 200 )
                {
                    _self.m_textAssets[ this['textAssetInfo']['textId'] ] = this.responseText;
                }
            }
            _xhttp.open( 'GET', textAssetInfo.filename, true );
            _xhttp.send();
        }

        public update() : void
        {
            if ( this.m_isWorking )
            {
                let _finishedLoading : boolean = true;
                let _key : string;

                for ( _key in this.m_textAssets )
                {
                    if ( this.m_textAssets[ _key ] == null )
                    {
                        // Model still not loaded
                        _finishedLoading = false;
                    }
                }

                if ( _finishedLoading )
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