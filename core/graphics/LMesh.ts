/// <reference path="../math/LMath.ts" />
/// <reference path="../data/LVertexBuffer.ts" />
/// <reference path="../data/LIndexBuffer.ts" />
/// <reference path="../data/LVertexArray.ts" />
/// <reference path="../material/LBaseMaterial.ts" />


class LMesh
{

	public pos : LVec3;
	public rotation : LMat4;
	public scale : LVec3;


	private m_vertexArray : LVertexArray;
	private m_indexBuffer : LIndexBuffer;

	private m_isWireframe : boolean;
	private m_material : LBaseMaterial;

	constructor()
	{
		this.pos = new LVec3( 0, 0, 0 );
		this.scale = new LVec3( 1, 1, 1 );
		this.rotation = new LMat4();

		this.m_material = new LBaseMaterial( new LVec3( 0, 1, 0 ) );
	}


	public draw() : void
	{
		this.m_vertexArray.bind();
		this.m_indexBuffer.bind();

		gl.drawElements( gl.TRIANGLES, this.m_indexBuffer.getCount(), gl.UNSIGNED_SHORT, 0 );

		this.m_indexBuffer.unbind();
		this.m_vertexArray.unbind();
	}


	public setMaterial( material : LBaseMaterial ) : void
	{
		this.m_material.release();
		this.m_material = material;
	}

	public getMaterial() : LBaseMaterial
	{
		return this.m_material;
	}

}