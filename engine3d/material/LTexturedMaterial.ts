
/// <reference path="LMaterial3d.ts" />
/// <reference path="../../core/data/LTexture.ts" />



namespace engine3d
{


    export class LTexturedMaterial extends LMaterial3d
    {
        private m_diffuseMap : core.LTexture;

        constructor( diffuseMap : core.LTexture,
                     specular : core.LVec3,
                     shininess : number )
        {
            super( new core.LVec3( 0, 0, 0 ) );

            this.m_diffuseMap = diffuseMap;
        }

        public bind() : void
        {
            this.m_diffuseMap.bind();
        }

        public getTexture() : core.LTexture { return this.m_diffuseMap; }

        public unbind() : void
        {
            // this.m_diffuseMap.unbind();
        }
    }



}
