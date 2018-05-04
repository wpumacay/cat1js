

/// <reference path="../../Globals.ts" />
/// <reference path="LShader.ts" />
/// <reference path="../../engine3d/shaders/LShaderBasic3d.ts" />
/// <reference path="../../engine3d/shaders/LShaderPhongLighting.ts" />
/// <reference path="../../engine3d/shaders/LShaderDebugDrawer3d.ts" />


namespace core
{

    export class LShaderManager
    {

        public static INSTANCE : LShaderManager = null;

        public programs : { [id: string] : LShader };

        private gl : WebGLRenderingContext;

        constructor( glContext : WebGLRenderingContext )
        {
            this.gl = glContext;
            this._loadShaders();
        }

        public static create( glContext : WebGLRenderingContext ) : LShaderManager
        {
            if ( !LShaderManager.INSTANCE )
            {
                LShaderManager.INSTANCE = new LShaderManager( glContext );
            }

            return LShaderManager.INSTANCE;
        }

        private _loadShaders() : void
        {
            console.info( 'LShaderManager> started loading shaders' );

            this.programs = {};

            this.programs['basic3d'] = new engine3d.LShaderBasic3d( 
                                                this.fromFile( 'res/shaders/3d/basic/basicShader3d_vs.glsl',
                                                               'res/shaders/3d/basic/basicShader3d_fs.glsl' ) );

            this.programs['phongLighting'] = new engine3d.LShaderPhongLighting( 
                                                this.fromFile( 'res/shaders/3d/basic/phongLighting_vs.glsl',
                                                               'res/shaders/3d/basic/phongLighting_fs.glsl' ) );

            this.programs['debugDrawer3d'] = new engine3d.LShaderDebugDrawer3d( 
                                                this.fromFile( 'res/shaders/3d/debug/debug_3d_vs.glsl',
                                                               'res/shaders/3d/debug/debug_3d_fs.glsl' ) );

            console.info( 'LShaderManager> finished loading shaders' );
        }

        public compileShader( type : number, code : string ) : WebGLShader
        {
            let _shaderObj : WebGLShader = this.gl.createShader( type );

            this.gl.shaderSource( _shaderObj, code );
            this.gl.compileShader( _shaderObj );

            if ( !this.gl.getShaderParameter( _shaderObj, this.gl.COMPILE_STATUS ) )
            {
                console.error( 'compileShader> ', this.gl.getShaderInfoLog( _shaderObj ) );
                console.error( 'compileShader> shaderType: ', type );
                console.error( 'compileShader> shaderCode: ', code );

                return null;
            }

            return _shaderObj;
        }

        public fromSource( vsCode : string, fsCode : string ) : WebGLProgram
        {
            let _vs : WebGLShader = this.compileShader( this.gl.VERTEX_SHADER, vsCode );
            let _fs : WebGLShader = this.compileShader( this.gl.FRAGMENT_SHADER, fsCode );

            let _obj : WebGLProgram = this.gl.createProgram();
            this.gl.attachShader( _obj, _vs );
            this.gl.attachShader( _obj, _fs );
            this.gl.linkProgram( _obj );

            if ( !this.gl.getProgramParameter( _obj, this.gl.LINK_STATUS ) )
            {
                console.error( 'fromSource> link error: ', this.gl.getProgramInfoLog( _obj ) );

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
