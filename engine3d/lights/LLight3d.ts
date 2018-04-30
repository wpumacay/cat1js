

/// <reference path="../../core/lights/LBaseLight.ts" />



namespace engine3d
{

    export class LLight3d extends core.LBaseLight
    {

        public ambient : core.LVec3;
        public diffuse : core.LVec3;
        public specular : core.LVec3;

        public strength : number;

        constructor( ambient : core.LVec3,
                     diffuse : core.LVec3,
                     specular : core.LVec3 )
        {
            super( ambient );

            this.ambient = ambient;
            this.diffuse = diffuse;
            this.specular = specular;
            this.strength = 1.0;
        }

        
    }



}