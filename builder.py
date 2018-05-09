
import os
import subprocess as sp
import sys
import argparse

DEFAULT_BUILDER_PORT = '7800'
DEFAULT_BUILD_DIRECTORY = 'build/'

BUILDER_PROJECT_NAME = 'cat1js'
BUILDER_COMPILER_COMMAND = 'tsc'
BUILDER_DTS_GENERATOR_COMMAND = 'dts-generator'
BUILDER_INDEX_FILES = [ 'index.html', 'playground.html' ]
BUILDER_RESOURCES_FOLDER = 'res' # assets
BUILDER_EXTJS_FOLDER = 'extjs' # libraries
# Add here the extra files you want to copy to the build dir
BUILDER_EXTRA_FILES_LIST = [ 'playgroundEntryPoint.js',
                             'playground.css' ]

MODE_BUILD_ONLY = 'build'
MODE_BUILD_AND_RUN = 'all'
MODE_RUN_ONLY = 'run'

class LBuilder :

    def __init__( self ) :

        self.m_parser = argparse.ArgumentParser( description = 'Builder config properties' )
        self.m_parser.add_argument( 'builderMode', help = '(build)|run|all', default = 'build' )
        self.m_parser.add_argument( '--port', help = 'port to run the app', default = DEFAULT_BUILDER_PORT )
        self.m_parser.add_argument( '--buildDir', help = 'output build directory', default = DEFAULT_BUILD_DIRECTORY )

        self.m_buildMode = MODE_BUILD_ONLY
        self.m_buildDir = DEFAULT_BUILD_DIRECTORY
        self.m_port = DEFAULT_BUILDER_PORT

    def execute( self ) :

        _args = self.m_parser.parse_args()

        self.m_buildMode = _args.builderMode
        self.m_buildDir = _args.buildDir
        self.m_port = _args.port

        if self.m_buildMode == MODE_BUILD_ONLY :
            self._clean()
            self._build()
            self._postCopy()

        elif self.m_buildMode == MODE_RUN_ONLY :
            self._run()     

        elif self.m_buildMode == MODE_BUILD_AND_RUN :
            self._clean()
            self._build()
            self._postCopy()
            self._run()

        else :
            print 'Wrong build mode: ', self.m_buildMode
            print 'Valid modes: build|run|all'

    def _build( self ) :

        print 'STARTED BUILDING ...'

        print 'building js'
        # Build to js
        _errorCode = sp.call( [BUILDER_COMPILER_COMMAND, '--outDir', self.m_buildDir] )
        
        if ( _errorCode != 0 ) :
            print 'Error while compiling typescript files'
            sys.exit( 0 )

        print 'ok!'

        print 'bundling d.ts declarations'
        # Build bundled d.ts
        sp.call( [BUILDER_DTS_GENERATOR_COMMAND, 
                 '--name', BUILDER_PROJECT_NAME,
                 '--project', './',
                 '--out', self.m_buildDir + BUILDER_PROJECT_NAME + '.d.ts'] )
        print 'ok!'

        print 'DONE BUILDING'

    def _clean( self ) :

        print 'CLEANING ...'

        if os.path.exists( self.m_buildDir ) :
            sp.call( ['rm', '-r', self.m_buildDir] )

        print 'DONE'


    def _postCopy( self ) :
        # copy index files
        for _indxFileName in BUILDER_INDEX_FILES :
            sp.call( ['cp', _indxFileName, self.m_buildDir] )
        # copy extra .js files
        for _extraJsFile in BUILDER_EXTRA_FILES_LIST :
            sp.call( ['cp', _extraJsFile, self.m_buildDir ] )
        # copy extjs folder
        sp.call( ['cp', '-r', BUILDER_EXTJS_FOLDER, self.m_buildDir] )
        # copy resources folder
        sp.call( ['cp', '-r', BUILDER_RESOURCES_FOLDER, self.m_buildDir] )

    def _run( self ) :
        # run using simplehttpserver
        sp.call( ['python2', '-m', 'SimpleHTTPServer', self.m_port] )

if __name__ == '__main__' :

    _builder = LBuilder()
    _builder.execute()
