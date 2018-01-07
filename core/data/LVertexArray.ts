/// <reference path="LVertexBuffer.ts" />


class LVertexArray
{

	private m_vArrayObj : WebGLVertexArrayObject;
	private m_vBuffers : Array<LVertexBuffer>;

	constructor()
	{
		this.m_vArrayObj = gl.createVertexArray();

		this.m_vBuffers = new Array<LVertexBuffer>();
	}

	public release() : void
	{
		let _i : number;

		for ( _i = 0; _i < this.m_vBuffers.length; _i++ )
		{
			this.m_vBuffers[_i].release();
			this.m_vBuffers[_i] = null;
		}

		this.m_vBuffers = null;
	}

	public addBuffer( buffer : LVertexBuffer, attribIndex : number ) : void
	{
		this.m_vBuffers.push( buffer );

		this.bind();

		buffer.bind();

		gl.enableVertexAttribArray( attribIndex );
		gl.vertexAttribPointer( attribIndex, 
								buffer.getComponentCount(), 
								gl.FLOAT, 
								false, 
								buffer.getComponentCount() * Float32Array.BYTES_PER_ELEMENT, 
								0 );

		buffer.unbind();

		this.unbind();
	}

	public bind() : void
	{
		gl.bindVertexArray( this.m_vArrayObj );
	}

	public unbind() : void
	{
		gl.bindVertexArray( null );
	}

}