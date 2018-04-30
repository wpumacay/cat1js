
/// <reference path="../../core/camera/LBaseCamera.ts" />




namespace engine3d
{


    export class LFixedCamera extends core.LBaseCamera
    {

        private m_targetPoint : core.LVec3;

        constructor( pos : core.LVec3,
                     target : core.LVec3, 
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
                   LFixedCamera.GetStaticType(), id );

            this.m_targetPoint = target;

            this._updateSystem();
        }

        protected _updateSystem() : void
        {
            this.m_front = core.LVec3.normalize( core.LVec3.minus( this.m_pos, this.m_targetPoint ) );
            this.m_right = core.LVec3.normalize( core.LVec3.cross( this.m_worldUp, this.m_front ) );
            this.m_up    = core.LVec3.normalize( core.LVec3.cross( this.m_front, this.m_right ) );

            // View matrix is ...
            /*
            *  |                |
            *  |     R^T   -R'p |
            *  |                |
            *  | 0   0   0   1  |
            */
            // Also, it's column major, so must keep layout ...
            // [ c1x c1y c1z c1w, c2x c2y c2z c2w, ... ]
            this.m_viewMat.buff[0] = this.m_right.x;
            this.m_viewMat.buff[1] = this.m_up.x;
            this.m_viewMat.buff[2] = this.m_front.x;
            this.m_viewMat.buff[3] = 0;

            this.m_viewMat.buff[4] = this.m_right.y;
            this.m_viewMat.buff[5] = this.m_up.y;
            this.m_viewMat.buff[6] = this.m_front.y;
            this.m_viewMat.buff[7] = 0;

            this.m_viewMat.buff[8]  = this.m_right.z;
            this.m_viewMat.buff[9]  = this.m_up.z;
            this.m_viewMat.buff[10] = this.m_front.z;
            this.m_viewMat.buff[11] = 0;

            this.m_viewMat.buff[12] = -core.LVec3.dot( this.m_right, this.m_pos );
            this.m_viewMat.buff[13] = -core.LVec3.dot( this.m_up, this.m_pos );
            this.m_viewMat.buff[14] = -core.LVec3.dot( this.m_front, this.m_pos );
            this.m_viewMat.buff[15] = 1;
        }

        public static GetStaticType() : string
        {
            return "Fixed3d";
        }

    }









}