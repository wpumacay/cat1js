
/// <reference path="../../core/material/LBaseMaterial.ts" />



namespace engine2d
{


    export class LMaterial2d extends core.LBaseMaterial
    {

        // TODO: Add 3d specific stuff ( texCoords?, multitex? )

        constructor( color : core.LVec3 )
        {
            super( color );

            this.m_type = 'base2d';
        }


    }



}
