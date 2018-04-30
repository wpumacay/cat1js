/// <reference path="../../core/graphics/LBaseMesh.ts"/>
/// <reference path="../geometry/LGeometry3d.ts" />
/// <reference path="../material/LMaterial3d.ts" />



namespace engine3d
{


    export class LMesh extends core.LBaseMesh
    {


        constructor( geometry : LGeometry3d,
                     material : LMaterial3d )
        {
            super();

            this.m_geometry = geometry;
            this.m_material = material;
        }

        


    }






}