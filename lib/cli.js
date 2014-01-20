/*
 * InterfaceLIFT Wallpaper Auto-Downloader
 * https://github.com/stevenbenner/interfacelift-downloader
 *
 * Copyright (c) 2013 Steven Benner (http://stevenbenner.com/).
 * Released under the MIT License.
 */

'use strict';

var PageScraper = require('./pagescraper'),
  Downloader = require('./downloader'),
  fs = require('fs'),
  path = require('path'),
  resPaths = require('./respaths.json');

module.exports = {

  process: function(args) {
    var resolution = '1920x1080',
      downloadPath = process.cwd();

    if (args.length > 4 || (args.length === 3 && args[2] === '--help')) {
      module.exports.help();
      process.exit(0);
    }

    if (args.length >= 3) {
      if (resPaths[args[2]]) {
        resolution = args[2];
      } else {
        console.log('"' + args[2] + '" is not a known resolution.');
        process.exit(0);
      }
    }

    if (args.length >= 4) {
      var destPath = path.join(downloadPath, args[3]);
      if (fs.existsSync(destPath)) {
        downloadPath = destPath;
      } else {
        console.log('The path "' + args[3] + '" does not exist.');
        process.exit(0);
      }
    }

    module.exports.run(resolution, downloadPath);
  },

  run: function(resolution, downloadPath) {
    console.log('InterfaceLIFT Wallpaper Auto-Downloader\n');

    var startTime = new Date();

    // run the page scraper
    var ps = new PageScraper(resolution);
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
      dl.on('exist', function(fileName) {
        console.log('[' + index + '] Existed: ' + fileName);
        index--;
      });
      dl.on('save', function(fileName) {
        console.log('[' + index + '] Saved: ' + fileName);
        index--;
      });
      dl.on('skip', function(fileName) {
        console.log('[' + index + '] Skipped: ' + fileName);
        index--;
      });

      console.log('Scrape completed in ' + elapesdSeconds + ' seconds. Found ' + index + ' images.');
      dl.start();
    });
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
