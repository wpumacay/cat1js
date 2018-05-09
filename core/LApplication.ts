
/// <reference path="../engine3d/debug/LDebugSystem.ts" />
/// <reference path="assets/LAssetsManager.ts" />
/// <reference path="renderer/LMasterRenderer.ts" />
/// <reference path="scene/LScene.ts" />
/// <reference path="LApplicationData.ts" />

namespace core
{

    export const MAX_DELTA : number = 50;

    export class LApplication
    {

        public static INSTANCE : LApplication;

        /* public **************************/
        public canvas : HTMLCanvasElement;
        public gl : WebGLRenderingContext;

        /* protected ***********************/

        protected m_appWidth : number;
        protected m_appHeight : number;

        protected m_userResizeCallback : Function;
        protected m_isReady : boolean;

        protected m_currentScene : LScene;
        protected m_scenes : { [id: string] : LScene };
        protected m_masterRenderer : LMasterRenderer;
        protected m_assetsManager : LAssetsManager;
        protected m_tNow : number;
        protected m_tBef : number;
        protected m_tDelta : number;

        /* private *************************/
        private m_hasLoadedTextures : boolean;
        private m_hasLoadedShaders : boolean;
        private m_initializationCallback : Function;
        private m_updateCallback : Function;

        constructor( canvas : HTMLCanvasElement,
                     glContext : WebGLRenderingContext,
                     appConfigData : LApplicationData,
                     initializationCallback : Function,
                     updateCallback : Function )
        {
            LApplication.INSTANCE = this;

            this.canvas = canvas;
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
            this.gl = glContext;

            this.m_appWidth = this.canvas.width;
            this.m_appHeight = this.canvas.height;

            this.m_currentScene = null;
            this.m_scenes = {};
            this.m_masterRenderer = null;

            window.onresize = this.onResize;
            this.m_userResizeCallback = null;

            // initialize
            this.gl.viewport( 0, 0, this.m_appWidth, this.m_appHeight );
            this.gl.clearColor( 0.1, 0.1, 0.1, 1.0 );
            this.gl.enable( this.gl.DEPTH_TEST );

            this.m_isReady = false;
            this.m_hasLoadedShaders = false;
            this.m_hasLoadedTextures = false;
            this.m_initializationCallback = initializationCallback;
            this.m_updateCallback = updateCallback;
            this.m_assetsManager = LAssetsManager.create();
            this.m_assetsManager.loadTextures( appConfigData.assets, this.onTexturesLoaded );
            this.m_assetsManager.loadShaders( appConfigData.shaders, this.onShadersLoaded );

            this.m_tBef = Date.now();
            this.m_tNow = Date.now();
            this.m_tDelta = MAX_DELTA;

            requestAnimationFrame( this.onTick );
        }

        protected _initialize() : void
        {
            this.m_masterRenderer = new LMasterRenderer();
            engine3d.DebugSystem.init();

            this.m_initializationCallback();
        }

        public addScene( scene : LScene ) : void
        {
            if ( this.m_scenes[ scene.id() ] )
            {
                console.warn( 'LApplication> there already exists a scene with id: ' +
                              scene.id() );
                return;
            }

            if ( !this.m_currentScene )
            {
                this.m_currentScene = scene;
            }
            this.m_scenes[ scene.id() ] = scene;
        }
        public changeToScene( sceneId : string ) : void
        {
            if ( !this.m_scenes[ sceneId ] )
            {
                console.warn( 'LApplication> there is no camera with id: ' + sceneId );
                return;
            }

            this.m_currentScene = this.m_scenes[ sceneId ];
        }
        public getScene( sceneId : string ) : LScene
        {
            if ( !this.m_scenes[ sceneId ] )
            {
                console.warn( 'LApplication> there is no camera with id: ' + sceneId );
                return null;
            }

            return this.m_scenes[ sceneId ];
        }
        public getCurrentScene() : LScene
        {
            return this.m_currentScene;
        }

        public addUserResizeCallback( callback : Function ) : void
        {
            this.m_userResizeCallback = callback;
        }

        public onTick() : void
        {
            let _self : LApplication = LApplication.INSTANCE;

            requestAnimationFrame( _self.onTick );

            _self.m_tNow = Date.now();
            _self.m_tDelta = _self.m_tNow - _self.m_tBef;
            _self.m_tBef = _self.m_tNow;

            _self.m_tDelta = ( _self.m_tDelta > MAX_DELTA ) ? MAX_DELTA : _self.m_tDelta;

            _self.m_assetsManager.update();

            if ( !_self.m_isReady )
            {
                if ( _self.m_hasLoadedShaders &&
                     _self.m_hasLoadedTextures )
                {
                    _self._initialize();
                    _self.m_isReady = true;
                }

                return;
            }

            _self.update( _self.m_tDelta );
            _self.render();
        }

        public update( dt : number ) : void
        {
            this.m_assetsManager.update();

            if ( this.m_currentScene )
            {
                this.m_currentScene.update( dt );
            }

            if ( this.m_updateCallback )
            {
                this.m_updateCallback( dt );
            }
        }

        public render() : void
        {
            this.gl.clear( this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT );

            if ( this.m_currentScene )
            {
                engine3d.DebugSystem.begin( this.m_currentScene.getCurrentCamera().getViewMatrix(), 
                                            this.m_currentScene.getCurrentCamera().getProjectionMatrix() );
                engine3d.DebugSystem.render();

                this.m_masterRenderer.begin( this.m_currentScene );
                this.m_masterRenderer.render( this.m_currentScene );
                this.m_masterRenderer.end();
            }
        }

        public onResize() : void
        {
            let _self : LApplication = LApplication.INSTANCE;

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

            let _key : string;

            for ( _key in _self.m_scenes )
            {
                _self.m_scenes[_key].onResize( _self.m_appWidth, _self.m_appHeight );
            }

            if ( _self.m_userResizeCallback )
            {
                _self.m_userResizeCallback( _self.m_appWidth, _self.m_appHeight );
            }
        }
        
        public onShadersLoaded() : void
        {
            console.info( 'LApplication> finished loading shaders' );

            let _self : LApplication = LApplication.INSTANCE;
            _self.m_hasLoadedShaders = true;
        }
        public onTexturesLoaded() : void
        {
            console.info( 'LApplication> finished loading textures' );

            let _self : LApplication = LApplication.INSTANCE;
            _self.m_hasLoadedTextures = true;
        }


        public isReady() : boolean { return this.m_isReady; }

        public width() : number { return this.m_appWidth; }
        public height() : number { return this.m_appHeight; }

    };


}

