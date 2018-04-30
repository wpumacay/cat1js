

/// <reference path = "../../core/shader/LShader.ts" />
/// <reference path = "../material/LPhongMaterial.ts" />
/// <reference path = "../lights/LDirectionalLight.ts" />


namespace engine3d
{

    class ULightDirectional
    {
        public direction : WebGLUniformLocation;
        public ambient : WebGLUniformLocation;
        public diffuse : WebGLUniformLocation;
        public specular : WebGLUniformLocation;        
        public strength : WebGLUniformLocation;
    };

    class UPhongMaterial
    {
        public ambient : WebGLUniformLocation;
        public diffuse : WebGLUniformLocation;
        public specular : WebGLUniformLocation;
        public shininess : WebGLUniformLocation;
    };

    const MAX_DIRECTIONAL_LIGHTS : number = 3;

    export class LShaderPhongLighting extends core.LShader
    {
        // Uniforms
        private m_uModel : WebGLUniformLocation;
        private m_uView  : WebGLUniformLocation;
        private m_uProj  : WebGLUniformLocation;

        private m_uViewPos : WebGLUniformLocation;

        private m_uLightsDirectional : ULightDirectional[];
        private m_uMaterial : UPhongMaterial;

        private m_uNumLightsDirectional : WebGLUniformLocation;

        constructor( obj : WebGLProgram )
        {
            super( obj );

            this.bind();

            // Load uniforms
            this.m_uModel = gl.getUniformLocation( obj, "u_matModel" );
            this.m_uView  = gl.getUniformLocation( obj, "u_matView" );
            this.m_uProj  = gl.getUniformLocation( obj, "u_matProj" );

            this.m_uMaterial = new UPhongMaterial();

            this.m_uMaterial.ambient   = gl.getUniformLocation( obj, "u_material.ambient" );
            this.m_uMaterial.diffuse   = gl.getUniformLocation( obj, "u_material.diffuse" );
            this.m_uMaterial.specular  = gl.getUniformLocation( obj, "u_material.specular" );
            this.m_uMaterial.shininess = gl.getUniformLocation( obj, "u_material.shininess" );

            this.m_uViewPos = gl.getUniformLocation( obj, "u_viewPos" );
            this.m_uNumLightsDirectional = gl.getUniformLocation( obj, "u_numDirectionalLights" );

            this.m_uLightsDirectional = [];

            let q : number;
            for ( q = 0; q < MAX_DIRECTIONAL_LIGHTS; q++ )
            {
                this.m_uLightsDirectional.push( new ULightDirectional() );

                let _uLocation : string = 'u_directionalLights' +
                                          '[' + q + ']';

                this.m_uLightsDirectional[q].direction = gl.getUniformLocation( obj, _uLocation + '.direction' );
                this.m_uLightsDirectional[q].ambient   = gl.getUniformLocation( obj, _uLocation + '.ambient' );
                this.m_uLightsDirectional[q].diffuse   = gl.getUniformLocation( obj, _uLocation + '.diffuse' );
                this.m_uLightsDirectional[q].specular  = gl.getUniformLocation( obj, _uLocation + '.specular' );
                this.m_uLightsDirectional[q].strength  = gl.getUniformLocation( obj, _uLocation + '.strength' );
            }

            this.unbind();
        }

        public setMatModel( matModel : core.LMat4 ) : void
        {
            this._setMat4( this.m_uModel, matModel );
        }

        public setMatView( matView : core.LMat4 ) : void
        {
            this._setMat4( this.m_uView, matView );
        }

        public setMatProj( matProj : core.LMat4 ) : void
        {
            this._setMat4( this.m_uProj, matProj );
        }

        public setViewPos( pos : core.LVec3 ) : void
        {
            this._setVec3( this.m_uViewPos, pos );
        }

        public setNumDirectionalLights( numDirLights : number ) : void
        {
            this._setInt( this.m_uNumLightsDirectional, numDirLights );
        }

        public setMaterial( phongMaterial : LPhongMaterial ) : void
        {
            this._setVec3( this.m_uMaterial.ambient, phongMaterial.ambient );
            this._setVec3( this.m_uMaterial.diffuse, phongMaterial.diffuse );
            this._setVec3( this.m_uMaterial.specular, phongMaterial.specular );
            this._setFloat( this.m_uMaterial.shininess, phongMaterial.shininess );
        }

        public setLightDirectional( light : LDirectionalLight, lightIndx : number ) : void
        {
            if ( lightIndx < 0 || lightIndx >= MAX_DIRECTIONAL_LIGHTS )
            {
                return;
            }

            this._setVec3( this.m_uLightsDirectional[ lightIndx ].direction, light.getDirection() );
            this._setVec3( this.m_uLightsDirectional[ lightIndx ].ambient, light.ambient );
            this._setVec3( this.m_uLightsDirectional[ lightIndx ].diffuse, light.diffuse );
            this._setVec3( this.m_uLightsDirectional[ lightIndx ].specular, light.specular );
            this._setFloat( this.m_uLightsDirectional[ lightIndx ].strength, light.strength );
        }

    }

}

