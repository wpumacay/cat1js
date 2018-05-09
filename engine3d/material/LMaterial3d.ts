
/// <reference path="../../core/material/LBaseMaterial.ts" />



namespace engine3d
{


    export class LMaterial3d extends core.LBaseMaterial
    {

        // TODO: Add 3d specific stuff (multitex? )

        constructor( color : core.LVec3 )
        {
            super( color );

            this.m_type = 'base3d';
        }

        public static staticType() : string { return 'base3d'; }
    }



}
