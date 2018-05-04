
/// <reference path="../../core/camera/LBaseCamera.ts" />




namespace engine2d
{


    export class LCamera2d extends core.LBaseCamera
    {

        private m_targetDir : core.LVec3;

        constructor( pos : core.LVec3,
                     width : number, height : number,
                     zNear : number, zFar : number,
                     fov : number, projMode : core.ProjectionMode,
                     id : string )
        {
            super( pos, core.WORLD_UP, 
                   width, height,
                   zNear, zFar, 
                   fov, projMode, 
                   LCamera2d.GetStaticType(), id );

            this.m_targetDir = core.AXIS_NEG_Z;

            this._updateSystem();
        }

        public setTargetDir( targetDir : core.LVec3 ) : void
        {
            this.m_targetDir = targetDir;

            this._updateSystem();
        }

        protected _updateSystem() : void
        {
            this.m_front = core.LVec3.normalize( core.LVec3.flip( this.m_targetDir ) );
            this.m_right = core.LVec3.normalize( core.LVec3.cross( this.m_worldUp, this.m_front ) );
            this.m_up    = core.LVec3.normalize( core.LVec3.cross( this.m_front, this.m_right ) );

            this._buildViewMatrix();
        }

        public static GetStaticType() : string
        {
            return "Camera2d";
        }

    }









}