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
  resPaths = require('./respaths.json');

module.exports = {

  process: function(args) {
    var resolution = '1920x1080';

    if (args.length > 3 || (args.length === 3 && args[2] === '--help')) {
      module.exports.help();
      process.exit(0);
    }

    if (args.length === 3) {
      if (resPaths[args[2]]) {
        resolution = args[2];
      } else {
        console.log('"' + args[2] + '" is not a known resolution.');
        process.exit(0);
      }
    }

    module.exports.run(resolution, process.cwd());
  },

  run: function(resolution, downloadPath) {
    console.log('InterfaceLIFT Wallpaper Auto-Downloader\n');

    var startTime = new Date();

    // create directories if they do not already exist
    if (!fs.existsSync(downloadPath)) {
      fs.mkdirSync(downloadPath);
    }

    // run the page scraper
    var ps = new PageScraper(resolution);
    ps.on('next', function(pageNumber) {
      console.log('Scanning Page ' + pageNumber + '...');
    });
    ps.on('end', function(downloadLinks) {
      var elapesdSeconds = (new Date() - startTime) / 1000;
      console.log('Scrape completed in ' + elapesdSeconds + ' seconds. Found ' + downloadLinks.length + ' images.');

      // run the image downloader
      var dl = new Downloader(downloadLinks, downloadPath, resolution);
      dl.on('start', function() {
        console.log('Starting Download...\n');
      });
      dl.on('save', function(fileName, index) {
        console.log('[' + index + '] Saved: ' + fileName);
      });
      dl.on('end', function(skippedImages) {
        var elapesdSeconds = (new Date() - startTime) / 1000;
        console.log('Download competed in ' + elapesdSeconds + ' seconds.');
        console.log('Skipped ' + skippedImages.length + ' images.');
      });
      dl.start();
    });
    ps.start();
  },

  help: function() {
    console.log([
      'Usage: node interfacelift-downloader [resolution]',
      'Resolution is the dimensions of the images you want to search for.',
      'For example: interfacelift-downloader 1920x1080'
    ].join('\n'));
  }

};
