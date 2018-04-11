
import os
import subprocess as sp
import sys

BUILDER_COMPILER_COMMAND = 'tsc'
BUILDER_BUILD_DIRECTORY = 'build/'
BUILDER_INDEX_FILE = 'index.html'
BUILDER_RESOURCES_FOLDER = 'res'
BUILDER_LIBJS_FOLDER = 'libjs'

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
		sp.call( ['python2', '-m', 'SimpleHTTPServer'] )

if __name__ == '__main__' :

	LBuilder.clean()
	LBuilder.build()
	LBuilder.postCopy()
	LBuilder.run()
