

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
        
        public setRot( euler : core.LVec3 ) : void
        {
            core.LVec3.copy( this.m_rotEuler, euler );
            // Update rotation matrix
            core.LMat4.fromEulerInPlace( this.m_rotMat, this.m_rotEuler );
            // Update model matrix
            this._updateModelMatrix();
        }
        public getRot() : core.LVec3 { return this.m_rotEuler; }

        public setRotMat( mat : core.LMat4 ) : void
        {
            core.LMat4.extractRotationInPlace( this.m_rotMat, mat );
            // Update euler angles
            core.LMat4.extractEulerFromRotationInPlace( this.m_rotEuler, this.m_rotMat );
            // Update model matrix
            this._updateModelMatrix();
        }
        public getRotMat() : core.LMat4 { return this.m_rotMat; }

        public setPos( pos : core.LVec3 ) : void
        {
            core.LVec3.copy( this.m_pos, pos );
        }
        public getPos() : core.LVec3 { return this.m_pos; }

        public setScale( scale : core.LVec3 ) : void
        {
            core.LVec3.copy( this.m_scale, scale );
        }
        public getScale() : core.LVec3 { return this.m_scale; }

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