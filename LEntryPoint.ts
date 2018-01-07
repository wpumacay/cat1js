/// <reference path="LBoot.ts" />

class LEntryPoint
{


	public static include( file : string ) : void
	{
		document.write( '<script type="text/javascript" languaje="javascript" src="' +		
						file + '"></script>' );
	}

	public static begin() : void
	{
		let _files : Array<string> = LEntryPointFiles;

		let _i : number;

		for ( _i = 0; _i < _files.length; _i++ )
		{
			LEntryPoint.include( _files[_i] );
		}
	}

}