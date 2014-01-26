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
var resPaths = require('./respaths.json');

var DLREGEX = /\/wallpaper\/[\w]+\/\d+_\w+\.jpg/ig;
var USERAGENT = 'Mozilla/4.8 [en] (Windows NT 6.0; U)';
var HOST = 'interfacelift.com';

module.exports = function(resolution) {
  var downloadLinks = [];
  var me = this;

  this.start = function() {
    me.emit('next', 1, resPaths[resolution]);
  };

  this.on('next', function(pageNumber, uri) {
    var requestConfig = {
      hostname: HOST,
      port: 80,
      path: uri,
      headers: {
        'User-Agent': USERAGENT
      }
    };

    http.get(requestConfig, function(response) {
      var pageData = '';

      response.on('data', function(chunk) {
        pageData += chunk;
      });

      response.on('end', function() {
        // grab image download links
        var matches = pageData.match(DLREGEX);
        matches.forEach(function(href) {
          // filter out preview images
          // i couldn't get regex lookaheads working
          if (href.indexOf('previews') === -1) {
            downloadLinks.push(href);
          }
        });

        // grab next page link
        pageNumber++;
        var nextPageReg = new RegExp(resPaths[resolution] + 'index' + pageNumber + '.html', 'ig');
        var match = pageData.match(nextPageReg);
        var nextPage = (match && match.length > 0) ? match[0] : null;

        // if there is a next page run the next callback, or end
        if (nextPage) {
          me.emit('next', pageNumber, nextPage);
        } else {
          me.emit('end', downloadLinks);
        }
      });
    });

  });
};

module.exports.prototype = Object.create(EventEmitter.prototype);
