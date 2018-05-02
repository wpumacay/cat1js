

/// <reference path="..//lights/LLight3d.ts" />



namespace engine3d
{

    export class LPointLight extends LLight3d
    {

        private m_position : core.LVec3;

        constructor( position : core.LVec3,
                     ambient : core.LVec3,
                     diffuse : core.LVec3,
                     specular : core.LVec3 )
        {
            super( ambient, diffuse, specular );

            this.m_position = position;
        }

        public setPosition( position : core.LVec3 ) : void { this.m_position = position; }
        public getPosition() : core.LVec3 { return this.m_position; }
    }



}