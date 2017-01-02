/*
 * Grunt Config
 */

'use strict';

module.exports = function(grunt) {
  // configure grunt
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      grunt: {
        src: [ 'Gruntfile.js' ],
        options: {
          jshintrc: '.jshintrc'
        }
      },
      bin: {
        src: [ 'bin/*' ],
        options: {
          jshintrc: '.jshintrc'
        }
      },
      lib: {
        src: [ 'lib/*.js' ],
        options: {
          jshintrc: '.jshintrc'
        }
      }
    },
    jsonlint: {
      lib: {
        src: [ 'lib/*.json' ]
      },
      project: {
        src: [ '.jshintrc', 'package.json' ]
      }
    }
  });

  // load grunt plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsonlint');

  // register grunt tasks
  grunt.registerTask('default', [ 'jshint', 'jsonlint' ]);
  grunt.registerTask('travis', [ 'jshint', 'jsonlint' ]);
};
