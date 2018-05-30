
/// <reference path="../../Globals.ts" />
/// <reference path="../../LCommon.ts" />

/// <reference path="../math/LMath.ts" />

namespace core
{

    export class LModelGeometryInfo
    {
        public vertices : LVec3[];
        public normals : LVec3[];
        public texCoords : LVec2[];
        public indices : LInd3[];

        public wasParsedCorrectly : boolean;

        constructor()
        {
            this.vertices = [];
            this.normals = [];
            this.texCoords = [];
            this.indices = [];

            this.wasParsedCorrectly = false;
        }
    }

    export class LModelMaterialInfo
    {
        public type : string;
        public properties : { [id:string] : any };

        public wasParsedCorrectly : boolean;

        constructor()
        {
            this.type = 'none';
            this.properties = {};

            this.wasParsedCorrectly = false;
        }
    }

    export class LModelConstructInfo
    {
        public geometryInfo : LModelGeometryInfo;
        public materialInfo : LModelMaterialInfo;

        public wasParsedCorrectly : boolean;

        constructor()
        {
            this.geometryInfo = new LModelGeometryInfo();
            this.materialInfo = new LModelMaterialInfo();

            this.wasParsedCorrectly = false;
        }
    }

}