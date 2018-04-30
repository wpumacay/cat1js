
/// <reference path="../../core/material/LBaseMaterial.ts" />



namespace engine3d
{


    export class LMaterial3d extends core.LBaseMaterial
    {

        public ambient : core.LVec3;
        public diffuse : core.LVec3;
        public specular : core.LVec3;
        public shininess : number;

        constructor( ambient : core.LVec3,
                     diffuse : core.LVec3,
                     specular : core.LVec3,
                     shininess : number )
        {
            super( ambient );

            this.ambient = ambient;
            this.diffuse = diffuse;
            this.specular = specular;
            this.shininess = shininess;
        }


    }



}
