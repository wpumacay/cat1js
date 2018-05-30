
/// <reference path="../math/LMath.ts" />
/// <reference path="../scene/LScene.ts" />

/// <reference path="../../engine3d/renderers/LMeshRenderer.ts" />

namespace core
{


    export class LMasterRenderer
    {

        private m_meshes : engine3d.LMesh[];
        private m_meshRenderer : engine3d.LMeshRenderer;

        constructor()
        {
            this.m_meshes = [];
            this.m_meshRenderer = new engine3d.LMeshRenderer();
        }


        public begin( scene : LScene ) : void
        {
            //// Collect renderables and organize the render tree
            let _renderables : LIRenderable[] = scene.getRenderables();

            let q : number;

            // Collect meshes
            for ( q = 0; q < _renderables.length; q++ )
            {
                if ( _renderables[q].type() == engine3d.RENDERABLE_TYPE_MESH_3D ||
                     _renderables[q].type() == engine3d.RENDERABLE_TYPE_MODEL )
                {
                    this.m_meshes.push( < engine3d.LMesh > _renderables[q] );
                }
            }
            this.m_meshRenderer.begin( this.m_meshes );

        }

        public render( scene : LScene ) : void
        {
            // render meshes
            this.m_meshRenderer.render( scene );
        }

        public end() : void
        {
            this.m_meshes = [];
            this.m_meshRenderer.end();
        }
    }







}