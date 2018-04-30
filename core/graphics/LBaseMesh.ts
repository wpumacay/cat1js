/// <reference path="../math/LMath.ts" />
/// <reference path="../data/LVertexBuffer.ts" />
/// <reference path="../data/LIndexBuffer.ts" />
/// <reference path="../material/LBaseMaterial.ts" />
/// <reference path="../geometry/LBaseGeometry.ts"/>


namespace core
{
    export class LBaseMesh
    {

        public pos : LVec3;
        public rotation : LMat4;
        public scale : LVec3;

        protected m_material : LBaseMaterial;
        protected m_geometry : LBaseGeometry;

        protected m_isWireframe : boolean;

        constructor()
        {

            this.pos = new LVec3( 0, 0, 0 );
            this.scale = new LVec3( 1, 1, 1 );
            this.rotation = new LMat4();

            this.m_isWireframe = false;

            this.m_geometry = null;
            this.m_material = null;
        }


        public render() : void
        {
            if ( this.m_geometry == null )
            {
                return;
            }

            this.m_geometry.bind();

            gl.drawElements( gl.TRIANGLES, this.m_geometry.getIndexCount(), gl.UNSIGNED_SHORT, 0 );

            this.m_geometry.unbind()
        }

    }
}