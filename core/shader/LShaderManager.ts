/// <reference path="../../Globals.ts" />
/// <reference path="LShader.ts" />

class LShaderManager
{

	public static INSTANCE : LShaderManager;

	/* public **************************/


	/* private *************************/

	constructor()
	{
		LShaderManager.INSTANCE = this;		
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

	public fromSource( vsCode : string, fsCode : string ) : LShader
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

		return new LShader( _obj );
	}


	public fromFile( vs : string, fs : string ) : LShader
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