
/// <reference path="../graphics/LMesh.ts" />
/// <reference path="../graphics/LModel.ts" />
/// <reference path="../../core/scene/LScene.ts" />

/// <reference path="../../core/assets/LAssetsManager.ts" />

namespace engine3d
{

    export class LMeshRenderer
    {

        private m_texturedMeshes : LMesh[];
        private m_nonTexturedMeshes : LMesh[];

        private m_isLightingEnabled : boolean;

        constructor()
        {
            this.m_texturedMeshes = [];
            this.m_nonTexturedMeshes = [];

            this.m_isLightingEnabled = true;
        }

        public setLightingMode( lightingMode : boolean ) : void
        {
            this.m_isLightingEnabled = lightingMode;
        }
        public isLightingEnabled() : boolean
        {
            return this.m_isLightingEnabled;
        }

        public begin( meshes : LMesh[] ) : void
        {
            let q : number;
            for ( q = 0; q < meshes.length; q++ )
            {
                let _material : LMaterial3d = meshes[q].getMaterial();

                if ( _material.type() == LMaterial3d.staticType() ||
                     _material.type() == LPhongMaterial.staticType() )
                {
                    this.m_nonTexturedMeshes.push( meshes[q] );
                }
                else if ( _material.type() == LTexturedMaterial.staticType() )
                {
                    this.m_texturedMeshes.push( meshes[q] );
                }
            }

            
        }

        public render( scene : core.LScene ) : void
        {
            if ( this.m_isLightingEnabled )
            {
                this._renderWithLighting( scene );
            }
            else
            {
                this._renderNoLighting( scene );
            }
        }

        private _renderWithLighting( scene : core.LScene ) : void
        {
            // render non textured
            {
                let _shader : LShaderPhongLighting = <LShaderPhongLighting> core.LAssetsManager.INSTANCE.getShader( 'phongLighting3d' );

                _shader.bind();

                let _camera : core.LBaseCamera = scene.getCurrentCamera();
                _shader.setMatView( _camera.getViewMatrix() );
                _shader.setMatProj( _camera.getProjectionMatrix() );
                _shader.setViewPos( _camera.getPosition() );

                let _lightsDirectional : LDirectionalLight[] = < LDirectionalLight[] > scene.getLights( LDirectionalLight.staticType() );
                let _lightsPunctual : LPointLight[] = < LPointLight[] > scene.getLights( LPointLight.staticType() );

                let q : number;
                for ( q = 0; q < _lightsDirectional.length; q++ )
                {
                    _shader.setLightDirectional( _lightsDirectional[q], q );
                }
                _shader.setNumDirectionalLights( _lightsDirectional.length );

                for ( q = 0; q < _lightsPunctual.length; q++ )
                {
                    _shader.setLightPoint( _lightsPunctual[q], q );
                }
                _shader.setNumPointLights( _lightsPunctual.length );

                for ( q = 0; q < this.m_nonTexturedMeshes.length; q++ )
                {
                    let _mesh : LMesh = this.m_nonTexturedMeshes[q];
                    let _material : LMaterial3d = _mesh.getMaterial();

                    _shader.setMatModel( _mesh.getModelMatrix() );
                    _shader.setMaterial( _material );

                    _mesh.render();
                }

                _shader.unbind();
            }

            // render textured
            {
                let _shader : LShaderTextureLighting = <LShaderTextureLighting> core.LAssetsManager.INSTANCE.getShader( 'textureLighting3d' );

                _shader.bind();

                let _camera : core.LBaseCamera = scene.getCurrentCamera();
                _shader.setMatView( _camera.getViewMatrix() );
                _shader.setMatProj( _camera.getProjectionMatrix() );
                _shader.setViewPos( _camera.getPosition() );

                let _lightsDirectional : LDirectionalLight[] = < LDirectionalLight[] > scene.getLights( LDirectionalLight.staticType() );
                let _lightsPunctual : LPointLight[] = < LPointLight[] > scene.getLights( LPointLight.staticType() );

                let q : number;
                for ( q = 0; q < _lightsDirectional.length; q++ )
                {
                    _shader.setLightDirectional( _lightsDirectional[q], q );
                }
                _shader.setNumDirectionalLights( _lightsDirectional.length );

                for ( q = 0; q < _lightsPunctual.length; q++ )
                {
                    _shader.setLightPoint( _lightsPunctual[q], q );
                }
                _shader.setNumPointLights( _lightsPunctual.length );

                for ( q = 0; q < this.m_texturedMeshes.length; q++ )
                {
                    let _mesh : LMesh = this.m_texturedMeshes[q];
                    let _material : LMaterial3d = _mesh.getMaterial();

                    _shader.setMatModel( _mesh.getModelMatrix() );
                    _shader.setMaterial( <LTexturedMaterial> _material );

                    _mesh.render();
                }

                _shader.unbind();
            }
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