/// <reference path="../math/LMath.ts" />


namespace core
{

    export class LBaseMaterial
    {

        public color : LVec3;

        constructor( color : LVec3 )
        {
            this.color = color;
        }

        public bind() : void
        {
            // Override this
        }

        public unbind() : void
        {
            // Override this
        }

    }
    
}

