
/// <reference path="LColladaParser.ts" />


namespace core
{

    export class LModelsManager
    {

        private m_models : { [id:string] : LModelConstructInfo }
        private m_batchLoadedCallback : Function;
        private m_isWorking : boolean;
        private m_xmlParser : DOMParser;

        private m_colladaParser : LColladaParser;

        constructor()
        {
            this.m_models = {};
            this.m_batchLoadedCallback = null;
            this.m_xmlParser = new DOMParser();

            this.m_colladaParser = new LColladaParser();
        }

        public getModel( modelId : string ) : LModelConstructInfo
        {
            if ( !this.m_models[ modelId ] )
            {
                console.warn( 'LModelsManager> model with id ' +
                              modelId + ' does not exist' );
                return null;
            }

            return this.m_models[ modelId ];
        }

        public loadBatch( modelsInfo : LModelInfo[],
                          callback : Function ) : void
        {
            if ( modelsInfo.length < 1 )
            {
                callback();
                return;
            }

            this.m_batchLoadedCallback = callback;
            this.m_isWorking = true;

            for ( let i = 0; i < modelsInfo.length; i++ )
            {
                this._loadModel( modelsInfo[i] );
            }
        }

        private _loadModel( modelInfo : LModelInfo ) : void
        {
            var _self : LModelsManager = this;

            this.m_models[ modelInfo.modelId ] = null;

            let _xhttp : XMLHttpRequest = new XMLHttpRequest();
            _xhttp['modelInfo'] = modelInfo;
            _xhttp.onreadystatechange = function()
            {
                if ( this.readyState == 4 && this.status == 200 )
                {
                    let _model = _self.parseModelFile( this.responseText,
                                                       this['modelInfo']['modelType'] );
                    _self.m_models[ this['modelInfo']['modelType'] ] = _model;
                }
            }
            _xhttp.open( 'GET', modelInfo.filename, true );
            _xhttp.send();
        }

        public parseModelFile( strModel : string,
                               modelType : string ) : LModelConstructInfo
        {
            let _model : LModelConstructInfo = null;

            if ( modelType == MODEL_TYPE_COLLADA )
            {
                _model = this._parseColladaModel( strModel );
            }
            else if ( modelType == MODEL_TYPE_OBJ )
            {
                _model = this._parseObjModel( strModel );
            }
            else
            {
                console.warn( 'LModelManager> Model type not supported: ' +
                              modelType );
            }

            return _model;
        }

        private _parseColladaModel( strModel : string ) : LModelConstructInfo
        {
            let _doc = this.m_xmlParser.parseFromString( strModel, 'text/xml' );
            let _root = _doc.documentElement;

            return this.m_colladaParser.parseModel( _root );
        }

        private _parseObjModel( strModel : string ) : LModelConstructInfo
        {
            let _model = new LModelConstructInfo();

            return _model;
        }

        public update() : void
        {
            if ( this.m_isWorking )
            {
                let _finishedLoading : boolean = true;
                let _key : string;

                for ( _key in this.m_models )
                {
                    if ( this.m_models[ _key ] == null )
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