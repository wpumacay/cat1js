/// <reference path="../lib/WebGL2.d.ts" />

class LApplication
{

	public static INSTANCE : LApplication;

	/* public **************************/
	public canvas : HTMLCanvasElement;
	public gl : WebGL2RenderingContext;

	/* private *************************/

	// testing stuff
	private m_tShader : LShader;
	private m_tVbo : LVertexBuffer;
	private m_tVao : LVertexArray;

	constructor()
	{
		LApplication.INSTANCE = this;

		this.canvas = <HTMLCanvasElement> document.createElement( 'canvas' );
		this.canvas.width = window.outerWidth;
		this.canvas.height = window.outerHeight;
		this.gl = <WebGL2RenderingContext> this.canvas.getContext( 'webgl2' );

		// initialize
		this.gl.clearColor( 0.529, 0.807, 0.920, 1.0 );
		this.gl.enable( this.gl.DEPTH_TEST );

		new LShaderManager();
	}


	public render() : void
	{
		this.gl.clear( this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT );


	}

};