

/// <reference path="LMesh2d.ts" />



namespace engine2d
{


    export class LSprite extends LMesh2d
    {

        public pos : core.LVec2;
        public rot : number;
        public scale : core.LVec2;

        private static _buildGeometry( vertices : core.LVec2[], 
                                       indices : core.LInd3[], 
                                       texCoord : core.LVec2[],
                                       width : number, height : number ) : void
        {
            vertices.push( new core.LVec2( -0.5 * width, -0.5 * height ) );
            vertices.push( new core.LVec2(  0.5 * width, -0.5 * height ) );
            vertices.push( new core.LVec2(  0.5 * width,  0.5 * height ) );
            vertices.push( new core.LVec2( -0.5 * width,  0.5 * height ) );

            indices.push( new core.LInd3( 0, 1, 2 ) );
            indices.push( new core.LInd3( 0, 2, 3 ) );

            texCoord.push( new core.LVec2( 0, 1 ) );
            texCoord.push( new core.LVec2( 1, 1 ) );
            texCoord.push( new core.LVec2( 1, 0 ) );
            texCoord.push( new core.LVec2( 0, 0 ) );
        }

        constructor( texture : any,
                     width : number, height : number )
        {

            let _vertices : core.LVec2[] = [];
            let _indices : core.LInd3[] = [];
            let _texCoords : core.LVec2[] = [];

            LSprite._buildGeometry( _vertices, _indices, _texCoords,
                                    width, height );

            let _geometry : LGeometry2d = new LGeometry2d( _vertices, _indices );
            let _material : LMaterial2d = new LMaterial2d( core.GREEN );

            super( _geometry, _material );
        }
    }






}