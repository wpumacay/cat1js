/// <reference path="../math/LMath.ts" />
/// <reference path="../data/LVertexBuffer.ts" />
/// <reference path="../data/LIndexBuffer.ts" />

namespace core
{
    
    export class LBaseGeometry
    {

        protected m_ibo : LIndexBuffer;
        protected m_vbos : LVertexBuffer[];

        constructor()
        {
            this.m_vbos = [];
            this.m_ibo = null;
        }

        public release() : void
        {
            if ( this.m_vbos )
            {
                for ( let q = 0; q < this.m_vbos.length; q++ )
                {
                    this.m_vbos[q].release();
                    this.m_vbos[q] = null;
                }
                this.m_vbos = null;
            }

            if ( this.m_ibo )
            {
                this.m_ibo.release();
                this.m_ibo = null;
            }
        }

        /**
        *    Creates and adds a new VBO object with the given data
        *    @method addVbo
        */
        public addVbo( componentCount : number, data : Float32Array, attribIndx : number ) : void
        {
            this.m_vbos.push( new LVertexBuffer( gl.STATIC_DRAW, componentCount, data, attribIndx ) );
        }

        /**
        *    Create a new IBO object with the given properties
        *    @method setIbo
        */
        public setIbo( indicesCount : number, data : Uint16Array ) : void
        {
            this.m_ibo = new LIndexBuffer( indicesCount, data );
        }

        /**
        *    Get number of indices in IBO buffer
        *    @method getIndexCount
        */
        public getIndexCount() : number
        {
            return this.m_ibo.getCount();
        }

        /**
        *    Bind all data in this geometry
        *    @method bind
        */
        public bind() : void
        {
            let i : number;
            for ( i = 0; i < this.m_vbos.length; i++ )
            {
                this.m_vbos[i].bind();
            }

            this.m_ibo.bind();
        }

        /**
        *    Unbind all data in this geometry
        *    @method unbind
        */
        public unbind() : void
        {
            this.m_ibo.unbind();

            let i : number;
            for ( i = 0; i < this.m_vbos.length; i++ )
            {
                this.m_vbos[i].unbind();
            }
        }

    }
    
}
