



namespace core
{
    export const BUFFER_USAGE_POSITION : string = 'POSITION';
    export const BUFFER_USAGE_VERTEX : string = 'VERTEX';
    export const BUFFER_USAGE_NORMAL : string = 'NORMAL';
    export const BUFFER_USAGE_TEXCOORD : string = 'TEXCOORD';
    export const BUFFER_USAGE_COLOR : string = 'COLOR';

    export class LColladaVertexBuffer
    {
        public size : number;
        public count : number;
        public data : Float32Array;
        public usage : string;
        public offset : number;

        // Used in case we need an alias
        public children : LColladaVertexBuffer[];

        constructor()
        {
            this.size = -1;
            this.count = -1;
            this.data = null;
            this.usage = '';
            this.offset = 0;

            this.children = [];
        }
    }

    export class LColladaIndexBuffer
    {
        public size : number;
        public count : number;
        public data : Uint16Array;

        constructor()
        {
            this.size = -1;
            this.count = -1;
            this.data = null;
        }
    }

    export class LColladaGeometry
    {
        public buffers : { [id:string] : LColladaVertexBuffer };

        public layout : LColladaVertexBuffer[][];

        public positionsBuffer : LColladaVertexBuffer;
        public normalsBuffer : LColladaVertexBuffer;
        public texCoordsBuffer : LColladaVertexBuffer;
        public colorBuffer : LColladaVertexBuffer;

        public offsetInGlobalBuffer : number;

        public faces : LColladaIndexBuffer;
        public scale : number;
        public isOk : boolean;

        constructor()
        {
            this.buffers = {};

            this.layout = [];

            this.positionsBuffer = null;
            this.normalsBuffer   = null;
            this.texCoordsBuffer = null;
            this.colorBuffer     = null;

            this.offsetInGlobalBuffer = 0;

            this.faces = null;
            this.scale = 1.0;
            this.isOk = true;
        }
    }

    export enum UpAxis
    {
        X = 'X_UP',
        Y = 'Y_UP',
        Z = 'Z_UP'
    }

    export class LColladaModelProperties
    {
        public scale : number;
        public correctionMatrix : LMat4;
        public upAxis : UpAxis;

        constructor()
        {
            this.scale = 1;
            this.correctionMatrix = new LMat4();
            this.upAxis = UpAxis.Y;
        }
    }
}