

/// <reference path="../../core/graphics/LBaseMesh.ts"/>
/// <reference path="../geometry/LGeometry3d.ts" />
/// <reference path="../material/LMaterial3d.ts" />



namespace engine3d
{

    export const RENDERABLE_TYPE_MESH_3D : string = 'Mesh3d';

    export class LMesh extends core.LBaseMesh
    {
        // TODO: Add support for local ( intrinsic ) and global ( extrinsic ) rotations

        protected m_pos : core.LVec3;
        protected m_rotEuler : core.LVec3;// Using Tiat-Bryan angles - z,y,x - extrinsic
        protected m_rotMat : core.LMat4;// Rotation matrix, in case needed
        protected m_scale : core.LVec3;

        protected m_modelMatrix : core.LMat4;

        protected m_isWireframe : boolean;

        constructor( geometry : LGeometry3d,
                     material : LMaterial3d )
        {
            super();

            this.m_type = RENDERABLE_TYPE_MESH_3D;

            this.m_isWireframe = false;

            this.m_pos = new core.LVec3( 0, 0, 0 );
            this.m_scale = new core.LVec3( 1, 1, 1 );
            this.m_rotEuler = new core.LVec3( 0, 0, 0 );
            this.m_rotMat = new core.LMat4();

            this.m_geometry = geometry;
            this.m_material = material;

            this.m_modelMatrix = new core.LMat4();
            this._updateModelMatrix();
        }
        
        public setRotEuler( euler : core.LVec3 ) : void
        {
            core.LVec3.copy( this.m_rotEuler, euler );
            // Update rotation matrix
            core.LMat4.fromEulerInPlace( this.m_rotMat, this.m_rotEuler );
        }
        public setRotEulerX( eulerX : number ) : void
        {
            this.m_rotEuler.x = eulerX;
            // Update rotation matrix
            core.LMat4.fromEulerInPlace( this.m_rotMat, this.m_rotEuler );
        }
        public setRotEulerY( eulerY : number ) : void
        {
            this.m_rotEuler.y = eulerY;
            // Update rotation matrix
            core.LMat4.fromEulerInPlace( this.m_rotMat, this.m_rotEuler );
        }
        public setRotEulerZ( eulerZ : number ) : void
        {
            this.m_rotEuler.z = eulerZ;
            // Update rotation matrix
            core.LMat4.fromEulerInPlace( this.m_rotMat, this.m_rotEuler );
        }
        public getRotEuler() : core.LVec3 { return this.m_rotEuler; }
        public getRotEulerX() : number { return this.m_rotEuler.x; }
        public getRotEulerY() : number { return this.m_rotEuler.y; }
        public getRotEulerZ() : number { return this.m_rotEuler.z; }


        public setRotMat( mat : core.LMat4 ) : void
        {
            core.LMat4.extractRotationInPlace( this.m_rotMat, mat );
            // Update euler angles
            core.LMat4.extractEulerFromRotationInPlace( this.m_rotEuler, this.m_rotMat );
        }
        public getRotMat() : core.LMat4 { return this.m_rotMat; }

        public setPos( pos : core.LVec3 ) : void { core.LVec3.copy( this.m_pos, pos ); }
        public setPosX( x : number ) : void { this.m_pos.x = x; }
        public setPosY( y : number ) : void { this.m_pos.y = y; }
        public setPosZ( z : number ) : void { this.m_pos.z = z; }
        public getPos() : core.LVec3 { return this.m_pos; }
        public getPosX() : number { return this.m_pos.x; }
        public getPosY() : number { return this.m_pos.y; }
        public getPosZ() : number { return this.m_pos.z; }

        public setScale( scale : core.LVec3 ) : void
        {
            core.LVec3.copy( this.m_scale, scale );
        }
        public getScale() : core.LVec3 { return this.m_scale; }

        public setWorldTransform( mat : core.LMat4 ) : void
        {
            core.LMat4.extractRotationInPlace( this.m_rotMat, mat );
            core.LMat4.extractEulerFromRotationInPlace( this.m_rotEuler, this.m_rotMat );
            core.LMat4.extractPositionInPlace( this.m_pos, mat );
            core.LMat4.copy( this.m_modelMatrix, mat );
        }

        protected _updateModelMatrix() : void
        {
            core.LMat4.fromPosRotScaleInPlace( this.m_modelMatrix, 
                                               this.m_pos,
                                               this.m_rotMat,
                                               this.m_scale );
        }

        public getModelMatrix() : core.LMat4 { return this.m_modelMatrix; }

        public update() : void
        {
            this._updateModelMatrix();
        }
    }






}