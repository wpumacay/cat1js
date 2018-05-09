

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

            this.m_type = LLight3d.staticType();

            this.ambient = ambient;
            this.diffuse = diffuse;
            this.specular = specular;
            this.strength = 1.0;
        }

        public static staticType() : string { return 'baseLight3d'; }
    }



}