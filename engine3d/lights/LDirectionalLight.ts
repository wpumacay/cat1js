

/// <reference path="..//lights/LLight3d.ts" />



namespace engine3d
{

    export class LDirectionalLight extends LLight3d
    {

        private m_direction : core.LVec3;

        constructor( direction : core.LVec3,
                     ambient : core.LVec3,
                     diffuse : core.LVec3,
                     specular : core.LVec3 )
        {
            super( ambient, diffuse, specular );

            this.m_direction = direction;
        }

        public setDirection( direction : core.LVec3 ) : void { this.m_direction = direction; }
        public getDirection() : core.LVec3 { return this.m_direction; }
    }



}