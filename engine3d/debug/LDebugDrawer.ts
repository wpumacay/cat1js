

/// <reference path="../../core/math/LMath.ts" />
/// <reference path="../../core/data/LVertexBuffer.ts" />
/// <reference path="../../core/assets/LAssetsManager.ts" />


namespace engine3d
{


    class LDLinePositions
    {
        public vStart : core.LVec3;
        public vEnd : core.LVec3;

        constructor()
        {
            this.vStart = new core.LVec3( 0, 0, 0 );
            this.vEnd = new core.LVec3( 0, 0, 0 );
        }

        public static linesToBuffer( lines : LDLinePositions[], numActiveLines : number ) : Float32Array
        {
            let _res : Float32Array = new Float32Array( numActiveLines * 2 * 3 );

            let q : number;
            for ( q = 0; q < lines.length; q++ )
            {
                if ( q >= numActiveLines )
                {
                    break;
                }

                _res[ 6 * q + 0 ] = lines[q].vStart.x;
                _res[ 6 * q + 1 ] = lines[q].vStart.y;
                _res[ 6 * q + 2 ] = lines[q].vStart.z;

                _res[ 6 * q + 3 ] = lines[q].vEnd.x;
                _res[ 6 * q + 4 ] = lines[q].vEnd.y;
                _res[ 6 * q + 5 ] = lines[q].vEnd.z;
            }

            return _res;
        }
    };

    class LDLineColors
    {
        public cStart : core.LVec3;
        public cEnd : core.LVec3;

        constructor()
        {
            this.cStart = new core.LVec3( 0, 0, 0 );
            this.cEnd = new core.LVec3( 0, 0, 0 );
        }

        public static linesToBuffer( lines : LDLineColors[], numActiveLines : number ) : Float32Array
        {
            let _res : Float32Array = new Float32Array( numActiveLines * 2 * 3 );

            let q : number;
            for ( q = 0; q < lines.length; q++ )
            {
                if ( q >= numActiveLines )
                {
                    break;
                }

                _res[ 6 * q + 0 ] = lines[q].cStart.x;
                _res[ 6 * q + 1 ] = lines[q].cStart.y;
                _res[ 6 * q + 2 ] = lines[q].cStart.z;

                _res[ 6 * q + 3 ] = lines[q].cEnd.x;
                _res[ 6 * q + 4 ] = lines[q].cEnd.y;
                _res[ 6 * q + 5 ] = lines[q].cEnd.z;
            }

            return _res;
        }
    };

    const MAX_LINES_PER_BATCH : number = 1024;

    export class LDebugDrawer
    {

        public static INSTANCE : LDebugDrawer = null;

        // Temp variables when rendering a fixed-size batch
        private m_linesRenderBufferPositions : LDLinePositions[];
        private m_linesRenderBufferColors : LDLineColors[];
        // Actual place to store the lines user data
        private m_linesPositions : LDLinePositions[];
        private m_linesColors : LDLineColors[];

        // VBOs to use for rendering - streamDraw usage
        private m_linesPositionsVBO : core.LVertexBuffer;
        private m_linesColorsVBO : core.LVertexBuffer;

        private m_shaderLinesRef : LShaderDebugDrawer3d;

        private m_viewMat : core.LMat4;
        private m_projMat : core.LMat4;

        constructor()
        {
            this.m_shaderLinesRef = <LShaderDebugDrawer3d> core.LAssetsManager.INSTANCE.getShader( 'debugDrawer3d' );

            this.m_linesPositions = [];
            this.m_linesColors = [];

            this.m_linesRenderBufferPositions = [];
            this.m_linesRenderBufferColors = [];

            let q : number;
            for ( q = 0; q < MAX_LINES_PER_BATCH; q++ )
            {
                this.m_linesRenderBufferPositions.push( new LDLinePositions() );
                this.m_linesRenderBufferColors.push( new LDLineColors() );
            }

            this.m_linesPositionsVBO = new core.LVertexBuffer( gl.STREAM_DRAW, 3, new Float32Array( MAX_LINES_PER_BATCH * 2 * 3 ), 0 );
            this.m_linesColorsVBO = new core.LVertexBuffer( gl.STREAM_DRAW, 3, new Float32Array( MAX_LINES_PER_BATCH * 2 * 3 ), 1 );

            this.m_viewMat = null;
            this.m_projMat = null;
        }

        public static create() : LDebugDrawer
        {
            if ( !LDebugDrawer.INSTANCE )
            {
                LDebugDrawer.INSTANCE = new LDebugDrawer();
            }

            return LDebugDrawer.INSTANCE;
        }

        public static release() : void
        {
            LDebugDrawer.INSTANCE = null;
        }

        public drawLine( start : core.LVec3, end : core.LVec3, color : core.LVec3 ) : void
        {
            let _linePos : LDLinePositions = new LDLinePositions();
            _linePos.vStart = start;
            _linePos.vEnd = end;

            this.m_linesPositions.push( _linePos );

            let _lineCol : LDLineColors = new LDLineColors();
            _lineCol.cStart = color;
            _lineCol.cEnd = color;

            this.m_linesColors.push( _lineCol );
        }

        public drawArrow( start : core.LVec3, end : core.LVec3, color : core.LVec3 ) : void
        {
            this.drawLine( start, end, color );

            let _arrowVec : core.LVec3 = core.LVec3.minus( end, start );
            let _length : number = _arrowVec.length();

            let _uf : core.LVec3 = core.LVec3.normalize( _arrowVec );
            let _ur : core.LVec3 = core.LVec3.cross( _uf, core.WORLD_UP );
            let _uu : core.LVec3 = core.LVec3.cross( _ur, _uf );

            let _sidesLength : number = _length / 10.0;

            _uf.scale( _sidesLength, _sidesLength, _sidesLength );
            _ur.scale( _sidesLength, _sidesLength, _sidesLength );
            _uu.scale( _sidesLength, _sidesLength, _sidesLength );

            let _p0 : core.LVec3 = core.LVec3.plus( core.LVec3.minus( end, _uf ), _ur );
            let _p1 : core.LVec3 = core.LVec3.plus( core.LVec3.minus( end, _uf ), _uu );
            let _p2 : core.LVec3 = core.LVec3.minus( core.LVec3.minus( end, _uf ), _ur );
            let _p3 : core.LVec3 = core.LVec3.minus( core.LVec3.minus( end, _uf ), _uu );

            this.drawLine( end, _p0, color );
            this.drawLine( end, _p1, color );
            this.drawLine( end, _p2, color );
            this.drawLine( end, _p3, color );
        }

        public drawFrame( frameMat : core.LMat4, axisSize : number ) : void
        {
            let _fPos : core.LVec3 = new core.LVec3( 0, 0, 0 );
            let _fx : core.LVec3 = new core.LVec3( 0, 0, 0 );
            let _fy : core.LVec3 = new core.LVec3( 0, 0, 0 );
            let _fz : core.LVec3 = new core.LVec3( 0, 0, 0 );

            _fPos.x = frameMat.buff[12];
            _fPos.y = frameMat.buff[13];
            _fPos.z = frameMat.buff[14];

            _fx.x = frameMat.buff[0] * axisSize;
            _fx.y = frameMat.buff[1] * axisSize;
            _fx.z = frameMat.buff[2] * axisSize;

            _fy.x = frameMat.buff[4] * axisSize;
            _fy.y = frameMat.buff[5] * axisSize;
            _fy.z = frameMat.buff[6] * axisSize;

            _fz.x = frameMat.buff[8] * axisSize;
            _fz.y = frameMat.buff[9] * axisSize;
            _fz.z = frameMat.buff[10] * axisSize;

            this.drawLine( _fPos, core.LVec3.plus( _fPos, _fx ), core.RED );
            this.drawLine( _fPos, core.LVec3.plus( _fPos, _fy ), core.GREEN );
            this.drawLine( _fPos, core.LVec3.plus( _fPos, _fz ), core.BLUE );
        }

        public setupMatrices( viewMatrix : core.LMat4, projMatrix : core.LMat4 ) : void
        {
            this.m_viewMat = viewMatrix;
            this.m_projMat = projMatrix;
        }

        public render() : void
        {
            if ( this.m_viewMat == null ||
                 this.m_projMat == null )
            {
                return;
            }

            this._renderLines();
        }

        private _renderLines() : void
        {
            let q : number;
            for ( q = 0; q < this.m_linesPositions.length; q++ )
            {
                this.m_linesRenderBufferPositions[ q % MAX_LINES_PER_BATCH ] = this.m_linesPositions[q];
                this.m_linesRenderBufferColors[ q % MAX_LINES_PER_BATCH ] = this.m_linesColors[q];

                if ( ( q + 1 ) % MAX_LINES_PER_BATCH == 0 )
                {
                    this._renderLinesBatch( MAX_LINES_PER_BATCH );
                }
            }

            let _numRemainingLines : number = this.m_linesPositions.length % MAX_LINES_PER_BATCH;

            if ( _numRemainingLines != 0 )
            {
                this._renderLinesBatch( _numRemainingLines );
            }

            // Clean up
            this.m_linesPositions = [];
            this.m_linesColors = [];
        }

        private _renderLinesBatch( countLines : number ) : void
        {
            this.m_linesPositionsVBO.updateData( LDLinePositions.linesToBuffer( this.m_linesRenderBufferPositions, countLines ) );
            this.m_linesColorsVBO.updateData( LDLineColors.linesToBuffer( this.m_linesRenderBufferColors, countLines ) );

            this.m_shaderLinesRef.bind();
            this.m_shaderLinesRef.setMatView( this.m_viewMat );
            this.m_shaderLinesRef.setMatProj( this.m_projMat );

            this.m_linesPositionsVBO.bind();
            this.m_linesColorsVBO.bind();

            gl.drawArrays( gl.LINES, 0, countLines * 2 );

            this.m_linesPositionsVBO.unbind();
            this.m_linesColorsVBO.unbind();

            this.m_shaderLinesRef.unbind();
        }



    }



}