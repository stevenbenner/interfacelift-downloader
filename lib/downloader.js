/*
 * InterfaceLIFT Wallpaper Auto-Downloader
 * https://github.com/stevenbenner/interfacelift-downloader
 *
 * Copyright (c) 2013 Steven Benner (http://stevenbenner.com/).
 * Released under the MIT License.
 */

'use strict';

var EventEmitter = require('events').EventEmitter,
  http = require('http'),
  url = require('url'),
  fs = require('fs'),
  resPaths = require('./respaths.json');

var USERAGENT = 'Mozilla/4.8 [en] (Windows NT 6.0; U)',
  HOST = 'interfacelift.com';

module.exports = function(uriList, downloadPath, resolution) {
  var skippedImages = [],
    me = this;

  function runNextUri() {
    var nextImage = uriList.shift();
    if (nextImage) {
      me.emit('next', nextImage);
    } else {
      me.emit('end', skippedImages);
    }
  }

  this.start = function() {
    runNextUri();
  };

  this.on('next', function(uri) {
    var fileNameRegEx = new RegExp('\\d+_\\w+_' + resolution + '\\.jpg', 'i'),
      fileName = fileNameRegEx.exec(uri),
      filePath = downloadPath + '/' + fileName;

    // if the file does not already exist
    if (!fs.existsSync(filePath)) {
      // dowload the file
      http.get(
        {
          host: HOST,
          port: 80,
          path: uri,
          headers: {
            'User-Agent': USERAGENT,
            'Referer': 'http://' + HOST + resPaths[resolution]
          }
        },
        function(response) {
          var imagedata = '';

          response.setEncoding('binary');

          response.on('data', function(chunk) {
            imagedata += chunk;
          });

          response.on('end', function() {
            // handle redirects
            if (response.statusCode > 300 && response.statusCode < 400 && response.headers.location) {
              me.emit('next', url.parse(response.headers.location).path);
              return;
            }

            // save the file
            fs.writeFile(filePath, imagedata, 'binary', function() {
              me.emit('save', fileName, uriList.length);

              // continue through the download queue
              runNextUri();
            });
          });
        }
      );
    } else {
      skippedImages.push(fileName);
      runNextUri();
    }
  });
};

module.exports.prototype = Object.create(EventEmitter.prototype);
