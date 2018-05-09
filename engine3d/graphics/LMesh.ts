

/// <reference path="../../core/graphics/LBaseMesh.ts"/>
/// <reference path="../geometry/LGeometry3d.ts" />
/// <reference path="../material/LMaterial3d.ts" />



namespace engine3d
{

    export const RENDERABLE_TYPE_MESH_3D : string = 'Mesh3d';

    export class LMesh extends core.LBaseMesh
    {

        public pos : core.LVec3;
        public rot : core.LVec3;// Using Tyrat-Bryan angles - z1,y2,x3
        public scale : core.LVec3;

        protected m_modelMatrix : core.LMat4;

        protected m_isWireframe : boolean;

        constructor( geometry : LGeometry3d,
                     material : LMaterial3d )
        {
            super();

            this.m_type = RENDERABLE_TYPE_MESH_3D;

            this.m_isWireframe = false;

            this.pos = new core.LVec3( 0, 0, 0 );
            this.scale = new core.LVec3( 1, 1, 1 );
            this.rot = new core.LVec3( 0, 0, 0 );

            this.m_geometry = geometry;
            this.m_material = material;

            this.m_modelMatrix = new core.LMat4();
            this._updateModelMatrix();
        }

        protected _updateModelMatrix() : void
        {
            // Recall, using Tyrat-Bryan angles - z1,y2,x3

            let _c1, _c2, _c3 : number = 0.0;
            let _s1, _s2, _s3 : number = 0.0;

            let _sx, _sy, _sz : number = 1.0;

            _sx = this.scale.x;
            _sy = this.scale.y;
            _sz = this.scale.z;

            _c1 = Math.cos( this.rot.z );
            _s1 = Math.sin( this.rot.z );

            _c2 = Math.cos( this.rot.y );
            _s2 = Math.sin( this.rot.y );

            _c3 = Math.cos( this.rot.x );
            _s3 = Math.sin( this.rot.x );

            this.m_modelMatrix.buff[0] = _sx * ( _c1 * _c2 );
            this.m_modelMatrix.buff[1] = _sx * ( _c2 * _s1 );
            this.m_modelMatrix.buff[2] = _sx * ( -_s2 );
            this.m_modelMatrix.buff[3] = 0;

            this.m_modelMatrix.buff[4] = _sy * ( _c1 * _s2 * _s3 - _c3 * _s1 );
            this.m_modelMatrix.buff[5] = _sy * ( _c1 * _c3 + _s1 * _s2 * _s3 );
            this.m_modelMatrix.buff[6] = _sy * ( _c2 * _s3 );
            this.m_modelMatrix.buff[7] = 0;

            this.m_modelMatrix.buff[8]  = _sz * ( _s1 * _s3 + _c1 * _c3 * _s2 );
            this.m_modelMatrix.buff[9]  = _sz * ( _c3 * _s1 * _s2 - _c1 * _s3 );
            this.m_modelMatrix.buff[10] = _sz * ( _c2 * _c3 );
            this.m_modelMatrix.buff[11] = 0;

            this.m_modelMatrix.buff[12] = this.pos.x;
            this.m_modelMatrix.buff[13] = this.pos.y;
            this.m_modelMatrix.buff[14] = this.pos.z;
            this.m_modelMatrix.buff[15] = 1;
        }

        public getModelMatrix() : core.LMat4 { return this.m_modelMatrix; }

        public update() : void
        {
            this._updateModelMatrix();
        }
    }






}