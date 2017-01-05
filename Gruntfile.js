/*
 * Grunt Config
 */

'use strict';

module.exports = function(grunt) {
  // configure grunt
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
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
    jscs: {
      options: {
        config: '.jscsrc'
      },
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
        src: [ '.jscsrc', '.jshintrc', 'package.json' ]
      }
    }
  });

  // load grunt plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-jsonlint');

  // register grunt tasks
  grunt.registerTask('default', [ 'jshint', 'jscs', 'jsonlint' ]);
  grunt.registerTask('travis', [ 'jshint', 'jscs', 'jsonlint' ]);
};
