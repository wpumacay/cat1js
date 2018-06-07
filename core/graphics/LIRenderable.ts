


namespace core
{

    export class LIRenderable
    {
        protected m_type : string;
        protected m_isVisible : boolean;

        constructor() 
        {
            this.m_type = 'base';
            this.m_isVisible = true;
        }

        public release() : void
        {
            // Override this
        }

        public update() : void {}
        public render() : void {}

        public type() : string { return this.m_type; }
        public isVisible() : boolean { return this.m_isVisible; }
        public setVisibility( visibility : boolean ) : void { this.m_isVisible = visibility; }
    }


}