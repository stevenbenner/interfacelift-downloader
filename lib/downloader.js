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
  path = require('path'),
  resPaths = require('./respaths.json');

var USERAGENT = 'Mozilla/4.8 [en] (Windows NT 6.0; U)',
  HOST = 'interfacelift.com';

module.exports = function(uriList, downloadPath, resolution) {
  var me = this;

  function runNextUri() {
    var nextImage = uriList.shift();

    if (nextImage) {
      me.emit('next', nextImage);
    }
  }

  this.start = function() {
    runNextUri();
  };

  this.on('next', function(uri) {
    var fileNameRegEx = new RegExp('\\d+_\\w+_' + resolution + '\\.jpg', 'i'),
      fileName = fileNameRegEx.exec(uri),
      filePath = path.join(downloadPath, fileName[0]);

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
          var image = '';

          response.setEncoding('binary');
          response.on('data', function(chunk) { image += chunk; });
          response.on('end', function() {
            switch (Math.floor(response.statusCode / 100)) {
              // 200 status codes.
              case 2:
                (function (a, b, c) {
                  fs.writeFile(b, a, 'binary', function() {
                    me.emit('save', c);
                  });
                })(image, filePath, fileName);

                runNextUri();
                break;

              // 300 status codes.
              case 3:
                // Seemingly at random, the details page is specified as the location instead of the image.
                if (response.headers.location && fileNameRegEx.test(response.headers.location)) {
                  me.emit('next', url.parse(response.headers.location).path);
                } else {
                  me.emit('skip', fileName);
                }

                runNextUri();
                break;

              // 400 and 500 status codes.
              default:
                me.emit('skip', fileName);

                runNextUri();
                break;
            }

            return;
          });
        }
      );
    } else {
      me.emit('exist', fileName);
      runNextUri();
    }
  });
};

module.exports.prototype = Object.create(EventEmitter.prototype);
