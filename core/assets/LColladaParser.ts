
/// <reference path="LModelCommon.ts" />

// Just in case, this parser still needs some (lots!) of work. The .dae files I'm targetting ...
// are the kind used in ROS, from here( https://github.com/ros-industrial/kuka_experimental ) ...
// They were exported from blender, but seem to only use some of the Collada format features, which ...
// are the ones I'm implementing here.
// Collada files are nice, as can be used for general sharing between applications, but has A LOT ...
// OF FEATURES

namespace core
{
    export const BUFFER_USAGE_POSITION : string = 'POSITION';
    export const BUFFER_USAGE_VERTEX : string = 'VERTEX';
    export const BUFFER_USAGE_NORMAL : string = 'NORMAL';
    export const BUFFER_USAGE_TEXCOORD : string = 'TEXCOORD';
    export const BUFFER_USAGE_COLOR : string = 'COLOR';

    export class LColladaVertexBuffer
    {
        public size : number;
        public count : number;
        public data : Float32Array;
        public usage : string;

        constructor()
        {
            this.size = -1;
            this.count = -1;
            this.data = null;
            this.usage = '';
        }
    }

    export class LColladaIndexBuffer
    {
        public size : number;
        public count : number;
        public data : Uint16Array;

        constructor()
        {
            this.size = -1;
            this.count = -1;
            this.data = null;
        }
    }

    export class LColladaGeometry
    {
        public buffers : { [id:string] : LColladaVertexBuffer };
        public offsetInGlobalBuffer : number;

        public faces : LColladaIndexBuffer;
        public scale : number;
        public isOk : boolean;

        constructor()
        {
            this.buffers = {};
            this.offsetInGlobalBuffer = 0;

            this.faces = null;
            this.scale = 1.0;
            this.isOk = true;
        }
    }

    export enum UpAxis
    {
        X = 'X_UP',
        Y = 'Y_UP',
        Z = 'Z_UP'
    }

    export class LColladaModelProperties
    {
        public scale : number;
        public correctionMatrix : LMat4;
        public upAxis : UpAxis;

        constructor()
        {
            this.scale = 1;
            this.correctionMatrix = new LMat4();
            this.upAxis = UpAxis.Y;
        }
    }

    export class LColladaParser
    {


        constructor()
        {
            // Some sexy stuff here, pls? :D
        }

        public parseModel( rootModelElement : HTMLElement ) : LModelConstructInfo
        {
            // parse global properties ( scale and correction matrix )
            let _scale : number = 1;
            let _correctionMat : LMat4 = new LMat4();
            let _modelProperties = this._parseModelAssetProperties( rootModelElement );

            // parse geometries
            let _geometriesElm = rootModelElement.getElementsByTagName( 'library_geometries' )[0];
            let _parsedGeometries = this._parseGeometries( _geometriesElm );

            // parse materials
            // TODO: Implement this part
            let _parsedMaterials = {};// TODO: Implement materials parsing

            // build model info
            let _constructInfo = this._buildConstructionInfo( _parsedGeometries,
                                                              _parsedMaterials,
                                                              _modelProperties );

            return _constructInfo;
        }

        private _parseModelAssetProperties( rootModelElement : HTMLElement ) : LColladaModelProperties
        {
            let _modelProperties = new LColladaModelProperties();

            let _assetElm = rootModelElement.getElementsByTagName( 'asset' );
            if ( _assetElm.length < 1 )
            {
                // Just use default, as it seems there is no information to parse, notify with warn ...
                // as it should be because of the specification
                console.warn( 'LColladaParser> It seems there is no metadata information' );
            }
            else
            {
                // Units
                let _unitsElms = _assetElm[0].getElementsByTagName( 'unit' );
                if ( _unitsElms.length != 0 )
                {
                    _modelProperties.scale = parseFloat( _unitsElms[0].attributes['meter'].nodeValue );
                }

                // Up axis
                let _upaxisElms = _assetElm[0].getElementsByTagName( 'up_axis' );
                if ( _upaxisElms.length != 0 )
                {
                    _modelProperties.upAxis = <UpAxis>_upaxisElms[0].textContent;
                }
            }

            let _lvsceneElm = rootModelElement.getElementsByTagName( 'library_visual_scenes' );
            if ( _lvsceneElm.length < 1 )
            {
                // Just use default, as it seems there is no information to parse
                console.info( 'LColladaParser> It seems there is no libVisScenes information' );
            }
            else
            {
                // Correction matrix
                // TODO: For now, we are assuming only one model in the file, so there should be ...
                // just one correction matrix. Actually, for a model with lots of parts, it's common ...
                // that each part has its own transformation matrix. In our simple case of the robot files, ...
                // we only deal with a single one per model, but should definitely make a tree and associate ...
                // each correction to the corresponding part
                let _matElms = _lvsceneElm[0].getElementsByTagName( 'matrix' );
                let _matData = _matElms[0].textContent.split( ' ' ).map( Number );
                LMat4.fromBufferInPlace( _modelProperties.correctionMatrix,
                                         _matData, false );
                _modelProperties.correctionMatrix.buff[12] *= _modelProperties.scale;
                _modelProperties.correctionMatrix.buff[13] *= _modelProperties.scale;
                _modelProperties.correctionMatrix.buff[14] *= _modelProperties.scale;
            }

            return _modelProperties;
        }

        private _parseGeometries( geometriesElm : Element ) : { [id:string] : LColladaGeometry }
        {
            let _parsedGeometries : { [id:string] : LColladaGeometry } = {};

            let _geoElms = geometriesElm.children;
            
            for ( let q = 0; q < _geoElms.length; q++ )
            {
                let _id = _geoElms[q].id;
                let _colladaGeo = this._parseSingleGeometry( _geoElms[_id] );
                if ( _colladaGeo )
                {
                    _parsedGeometries[_id] = _colladaGeo;
                }
            }

            return _parsedGeometries;
        }

        private _parseSingleGeometry( geoElm : Element ) : LColladaGeometry
        {
            let _colladaGeo = new LColladaGeometry();
            let _meshElm = geoElm.getElementsByTagName( 'mesh' )[0];

            // Parse buffers' data
            this._parseBuffers( _colladaGeo, _meshElm );
            // Parse buffers' usage
            this._parseBuffersUsage( _colladaGeo, _meshElm );
            // Parse indices
            let _isGeometrySupported = this._parseFaces( _colladaGeo, _meshElm );

            if ( !_isGeometrySupported )
            {
                return null;
            }

            return _colladaGeo;
        }

        private _parseBuffers( targetGeo : LColladaGeometry, meshElm : Element ) : void
        {
            let _buffElms = meshElm.getElementsByTagName( 'source' );

            for ( let q = 0; q < _buffElms.length; q++ )
            {
                let _buffId = _buffElms[q].id;

                let _buffer = new LColladaVertexBuffer();

                // Parse data
                let _floatsElm = _buffElms[_buffId].getElementsByTagName( 'float_array' )[0];
                let _data : number[] = _floatsElm.textContent.split( ' ' ).map( Number );

                // Parse composition
                let _compositionElm = _buffElms[_buffId]
                                            .getElementsByTagName( 'technique_common' )[0]
                                            .getElementsByTagName( 'accessor' )[0];
                let _verticesCount : number = parseInt( _compositionElm.attributes['count'].nodeValue, 10 );
                let _componentCount : number = parseInt( _compositionElm.attributes['stride'].nodeValue, 10 );

                _buffer.data = new Float32Array( _data );
                _buffer.size = _verticesCount;
                _buffer.count = _componentCount;

                if ( _verticesCount * _componentCount != _data.length )
                {
                    console.warn( 'LColladaParser> buffers size mismatch: ' + 
                                  'data has different length than what composition says' );
                }

                targetGeo.buffers[_buffId] = _buffer;
            }
        }

        private _parseBuffersUsage( targetGeo : LColladaGeometry, meshElm : Element ) : void
        {
            let _usageElms = meshElm.getElementsByTagName( 'vertices' )[0].children;

            for ( let q = 0; q < _usageElms.length; q++ )
            {
                // Extract from that monstruosity what we need :/
                let _usage : string = _usageElms[q]
                                            .attributes['semantic']
                                            .nodeValue;

                let _targetBufferId : string = _usageElms[q]
                                                    .attributes['source']
                                                    .nodeValue
                                                    .replace( '#', '' );

                // Store usage in dictionary
                if ( !targetGeo.buffers[_targetBufferId] )
                {
                    console.warn( 'LColladaParser> non used semantic field' );
                    continue;
                }

                targetGeo.buffers[_targetBufferId].usage = _usage;
            }
        }

        private _parseFaces( targetGeo : LColladaGeometry, meshElm : Element ) : boolean
        {
            if ( ( meshElm.getElementsByTagName( 'triangles' ) ).length < 1 )
            {
                // As only triangles supported for now, just skip this geometry
                return false;
            }

            let _triElm = meshElm.getElementsByTagName( 'triangles' )[0];

            // Extract faces properties ( count and material related )
            let _triCount = parseInt( _triElm.attributes['count'].nodeValue, 10 );
            let _materialId = _triElm.attributes['material'].nodeValue;

            // Extract actual indices data
            let _triDataElm = _triElm.getElementsByTagName( 'p' )[0];
            let _triData : number[] = _triDataElm.textContent.split( ' ' ).map( Number );
            let _ibuffer : LColladaIndexBuffer = new LColladaIndexBuffer();

            _ibuffer.data = new Uint16Array( _triData );
            _ibuffer.size = _triCount;
            _ibuffer.count = 3;

            if ( ( _triCount * 3 ) != _triData.length )
            {
                console.warn( 'LColladaParser> faces count mismatch' );
            }

            targetGeo.faces = _ibuffer;

            return true;
        }

        private _getBufferByUsage( buffers : { [id:string] : LColladaVertexBuffer },
                                   usage : string ) : LColladaVertexBuffer
        {
            // Assumming a single buffer per usage, so retrieving first match
            let _key : string;
            for ( _key in buffers )
            {
                if ( buffers[ _key ].usage == usage )
                {
                    return buffers[ _key ];
                }
            }

            return null;
        }

        private _buildConstructionInfo( parsedGeometries : { [id:string] : LColladaGeometry },
                                        parsedMaterials : { [id:string] : any },
                                        parsedModelProperties : LColladaModelProperties ) : LModelConstructInfo
        {
            let _constructInfo = new LModelConstructInfo();

            _constructInfo.correctionMat = parsedModelProperties.correctionMatrix;

            //// For now, just build using the parsed geometries, wip: use materials info
            // Generate the global buffers for the model
            let _vertices : LVec3[] = [];
            let _normals : LVec3[] = [];
            let _texCoords : LVec2[] = [];
            let _indices : LInd3[] = [];

            let _successfullyParsedGeometry : boolean = true;

            let _key : string;
            for ( _key in parsedGeometries )
            {
                let _cGeometry = parsedGeometries[_key];

                // Collect buffers
                let _positionbuffer = this._getPositionBuffer( _cGeometry );
                let _normalBuffer = this._getNormalBuffer( _cGeometry, _positionbuffer );
                let _texCoordBuffer = this._getTexCoordBuffer( _cGeometry, _positionbuffer );

                if ( !_positionbuffer )
                {
                    _successfullyParsedGeometry = false;
                    continue;
                }

                // Update offset in total buffer, so the indices can be recalculated
                _cGeometry.offsetInGlobalBuffer = _vertices.length;

                // Append buffer to total buffers
                this._appendBufferIntoVec3Array( _positionbuffer, _vertices, parsedModelProperties.scale );
                this._appendBufferIntoVec3Array( _normalBuffer, _normals, 1 );
                this._appendBufferIntoVec2Array( _texCoordBuffer, _texCoords );
            }

            // Compensate indices with offsets in total buffer
            // TODO: Doing this separately, as not sure if faces can be associated with ...
            // buffers in a different geometry ( check again .dae format specification )
            for ( _key in parsedGeometries )
            {
                let _cGeometry = parsedGeometries[_key];
                if ( !_cGeometry.isOk )
                {
                    // If the geometry was not parsed correctly, skip these faces
                    continue;
                }

                this._compensateIndices( _cGeometry.faces,
                                         _cGeometry.offsetInGlobalBuffer );
                this._appendBufferIntoInd3Array( _cGeometry.faces,
                                                 _indices );
            }

            // Pass the data to the geometry info
            _constructInfo.geometryInfo.vertices = _vertices;
            _constructInfo.geometryInfo.normals = _normals;
            _constructInfo.geometryInfo.texCoords = _texCoords;
            _constructInfo.geometryInfo.indices = _indices;

            // Set whether or not the geometry was correctly parsed
            _constructInfo.geometryInfo.wasParsedCorrectly = _successfullyParsedGeometry;

            // TODO: build material info. For now, just let the material info by default
            /*
            */

            // Set whether or not the material was correctly parsed
            _constructInfo.materialInfo.wasParsedCorrectly = true;

            // Set whether or not the info is ready for use
            _constructInfo.wasParsedCorrectly = _constructInfo.geometryInfo.wasParsedCorrectly &&
                                                _constructInfo.materialInfo.wasParsedCorrectly;

            return _constructInfo;
        }

        private _getPositionBuffer( colladaGeo : LColladaGeometry ) : LColladaVertexBuffer
        {
            let _positionbuffer = this._getBufferByUsage( colladaGeo.buffers,
                                                          BUFFER_USAGE_POSITION );
            _positionbuffer = ( _positionbuffer == null ) ? 
                                    this._getBufferByUsage( colladaGeo.buffers,
                                                            BUFFER_USAGE_VERTEX ) :
                                    _positionbuffer;

            if ( !_positionbuffer )
            {
                console.warn( 'LColladaParser> this geometry seems to be broken: ' +
                              'no position buffer found' );
                colladaGeo.isOk = false;
            }

            return _positionbuffer;
        }

        private _getNormalBuffer( colladaGeo : LColladaGeometry,
                                  positionBuffer : LColladaVertexBuffer ) : LColladaVertexBuffer
        {
            if ( positionBuffer == null )
            {
                // There is nothing to do, as the positions could not be parsed
                return null;
            }

            let _normalBuffer = this._getBufferByUsage( colladaGeo.buffers,
                                                        BUFFER_USAGE_NORMAL );
            if ( !_normalBuffer )
            {
                console.warn( 'LColladaParser> this geometry seems to not use normals - ' +
                              'creating a default normal buffer with zeros' );
                _normalBuffer = new LColladaVertexBuffer();
                _normalBuffer.count = positionBuffer.count;
                _normalBuffer.size = positionBuffer.size;
                _normalBuffer.data = new Float32Array( positionBuffer.data.length );
            }
            else if ( _normalBuffer.count != positionBuffer.count ||
                      _normalBuffer.size != positionBuffer.size )
            {
                console.warn( 'LColladaParser> this geometry seems to have buffers of ' +
                              'different sizes ( positions.size != normals.size ) ' +
                              'creating default with zeros instead' );
                _normalBuffer = new LColladaVertexBuffer();
                _normalBuffer.count = positionBuffer.count;
                _normalBuffer.size = positionBuffer.size;
                _normalBuffer.data = new Float32Array( positionBuffer.data.length );
            }

            return _normalBuffer;
        }

        private _getTexCoordBuffer( colladaGeo : LColladaGeometry,
                                    positionBuffer : LColladaVertexBuffer ) : LColladaVertexBuffer
        {
            if ( positionBuffer == null )
            {
                // There is nothing to do, as the positions could not be parsed
                return null;
            }

            let _texCoordBuffer = this._getBufferByUsage( colladaGeo.buffers,
                                                          BUFFER_USAGE_TEXCOORD );
            if ( !_texCoordBuffer )
            {
                // Just info, as might not need texture coordinates
                console.info( 'LColladaParser> this geometry seems to not use texture coordinates - ' +
                              'creating a default texCoord buffer with zeros' );
                _texCoordBuffer = new LColladaVertexBuffer();
                _texCoordBuffer.count = 2;
                _texCoordBuffer.size = positionBuffer.size;
                _texCoordBuffer.data = new Float32Array( 2 * positionBuffer.size );
            }
            else if ( _texCoordBuffer.count != 2 ||
                      _texCoordBuffer.size != positionBuffer.size )
            {
                console.warn( 'LColladaParser> this geometry seems to have buffers of ' +
                              'different sizes ( positions.size != texCoord.size ) ' +
                              'creating default with zeros instead' );
                _texCoordBuffer = new LColladaVertexBuffer();
                _texCoordBuffer.count = 2;
                _texCoordBuffer.size = positionBuffer.size;
                _texCoordBuffer.data = new Float32Array( 2 * positionBuffer.size );
            }

            return _texCoordBuffer;
        }

        private _appendBufferIntoVec3Array( buffer : LColladaVertexBuffer,
                                            vec3Array : LVec3[],
                                            scale : number ) : boolean
        {
            if ( buffer.count != 3 )
            {
                console.warn( 'LColladaParser> this buffer cant be appended to vec3 array' );
                return false;
            }

            for ( let q = 0; q < buffer.size; q++ )
            {
                vec3Array.push( new LVec3( buffer.data[ 3 * q + 0 ] * scale,
                                           buffer.data[ 3 * q + 1 ] * scale,
                                           buffer.data[ 3 * q + 2 ] * scale ) );
            }

            return true;
        }

        private _appendBufferIntoVec2Array( buffer : LColladaVertexBuffer,
                                            vec2Array : LVec2[] ) : boolean
        {
            if ( buffer.count != 2 )
            {
                console.warn( 'LColladaParser> this buffer cant be appended to vec2 array' );
                return false;
            }

            for ( let q = 0; q < buffer.size; q++ )
            {
                vec2Array.push( new LVec2( buffer.data[ 2 * q + 0 ],
                                           buffer.data[ 2 * q + 1 ] ) );
            }

            return true;
        }

        private _compensateIndices( indexBuffer : LColladaIndexBuffer,
                                    offset : number ) : void
        {
            for ( let q = 0; q < indexBuffer.data.length; q++ )
            {
                indexBuffer.data[q] += offset;
            }
        }

        private _appendBufferIntoInd3Array( indexBuffer : LColladaIndexBuffer,
                                            ind3Array : LInd3[] ) : boolean
        {
            if ( indexBuffer.count != 3 )
            {
                console.warn( 'LColladaParser> this index buffer cant be appended to ind3 array' );
                return false;
            }

            for ( let q = 0; q < indexBuffer.size; q++ )
            {
                ind3Array.push( new LInd3( indexBuffer.data[ 3 * q + 0 ],
                                           indexBuffer.data[ 3 * q + 1 ],
                                           indexBuffer.data[ 3 * q + 2 ] ) );
            }

            return true;
        }
    }
}