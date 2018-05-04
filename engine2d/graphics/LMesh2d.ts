

/// <reference path="../../core/graphics/LBaseMesh.ts"/>
/// <reference path="../geometry/LGeometry2d.ts" />
/// <reference path="../material/LMaterial2d.ts" />



namespace engine2d
{


    export class LMesh2d extends core.LBaseMesh
    {

        public pos : core.LVec2;
        public rot : number;
        public scale : core.LVec2;

        constructor( geometry : LGeometry2d,
                     material : LMaterial2d )
        {
            super();

            this.pos = new core.LVec2( 0, 0 );
            this.rot = 0;
            this.scale = new core.LVec2( 1, 1 );

            this.m_geometry = geometry;
            this.m_material = material;
        }
    }






}