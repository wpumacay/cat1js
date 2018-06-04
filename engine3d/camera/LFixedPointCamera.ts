
/// <reference path="../../core/camera/LBaseCamera.ts" />




namespace engine3d
{


    export class LFixedPointCamera extends core.LBaseCamera
    {

        private m_targetPoint : core.LVec3;

        constructor( pos : core.LVec3,
                     targetPoint : core.LVec3, 
                     worldUp : core.LVec3,
                     width : number, height : number,
                     zNear : number, zFar : number,
                     fov : number, projMode : core.ProjectionMode,
                     id : string )
        {
            super( pos, worldUp, 
                   width, height,
                   zNear, zFar, 
                   fov, projMode, 
                   LFixedPointCamera.GetStaticType(), id );

            this.m_targetPoint = targetPoint;

            this._updateSystem();
        }

        public setTargetPoint( targetPoint : core.LVec3 ) : void
        {
            this.m_targetPoint = targetPoint;

            this._updateSystem();
        }

        protected _updateSystem() : void
        {
            this.m_front = core.LVec3.normalize( core.LVec3.minus( this.m_pos, this.m_targetPoint ) );
            this.m_right = core.LVec3.normalize( core.LVec3.cross( this.m_worldUp, this.m_front ) );
            this.m_up    = core.LVec3.normalize( core.LVec3.cross( this.m_front, this.m_right ) );

            this._buildViewMatrix();
        }

        public static GetStaticType() : string
        {
            return "FixedPoint3d";
        }

    }

}