
/// <reference path="shader/LShaderManager.ts" />

namespace core
{

    export class LBaseApplication
    {

        public static INSTANCE : LBaseApplication;

        /* public **************************/
        public canvas : HTMLCanvasElement;
        public gl : WebGLRenderingContext;

        /* private *************************/

        constructor()
        {
            LBaseApplication.INSTANCE = this;

            this.canvas = <HTMLCanvasElement> document.createElement( 'canvas' );
            this.canvas.width = window.outerWidth;
            this.canvas.height = window.outerHeight;
            this.gl = <WebGLRenderingContext> this.canvas.getContext( 'webgl' );

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


}

