


namespace core
{

    export class LIRenderable
    {
        protected m_type : string;

        constructor() 
        {
            this.m_type = 'base';
        }

        public update() : void {}
        public render() : void {}

        public type() : string { return this.m_type; }
    }


}