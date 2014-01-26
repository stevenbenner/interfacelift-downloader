/*
 * InterfaceLIFT Wallpaper Auto-Downloader
 * https://github.com/stevenbenner/interfacelift-downloader
 *
 * Copyright (c) 2014 Steven Benner (http://stevenbenner.com/).
 * Released under the MIT License.
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var resPaths = require('./respaths.json');

var USERAGENT = 'Mozilla/4.8 [en] (Windows NT 6.0; U)';
var HOST = 'interfacelift.com';

module.exports = function(uriList, downloadPath, resolution) {
  var fileNameRegEx = new RegExp('\\d+_\\w+_' + resolution + '\\.jpg', 'i');
  var me = this;

  function runNextUri() {
    var nextImage = uriList.shift();
    if (nextImage) {
      me.emit('next', nextImage);
    } else {
      me.emit('end');
    }
  }

  this.start = function() {
    runNextUri();
  };

  this.on('next', function(uri) {
    var fileName = fileNameRegEx.exec(uri);
    var filePath = path.join(downloadPath, fileName[0]);
    var requestConfig = {
      host: HOST,
      port: 80,
      path: uri,
      headers: {
        'User-Agent': USERAGENT,
        'Referer': 'http://' + HOST + resPaths[resolution]
      }
    };

    // if the file does not already exist
    if (!fs.existsSync(filePath)) {
      // dowload the file
      http.get(requestConfig, function(response) {
        var image = '';

        response.setEncoding('binary');
        response.on('data', function(chunk) {
          image += chunk;
        });
        response.on('end', function() {
          switch (Math.floor(response.statusCode / 100)) {
          case 2:
            // 200 status codes
            fs.writeFile(filePath, image, 'binary', function() {
              me.emit('save', fileName);
            });
            runNextUri();
            break;
          case 3:
            // 300 status codes
            // seemingly at random, the details page is specified as the location instead of the image
            if (response.headers.location && fileNameRegEx.test(response.headers.location)) {
              me.emit('next', url.parse(response.headers.location).path);
            } else {
              me.emit('fail', fileName);
              runNextUri();
            }
            break;
          default:
            // 400 and 500 status codes
            me.emit('fail', fileName);
            runNextUri();
          }
        });
      });
    } else {
      me.emit('exist', fileName);
      runNextUri();
    }
  });
};

module.exports.prototype = Object.create(EventEmitter.prototype);
