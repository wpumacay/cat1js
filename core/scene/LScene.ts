
/// <reference path="../graphics/LIRenderable.ts"/>
/// <reference path="../camera/LBaseCamera.ts" />
/// <reference path="../lights/LBaseLight.ts" />


namespace core
{

    export class LScene
    {

        private m_renderables : LIRenderable[];

        private m_cameras : { [id: string] : LBaseCamera };
        private m_currentCamera : LBaseCamera;

        private m_lights : { [type:string] : LBaseLight[] };

        private m_id : string;

        constructor( sceneId : string )
        {
            this.m_id = sceneId;

            this.m_renderables = [];

            this.m_cameras = {};
            this.m_currentCamera = null;

            this.m_lights = {};
            this.m_lights[ engine3d.LDirectionalLight.staticType() ] = [];
            this.m_lights[ engine3d.LPointLight.staticType() ] = [];
        }

        public addRenderable( renderable : LIRenderable ) : void
        {
            this.m_renderables.push( renderable );
        }
        public getRenderables() : LIRenderable[]
        {
            return this.m_renderables;
        }

        public addCamera( camera : LBaseCamera ) : void
        {
            if ( this.m_cameras[ camera.getId() ] )
            {
                console.warn( 'LScene> there is already a camera with id: ' + camera.getId() );
                return;
            }

            if ( !this.m_currentCamera )
            {
                this.m_currentCamera = camera;
            }

            this.m_cameras[ camera.getId() ] = camera;
        }
        public changeToCamera( id : string ) : void
        {
            if ( !this.m_cameras[ id ] )
            {
                console.warn( 'LScene> there is no camera with id: ' + id );
                return;
            }

            this.m_currentCamera = this.m_cameras[ id ];
        }
        public getCameraById( id : string ) : LBaseCamera
        {
            if ( !this.m_cameras[ id ] )
            {
                console.warn( 'LScene> there is no camera with id: ' + id );
                return null;
            }

            return this.m_cameras[ id ];
        }
        public getCurrentCamera() : LBaseCamera
        {
            return this.m_currentCamera;
        }

        public addLight( light : LBaseLight ) : void
        {
            this.m_lights[light.type()].push( light );
        }
        public getLights( type : string ) : LBaseLight[]
        {
            return this.m_lights[type];
        }

        public update( dt : number ) : void
        {
            let _key : string;
            for ( _key in this.m_cameras )
            {
                this.m_cameras[ _key ].update( dt );
            }

            let q : number;
            for ( q = 0; q < this.m_renderables.length; q++ )
            {
                if ( !this.m_renderables[q] )
                {
                    continue;
                }

                if ( this.m_renderables[q].isDeletionRequested() )
                {
                    this.m_renderables[q].release();
                    this.m_renderables.splice( q, 1 );
                    q--;
                }
                else
                {
                    this.m_renderables[q].update();
                }

            }
        }

        public onResize( appWidth : number,
                         appHeight : number ) : void
        {
            let _key : string;
            for ( _key in this.m_cameras )
            {
                this.m_cameras[ _key ].onResize( appWidth, appHeight );
            }
        }

        public id() : string { return this.m_id; }

    }



}