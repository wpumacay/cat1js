/// <reference path="../math/LMath.ts" />


namespace core
{

    export class LBaseLight
    {
        public color : LVec3;

        protected m_type : string;

        constructor( color : LVec3 )
        {
            this.color = color;
            this.m_type = 'base';
        }

        public type() : string
        {
            return this.m_type;
        }

    }
    
}

