

/// <reference path = "../../core/shader/LShader.ts" />


namespace engine3d
{

    export class LShaderDebugDrawer3d extends core.LShader
    {
        // Uniforms
        private m_uView  : WebGLUniformLocation;
        private m_uProj  : WebGLUniformLocation;

        constructor( obj : WebGLProgram )
        {
            super( obj );

            this.bind();

            // Load uniforms
            this.m_uView  = gl.getUniformLocation( obj, "u_matView" );
            this.m_uProj  = gl.getUniformLocation( obj, "u_matProj" );

            this.unbind();
        }

        public setMatView( matView : core.LMat4 ) : void
        {
            this._setMat4( this.m_uView, matView );
        }

        public setMatProj( matProj : core.LMat4 ) : void
        {
            this._setMat4( this.m_uProj, matProj );
        }
    }

}

