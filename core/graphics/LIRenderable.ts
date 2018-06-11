


namespace core
{

    export class LIRenderable
    {
        protected m_type : string;
        protected m_isVisible : boolean;
        protected m_deletionRequested : boolean;

        constructor() 
        {
            this.m_type = 'base';
            this.m_isVisible = true;
            this.m_deletionRequested = false;
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
        public requestDeletion() : void { this.m_deletionRequested = true; }
        public isDeletionRequested() : boolean { return this.m_deletionRequested; }
    }


}