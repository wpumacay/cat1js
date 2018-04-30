
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

    }


    export class LInd3
    {
        public buff : Uint16Array;

        constructor( i1 : number, i2 : number, i3 : number )
        {
            this.buff = new Uint16Array( 3 );
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

}

