

/// <reference path = "../../core/shader/LShader.ts" />


namespace engine2d
{

    export class LShaderBasic2d extends core.LShader
    {
        // Uniforms
        private m_uModel : WebGLUniformLocation;
        private m_uView  : WebGLUniformLocation;
        private m_uProj  : WebGLUniformLocation;
        private m_uColor : WebGLUniformLocation;

        constructor( obj : WebGLProgram )
        {
            super( obj );

            this.bind();

            // Load uniforms
            this.m_uModel = gl.getUniformLocation( obj, "u_matModel" );
            this.m_uView  = gl.getUniformLocation( obj, "u_matView" );
            this.m_uProj  = gl.getUniformLocation( obj, "u_matProj" );
            this.m_uColor = gl.getUniformLocation( obj, "u_color" );

            this.unbind();
        }

        public setMatModel( matModel : core.LMat4 ) : void
        {
            this._setMat4( this.m_uModel, matModel );
        }

        public setMatView( matView : core.LMat4 ) : void
        {
            this._setMat4( this.m_uView, matView );
        }

        public setMatProj( matProj : core.LMat4 ) : void
        {
            this._setMat4( this.m_uProj, matProj );
        }

        public setColor( vecColor : core.LVec3 ) : void
        {
            this._setVec3( this.m_uColor, vecColor );
        }
    }

}

