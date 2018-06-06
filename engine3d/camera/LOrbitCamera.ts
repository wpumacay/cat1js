
/// <reference path="../../core/camera/LBaseCamera.ts" />
/// <reference path="../../core/LInputHandler.ts" />




namespace engine3d
{

    // TODO: Generalize the implementation to allow for any up vector. FOr ...
    // now, I'm using Z+ as up vector, as the meshes assume it in that way

    export enum OrbitCameraState
    {
        IDLE = 0,
        DRAGGING = 1,
        MOVING_TARGET = 2
    }

    export class LOrbitCamera extends core.LBaseCamera
    {
        // spherical coordinates
        private m_rho : number;
        private m_theta : number;
        private m_phi : number;

        // reference sphericals used when dragging
        private m_rho0 : number;
        private m_theta0 : number;
        private m_phi0 : number;

        private m_r : core.LVec3;
        private m_targetPoint : core.LVec3;
        private m_startTargetPoint : core.LVec3;

        private m_camState : OrbitCameraState;
        private m_mouseCurrentXY : core.LVec2;
        private m_mouseStartXY : core.LVec2;

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
                   LOrbitCamera.GetStaticType(), id );

            this.m_r = new core.LVec3( 0, 0, 0 );
            this.m_targetPoint = targetPoint.clone();
            this.m_startTargetPoint = targetPoint.clone();

            this.m_camState = OrbitCameraState.IDLE;
            this.m_mouseCurrentXY = new core.LVec2( 0, 0 );
            this.m_mouseStartXY = new core.LVec2( 0, 0 );

            this._computeSphericalsFromPosition();
            this._updateSystem();
        }

        private _computeSphericalsFromPosition() : void
        {
            this.m_r.x = this.m_pos.x - this.m_targetPoint.x;
            this.m_r.y = this.m_pos.y - this.m_targetPoint.y;
            this.m_r.z = this.m_pos.z - this.m_targetPoint.z;

            this.m_rho0 = this.m_rho = this.m_r.length();
            this.m_phi0 = this.m_phi = Math.acos( this.m_r.z / this.m_rho );
            this.m_theta0 = this.m_theta = Math.atan2( this.m_r.y, this.m_r.x );
        }

        private _computePositionFromSphericals() : void
        {
            let _sphi = Math.sin( this.m_phi );
            let _cphi = Math.cos( this.m_phi );
            let _stheta = Math.sin( this.m_theta );
            let _ctheta = Math.cos( this.m_theta );

            this.m_r.x = this.m_rho * _sphi * _ctheta;
            this.m_r.y = this.m_rho * _sphi * _stheta;
            this.m_r.z = this.m_rho * _cphi;

            this.m_pos.x = this.m_targetPoint.x + this.m_r.x;
            this.m_pos.y = this.m_targetPoint.y + this.m_r.y;
            this.m_pos.z = this.m_targetPoint.z + this.m_r.z;
        }

        public setTargetPoint( targetPoint : core.LVec3 ) : void
        {
            this.m_targetPoint = targetPoint;
            this._updateSystem();
        }
        public getTargetPoint() : core.LVec3
        {
            return this.m_targetPoint;
        }

        public rho() : number { return this.m_rho; }
        public phi() : number { return this.m_phi; }
        public theta() : number { return this.m_theta; }

        protected _updateSystem() : void
        {
            this._computePositionFromSphericals();

            this.m_front = core.LVec3.normalize( core.LVec3.minus( this.m_pos, this.m_targetPoint ) );
            this.m_right = core.LVec3.normalize( core.LVec3.cross( this.m_worldUp, this.m_front ) );
            this.m_up    = core.LVec3.normalize( core.LVec3.cross( this.m_front, this.m_right ) );

            this._buildViewMatrix();
        }

        public static GetStaticType() : string
        {
            return "Orbit3d";
        }

        public update( dt : number ) : void
        {
            if ( this.m_camState == OrbitCameraState.IDLE )
            {
                if ( core.LInputHandler.isMouseButtonDown( core.MOUSE_LEFT ) )
                {
                    this.m_camState = OrbitCameraState.DRAGGING;
                    this.m_mouseStartXY = core.LInputHandler.cursorXY();
                    this.m_mouseCurrentXY = core.LInputHandler.cursorXY();

                    this.m_phi0 = this.m_phi;
                    this.m_theta0 = this.m_theta;
                }
                else if ( core.LInputHandler.isMouseButtonDown( core.MOUSE_WHEEL ) )
                {
                    this.m_camState = OrbitCameraState.MOVING_TARGET;
                    this.m_mouseStartXY = core.LInputHandler.cursorXY();
                    this.m_mouseCurrentXY = core.LInputHandler.cursorXY();
                    core.LVec3.copy( this.m_startTargetPoint, this.m_targetPoint );
                }
            }
            else if ( this.m_camState == OrbitCameraState.DRAGGING )
            {
                this.m_mouseCurrentXY = core.LInputHandler.cursorXY();

                let _dx = this.m_mouseCurrentXY.x - this.m_mouseStartXY.x;
                let _dy = this.m_mouseCurrentXY.y - this.m_mouseStartXY.y;

                let _dtheta = ( -_dx / this.m_viewportWidth ) * 2 * Math.PI;
                let _dphi = ( -_dy / this.m_viewportHeight ) * Math.PI;

                this.m_theta = this.m_theta0 + _dtheta;
                this.m_phi = this.m_phi0 + _dphi;

                if ( core.LInputHandler.isMouseButtonUp( core.MOUSE_LEFT ) )
                {
                    this.m_camState = OrbitCameraState.IDLE;
                }
            }
            else if ( this.m_camState ==  OrbitCameraState.MOVING_TARGET )
            {
                this.m_mouseCurrentXY = core.LInputHandler.cursorXY();

                // Update target position
                let _dx = -( this.m_mouseCurrentXY.x - this.m_mouseStartXY.x );
                let _dy = ( this.m_mouseCurrentXY.y - this.m_mouseStartXY.y );

                this.m_targetPoint.x = this.m_startTargetPoint.x + ( this.m_right.x * _dx + this.m_up.x * _dy ) * 0.01;
                this.m_targetPoint.y = this.m_startTargetPoint.y + ( this.m_right.y * _dx + this.m_up.y * _dy ) * 0.01;
                this.m_targetPoint.z = this.m_startTargetPoint.z;

                this._computePositionFromSphericals();

                if ( core.LInputHandler.isMouseButtonUp( core.MOUSE_WHEEL ) )
                {
                    this.m_camState = OrbitCameraState.IDLE;
                }
            }

            let _wheel = core.LInputHandler.wheelAcumValue();
            let _drho = -_wheel * 0.25;
            this.m_rho = this.m_rho0 + _drho;

            this._updateSystem();
        }

    }

}