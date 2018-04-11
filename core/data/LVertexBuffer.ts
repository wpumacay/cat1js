/// <reference path="../../Globals.ts" />


class LVertexBuffer
{

	private m_bufferObj : WebGLBuffer;
	private m_componentCount : number;
	private m_attribIndex : number;

	/**
	*  	Abstraction of a vertexbuffer object.
	*  
	*   @class LVertexBuffer
	*   @constructor
	*	@param {Number} componentCount Number of float that represent a vertex attribute
	*	@param {Float32Array} data Memory buffer of floats
	*	@param {Number} attribIndex Attribute
	*/
	constructor( componentCount : number,
				 data : Float32Array,
				 attribIndex : number )
	{
		this.m_componentCount = componentCount;
		this.m_attribIndex = attribIndex;
		this.m_bufferObj = gl.createBuffer();

		gl.bindBuffer( gl.ARRAY_BUFFER, this.m_bufferObj );
		gl.bufferData( gl.ARRAY_BUFFER, data, gl.STATIC_DRAW );
	}

	/**
	* 	Release resources method.
	*
	*	@method release
	*/
	public release() : void
	{
		gl.deleteBuffer( this.m_bufferObj );
		this.m_bufferObj = null;
	}

	/**
	* 	Bind this object's vbo data.
	*
	*	@method bind
	*/
	public bind() : void
	{
		gl.bindBuffer( gl.ARRAY_BUFFER, this.m_bufferObj );

		gl.vertexAttribPointer( this.m_attribIndex,
								this.m_componentCount,
								gl.FLOAT,
								false,
								this.m_componentCount * Float32Array.BYTES_PER_ELEMENT,
								0 );

		gl.enableVertexAttribArray( this.m_attribIndex );
	}

	/**
	* 	Unbind this object's vbo data.
	*
	*	@method unbind
	*/
	public unbind() : void
	{
		gl.disableVertexAttribArray( this.m_attribIndex );
		gl.bindBuffer( gl.ARRAY_BUFFER, null );
	}

	/**
	* 	Gets the number of float that represent an attribute in this buffer
	*
	*	@method getComponentCount
	*/
	public getComponentCount() : number
	{
		return this.m_componentCount;
	}

	/**
	* 	Gets the index of the attribute it represents
	*
	*	@method getComponentCount
	*/
	public getAttribIndex() : number
	{
		return this.m_attribIndex;
	}

	/**
	* 	Gets the reference to the inner vbo
	*
	*	@method getVBO
	*/
	public getVBO() : WebGLBuffer
	{
		return this.m_bufferObj;
	}

}