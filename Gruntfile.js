/*
 * Grunt Config
 */

'use strict';

module.exports = function(grunt) {
  // configure grunt
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    eslint: {
      grunt: {
        src: [ 'Gruntfile.js' ]
      },
      bin: {
        src: [ 'bin/*' ]
      },
      lib: {
        src: [ 'lib/*.js' ]
      }
    },
    jsonlint: {
      lib: {
        src: [ 'lib/*.json' ]
      },
      project: {
        src: [ '.eslintrc.json', 'package.json' ]
      }
    }
  });

  // load grunt plugins
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-jsonlint');

  // register grunt tasks
  grunt.registerTask('default', [ 'test' ]);
  grunt.registerTask('test', [ 'jsonlint', 'eslint' ]);
};
