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
var util = require('util');
var resPaths = require('./respaths.json');

var DLREGEX = /\/wallpaper\/[\w]+\/\d+_\w+\.jpg/ig;
var USERAGENT = 'Mozilla/4.8 [en] (Windows NT 6.0; U)';
var HOST = 'interfacelift.com';

module.exports = function(resolution, downloadLimit) {
  var resPath = resPaths[resolution];
  var downloadLinks = [];
  var me = this;

  this.start = function() {
    me.emit('next', 1, resPath);
  };

  this.on('next', function(pageNumber, uri) {
    var requestConfig = {
      hostname: HOST,
      port: 443,
      path: uri,
      headers: {
        'User-Agent': USERAGENT
      }
    };

    https.get(requestConfig, function(response) {
      var pageData = '';

      response.on('data', function(chunk) {
        pageData += chunk;
      });

      response.on('end', function() {
        // grab image download links
        var matches = pageData.match(DLREGEX).filter(function(href) {
          // filter out preview images
          // i couldn't get regex lookaheads working
          return href.indexOf('previews') === -1;
        });
        downloadLinks = downloadLinks.concat(matches);

        // grab next page link
        pageNumber++;
        var nextPage = util.format('%sindex%d.html', resPath, pageNumber);

        // if there is a next page run the next callback, or end
        if (pageData.indexOf(nextPage) > -1) {
          // check that download limit has not been reached
          if (downloadLimit === 0 || downloadLinks.length < downloadLimit) {
            me.emit('next', pageNumber, nextPage);
          } else {
            me.emit('end', downloadLinks.slice(0, downloadLimit));
          }
        } else {
          me.emit('end', downloadLinks);
        }
      });
    });
  });
};

util.inherits(module.exports, events.EventEmitter);
