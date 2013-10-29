'use strict';

var EventEmitter = require('events').EventEmitter,
  http = require('http'),
  resPaths = require('./respaths.json');

var DLREGEX = /\/wallpaper\/[\w]+\/\d+_\w+\.jpg/ig,
  USERAGENT = 'Mozilla/4.8 [en] (Windows NT 6.0; U)',
  HOST = 'interfacelift.com';

module.exports = function(resolution) {
  var downloadLinks = [],
    me = this;

  this.start = function() {
    me.emit('next', 1, resPaths[resolution]);
  };

  this.on('next', function(pageNumber, uri) {
    var requestConfig = {
      host: HOST,
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
        var nextPageReg = new RegExp(resPaths[resolution] + 'index' + pageNumber + '.html', 'ig'),
          match = pageData.match(nextPageReg),
          nextPage = (match && match.length > 0) ? match[0] : null;

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
