/// <reference path="../../Globals.ts" />


class LVertexBuffer
{

	private m_bufferObj : WebGLBuffer;
	private m_componentCount : number;


	constructor( componentCount : number,
				 data : Float32Array )
	{
		this.m_componentCount = componentCount;

		this.m_bufferObj = gl.createBuffer();

		gl.bindBuffer( gl.ARRAY_BUFFER, this.m_bufferObj );
		gl.bufferData( gl.ARRAY_BUFFER, data, gl.STATIC_DRAW );
	}


	public release() : void
	{
		gl.deleteBuffer( this.m_bufferObj );
		this.m_bufferObj = null;
	}

	public bind() : void
	{
		gl.bindBuffer( gl.ARRAY_BUFFER, this.m_bufferObj );
	}

	public unbind() : void
	{
		gl.bindBuffer( gl.ARRAY_BUFFER, null );
	}

	public getComponentCount() : number
	{
		return this.m_componentCount;
	}

}