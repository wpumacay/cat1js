/// <reference path="../math/LMath.ts" />
/// <reference path="../../Globals.ts" />




namespace core
{

    export enum ProjectionMode
    {
        PERSPECTIVE = 0,
        ORTHOGRAPHIC = 1
    }

    export class LBaseCamera
    {

        protected m_pos : LVec3;
        protected m_worldUp : LVec3;

        protected m_front : LVec3;
        protected m_up : LVec3;
        protected m_right : LVec3;

        protected m_fov : number;
        protected m_aspectRatio : number;
        protected m_zNear : number;
        protected m_zFar : number;

        protected m_type : string;
        protected m_id : string;

        protected m_viewMat : LMat4;
        protected m_projMat : LMat4;
        protected m_projMode : ProjectionMode;

        protected m_viewportWidth : number
        protected m_viewportHeight : number;

        constructor( pos : LVec3, worldUp : LVec3,
                     width : number, height : number,
                     zNear : number, zFar : number,
                     fov : number, projMode : ProjectionMode,
                     type : string, id : string )
        {
            this.m_pos = pos;
            this.m_worldUp = worldUp;

            this.m_front = new LVec3( 0, 0, 0 );
            this.m_up = new LVec3( 0, 0, 0 );
            this.m_right = new LVec3( 0, 0, 0 );

            this.m_viewportWidth = width;
            this.m_viewportHeight = height;

            this.m_fov = fov;
            this.m_aspectRatio = width / height;
            this.m_zNear = zNear;
            this.m_zFar = zFar;

            this.m_type = type;
            this.m_id = id;

            this.m_viewMat = new LMat4();
            this.m_projMat = null;

            this.setProjMode( projMode );
        }

        protected _updateSystem() : void
        {
            // Override this
        }

        public update( dt : number ) : void
        {
            // Override this
        }

        public setProjMode( projMode : ProjectionMode ) : void
        {
            if ( projMode == ProjectionMode.ORTHOGRAPHIC )
            {
                this.m_projMat = LMat4.ortho( this.m_viewportWidth,
                                              this.m_viewportHeight,
                                              this.m_zNear, this.m_zFar );
            }
            else
            {
                this.m_projMat = LMat4.perspective( this.m_fov, this.m_aspectRatio,
                                                    this.m_zNear, this.m_zFar );
            }
        }

        public getStaticType() : string { return "Base"; }

        public getType() : string { return this.m_type; }
        public getId() : string { return this.m_id; }

        public setPosition( pos : LVec3 ) : void { this.m_pos = pos; }
        public getPosition() : LVec3 { return this.m_pos; }

        public getFov() : number { return this.m_fov; }
        public getZNear() : number { return this.m_zNear; }
        public getZFar() : number { return this.m_zFar; }

        public getViewMatrix() : LMat4 { return this.m_viewMat; }
        public getProjectionMatrix() : LMat4 { return this.m_projMat; }
    }



}