
/// <reference path="LMaterial3d.ts" />



namespace engine3d
{


    export class LPhongMaterial extends LMaterial3d
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

            this.m_type = LPhongMaterial.staticType();

            this.ambient = ambient;
            this.diffuse = diffuse;
            this.specular = specular;
            this.shininess = shininess;
        }

        public release() : void
        {
            this.ambient = null;
            this.diffuse = null;
            this.specular = null;

            super.release();
        }

        public static staticType() : string { return 'phongMaterial3d'; }

    }



}
