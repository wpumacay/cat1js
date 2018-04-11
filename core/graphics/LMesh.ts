/// <reference path="../math/LMath.ts" />
/// <reference path="../data/LVertexBuffer.ts" />
/// <reference path="../data/LIndexBuffer.ts" />
/// <reference path="../material/LBaseMaterial.ts" />

namespace engine
{
	export class LMesh
	{

		public pos : LVec3;
		public rotation : LMat4;
		public scale : LVec3;

		private m_buffers : Array< LVertexBuffer >;
		private m_indexBuffer : LIndexBuffer;

		private m_isWireframe : boolean;
		private m_material : LBaseMaterial;

		constructor( vertices : Array< LVec3 >,
					 normals : Array< LVec3 >,
					 indices : Array< LInd3 > )
		{

			this.m_buffers = new Array< LVertexBuffer >();
			this.m_buffers[0] = new LVertexBuffer( 3, LVec3.arrayToBuffer( vertices ), 0 );
			this.m_buffers[1] = new LVertexBuffer( 3, LVec3.arrayToBuffer( normals ), 1 );

			this.m_indexBuffer = new LIndexBuffer( indices.length * 3,
												   LInd3.arrayToBuffer( indices ) );

			this.pos = new LVec3( 0, 0, 0 );
			this.scale = new LVec3( 1, 1, 1 );
			this.rotation = new LMat4();

			this.m_material = new LBaseMaterial( new LVec3( 0, 1, 0 ) );
		}


		public draw() : void
		{
			let i : number;
			for ( i = 0; i < this.m_buffers.length; i++ )
			{
				this.m_buffers[i].bind();
			}

			this.m_indexBuffer.bind();

			gl.drawElements( gl.TRIANGLES, this.m_indexBuffer.getCount(), gl.UNSIGNED_SHORT, 0 );

			this.m_indexBuffer.unbind();
			
			for ( i = 0; i < this.m_buffers.length; i++ )
			{
				this.m_buffers[i].unbind();
			}
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
}