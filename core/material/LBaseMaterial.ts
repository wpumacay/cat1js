/// <reference path="../math/LMath.ts" />


namespace core
{

    export class LBaseMaterial
    {

        public color : LVec3;

        protected m_type : string;

        constructor( color : LVec3 )
        {
            this.color = color;
            this.m_type = 'base';
        }

        public bind() : void
        {
            // Override this
        }

        public unbind() : void
        {
            // Override this
        }

        public type() : string { return this.m_type; }

    }
    
}

