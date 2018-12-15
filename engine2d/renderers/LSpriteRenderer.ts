
/// <reference path="../graphics/LSprite.ts" />
/// <reference path="../../core/scene/LScene.ts" />

/// <reference path="../../core/assets/LAssetsManager.ts" />

namespace engine2d
{

    export class LSpriteRenderer
    {

        private m_sprites : LSprite[];

        private m_isLightingEnabled : boolean;

        constructor()
        {
            this.m_sprites = [];
        }

        public begin( sprites : LSprite[] ) : void
        {
            let q : number;
            for ( q = 0; q < sprites.length; q++ )
            {
                this.m_sprites.push( sprites[q] );
            }
        }

        public render( scene : core.LScene ) : void
        {
            this._renderNoLighting( scene );
        }

        private _renderNoLighting( scene : core.LScene ) : void
        {
            // render non textured
            {
                let _shader : LShaderBasic3d = <LShaderBasic3d> core.LAssetsManager.INSTANCE.getShader( 'basic3d' );

                _shader.bind();

                let _camera : core.LBaseCamera = scene.getCurrentCamera();
                _shader.setMatView( _camera.getViewMatrix() );
                _shader.setMatProj( _camera.getProjectionMatrix() );

                let q : number;
                for ( q = 0; q < this.m_nonTexturedMeshes.length; q++ )
                {
                    let _mesh : LMesh = this.m_nonTexturedMeshes[q];
                    let _material : LMaterial3d = _mesh.getMaterial();

                    _shader.setMatModel( _mesh.getModelMatrix() );
                    _shader.setColor( _material.color );

                    _mesh.render();
                }

                _shader.unbind();
            }

            // render textured
            {
                let _shader : LShaderSimpleTexture = <LShaderSimpleTexture> core.LAssetsManager.INSTANCE.getShader( 'simpleTexture3d' );

                _shader.bind();

                let _camera : core.LBaseCamera = scene.getCurrentCamera();
                _shader.setMatView( _camera.getViewMatrix() );
                _shader.setMatProj( _camera.getProjectionMatrix() );

                let q : number;
                for ( q = 0; q < this.m_texturedMeshes.length; q++ )
                {
                    let _mesh : LMesh = this.m_texturedMeshes[q];
                    let _material : LTexturedMaterial = <LTexturedMaterial> _mesh.getMaterial();

                    _shader.setMatModel( _mesh.getModelMatrix() );
                    _shader.setTexture( _material.getTexture() );

                    _mesh.render();
                }

                _shader.unbind();
            }
        }

        public end() : void
        {
            this.m_texturedMeshes = [];
            this.m_nonTexturedMeshes = [];
        }

    }




}