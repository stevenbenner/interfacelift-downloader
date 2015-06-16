/*
 * InterfaceLIFT Wallpaper Auto-Downloader
 * https://github.com/stevenbenner/interfacelift-downloader
 *
 * Copyright (c) 2014 Steven Benner (http://stevenbenner.com/).
 * Released under the MIT License.
 */

'use strict';

var PageScraper = require('./pagescraper');
var Downloader = require('./downloader');
var fs = require('fs');
var path = require('path');
var resPaths = require('./respaths.json');

module.exports = {

  process: function(args) {
    var resolution = '1920x1080';
    var downloadPath = process.cwd();

    if (args.length > 4 || (args.length === 3 && args[2] === '--help')) {
      module.exports.help();
      process.exit(0);
    }

    if (args.length >= 3) {
      if (resPaths[args[2]]) {
        resolution = args[2];
      } else {
        console.log('"' + args[2] + '" is not a known resolution.');
        process.exit(1);
      }
    }

    if (args.length >= 4) {
      if (args[3].charAt(0) === '/' || args[3].charAt(0) === '~') {
        downloadPath = args[3];
      } else {
        downloadPath = path.join(downloadPath, args[3]);
      }

      if (!fs.existsSync(downloadPath)) {
        console.log('The path "' + args[3] + '" does not exist.');
        process.exit(1);
      }
    }

    module.exports.run(resolution, downloadPath);
  },

  run: function(resolution, downloadPath) {
    var startTime = new Date();
    var ps = new PageScraper(resolution);
    var existingFiles = 0;

    // run the page scraper
    ps.on('next', function(pageNumber) {
      console.log('Scanning Page ' + pageNumber + '...');
    });
    ps.on('end', function(downloadLinks) {
      var index = downloadLinks.length;
      var elapesdSeconds = (new Date() - startTime) / 1000;
      var dl = new Downloader(downloadLinks, downloadPath, resolution);

      dl.on('start', function() {
        console.log('Starting Download...\n');
      });
      dl.on('exist', function() {
        existingFiles++;
        index--;
      });
      dl.on('save', function(fileName) {
        console.log('[' + index + '] Saved: ' + fileName);
        index--;
      });
      dl.on('fail', function(fileName) {
        console.log('[' + index + '] Failed: ' + fileName);
        index--;
      });
      dl.on('end', function() {
        var elapesdSeconds = (new Date() - startTime) / 1000;
        console.log('Download competed in ' + elapesdSeconds + ' seconds.');
        console.log('Already had ' + existingFiles + ' images.');
      });

      console.log('Scrape completed in ' + elapesdSeconds + ' seconds. Found ' + index + ' images.');
      dl.start();
    });

    console.log('InterfaceLIFT Wallpaper Auto-Downloader\n');
    console.log([
      'Searching pages for images...',
      '(The download will begin after the page scan finishes.)'
    ].join('\n'));
    ps.start();
  },

  help: function() {
    console.log([
      'Usage: node interfacelift-downloader [resolution] [path]',
      'Resolution is the dimensions of the images you want to search for.',
      'For example: interfacelift-downloader 1920x1080'
    ].join('\n'));
  }

};
