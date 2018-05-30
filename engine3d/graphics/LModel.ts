

/// <reference path="LMesh.ts" />


namespace engine3d
{

    export const RENDERABLE_TYPE_MODEL : string = 'Model3d';

    export class LModel extends LMesh
    {

        constructor( geometry : LGeometry3d,
                     material : LMaterial3d,
                     compensationMat : core.LMat4 )
        {
            super( geometry, material, compensationMat );

            this.m_type = RENDERABLE_TYPE_MODEL;
        }

        protected _updateModelMatrix() : void
        {
            super._updateModelMatrix();

            core.mulMatMat44InPlace( this.m_calcMat,
                                     this.m_modelMatrix,
                                     this.m_modelCompensation );

            core.LMat4.copy( this.m_modelMatrix, this.m_calcMat );
        }
    }



}