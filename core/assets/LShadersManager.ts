

/// <reference path="../../Globals.ts" />
/// <reference path="../../engine3d/shaders/LShaderBasic3d.ts" />
/// <reference path="../../engine3d/shaders/LShaderPhongLighting.ts" />
/// <reference path="../../engine3d/shaders/LShaderDebugDrawer3d.ts" />
/// <reference path="../../engine3d/shaders/LShaderSimpleTexture.ts" />
/// <reference path="../../engine3d/shaders/LShaderTextureLighting.ts" />
/// <reference path="../shader/LShader.ts" />


namespace core
{

    export class LShaderData
    {
        public vertexShaderCode : string;
        public fragmentShaderCode : string;
        public shaderClassType : string;
        public loaded : boolean;

        constructor( shaderClassType : string )
        {
            this.vertexShaderCode = null;
            this.fragmentShaderCode = null;
            this.loaded = false;
            this.shaderClassType = shaderClassType;
        }
    }

    export class LShadersManager
    {

        private m_programs : { [id: string] : LShader };
        private m_shaderData : { [id : string] : LShaderData }
        private m_batchLoadedCallback : Function;
        private m_isWorking : boolean;

        constructor()
        {
            this.m_programs = {};
            this.m_shaderData = {};
        }

        public getShader( shaderId : string ) : LShader
        {
            if ( !this.m_programs[ shaderId ] )
            {
                console.warn( 'LShadersManager> shader with id ' + 
                              shaderId + ' does not exist' );
                return null;
            }

            return this.m_programs[ shaderId ];
        }

        public loadBatch( shadersInfo : LShaderAssetInfo[], 
                          callback : Function ) : void
        {
            if ( shadersInfo.length < 1 )
            {
                callback();
                return;
            }

            this.m_batchLoadedCallback = callback;
            this.m_isWorking = true;
            this.m_shaderData = {};

            let q : number;
            for ( q = 0; q < shadersInfo.length; q++ )
            {
                this._loadShader( shadersInfo[q] );
            }
        }

        private _loadShader( shaderInfo : LShaderAssetInfo ) : void
        {
            var _self : LShadersManager = this;

            this.m_shaderData[ shaderInfo.shaderId ] = new LShaderData( shaderInfo.shaderClassType );

            let _xhttp_vs : XMLHttpRequest = new XMLHttpRequest();
            _xhttp_vs['shaderInfo'] = shaderInfo;
            _xhttp_vs.onreadystatechange = function()
            {
                if ( this.readyState == 4 && this.status == 200 )
                {
                    _self.m_shaderData[ this['shaderInfo']['shaderId'] ].vertexShaderCode = this.responseText;
                }
            };
            _xhttp_vs.open( 'GET', shaderInfo.fileNameVs, true );
            _xhttp_vs.send();

            let _xhttp_fs : XMLHttpRequest = new XMLHttpRequest();
            _xhttp_fs['shaderInfo'] = shaderInfo;
            _xhttp_fs.onreadystatechange = function()
            {
                if ( this.readyState == 4 && this.status == 200 )
                {
                    _self.m_shaderData[ this['shaderInfo']['shaderId'] ].fragmentShaderCode = this.responseText;
                }
            };
            _xhttp_fs.open( 'GET', shaderInfo.fileNameFs, true );
            _xhttp_fs.send();

        }

        public update() : void
        {
            if ( this.m_isWorking )
            {
                let _finishedLoading : boolean = true;

                let _key : string;
                for ( _key in this.m_shaderData )
                {
                    if ( this.m_shaderData[ _key ].vertexShaderCode &&
                         this.m_shaderData[ _key ].fragmentShaderCode )
                    {
                        // Finished loading the shader code for this instance
                        this.m_shaderData[ _key ].loaded = true;
                    }

                    if ( !this.m_shaderData[ _key ].loaded )
                    {
                        _finishedLoading = false;
                    }
                }

                if ( _finishedLoading )
                {
                    // Generate shaders

                    let _shaderId : string;
                    for ( _shaderId in this.m_shaderData )
                    {
                        this.m_programs[ _shaderId ] = this.generateShader( this.m_shaderData[ _shaderId ] );
                    }

                    this.m_shaderData = {};// Clean this dictionary
                    this.m_isWorking = false;
                    if ( this.m_batchLoadedCallback )
                    {
                        this.m_batchLoadedCallback();
                    }
                }
            }
        }

        public generateShader( shaderData : LShaderData ) : LShader
        {
            let _programObj : WebGLProgram = this.fromSource( shaderData.vertexShaderCode,
                                                              shaderData.fragmentShaderCode );

            let _shader : LShader;

            switch ( shaderData.shaderClassType )
            {
                case SHADER_BASIC_3D :
                    _shader = new engine3d.LShaderBasic3d( _programObj );
                break;

                case SHADER_DEBUG_DRAWER_3D :
                    _shader = new engine3d.LShaderDebugDrawer3d( _programObj );
                break;

                case SHADER_PHONG_LIGHTING_3D :
                    _shader = new engine3d.LShaderPhongLighting( _programObj );
                break;

                case SHADER_SIMPLE_TEXTURE_3D :
                    _shader = new engine3d.LShaderSimpleTexture( _programObj );
                break;

                case SHADER_TEXTURE_LIGHTING_3D :
                    _shader = new engine3d.LShaderTextureLighting( _programObj );
                break;

                default :
                    _shader = new core.LShader( _programObj );
                break;
            }

            return _shader;
        }

        public compileShader( type : number, code : string ) : WebGLShader
        {
            let _shaderObj : WebGLShader = gl.createShader( type );

            gl.shaderSource( _shaderObj, code );
            gl.compileShader( _shaderObj );

            if ( !gl.getShaderParameter( _shaderObj, gl.COMPILE_STATUS ) )
            {
                console.error( 'compileShader> ', gl.getShaderInfoLog( _shaderObj ) );
                console.error( 'compileShader> shaderType: ', type );
                console.error( 'compileShader> shaderCode: ', code );

                return null;
            }

            return _shaderObj;
        }

        public fromSource( vsCode : string, fsCode : string ) : WebGLProgram
        {
            let _vs : WebGLShader = this.compileShader( gl.VERTEX_SHADER, vsCode );
            let _fs : WebGLShader = this.compileShader( gl.FRAGMENT_SHADER, fsCode );

            let _obj : WebGLProgram = gl.createProgram();
            gl.attachShader( _obj, _vs );
            gl.attachShader( _obj, _fs );
            gl.linkProgram( _obj );

            if ( !gl.getProgramParameter( _obj, gl.LINK_STATUS ) )
            {
                console.error( 'fromSource> link error: ', gl.getProgramInfoLog( _obj ) );

                return null;
            }

            return _obj;
        }


        public fromFile( vs : string, fs : string ) : WebGLProgram
        {
            let _shader : LShader = null;

            let _vsCode : string = null;
            let _fsCode : string = null;

            let _xhttp_vs : XMLHttpRequest = new XMLHttpRequest();
            _xhttp_vs.onreadystatechange = function()
            {
                if ( this.readyState == 4 && this.status == 200 )
                {
                    _vsCode = this.responseText;
                }
            };
            _xhttp_vs.open( 'GET', vs, false );
            _xhttp_vs.send();

            let _xhttp_fs : XMLHttpRequest = new XMLHttpRequest();
            _xhttp_fs.onreadystatechange = function()
            {
                if ( this.readyState == 4 && this.status == 200 )
                {
                    _fsCode = this.responseText;
                }
            };
            _xhttp_fs.open( 'GET', fs, false );
            _xhttp_fs.send();

            return this.fromSource( _vsCode, _fsCode );
        }


    }

}
