/// <reference path="../geometry/LGeometry3d.ts" />



namespace engine3d
{

    export class LGeometryBuilder
    {


        public static createSphere( radius : number, levelDivision : number, numLevels : number ) : LGeometry3d
        {
            let _geometry : LGeometry3d = null;

            let _vertices : core.LVec3[] = [];
            let _normals : core.LVec3[] = [];
            let _texCoords : core.LVec2[] = [];// default texCoords for this geometry
            let _indices : core.LInd3[] = [];

            // adapted from here :
            // https://www.opengl.org/discussion_boards/showthread.php/159584-sphere-generation

            let _x, _y, _z, _r : number;
            let l, d, s : number;

            // Compute vertices and normals using the given parameters

            for ( l = -numLevels; l <= numLevels; l++ )
            {
                _y = Math.sin( 0.5 * Math.PI * ( l / ( numLevels + 1 ) ) );

                for ( d = 0; d < levelDivision; d++ )
                {
                    _r = Math.sqrt( 1.0 - _y * _y );
                    _x = _r * Math.cos( 2.0 * Math.PI * ( d / levelDivision ) );
                    _z = _r * Math.sin( 2.0 * Math.PI * ( d / levelDivision ) );

                    _vertices.push( new core.LVec3( radius * _x, radius * _y, radius * _z ) );
                    _normals.push( new core.LVec3( _x, _y, _z ) );

                    // from here: https://en.wikipedia.org/wiki/UV_mapping#Finding_UV_on_a_sphere

                    let _u, _v : number;
                    _u = 0.5 + ( Math.atan2( -_z, -_x ) / ( 2 * Math.PI ) );
                    _v = 0.5 - ( Math.asin( -_y ) / Math.PI );


                    _texCoords.push( new core.LVec2( _u, _v ) );
                }
            }

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

                    _indices.push( new core.LInd3( _p0, _p1n, _p0n ) );
                    _indices.push( new core.LInd3( _p0, _p1, _p1n ) );
                }
            }

            _geometry = new LGeometry3d( _vertices, _normals, _texCoords, _indices );

            return _geometry;
        }


        public static createBox( width : number, height : number, depth : number )
        {
            let _geometry : LGeometry3d = null;

            let _vertices : core.LVec3[] = [];
            let _normals : core.LVec3[] = [];
            let _texCoords : core.LVec2[] = [];// default texCoords for this geometry
            let _indices : core.LInd3[] = [];


            let _normalsSource : core.LVec3[] = [];

            _normalsSource.push( new core.LVec3(  0,  0,  1 ) );
            _normalsSource.push( new core.LVec3(  0,  0, -1 ) );
            _normalsSource.push( new core.LVec3(  0,  1,  0 ) );
            _normalsSource.push( new core.LVec3(  0, -1,  0 ) );
            _normalsSource.push( new core.LVec3(  1,  0,  0 ) );
            _normalsSource.push( new core.LVec3( -1,  0,  0 ) );

            let _scale : core.LVec3 = new core.LVec3( 0.5 * width, 0.5 * height, 0.5 * depth );
            let q : number;

            // for each face, compute the vertices that form ...
            // the face perpendicular to that normal
            for ( q = 0; q < _normalsSource.length; q++ )
            {
                let _n : core.LVec3 = _normalsSource[q];

                // form a tri perpendicular right hand system
                let _s1 : core.LVec3 = new core.LVec3( _n.y, _n.z, _n.x );
                let _s2 : core.LVec3 = core.LVec3.cross( _n, _s1 );

                // Add the indices accordingly
                _indices.push( new core.LInd3( _vertices.length,
                                               _vertices.length + 1,
                                               _vertices.length + 2 ) );

                _indices.push( new core.LInd3( _vertices.length,
                                               _vertices.length + 2,
                                               _vertices.length + 3 ) );

                // Generate each vertex of each face ...
                // according to these vectors
                let _v : core.LVec3;

                _v = core.LVec3.minus( core.LVec3.minus( _n, _s1 ), _s2 );
                _v.scale( _scale.x, _scale.y, _scale.z );

                _vertices.push( _v );
                _normals.push( new core.LVec3( _n.x, _n.y, _n.z ) );
                _texCoords.push( new core.LVec2( 1, 1 ) );

                _v = core.LVec3.minus( core.LVec3.plus( _n, _s1 ), _s2 );
                _v.scale( _scale.x, _scale.y, _scale.z );

                _vertices.push( _v );
                _normals.push( new core.LVec3( _n.x, _n.y, _n.z ) );
                _texCoords.push( new core.LVec2( 1, 0 ) );

                _v = core.LVec3.plus( core.LVec3.plus( _n, _s1 ), _s2 );
                _v.scale( _scale.x, _scale.y, _scale.z );

                _vertices.push( _v );
                _normals.push( new core.LVec3( _n.x, _n.y, _n.z ) );
                _texCoords.push( new core.LVec2( 0, 0 ) );

                _v = core.LVec3.plus( core.LVec3.minus( _n, _s1 ), _s2 );
                _v.scale( _scale.x, _scale.y, _scale.z );

                _vertices.push( _v );
                _normals.push( new core.LVec3( _n.x, _n.y, _n.z ) );
                _texCoords.push( new core.LVec2( 0, 1 ) );

            }

            _geometry = new LGeometry3d( _vertices, _normals, _texCoords, _indices );

            return _geometry;
        }

// ************************************************************************************

        public static createCylinder( radius : number, height : number, sectionDivision : number ) : LGeometry3d
        {
            let _geometry : LGeometry3d = null;

            let _vertices : core.LVec3[] = [];
            let _texCoords : core.LVec2[] = [];
            let _normals : core.LVec3[] = [];
            let _indices : core.LInd3[] = [];

            // Start cylinder tessellation

            // calculate section geometry
            let _sectionXZ : core.LVec3[] = [];

            let _stepSectionAngle : number = 2 * Math.PI / sectionDivision;
            let q : number = 0;

            for ( q = 0; q < sectionDivision; q++ )
            {
                let _x : number = radius * Math.cos( q * _stepSectionAngle );
                let _z : number = radius * Math.sin( q * _stepSectionAngle );

                _sectionXZ.push( new core.LVec3( _x, 0, _z ) );
            }

            // calculate cylinder geometry
            let _baseIndx : number = 0;

            // up base *****************************************************************
            for ( q = 0; q < _sectionXZ.length; q++ )
            {
                _vertices.push( core.LVec3.plus( _sectionXZ[q], new core.LVec3( 0, 0.5 * height, 0 ) ) );
                _normals.push( new core.LVec3( 0, 1, 0 ) );
                _texCoords.push( new core.LVec2( 0.5 + ( _sectionXZ[q].z / ( 2 * radius ) ),
                                                 0.5 + ( _sectionXZ[q].x / ( 2 * radius ) ) ) );
            }
            for ( q = 1; q <= _sectionXZ.length - 2; q++ )
            {
                _indices.push( new core.LInd3( _baseIndx, _baseIndx + q, _baseIndx + q + 1 ) );
            }
            _baseIndx += _vertices.length;
            // *************************************************************************

            // body surface ************************************************************
            for ( q = 0; q < _sectionXZ.length; q++ )
            {
                // quad vertices
                let _p0 : core.LVec3 = core.LVec3.plus( _sectionXZ[q], new core.LVec3( 0, 0.5 * height, 0 ) );
                let _p1 : core.LVec3 = core.LVec3.plus( _sectionXZ[( q + 1 ) % _sectionXZ.length], new core.LVec3( 0, 0.5 * height, 0 ) );
                let _p2 : core.LVec3 = core.LVec3.plus( _sectionXZ[( q + 1 ) % _sectionXZ.length], new core.LVec3( 0, -0.5 * height, 0 ) );
                let _p3 : core.LVec3 = core.LVec3.plus( _sectionXZ[q], new core.LVec3( 0, -0.5 * height, 0 ) );

                _vertices.push( _p0 );
                _vertices.push( _p1 );
                _vertices.push( _p2 );
                _vertices.push( _p3 );

                _texCoords.push( new core.LVec2( 0.5 + ( Math.atan2( _p0.z, _p0.x ) / ( 2 * Math.PI ) ), 
                                                 0.5 + _p0.y / height ) );
                _texCoords.push( new core.LVec2( 0.5 + ( Math.atan2( _p1.z, _p1.x ) / ( 2 * Math.PI ) ), 
                                                 0.5 + _p1.y / height ) );
                _texCoords.push( new core.LVec2( 0.5 + ( Math.atan2( _p2.z, _p2.x ) / ( 2 * Math.PI ) ), 
                                                 0.5 + _p2.y / height ) );
                _texCoords.push( new core.LVec2( 0.5 + ( Math.atan2( _p3.z, _p3.x ) / ( 2 * Math.PI ) ), 
                                                 0.5 + _p3.y / height ) );

                // For "flat" normals
                // let _nx : number = Math.cos( ( q + 0.5 ) * _stepSectionAngle );
                // let _nz : number = Math.sin( ( q + 0.5 ) * _stepSectionAngle );

                // let _nQuad : core.LVec3 = new core.LVec3( _nx, 0, _nz );

                // _normals.push( _nQuad );
                // _normals.push( _nQuad );
                // _normals.push( _nQuad );
                // _normals.push( _nQuad );

                // For "smooth" normals
                let _nx1 : number = Math.cos( ( q ) * _stepSectionAngle );
                let _nz1 : number = Math.sin( ( q ) * _stepSectionAngle );

                let _nx2 : number = Math.cos( ( q + 1 ) * _stepSectionAngle );
                let _nz2 : number = Math.sin( ( q + 1 ) * _stepSectionAngle );

                let _nQuad1 : core.LVec3 = new core.LVec3( _nx1, 0, _nz1 );
                let _nQuad2 : core.LVec3 = new core.LVec3( _nx2, 0, _nz2 );

                _normals.push( _nQuad1 );
                _normals.push( _nQuad2 );
                _normals.push( _nQuad2 );
                _normals.push( _nQuad1 );

                _indices.push( new core.LInd3( _baseIndx, _baseIndx + 2, _baseIndx + 1 ) );
                _indices.push( new core.LInd3( _baseIndx, _baseIndx + 3, _baseIndx + 2 ) );

                _baseIndx += 4;
            }
            // *************************************************************************

            // down base ***************************************************************
            for ( q = 0; q < _sectionXZ.length; q++ )
            {
                _vertices.push( core.LVec3.plus( _sectionXZ[q], new core.LVec3( 0, -0.5 * height, 0 ) ) );
                _normals.push( new core.LVec3( 0, -1, 0 ) );
                _texCoords.push( new core.LVec2( 0.5 + ( _sectionXZ[q].z / ( 2 * radius ) ),
                                                 0.5 + ( _sectionXZ[q].x / ( 2 * radius ) ) ) );
            }

            for ( q = 1; q <= _sectionXZ.length - 2; q++ )
            {
                _indices.push( new core.LInd3( _baseIndx, _baseIndx + q + 1, _baseIndx + q ) );
            }

            _geometry = new LGeometry3d( _vertices, _normals, _texCoords, _indices );

            return _geometry;
        }

        public static createCone( radius : number, height : number, sectionDivision : number ) : LGeometry3d
        {
            let _geometry : LGeometry3d = null;

            let _vertices : core.LVec3[] = [];
            let _texCoords : core.LVec2[] = [];
            let _normals : core.LVec3[] = [];
            let _indices : core.LInd3[] = [];

            let q : number;


            // Build base points
            let _sectionXZ : core.LVec3[] = [];
            let _stepSectionAngle : number = 2 * Math.PI / sectionDivision;

            for ( q = 0; q < sectionDivision; q++ )
            {
                let _x : number = radius * Math.cos( q * _stepSectionAngle );
                let _z : number = radius * Math.sin( q * _stepSectionAngle );

                _sectionXZ.push( new core.LVec3( _x, 0, _z ) );
            }

            // Build surface - tesselate using strips of triangles
            for ( q = 0; q < _sectionXZ.length; q++ )
            {
                _indices.push( new core.LInd3( _vertices.length,
                                               _vertices.length + 1,
                                               _vertices.length + 2 ) );

                let _p0 : core.LVec3 = core.LVec3.minus( _sectionXZ[ q % _sectionXZ.length ], 
                                                         new core.LVec3( 0, 0.5 * height, 0 ) );
                let _p1 : core.LVec3 = core.LVec3.minus( _sectionXZ[ ( q + 1 ) % _sectionXZ.length ], 
                                                         new core.LVec3( 0, 0.5 * height, 0 ) );
                let _p2 : core.LVec3 = new core.LVec3( 0, 0.5 * height, 0 );

                _vertices.push( _p0 );
                _vertices.push( _p1 );
                _vertices.push( _p2 );

                let _nx0 : number = Math.cos( ( q ) * _stepSectionAngle );
                let _nz0 : number = Math.sin( ( q ) * _stepSectionAngle );

                let _nx1 : number = Math.cos( ( q + 1 ) * _stepSectionAngle );
                let _nz1 : number = Math.sin( ( q + 1 ) * _stepSectionAngle );

                let _n0 : core.LVec3 = new core.LVec3( _nx0, 0, _nz0 );
                let _n1 : core.LVec3 = new core.LVec3( _nx1, 0, _nz1 );
                let _n2 : core.LVec3 = new core.LVec3( 0, 1, 0 );

                _normals.push( _n0 );
                _normals.push( _n1 );
                _normals.push( _n2 );

                _texCoords.push( new core.LVec2( q / _sectionXZ.length, 1 ) );
                _texCoords.push( new core.LVec2( ( q + 1 ) / _sectionXZ.length, 1 ) );
                _texCoords.push( new core.LVec2( ( q + 0.5 ) / _sectionXZ.length, 0 ) );
            }

            // Build bottom base
            let _baseIndx : number = _vertices.length;

            for ( q = 0; q < _sectionXZ.length; q++ )
            {
                _vertices.push( core.LVec3.plus( _sectionXZ[q], new core.LVec3( 0, -0.5 * height, 0 ) ) );
                _normals.push( new core.LVec3( 0, -1, 0 ) );
                _texCoords.push( new core.LVec2( 0.5 + ( _sectionXZ[q].z / ( 2 * radius ) ),
                                                 0.5 + ( _sectionXZ[q].x / ( 2 * radius ) ) ) );
            }

            for ( q = 1; q <= _sectionXZ.length - 2; q++ )
            {
                _indices.push( new core.LInd3( _baseIndx, _baseIndx + q + 1, _baseIndx + q ) );
            }

            _geometry = new LGeometry3d( _vertices, _normals, _texCoords, _indices );

            return _geometry;
        }

        public static createArrow( length : number ) : LGeometry3d
        {
            let _geometry : LGeometry3d = null;

            let _vertices : core.LVec3[] = [];
            let _normals : core.LVec3[] = [];
            let _texCoords : core.LVec2[] = [];
            let _indices : core.LInd3[] = [];

            let _sectionDivision : number = 10;
            // Arrow dimensions
            let _radiusCyl : number  = 0.05 * length;
            let _radiusCone : number = 0.075 * length;
            let _lengthCyl : number = 0.8 * length;
            let _lengthCone : number = 0.2 * length;

            // Tesselate cylinder ***********************************************************************
            // calculate section geometry
            let _sectionXZ : core.LVec3[] = [];

            let _stepSectionAngle : number = 2 * Math.PI / _sectionDivision;
            let q : number = 0;

            for ( q = 0; q < _sectionDivision; q++ )
            {
                let _x : number = _radiusCyl * Math.cos( q * _stepSectionAngle );
                let _z : number = _radiusCyl * Math.sin( q * _stepSectionAngle );

                _sectionXZ.push( new core.LVec3( _x, 0, _z ) );
            }

            // calculate cylinder geometry
            let _baseIndx : number = 0;

            // down base ****************************************
            for ( q = 0; q < _sectionXZ.length; q++ )
            {
                _vertices.push( _sectionXZ[q] );
                _normals.push( core.AXIS_NEG_Y );
                _texCoords.push( new core.LVec2( 0.5 + ( _sectionXZ[q].z / ( 2 * _radiusCyl ) ),
                                                 0.5 + ( _sectionXZ[q].x / ( 2 * _radiusCyl ) ) ) );
            }
            for ( q = 1; q <= _sectionXZ.length - 2; q++ )
            {
                _indices.push( new core.LInd3( _baseIndx, _baseIndx + q, _baseIndx + q + 1 ) );
            }
            _baseIndx += _vertices.length;
            // **************************************************

            // body surface *************************************
            for ( q = 0; q < _sectionXZ.length; q++ )
            {
                // quad vertices
                let _p0 : core.LVec3 = core.LVec3.plus( _sectionXZ[q], new core.LVec3( 0, _lengthCyl, 0 ) );
                let _p1 : core.LVec3 = core.LVec3.plus( _sectionXZ[( q + 1 ) % _sectionXZ.length], new core.LVec3( 0, _lengthCyl, 0 ) );
                let _p2 : core.LVec3 = core.LVec3.plus( _sectionXZ[( q + 1 ) % _sectionXZ.length], new core.LVec3( 0, 0, 0 ) );
                let _p3 : core.LVec3 = core.LVec3.plus( _sectionXZ[q], new core.LVec3( 0, 0, 0 ) );

                _vertices.push( _p0 );
                _vertices.push( _p1 );
                _vertices.push( _p2 );
                _vertices.push( _p3 );

                _texCoords.push( new core.LVec2( 0.5 + ( Math.atan2( _p0.z, _p0.x ) / ( 2 * Math.PI ) ), 
                                                 _p0.y / _lengthCyl ) );
                _texCoords.push( new core.LVec2( 0.5 + ( Math.atan2( _p1.z, _p1.x ) / ( 2 * Math.PI ) ), 
                                                 _p1.y / _lengthCyl ) );
                _texCoords.push( new core.LVec2( 0.5 + ( Math.atan2( _p2.z, _p2.x ) / ( 2 * Math.PI ) ), 
                                                 _p2.y / _lengthCyl ) );
                _texCoords.push( new core.LVec2( 0.5 + ( Math.atan2( _p3.z, _p3.x ) / ( 2 * Math.PI ) ), 
                                                 _p3.y / _lengthCyl ) );

                // For "smooth" normals
                let _nx1 : number = Math.cos( ( q ) * _stepSectionAngle );
                let _nz1 : number = Math.sin( ( q ) * _stepSectionAngle );

                let _nx2 : number = Math.cos( ( q + 1 ) * _stepSectionAngle );
                let _nz2 : number = Math.sin( ( q + 1 ) * _stepSectionAngle );

                let _nQuad1 : core.LVec3 = new core.LVec3( _nx1, 0, _nz1 );
                let _nQuad2 : core.LVec3 = new core.LVec3( _nx2, 0, _nz2 );

                _normals.push( _nQuad1 );
                _normals.push( _nQuad2 );
                _normals.push( _nQuad2 );
                _normals.push( _nQuad1 );

                _indices.push( new core.LInd3( _baseIndx, _baseIndx + 2, _baseIndx + 1 ) );
                _indices.push( new core.LInd3( _baseIndx, _baseIndx + 3, _baseIndx + 2 ) );

                _baseIndx += 4;
            }
            // **************************************************

            // Tesselate cone ***************************************************************************

            // Build base points
            let _sectionXZCone : core.LVec3[] = [];
            let _sectionXZConeIn : core.LVec3[] = [];
            let _stepSectionAngleCone : number = 2 * Math.PI / _sectionDivision;

            for ( q = 0; q < _sectionDivision; q++ )
            {
                let _x : number = _radiusCone * Math.cos( q * _stepSectionAngleCone );
                let _z : number = _radiusCone * Math.sin( q * _stepSectionAngleCone );

                _sectionXZCone.push( new core.LVec3( _x, 0, _z ) );

                _x = _radiusCyl * Math.cos( q * _stepSectionAngleCone );
                _z = _radiusCyl * Math.sin( q * _stepSectionAngleCone );

                _sectionXZConeIn.push( new core.LVec3( _x, 0, _z ) );
            }

            // Build surface - tesselate using strips of triangles
            for ( q = 0; q < _sectionXZCone.length; q++ )
            {
                _indices.push( new core.LInd3( _vertices.length,
                                               _vertices.length + 1,
                                               _vertices.length + 2 ) );

                let _p0 : core.LVec3 = core.LVec3.plus( _sectionXZCone[ q % _sectionXZCone.length ], 
                                                        new core.LVec3( 0, _lengthCyl, 0 ) );
                let _p1 : core.LVec3 = core.LVec3.plus( _sectionXZCone[ ( q + 1 ) % _sectionXZCone.length ], 
                                                        new core.LVec3( 0, _lengthCyl, 0 ) );
                let _p2 : core.LVec3 = new core.LVec3( 0, _lengthCyl + _lengthCone, 0 );

                _vertices.push( _p0 );
                _vertices.push( _p1 );
                _vertices.push( _p2 );

                let _nx0 : number = Math.cos( ( q ) * _stepSectionAngleCone );
                let _nz0 : number = Math.sin( ( q ) * _stepSectionAngleCone );

                let _nx1 : number = Math.cos( ( q + 1 ) * _stepSectionAngleCone );
                let _nz1 : number = Math.sin( ( q + 1 ) * _stepSectionAngleCone );

                let _n0 : core.LVec3 = new core.LVec3( _nx0, 0, _nz0 );
                let _n1 : core.LVec3 = new core.LVec3( _nx1, 0, _nz1 );
                let _n2 : core.LVec3 = new core.LVec3( 0, 1, 0 );

                _normals.push( _n0 );
                _normals.push( _n1 );
                _normals.push( _n2 );

                _texCoords.push( new core.LVec2( q / _sectionXZCone.length, 1 ) );
                _texCoords.push( new core.LVec2( ( q + 1 ) / _sectionXZCone.length, 1 ) );
                _texCoords.push( new core.LVec2( ( q + 0.5 ) / _sectionXZCone.length, 0 ) );
            }

            // Build bottom base - strip of "kind of quads" ( ring tessellation )
            _baseIndx = _vertices.length;

            for ( q = 0; q < _sectionXZCone.length; q++ )
            {
                let _p0 : core.LVec3 = core.LVec3.plus( _sectionXZCone[q], new core.LVec3( 0, _lengthCyl, 0 ) );
                let _p1 : core.LVec3 = core.LVec3.plus( _sectionXZConeIn[q], new core.LVec3( 0, _lengthCyl, 0 ) );
                let _p2 : core.LVec3 = core.LVec3.plus( _sectionXZConeIn[( q + 1 ) % _sectionXZConeIn.length], new core.LVec3( 0, _lengthCyl, 0 ) );
                let _p3 : core.LVec3 = core.LVec3.plus( _sectionXZ[( q + 1 ) % _sectionXZCone.length], new core.LVec3( 0, _lengthCyl, 0 ) );

                _vertices.push( _p0 );
                _vertices.push( _p1 );
                _vertices.push( _p2 );
                _vertices.push( _p3 );

                _normals.push( core.AXIS_NEG_Y );
                _normals.push( core.AXIS_NEG_Y );
                _normals.push( core.AXIS_NEG_Y );
                _normals.push( core.AXIS_NEG_Y );

                _texCoords.push( new core.LVec2( 0.5 + ( _sectionXZCone[q].z / ( 2 * _radiusCone ) ),
                                                 0.5 + ( _sectionXZCone[q].x / ( 2 * _radiusCone ) ) ) );

                _texCoords.push( new core.LVec2( 0.5 + ( _sectionXZConeIn[q].z / ( 2 * _radiusCone ) ),
                                                 0.5 + ( _sectionXZConeIn[q].x / ( 2 * _radiusCone ) ) ) );

                _texCoords.push( new core.LVec2( 0.5 + ( _sectionXZConeIn[( q + 1 ) % _sectionXZConeIn.length].z / ( 2 * _radiusCone ) ),
                                                 0.5 + ( _sectionXZCone[( q + 1 ) % _sectionXZConeIn.length].x / ( 2 * _radiusCone ) ) ) );

                _texCoords.push( new core.LVec2( 0.5 + ( _sectionXZCone[( q + 1 ) % _sectionXZCone.length].z / ( 2 * _radiusCone ) ),
                                                 0.5 + ( _sectionXZCone[( q + 1 ) % _sectionXZCone.length].x / ( 2 * _radiusCone ) ) ) );

                _indices.push( new core.LInd3( _baseIndx, _baseIndx + 2, _baseIndx + 1 ) );
                _indices.push( new core.LInd3( _baseIndx, _baseIndx + 3, _baseIndx + 2 ) );

                _baseIndx += 4;
            }

            _geometry = new LGeometry3d( _vertices, _normals, _texCoords, _indices );

            return _geometry;
        }

        public static createCapsule( radius : number, height : number, sectionDivision : number, capLevels : number ) : LGeometry3d
        {
            let _geometry : LGeometry3d = null;

            let _vertices : core.LVec3[] = [];
            let _normals : core.LVec3[] = [];
            let _texCoords : core.LVec2[] = [];
            let _indices : core.LInd3[] = [];

            // Tessellate using cap-surface-cap approach

            // Build up cap *********************************
            // make vertices
            let _x, _y, _z, _r : number;
            let _baseIndx : number = 0;
            let l, d, s, q : number = 0;

            for ( l = 0; l <= capLevels; l++ )
            {
                // _y = ( ( float )l ) / ( numLevels + 1 );
                _y = Math.sin( 0.5 * Math.PI * ( l ) / ( capLevels + 1 ) );

                for ( d = 0; d < sectionDivision; d++ )
                {
                    _r = Math.sqrt( 1.0 - _y * _y );
                    _x = _r * Math.cos( 2.0 * Math.PI * ( d ) / sectionDivision );
                    _z = _r * Math.sin( 2.0 * Math.PI * ( d ) / sectionDivision );

                    let _upOffset : core.LVec3 = new core.LVec3( 0, 0.5 * height, 0 );

                    _vertices.push( core.LVec3.plus( new core.LVec3( radius * _x, radius * _y, radius * _z ), _upOffset ) );
                    _normals.push( new core.LVec3( _x, _y, _z ) );
                }
            }

            for ( l = 0; l < capLevels; l++ )
            {
                let _vl : number = l * sectionDivision;
                let _vlNext : number = ( l + 1 ) * sectionDivision;

                // Connect sides
                for ( s = 0; s < sectionDivision; s++ )
                {
                    let _p0 : number = _baseIndx + _vl + s;
                    let _p1 : number = _baseIndx + _vl + ( ( s + 1 ) % sectionDivision );
                    let _p0n : number = _baseIndx + _vlNext + s;
                    let _p1n : number = _baseIndx + _vlNext + ( ( s + 1 ) % sectionDivision );

                    _indices.push( new core.LInd3( _p0, _p1n, _p0n ) );
                    _indices.push( new core.LInd3( _p0, _p1, _p1n ) );
                }
            }
            _baseIndx += _vertices.length;
            // Build surface *******************************

            // calculate section geometry
            let _sectionXZ : core.LVec3[] = [];

            let _stepSectionAngle : number = 2 * Math.PI / sectionDivision;

            for ( q = 0; q < sectionDivision; q++ )
            {
                let _x : number = radius * Math.cos( q * _stepSectionAngle );
                let _z : number = radius * Math.sin( q * _stepSectionAngle );

                _sectionXZ.push( new core.LVec3( _x, 0, _z ) );
            }

            // body surface
            
            for ( q = 0; q < _sectionXZ.length; q++ )
            {
                // quad vertices
                let _p0 : core.LVec3 = core.LVec3.plus( _sectionXZ[q], new core.LVec3( 0, 0.5 * height, 0 ) );
                let _p1 : core.LVec3 = core.LVec3.plus( _sectionXZ[( q + 1 ) % _sectionXZ.length], new core.LVec3( 0, 0.5 * height, 0 ) );
                let _p2 : core.LVec3 = core.LVec3.plus( _sectionXZ[( q + 1 ) % _sectionXZ.length], new core.LVec3( 0, -0.5 * height, 0 ) );
                let _p3 : core.LVec3 = core.LVec3.plus( _sectionXZ[q], new core.LVec3( 0, -0.5 * height, 0 ) );

                _vertices.push( _p0 );
                _vertices.push( _p1 );
                _vertices.push( _p2 );
                _vertices.push( _p3 );

                // For "flat" normals
                // let _nx : number = Math.cos( ( q + 0.5 ) * _stepSectionAngle );
                // let _nz : number = Math.sin( ( q + 0.5 ) * _stepSectionAngle );

                // let _nQuad : core.LVec3 = new core.LVec3( _nx, 0, _nz );

                // _normals.push( _nQuad );
                // _normals.push( _nQuad );
                // _normals.push( _nQuad );
                // _normals.push( _nQuad );

                // For "smooth" normals
                let _nx1 : number = Math.cos( ( q ) * _stepSectionAngle );
                let _nz1 : number = Math.sin( ( q ) * _stepSectionAngle );

                let _nx2 : number = Math.cos( ( q + 1 ) * _stepSectionAngle );
                let _nz2 : number = Math.sin( ( q + 1 ) * _stepSectionAngle );

                let _nQuad1 : core.LVec3 = new core.LVec3( _nx1, 0, _nz1 );
                let _nQuad2 : core.LVec3 = new core.LVec3( _nx2, 0, _nz2 );

                _normals.push( _nQuad1 );
                _normals.push( _nQuad2 );
                _normals.push( _nQuad2 );
                _normals.push( _nQuad1 );

                _indices.push( new core.LInd3( _baseIndx, _baseIndx + 2, _baseIndx + 1 ) );
                _indices.push( new core.LInd3( _baseIndx, _baseIndx + 3, _baseIndx + 2 ) );

                _baseIndx += 4;
            }


            // Build down cap ******************************
            // make vertices

            for ( l = -capLevels; l <= 0; l++ )
            {
                // _y = ( ( float )l ) / ( numLevels + 1 );
                _y = Math.sin( 0.5 * Math.PI * ( l ) / ( capLevels + 1 ) );

                for ( d = 0; d < sectionDivision; d++ )
                {
                    _r = Math.sqrt( 1.0 - _y * _y );
                    _x = _r * Math.cos( 2.0 * Math.PI * ( d ) / sectionDivision );
                    _z = _r * Math.sin( 2.0 * Math.PI * ( d ) / sectionDivision );

                    let _downOffset : core.LVec3 = new core.LVec3( 0, -0.5 * height, 0 );

                    _vertices.push( core.LVec3.plus( new core.LVec3( radius * _x, radius * _y, radius * _z ), _downOffset ) );
                    _normals.push( new core.LVec3( _x, _y, _z ) );
                }
            }

            for ( l = 0; l < capLevels; l++ )
            {
                let _vl : number = l * sectionDivision;
                let _vlNext : number = ( l + 1 ) * sectionDivision;

                // Connect sides
                for ( s = 0; s < sectionDivision; s++ )
                {
                    let _p0 : number = _baseIndx + _vl + s;
                    let _p1 : number = _baseIndx + _vl + ( ( s + 1 ) % sectionDivision );
                    let _p0n : number = _baseIndx + _vlNext + s;
                    let _p1n : number = _baseIndx + _vlNext + ( ( s + 1 ) % sectionDivision );

                    _indices.push( new core.LInd3( _p0, _p1n, _p0n ) );
                    _indices.push( new core.LInd3( _p0, _p1, _p1n ) );
                }
            }

            for ( q = 0; q < _vertices.length; q++ )
            {
                //// Project capsule onto sphere of radius ( h + 2r )
                // calculate spherical coordinates
                let _rC : number = Math.sqrt( _vertices[q].x * _vertices[q].x + 
                                              _vertices[q].y * _vertices[q].y +
                                              _vertices[q].z * _vertices[q].z );
                let _thetaC : number = Math.acos( _vertices[q].z / _rC );
                let _yawC : number = Math.atan2( _vertices[q].y, _vertices[q].x );// [-pi, pi]
                // convert to coordinates in projection sphere
                let _rS : number = height + 2 * radius;
                let _thetaS : number = _thetaC;
                let _yawS : number = _yawC;
                // Transform to coordinates in sphere
                let _xS : number = Math.sin( _thetaS ) * Math.cos( _yawS );
                let _yS : number = Math.sin( _thetaS ) * Math.sin( _yawS );
                let _zS : number = Math.cos( _thetaS );
                // Extract UVs from spherical uv wrapping
                let _u, _v : number;
                _u = 0.5 + ( Math.atan2( -_zS, -_xS ) / ( 2 * Math.PI ) );
                _v = 0.5 - ( Math.asin( -_yS ) / Math.PI );

                _texCoords.push( new core.LVec2( _u, _v ) )
            }

            _geometry = new LGeometry3d( _vertices, _normals, _texCoords, _indices );

            return _geometry;
        }

        public static createPlane( width : number, depth : number ) : LGeometry3d
        {
            let _geometry : LGeometry3d = null;

            let _vertices : core.LVec3[] = [];
            let _normals : core.LVec3[] = [];
            let _texCoords : core.LVec2[] = [];
            let _indices : core.LInd3[] = [];


            let _n : core.LVec3 = new core.LVec3( 0.0, 1.0, 0.0 );
            let _s1 : core.LVec3 = new core.LVec3( 0.0, 0.0, 1.0 );
            let _s2 : core.LVec3 = new core.LVec3( 1.0, 0.0, 0.0 );

            let _scale : core.LVec3 = new core.LVec3( 0.5 * width, 0.0, 0.5 * depth );

            _indices.push( new core.LInd3( _vertices.length,
                                           _vertices.length + 1,
                                           _vertices.length + 2 ) );

            _indices.push( new core.LInd3( _vertices.length,
                                           _vertices.length + 2,
                                           _vertices.length + 3 ) );

            let _v : core.LVec3 = new core.LVec3( 0, 0, 0 );

            _v = core.LVec3.minus( core.LVec3.minus( _n, _s1 ), _s2 );
            _v.scale( _scale.x, _scale.y, _scale.z );

            _vertices.push( _v );
            _normals.push( _n );
            _texCoords.push( new core.LVec2( 0, 0 ) );

            _v = core.LVec3.plus( core.LVec3.minus( _n, _s1 ), _s2 );
            _v.scale( _scale.x, _scale.y, _scale.z );

            _vertices.push( _v );
            _normals.push( _n );
            _texCoords.push( new core.LVec2( 1, 0 ) );

            _v = core.LVec3.plus( core.LVec3.plus( _n, _s1 ), _s2 );
            _v.scale( _scale.x, _scale.y, _scale.z );

            _vertices.push( _v );
            _normals.push( _n );
            _texCoords.push( new core.LVec2( 1, 1 ) );

            _v = core.LVec3.minus( core.LVec3.plus( _n, _s1 ), _s2 );
            _v.scale( _scale.x, _scale.y, _scale.z );

            _vertices.push( _v );
            _normals.push( _n );
            _texCoords.push( new core.LVec2( 0, 1 ) );

            _geometry = new LGeometry3d( _vertices, _normals, _texCoords, _indices );

            return _geometry;
        }


        public static createFromObj( filename : string ) : LGeometry3d
        {
            let _geometry : LGeometry3d = null;

            // ifstream _fileHandle( filename );

            // if ( !_fileHandle.is_open() )
            // {
            //     cout << "LGeometryBuilder::createFromObj> couldn't open the file " << filename << endl;
            //     return NULL;
            // }

            // LObjInfo _objInfo;

            // _parseObj( _fileHandle, _objInfo );

            // _geometry = new LGeometry3d( _objInfo.vertices, _objInfo.normals, _objInfo.texCoords );
            
            return _geometry;
        }


    }

}
