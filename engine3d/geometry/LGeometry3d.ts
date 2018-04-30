
/// <reference path="../../core/geometry/LBaseGeometry.ts" />



namespace engine3d
{

    export class LGeometry3d extends core.LBaseGeometry
    {



        constructor( vertices : core.LVec3[],
                     normals : core.LVec3[],
                     indices : core.LInd3[] )
        {
            super();

            // Create vbos
            // Layout : 
            // attribute 0 -> vertices - here
            // attribute 1 -> normals - here
            // attribute 2 -> texture coords - vbo in material
            this.addVbo( 3, core.LVec3.arrayToBuffer( vertices ) );
            this.addVbo( 3, core.LVec3.arrayToBuffer( normals ) );

            // Create ibo
            this.setIbo( indices.length * 3, core.LInd3.arrayToBuffer( indices ) );
        }

        
    }



}