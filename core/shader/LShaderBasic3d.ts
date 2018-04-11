/// <reference path = "LShader.ts" />




class LShaderBasic3d extends LShader
{
    // Uniforms
    private m_uModel : WebGLUniformLocation;
    private m_uView  : WebGLUniformLocation;
    private m_uProj  : WebGLUniformLocation;
    private m_uColor : WebGLUniformLocation;

    constructor( obj : WebGLProgram )
    {
        super( obj );

        this.m_uModel = gl.getUniformLocation( obj, "u_matModel" );
        this.m_uView  = gl.getUniformLocation( obj, "u_matView" );
        this.m_uProj  = gl.getUniformLocation( obj, "u_matProj" );
        this.m_uColor = gl.getUniformLocation( obj, "u_color" );

    }


    public setMatModel( matModel : LMat4 ) : void
    {

    }

    public setMatView( matView : LMat4 ) : void
    {

    }

    public setMatProj( matProj : LMat4 ) : void
    {
        
    }
}