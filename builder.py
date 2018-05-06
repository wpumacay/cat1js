
import os
import subprocess as sp
import sys

BUILDER_COMPILER_COMMAND = 'tsc'
BUILDER_DTS_GENERATOR_COMMAND = 'dts-generator'
BUILDER_BUILD_DIRECTORY = 'build/'
BUILDER_INDEX_FILES = [ 'index.html', 'playground.html' ]
BUILDER_RESOURCES_FOLDER = 'res' # assets
BUILDER_EXTJS_FOLDER = 'extjs' # libraries

# Add here the extra files you want to copy to the build dir
BUILDER_EXTRA_FILES_LIST = [ 'playgroundEntryPoint.js',
							 'playground.css' ]

MODE_BUILD_ONLY = 'buildOnly'
MODE_BUILD_AND_RUN = 'buildAndRun'
MODE_RUN_ONLY = 'runOnly'

class LBuilder :

	@staticmethod
	def build() :

		print( 'STARTED BUILDING ...' )

		print( 'building js' )
		# Build to js
		sp.call( [BUILDER_COMPILER_COMMAND] )
		print( 'ok!' )

		print( 'bundling d.ts declarations' )
		# Build bundled d.ts
		sp.call( [BUILDER_DTS_GENERATOR_COMMAND, 
				 '--name', 'cat1js',
				 '--project', './',
				 '--out', 'build/cat1js.d.ts'] )
		print( 'ok!' )

		print( 'DONE BUILDING' )

	@staticmethod
	def clean() :

		print( 'CLEANING ...' )

		if os.path.exists( BUILDER_BUILD_DIRECTORY ) :
			sp.call( ['rm', '-r', BUILDER_BUILD_DIRECTORY] )

		print( 'DONE' )


	@staticmethod
	def postCopy() :
		# copy index files
		for _indxFileName in BUILDER_INDEX_FILES :
			sp.call( ['cp', _indxFileName, BUILDER_BUILD_DIRECTORY] )
		# copy extra .js files
		for _extraJsFile in BUILDER_EXTRA_FILES_LIST :
			sp.call( ['cp', _extraJsFile, BUILDER_BUILD_DIRECTORY ] )
		# copy extjs folder
		sp.call( ['cp', '-r', BUILDER_EXTJS_FOLDER, BUILDER_BUILD_DIRECTORY] )
		# copy resources folder
		sp.call( ['cp', '-r', BUILDER_RESOURCES_FOLDER, BUILDER_BUILD_DIRECTORY] )

	@staticmethod
	def run() :
		# run using simplehttpserver
		sp.call( ['python2', '-m', 'SimpleHTTPServer', '7800'] )

if __name__ == '__main__' :

	_mode = MODE_BUILD_ONLY

	if len( sys.argv ) >= 2 :
		_strModeArg = sys.argv[1]

		if _strModeArg == 'build' :
			_mode = MODE_BUILD_ONLY
		elif _strModeArg == 'run' : 
			_mode = MODE_RUN_ONLY
		elif _strModeArg == 'all' :
			_mode = MODE_BUILD_AND_RUN
		else :
			print 'Usage: python builder.py [mode](build, run, all)'
			sys.exit()
			
		print 'Running Mode: ', _mode

	else :
		print 'Usage: python builder.py [mode](build, run, all)'
		sys.exit()

	if _mode == MODE_BUILD_ONLY :
		LBuilder.clean()
		LBuilder.build()
		LBuilder.postCopy()

	elif _mode == MODE_RUN_ONLY :
		LBuilder.run()		

	elif _mode == MODE_BUILD_AND_RUN :
		LBuilder.clean()
		LBuilder.build()
		LBuilder.postCopy()
		LBuilder.run()