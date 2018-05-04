
/// <reference path="../../core/geometry/LBaseGeometry.ts" />



namespace engine2d
{

    export class LGeometry2d extends core.LBaseGeometry
    {

        constructor( vertices : core.LVec2[],
                     indices : core.LInd3[] )
        {
            super();

            // Create vbos
            // Layout : 
            // attribute 0 -> vertices - here
            // attribute 1 -> texture coords - vbo in material
            // console.log( vertices );
            this.addVbo( 2, core.LVec2.arrayToBuffer( vertices ), 0 );

            // Create ibo
            this.setIbo( indices.length * 3, core.LInd3.arrayToBuffer( indices ) );
        }

        
    }



}