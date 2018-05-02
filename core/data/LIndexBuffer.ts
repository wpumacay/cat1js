

/// <reference path="../../Globals.ts" />


namespace core
{

    export class LIndexBuffer
    {
        
        private m_bufferObj : WebGLBuffer;
        private m_count : number;

        constructor( count : number,
                     data : Uint16Array )
        {
            this.m_count = count;

            this.m_bufferObj = gl.createBuffer();

            gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.m_bufferObj );
            gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW );
        }


        public release() : void
        {
            gl.deleteBuffer( this.m_bufferObj );
            this.m_bufferObj = null;
        }

        public bind() : void
        {
            gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.m_bufferObj );
        }

        public unbind() : void
        {
            gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );
        }

        public getCount() : number
        {
            return this.m_count;
        }

    }

}