/// <reference path="LMesh.ts" />



namespace engine
{

    export class LMeshBuilder
    {


        public static createSphere( radius : number, levelDivision : number, numLevels : number ) : LMesh
        {
            let _mesh : LMesh = null;

            let _vertices : Array< LVec3 > = [];
            let _normals : Array< LVec3 > = [];
            let _indices : Array< LInd3 > = [];

            // adapted from here :
            // https://www.opengl.org/discussion_boards/showthread.php/159584-sphere-generation

            let _x, _y, _z, _r : number;
            let l, d : number;

            // Compute vertices and normals using the given parameters

            for ( l = -numLevels, l <= numLevels; l++ )
            {
                _y = Math.sin( 0.5 * Math.PI * ( l / ( numLevels + 1 ) ) );

                for ( d = 0; d < levelDivision; d++ )
                {
                    _r = Math.sqrt( 1.0 - _y * _y );
                    _x = _r * Math.cos( 2.0 * Math.PI * ( d / levelDivision ) );
                    _z = _r * Math.sin( 2.0 * Math.PI * ( d / levelDivision ) );

                    _vertices.push( new LVec3( radius * _x, radius * _y, radius * _z ) );
                    _normals.push( new LVec3( _x, _y, _z ) );
                }
            }

            let s : number;

            // Compute the indices-topology

            for ( l = 0; l < 2 * numLevels; l++ )
            {
                let _indxAtLevel     : number = l * levelDivision;
                let _indxAtNextLevel : number = ( l + 1 ) * levelDivision;

                // Connect sides
                for ( s = 0; s < levelDivision; s++ )
                {
                    let _p0 : number = _indxAtLevel + s;
                    let _p1 : number = _indxAtLevel + ( ( s + 1 ) % levelDivision );
                    let _p0n : number = _indxAtNextLevel + s;
                    let _p1n : number = _indxAtNextLevel + ( ( s + 1 ) % levelDivision );

                    _indices.push( new LInd3( _p0, _p1n, _p0n ) );
                    _indices.push( new LInd3( _p0, _p1, _p1n ) );
                }
            }

            _mesh = new LMesh();

            return _mesh;
        }

        public static foo() : LMesh
        {

            return new LMesh();
        }



    }

}

