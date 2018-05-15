
namespace core
{

    export class LVec2
    {
        public x : number;
        public y : number;

        constructor( x : number, y : number )
        {
            this.x = x;
            this.y = y;
        }

        public static arrayToBuffer( arrayOfVec2 : LVec2[] ) : Float32Array
        {
            let _totalBuff : Float32Array = new Float32Array( arrayOfVec2.length * 2 );

            let q : number;
            for ( q = 0; q < arrayOfVec2.length; q++ )
            {
                _totalBuff[ q * 2 + 0 ] = arrayOfVec2[q].x;
                _totalBuff[ q * 2 + 1 ] = arrayOfVec2[q].y;
            }

            return _totalBuff;
        }
    }

    export class LVec3
    {

        public x : number;
        public y : number;
        public z : number;

        constructor( x : number, y : number, z : number )
        {
            this.x = x;
            this.y = y;
            this.z = z;
        }


        public add( other : LVec3 ) : void
        {
            this.x += other.x;
            this.y += other.y;
            this.z += other.z;
        }

        public subs( other : LVec3 ) : void
        {
            this.x -= other.x;
            this.y -= other.y;
            this.z -= other.z;
        }

        public scale( sx : number, sy : number, sz : number ) : void
        {
            this.x *= sx;
            this.y *= sy;
            this.z *= sz;
        }

        public length() : number
        {
            return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
        }

        /* static methods ******************************/

        public static copy( outVec : LVec3, inVec : LVec3 ) : void
        {
            outVec.x = inVec.x;
            outVec.y = inVec.y;
            outVec.z = inVec.z;
        }

        public static plus( v1 : LVec3, v2 : LVec3 ) : LVec3
        {
            let _res : LVec3 = new LVec3( 0, 0, 0 );

            _res.x = v1.x + v2.x;
            _res.y = v1.y + v2.y;
            _res.z = v1.z + v2.z;

            return _res;
        }

        public static minus( v1 : LVec3, v2 : LVec3 ) : LVec3
        {
            let _res : LVec3 = new LVec3( 0, 0, 0 );

            _res.x = v1.x - v2.x;
            _res.y = v1.y - v2.y;
            _res.z = v1.z - v2.z;

            return _res;        
        }

        public static dot( v1 : LVec3, v2 : LVec3 ) : number
        {
            return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
        }

        public static cross( v1 : LVec3, v2 : LVec3 ) : LVec3
        {
            let _res : LVec3 = new LVec3( 0, 0, 0 );

            _res.x = v1.y * v2.z - v2.y * v1.z;
            _res.y = -v1.x * v2.z + v2.x * v1.z;
            _res.z = v1.x * v2.y - v2.x * v1.y;

            return _res;
        }

        public static normalize( v : LVec3 ) : LVec3
        {
            let _len : number = v.length();

            let _v : LVec3 = new LVec3( v.x, v.y, v.z );

            _v.x = _v.x / _len;
            _v.y = _v.y / _len;
            _v.z = _v.z / _len;

            return _v;
        }

        public static flip( v : LVec3 ) : LVec3
        {
            return new LVec3( -v.x, -v.y, -v.z );;
        }

        public static arrayToBuffer( arrayOfVec3 : Array< LVec3 > ) : Float32Array
        {
            let _totalBuff : Float32Array = new Float32Array( arrayOfVec3.length * 3 );

            let q : number;
            for ( q = 0; q < arrayOfVec3.length; q++ )
            {
                _totalBuff[ q * 3 + 0 ] = arrayOfVec3[q].x;
                _totalBuff[ q * 3 + 1 ] = arrayOfVec3[q].y;
                _totalBuff[ q * 3 + 2 ] = arrayOfVec3[q].z;
            }

            return _totalBuff;
        }

    }

    export class LVec4
    {
        public x : number;
        public y : number;
        public z : number;
        public w : number;

        constructor( x : number, y : number, z : number, w : number )
        {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }   
    }


    export class LMat4
    {

        public buff : Float32Array;

        constructor()
        {
            this.buff = new Float32Array( 16 );

            this.buff[0]  = 1; this.buff[1]  = 0; this.buff[2]  = 0; this.buff[3]  = 0;
            this.buff[4]  = 0; this.buff[5]  = 1; this.buff[6]  = 0; this.buff[7]  = 0;
            this.buff[8]  = 0; this.buff[9]  = 0; this.buff[10] = 1; this.buff[11] = 0;
            this.buff[12] = 0; this.buff[13] = 0; this.buff[14] = 0; this.buff[15] = 1;
        }

        public set( row : number, col : number, val : number ) : void
        {
            this.buff[col + row * 4] = val;
        }

        public get( row : number, col : number ) : number
        {
            return this.buff[col + row * 4];
        }

        public static dot( mat1 : LMat4, mat2 : LMat4 ) : LMat4
        {
            let _res : LMat4 = new LMat4();

            let i : number;
            let j : number;
            let c : number;

            for ( i = 0; i < 4; i++ )
            {
                for ( j = 0; j < 4; j++ )
                {
                    for ( c = 0; c < 4; c++ )
                    {
                        _res.set( i, j, 
                                  _res.get( i, j ) + mat1.get( i, c ) * mat2.get( c, j ) );
                    }
                }
            }

            return _res;
        }

        public static translation( t : LVec3 ) : LMat4
        {
            let _res : LMat4 = new LMat4();

            _res.buff[12] = t.x;
            _res.buff[13] = t.y;
            _res.buff[14] = t.z;

            return _res;
        }

        public static rotationX( ang : number ) : LMat4
        {
            let _res : LMat4 = new LMat4();

            let _c : number = Math.cos( ang );
            let _s : number = Math.sin( ang );

            _res.buff[0] = 1; _res.buff[4] =  0; _res.buff[8]  = 0;
            _res.buff[1] = 0; _res.buff[5] = _c; _res.buff[9]  = -_s;
            _res.buff[2] = 0; _res.buff[6] = _s; _res.buff[10] = _c;

            return _res;
        }

        public static rotationY( ang : number ) : LMat4
        {
            let _res : LMat4 = new LMat4();

            let _c : number = Math.cos( ang );
            let _s : number = Math.sin( ang );

            _res.buff[0] = _c;  _res.buff[4] = 0; _res.buff[8]  = _s;
            _res.buff[1] =  0;  _res.buff[5] = 1; _res.buff[9]  =  0;
            _res.buff[2] = -_s; _res.buff[6] = 0; _res.buff[10] = _c;

            return _res;
        }

        public static rotationZ( ang : number ) : LMat4
        {
            let _res : LMat4 = new LMat4();

            let _c : number = Math.cos( ang );
            let _s : number = Math.sin( ang );

            _res.buff[0] = _c; _res.buff[4] = -_s; _res.buff[8]  = 0;
            _res.buff[1] = _s; _res.buff[5] = _c;  _res.buff[9]  = 0;
            _res.buff[2] =  0; _res.buff[6] =  0;  _res.buff[10] = 1;

            return _res;
        }

        public static scale( sx : number, sy : number, sz : number ) : LMat4
        {
            let _res : LMat4 = new LMat4();

            _res.buff[0] = sx; _res.buff[4] =  0;  _res.buff[8]  =  0;
            _res.buff[1] =  0; _res.buff[5] = sy;  _res.buff[9]  =  0;
            _res.buff[2] =  0; _res.buff[6] =  0;  _res.buff[10] = sz;

            return _res;
        }

        public static perspective( fov : number, aspect : number, zNear : number, zFar : number ) : LMat4
        {
            let _res : LMat4 = new LMat4();

            let _ht : number = Math.tan( ( fov / 2 ) * ( Math.PI / 180 ) );

            _res.buff[0] = 1 / ( _ht * aspect )  ; _res.buff[4] =    0      ; _res.buff[8]  =                   0                      ; _res.buff[12] =  0;
            _res.buff[1] =          0            ; _res.buff[5] = 1 / _ht   ; _res.buff[9]  =                   0                      ; _res.buff[13] =  0;
            _res.buff[2] =          0            ; _res.buff[6] =    0      ; _res.buff[10] = -( zFar + zNear ) / ( zFar - zNear )     ; _res.buff[14] = -2 * ( zFar * zNear ) / ( zFar - zNear );
            _res.buff[3] =          0            ; _res.buff[7] =    0      ; _res.buff[11] =                  -1                      ; _res.buff[15] =  0;        

            return _res;
        }

        public static ortho( width : number, height : number, zNear : number, zFar : number ) : LMat4
        {
            let _res : LMat4 = new LMat4();

            _res.buff[0] =  1 / ( width / 2 )   ; _res.buff[4] =       0            ; _res.buff[8]  =         0             ; _res.buff[12] = 0;
            _res.buff[1] =        0             ; _res.buff[5] = 1 / ( height / 2 ) ; _res.buff[9]  =         0             ; _res.buff[13] = 0;
            _res.buff[2] =        0             ; _res.buff[6] =       0            ; _res.buff[10] = -2 / ( zFar - zNear ) ; _res.buff[14] = -( zFar + zNear ) / ( zFar - zNear );
            _res.buff[3] =        0             ; _res.buff[7] =       0            ; _res.buff[11] =         0             ; _res.buff[15] =  1;        

            return _res;
        }

        public static fromEuler( euler : LVec3 ) : LMat4
        {
            let _res : LMat4 = new LMat4();

            let _c1, _c2, _c3 : number = 0.0;
            let _s1, _s2, _s3 : number = 0.0;

            _c1 = Math.cos( euler.z );
            _s1 = Math.sin( euler.z );

            _c2 = Math.cos( euler.y );
            _s2 = Math.sin( euler.y );

            _c3 = Math.cos( euler.x );
            _s3 = Math.sin( euler.x );

            _res.buff[0] = _c1 * _c2;
            _res.buff[1] = _c2 * _s1;
            _res.buff[2] = -_s2;
            _res.buff[3] = 0;

            _res.buff[4] = _c1 * _s2 * _s3 - _c3 * _s1;
            _res.buff[5] = _c1 * _c3 + _s1 * _s2 * _s3;
            _res.buff[6] = _c2 * _s3;
            _res.buff[7] = 0;

            _res.buff[8]  = _s1 * _s3 + _c1 * _c3 * _s2;
            _res.buff[9]  = _c3 * _s1 * _s2 - _c1 * _s3;
            _res.buff[10] = _c2 * _c3;
            _res.buff[11] = 0;

            return _res;
        }

        public static fromEulerInPlace( outMat : LMat4, euler : LVec3 ) : void
        {
            let _c1, _c2, _c3 : number = 0.0;
            let _s1, _s2, _s3 : number = 0.0;

            _c1 = Math.cos( euler.z );
            _s1 = Math.sin( euler.z );

            _c2 = Math.cos( euler.y );
            _s2 = Math.sin( euler.y );

            _c3 = Math.cos( euler.x );
            _s3 = Math.sin( euler.x );

            outMat.buff[0] = _c1 * _c2;
            outMat.buff[1] = _c2 * _s1;
            outMat.buff[2] = -_s2;
            outMat.buff[3] = 0;

            outMat.buff[4] = _c1 * _s2 * _s3 - _c3 * _s1;
            outMat.buff[5] = _c1 * _c3 + _s1 * _s2 * _s3;
            outMat.buff[6] = _c2 * _s3;
            outMat.buff[7] = 0;

            outMat.buff[8]  = _s1 * _s3 + _c1 * _c3 * _s2;
            outMat.buff[9]  = _c3 * _s1 * _s2 - _c1 * _s3;
            outMat.buff[10] = _c2 * _c3;
            outMat.buff[11] = 0;
        }

        public static fromPosEuler( pos : LVec3, euler : LVec3 ) : LMat4
        {
            let _res : LMat4 = new LMat4();

            let _c1, _c2, _c3 : number = 0.0;
            let _s1, _s2, _s3 : number = 0.0;

            _c1 = Math.cos( euler.z );
            _s1 = Math.sin( euler.z );

            _c2 = Math.cos( euler.y );
            _s2 = Math.sin( euler.y );

            _c3 = Math.cos( euler.x );
            _s3 = Math.sin( euler.x );

            _res.buff[0] = _c1 * _c2;
            _res.buff[1] = _c2 * _s1;
            _res.buff[2] = -_s2;
            _res.buff[3] = 0;

            _res.buff[4] = _c1 * _s2 * _s3 - _c3 * _s1;
            _res.buff[5] = _c1 * _c3 + _s1 * _s2 * _s3;
            _res.buff[6] = _c2 * _s3;
            _res.buff[7] = 0;

            _res.buff[8]  = _s1 * _s3 + _c1 * _c3 * _s2;
            _res.buff[9]  = _c3 * _s1 * _s2 - _c1 * _s3;
            _res.buff[10] = _c2 * _c3;
            _res.buff[11] = 0;

            _res.buff[12] = pos.x;
            _res.buff[13] = pos.y;
            _res.buff[14] = pos.z;
            _res.buff[15] = 1;

            return _res;
        }

        public static fromPosEulerInPlace( outMat : LMat4, pos : LVec3, euler : LVec3 ) : void
        {
            let _c1, _c2, _c3 : number = 0.0;
            let _s1, _s2, _s3 : number = 0.0;

            _c1 = Math.cos( euler.z );
            _s1 = Math.sin( euler.z );

            _c2 = Math.cos( euler.y );
            _s2 = Math.sin( euler.y );

            _c3 = Math.cos( euler.x );
            _s3 = Math.sin( euler.x );

            outMat.buff[0] = _c1 * _c2;
            outMat.buff[1] = _c2 * _s1;
            outMat.buff[2] = -_s2;
            outMat.buff[3] = 0;

            outMat.buff[4] = _c1 * _s2 * _s3 - _c3 * _s1;
            outMat.buff[5] = _c1 * _c3 + _s1 * _s2 * _s3;
            outMat.buff[6] = _c2 * _s3;
            outMat.buff[7] = 0;

            outMat.buff[8]  = _s1 * _s3 + _c1 * _c3 * _s2;
            outMat.buff[9]  = _c3 * _s1 * _s2 - _c1 * _s3;
            outMat.buff[10] = _c2 * _c3;
            outMat.buff[11] = 0;

            outMat.buff[12] = pos.x;
            outMat.buff[13] = pos.y;
            outMat.buff[14] = pos.z;
            outMat.buff[15] = 1;
        }

        public static fromPosRotMat( pos : LVec3, rotMat : LMat4 ) : LMat4
        {
            let _res : LMat4 = new LMat4();

            _res.buff[0] = rotMat[0];
            _res.buff[1] = rotMat[1];
            _res.buff[2] = rotMat[2];
            _res.buff[3] = 0;

            _res.buff[4] = rotMat[4];
            _res.buff[5] = rotMat[5];
            _res.buff[6] = rotMat[6];
            _res.buff[7] = 0;

            _res.buff[8]  = rotMat[8];
            _res.buff[9]  = rotMat[9];
            _res.buff[10] = rotMat[10];
            _res.buff[11] = 0;

            _res.buff[12] = pos.x;
            _res.buff[13] = pos.y;
            _res.buff[14] = pos.z;
            _res.buff[15] = 1;

            return _res;
        }

        public static fromPosRotMatInPlace( outMat : LMat4, pos : LVec3, rotMat : LMat4 ) : void
        {
            outMat.buff[0] = rotMat[0];
            outMat.buff[1] = rotMat[1];
            outMat.buff[2] = rotMat[2];
            outMat.buff[3] = 0;

            outMat.buff[4] = rotMat[4];
            outMat.buff[5] = rotMat[5];
            outMat.buff[6] = rotMat[6];
            outMat.buff[7] = 0;

            outMat.buff[8]  = rotMat[8];
            outMat.buff[9]  = rotMat[9];
            outMat.buff[10] = rotMat[10];
            outMat.buff[11] = 0;

            outMat.buff[12] = pos.x;
            outMat.buff[13] = pos.y;
            outMat.buff[14] = pos.z;
            outMat.buff[15] = 1;
        }

        public static fromPosRotScale( pos : LVec3, rotMat : LMat4, scale : LVec3 ) : LMat4
        {
            let _res : LMat4 = new LMat4();

            _res.buff[0] = scale.x * rotMat[0];
            _res.buff[1] = scale.x * rotMat[1];
            _res.buff[2] = scale.x * rotMat[2];
            _res.buff[3] = 0;

            _res.buff[4] = scale.y * rotMat[4];
            _res.buff[5] = scale.y * rotMat[5];
            _res.buff[6] = scale.y * rotMat[6];
            _res.buff[7] = 0;

            _res.buff[8]  = scale.z * rotMat[8];
            _res.buff[9]  = scale.z * rotMat[9];
            _res.buff[10] = scale.z * rotMat[10];
            _res.buff[11] = 0;

            _res.buff[12] = pos.x;
            _res.buff[13] = pos.y;
            _res.buff[14] = pos.z;
            _res.buff[15] = 1;

            return _res;
        }        

        public static fromPosRotScaleInPlace( outMat : LMat4, pos : LVec3, rotMat : LMat4, scale : LVec3 ) : void
        {
            outMat.buff[0] = scale.x * rotMat[0];
            outMat.buff[1] = scale.x * rotMat[1];
            outMat.buff[2] = scale.x * rotMat[2];
            outMat.buff[3] = 0;

            outMat.buff[4] = scale.y * rotMat[4];
            outMat.buff[5] = scale.y * rotMat[5];
            outMat.buff[6] = scale.y * rotMat[6];
            outMat.buff[7] = 0;

            outMat.buff[8]  = scale.z * rotMat[8];
            outMat.buff[9]  = scale.z * rotMat[9];
            outMat.buff[10] = scale.z * rotMat[10];
            outMat.buff[11] = 0;

            outMat.buff[12] = pos.x;
            outMat.buff[13] = pos.y;
            outMat.buff[14] = pos.z;
            outMat.buff[15] = 1;
        }

        public static extractColumn( mat : LMat4, columnIndx : number ) : LVec3
        {
            let _res : LVec3 = new LVec3( 0, 0, 0 );

            if ( columnIndx < 0 || columnIndx > 3 )
            {
                console.warn( 'LMat4> trying to extract column ' +
                              columnIndx + ' which is out of range' );
                return _res;
            }

            let q : number;

            for ( q = 0; q < 3; q++ )
            {
                _res.x = mat.buff[ 4 * q + 0 ];
                _res.y = mat.buff[ 4 * q + 1 ];
                _res.z = mat.buff[ 4 * q + 2 ];
            }

            return _res;
        }

        public static extractColumnInPlace( outVec : LVec3, mat : LMat4, columnIndx : number ) : void
        {
            if ( columnIndx < 0 || columnIndx > 3 )
            {
                console.warn( 'LMat4> trying to extract column ' +
                              columnIndx + ' which is out of range' );
                return;
            }

            let q : number;

            for ( q = 0; q < 3; q++ )
            {
                outVec.x = mat.buff[ 4 * q + 0 ];
                outVec.y = mat.buff[ 4 * q + 1 ];
                outVec.z = mat.buff[ 4 * q + 2 ];
            }
        }

        /*
        * extract euler angles from rotation matrix, asumming ...
        * tiat bryan angles and zyx extrinsic convention
        * TODO: Check cases for y angle, as we may be throwing away ...
        * the sign in the sqrt calculation
        */
        public static extractEulerFromRotation( mat : LMat4 ) : LVec3
        {
            let _res : LVec3 = new LVec3( 0, 0, 0 );

            let _r11 : number = mat.get( 0, 0 );
            let _r21 : number = mat.get( 1, 0 );
            let _r31 : number = mat.get( 2, 0 );
            let _r32 : number = mat.get( 2, 1 );
            let _r33 : number = mat.get( 2, 2 );

            _res.x = Math.atan2( _r32, _r33 );
            _res.y = Math.atan2( -_r31, Math.sqrt( _r11 * _r11 + _r21 * _r21 ) );
            _res.z = Math.atan2( _r21, _r11 );

            return _res;
        }

        public static extractEulerFromRotationInPlace( outVec : LVec3, mat : LMat4 ) : void
        {
            let _r11 : number = mat.get( 0, 0 );
            let _r21 : number = mat.get( 1, 0 );
            let _r31 : number = mat.get( 2, 0 );
            let _r32 : number = mat.get( 2, 1 );
            let _r33 : number = mat.get( 2, 2 );

            outVec.x = Math.atan2( _r32, _r33 );
            outVec.y = Math.atan2( -_r31, Math.sqrt( _r11 * _r11 + _r21 * _r21 ) );
            outVec.z = Math.atan2( _r21, _r11 );
        }

        public static extractRotation( inMat : LMat4 ) : LMat4
        {
            let _res : LMat4 = new LMat4();

            _res.buff[0] = inMat.buff[0];
            _res.buff[1] = inMat.buff[1];
            _res.buff[2] = inMat.buff[2];

            _res.buff[4] = inMat.buff[4];
            _res.buff[5] = inMat.buff[5];
            _res.buff[6] = inMat.buff[6];

            _res.buff[8] = inMat.buff[8];
            _res.buff[9] = inMat.buff[9];
            _res.buff[10] = inMat.buff[10];

            return _res;
        }

        public static extractRotationInPlace( outMat : LMat4, inMat : LMat4 ) : void
        {
            outMat.buff[0] = inMat.buff[0];
            outMat.buff[1] = inMat.buff[1];
            outMat.buff[2] = inMat.buff[2];

            outMat.buff[4] = inMat.buff[4];
            outMat.buff[5] = inMat.buff[5];
            outMat.buff[6] = inMat.buff[6];

            outMat.buff[8] = inMat.buff[8];
            outMat.buff[9] = inMat.buff[9];
            outMat.buff[10] = inMat.buff[10];
        }
    }

    function mulMatVec44( mat : LMat4, vec : LVec4 ) : LVec4
    {
        let _res : LVec4 = new LVec4( 0, 0, 0, 0 );



        return _res;
    }

    function mulMatMat44( mat1 : LMat4, mat2 : LMat4 ) : LMat4
    {
        let _res : LMat4 = new LMat4();

        

        return _res;
    }

    export class LInd3
    {
        public buff : Uint16Array;

        constructor( i1 : number, i2 : number, i3 : number )
        {
            this.buff = new Uint16Array( 3 );
            
            this.buff[0] = i1;
            this.buff[1] = i2;
            this.buff[2] = i3;
        }

        public static arrayToBuffer( arrayOfInd3 : Array< LInd3 > ) : Uint16Array
        {
            let _totalBuff : Uint16Array = new Uint16Array( arrayOfInd3.length * 3 );

            let q : number;
            for ( q = 0; q < arrayOfInd3.length; q++ )
            {
                _totalBuff[ q * 3 + 0 ] = arrayOfInd3[q].buff[0];
                _totalBuff[ q * 3 + 1 ] = arrayOfInd3[q].buff[1];
                _totalBuff[ q * 3 + 2 ] = arrayOfInd3[q].buff[2];
            }

            return _totalBuff;
        }
    }



    export const WORLD_UP : LVec3 = new LVec3( 0, 0, 0 );

    export const AXIS_X : LVec3 = new LVec3( 1, 0, 0 );
    export const AXIS_Y : LVec3 = new LVec3( 0, 1, 0 );
    export const AXIS_Z : LVec3 = new LVec3( 0, 0, 1 );

    export const AXIS_NEG_X : LVec3 = new LVec3( -1, 0, 0 );
    export const AXIS_NEG_Y : LVec3 = new LVec3( 0, -1, 0 );
    export const AXIS_NEG_Z : LVec3 = new LVec3( 0, 0, -1 );

    export const RED : LVec3 = new LVec3( 1, 0, 0 );
    export const GREEN : LVec3 = new LVec3( 0, 1, 0 );
    export const BLUE : LVec3 = new LVec3( 0, 0, 1 );

    export const DEFAULT_AMBIENT : LVec3 = new LVec3( 0.1, 0.1, 0.1 );
    export const DEFAULT_DIFFUSE : LVec3 = new LVec3( 0.1, 0.1, 0.1 );
    export const DEFAULT_SPECULAR : LVec3 = new LVec3( 0.1, 0.1, 0.1 );
    export const DEFAULT_SHININESS : number = 32.0;

    export const ORIGIN : LVec3 = new LVec3( 0, 0, 0 );
}

