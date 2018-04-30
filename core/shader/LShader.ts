/// <reference path="../math/LMath.ts" />
/// <reference path="../../Globals.ts" />


namespace core
{

    export class LShader
    {

        protected m_obj : WebGLProgram;

        constructor( obj : WebGLProgram )
        {
            this.m_obj = obj;
        }

        public setObj( obj : WebGLProgram ) : void
        {
            this.m_obj = obj;
        }

        public getObj() : WebGLProgram
        {
            return this.m_obj;
        }

        public release() : void
        {
            gl.deleteProgram( this.m_obj );
        }

        public bind() : void
        {
            gl.useProgram( this.m_obj );
        }

        public unbind() : void
        {
            gl.useProgram( null );
        }

        public setInt( uName : string, val : number )
        {
            gl.uniform1i( gl.getUniformLocation( this.m_obj, uName ), val );
        }

        public setFloat( uName : string, val : number )
        {
            gl.uniform1f( gl.getUniformLocation( this.m_obj, uName ), val );
        }

        public setVec2( uName : string, v : LVec2 ) : void
        {
            gl.uniform2f( gl.getUniformLocation( this.m_obj, uName ), v.x, v.y );
        }

        public setVec3( uName : string, v : LVec3 ) : void
        {
            gl.uniform3f( gl.getUniformLocation( this.m_obj, uName ), v.x, v.y, v.z );
        }

        public setVec4( uName : string, v : LVec4 ) : void
        {
            gl.uniform4f( gl.getUniformLocation( this.m_obj, uName ), v.x, v.y, v.z, v.w );
        }

        public setMat4( uName : string, mat : LMat4 ) : void
        {
            gl.uniformMatrix4fv( gl.getUniformLocation( this.m_obj, uName ), false, mat.buff );
        }

        // To be used internally

        protected _setInt( unifLoc : WebGLUniformLocation, val : number )
        {
            gl.uniform1i( unifLoc, val );
        }

        protected _setFloat( unifLoc : WebGLUniformLocation, val : number )
        {
            gl.uniform1f( unifLoc, val );
        }

        protected _setVec2( unifLoc : WebGLUniformLocation, v : LVec2 ) : void
        {
            gl.uniform2f( unifLoc, v.x, v.y );
        }

        protected _setVec3( unifLoc : WebGLUniformLocation, v : LVec3 ) : void
        {
            gl.uniform3f( unifLoc, v.x, v.y, v.z );
        }

        protected _setVec4( unifLoc : WebGLUniformLocation, v : LVec4 ) : void
        {
            gl.uniform4f( unifLoc, v.x, v.y, v.z, v.w );
        }

        protected _setMat4( unifLoc : WebGLUniformLocation, mat : LMat4 ) : void
        {
            gl.uniformMatrix4fv( unifLoc, false, mat.buff );
        }

    }

}

