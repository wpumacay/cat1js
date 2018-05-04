
/// <reference path="shader/LShaderManager.ts" />
/// <reference path="../engine3d/debug/LDebugSystem.ts" />

namespace core
{

    export class LBaseApplication
    {

        public static INSTANCE : LBaseApplication;

        /* public **************************/
        public canvas : HTMLCanvasElement;
        public gl : WebGLRenderingContext;

        /* private *************************/

        private m_appWidth : number;
        private m_appHeight : number;

        private m_userResizeCallback : Function;

        constructor()
        {
            LBaseApplication.INSTANCE = this;

            this.m_userResizeCallback = null;

            // this.canvas = <HTMLCanvasElement> document.createElement( 'canvas' );
            this.canvas = <HTMLCanvasElement> document.getElementById( 'glCanvas' );
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
            this.gl = <WebGLRenderingContext> this.canvas.getContext( 'webgl' );

            gl = this.gl;

            this.m_appWidth = this.canvas.width;
            this.m_appHeight = this.canvas.height;
            window.onresize = this.onResize;
            // document.body.addEventListener( 'resize', this.onResize );


            // initialize
            this.gl.viewport( 0, 0, this.m_appWidth, this.m_appHeight );
            this.gl.clearColor( 0.1, 0.1, 0.1, 1.0 );
            this.gl.enable( this.gl.DEPTH_TEST );


            LShaderManager.create( this.gl );
            engine3d.DebugSystem.init();
        }

        public addUserResizeCallback( callback : Function ) : void
        {
            this.m_userResizeCallback = callback;
        }


        public render() : void
        {
            this.gl.clear( this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT );

        }

        public onResize() : void
        {
            let _self : LBaseApplication = LBaseApplication.INSTANCE;

            if ( _self.m_appWidth == _self.canvas.clientWidth &&
                 _self.m_appHeight == _self.canvas.clientHeight )
            {
                return;
            }

            _self.canvas.width = _self.canvas.clientWidth;
            _self.canvas.height = _self.canvas.clientHeight;

            _self.m_appWidth = _self.canvas.width;
            _self.m_appHeight = _self.canvas.height;

            gl.viewport( 0, 0, _self.m_appWidth, _self.m_appHeight );

            if ( _self.m_userResizeCallback )
            {
                _self.m_userResizeCallback( _self.m_appWidth, _self.m_appHeight );
            }
        }
                

        public width() : number { return this.m_appWidth; }
        public height() : number { return this.m_appHeight; }

    };


}

