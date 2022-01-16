/*
 * InterfaceLIFT Wallpaper Auto-Downloader
 * https://github.com/stevenbenner/interfacelift-downloader
 *
 * Copyright 2022 Steven Benner (https://stevenbenner.com/).
 * Released under the MIT License.
 */

'use strict';

var events = require('events');
var https = require('https');
var url = require('url');
var fs = require('fs');
var path = require('path');
var util = require('util');
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

  function saveFile(filePath, fileName, incomingMessage) {
    var image = '';
    incomingMessage.setEncoding('binary');
    incomingMessage.on('data', function(chunk) {
      image += chunk;
    });
    incomingMessage.on('end', function() {
      fs.writeFile(filePath, image, 'binary', function() {
        me.emit('save', fileName);
      });
      setImmediate(runNextUri);
    });
  }

  function handleRedirect(fileName, incomingMessage) {
    var locationHeader = incomingMessage.headers.location;
    // seemingly at random, the details page is specified as the location
    // instead of the image
    if (locationHeader && fileNameRegEx.test(locationHeader)) {
      me.emit('next', url.parse(incomingMessage.headers.location).path);
    } else {
      failFile(fileName);
    }
  }

  function failFile(fileName) {
    me.emit('fail', fileName);
    setImmediate(runNextUri);
  }

  this.start = function() {
    setImmediate(runNextUri);
  };

  this.on('next', function(uri) {
    var fileName = fileNameRegEx.exec(uri);
    var filePath = path.join(downloadPath, fileName[0]);
    var requestConfig = {
      hostname: HOST,
      port: 443,
      path: uri,
      headers: {
        'User-Agent': USERAGENT,
        Referer: 'https://' + HOST + resPaths[resolution]
      }
    };

    // skip the file if it already exists
    if (fs.existsSync(filePath)) {
      me.emit('exist', fileName);
      setImmediate(runNextUri);
      return;
    }

    // request the file
    https.get(requestConfig, function(response) {
      switch (Math.floor(response.statusCode / 100)) {
        case 2:
          // 200 status codes
          saveFile(filePath, fileName, response);
          break;
        case 3:
          // 300 status codes
          handleRedirect(fileName, response);
          break;
        default:
          // 400 and 500 status codes
          failFile(fileName);
      }
    });
  });
};

util.inherits(module.exports, events.EventEmitter);
