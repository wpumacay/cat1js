
import os
import subprocess as sp
import sys

BUILDER_COMPILER_COMMAND = 'tsc'
BUILDER_BUILD_DIRECTORY = 'build/'
BUILDER_INDEX_FILE = 'index.html'
BUILDER_RESOURCES_FOLDER = 'res'
BUILDER_LIBJS_FOLDER = 'libjs'

MODE_BUILD_ONLY = 'buildOnly'
MODE_BUILD_AND_RUN = 'buildAndRun'
MODE_RUN_ONLY = 'runOnly'

class LBuilder :

	@staticmethod
	def build() :

		print( 'STARTED BUILDING ...' )

		sp.call( [BUILDER_COMPILER_COMMAND] )

		print( 'DONE BUILDING' )

	@staticmethod
	def clean() :

		print( 'CLEANING ...' )

		if os.path.exists( BUILDER_BUILD_DIRECTORY ) :
			sp.call( ['rm', '-r', BUILDER_BUILD_DIRECTORY] )

		print( 'DONE' )


	@staticmethod
	def postCopy() :
		# copy index file
		sp.call( ['cp', BUILDER_INDEX_FILE, BUILDER_BUILD_DIRECTORY] )
		# copy libjs folder
		sp.call( ['cp', '-r', BUILDER_LIBJS_FOLDER, BUILDER_BUILD_DIRECTORY] )
		# copy resources folder
		sp.call( ['cp', '-r', BUILDER_RESOURCES_FOLDER, BUILDER_BUILD_DIRECTORY] )

	@staticmethod
	def run() :
		# run using simplehttpserver
		sp.call( ['python2', '-m', 'SimpleHTTPServer', '8888'] )

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