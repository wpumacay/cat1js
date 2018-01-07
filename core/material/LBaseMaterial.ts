/// <reference path="../math/LMath.ts" />



class LBaseMaterial
{

	public ambient : LVec3;
	public diffuse : LVec3;
	public specular : LVec3;
	public shininess : number;

	constructor( color : LVec3 )
	{
		this.ambient  = new LVec3( color.x, color.y, color.z );
		this.diffuse  = new LVec3( color.x, color.y, color.z );
		this.specular = new LVec3( color.x, color.y, color.z );

		this.shininess = 20.0;
	}

	public release() : void
	{
		this.ambient = null;
		this.diffuse = null;
		this.specular = null;
	}

}