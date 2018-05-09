

/// <reference path="../math/LMath.ts" />
/// <reference path="../data/LVertexBuffer.ts" />
/// <reference path="../data/LIndexBuffer.ts" />
/// <reference path="../material/LBaseMaterial.ts" />
/// <reference path="../geometry/LBaseGeometry.ts"/>
/// <reference path="LIRenderable.ts"/>

namespace core
{
    export class LBaseMesh extends LIRenderable
    {

        protected m_material : LBaseMaterial;
        protected m_geometry : LBaseGeometry;

        constructor()
        {
            super();

            this.m_type = 'baseMesh';

            this.m_geometry = null;
            this.m_material = null;
        }

        public update() : void
        {
            // Override this
        }

        public render() : void
        {
            if ( this.m_geometry == null )
            {
                return;
            }

            this.m_material.bind();
            this.m_geometry.bind();

            gl.drawElements( gl.TRIANGLES, this.m_geometry.getIndexCount(), gl.UNSIGNED_SHORT, 0 );

            this.m_geometry.unbind()
            this.m_material.unbind();
        }

        public getGeometry() : LBaseGeometry { return this.m_geometry; }
        public getMaterial() : LBaseMaterial { return this.m_material; }

    }
}