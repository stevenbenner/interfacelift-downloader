/*
 * InterfaceLIFT Wallpaper Auto-Downloader v1.0.0
 *
 * Copyright (c) 2013 Steven Benner (http://stevenbenner.com/).
 * Released under the MIT License.
 *
 * Description:
 * It takes way too long to download all of the great photos in InterfaceLIFT's
 * wallpaper collection by hand, and I'm too much of a cheap bastard to pay them
 * for the privilege of using their bulk download service. So here is the
 * leechers way of grabbing all of their wallpapers quickly, easily, for free.
 *
 * Usage:
 * npm install http-agent
 * node interfacelift-downloader.js [resolution]
 */

/* jslint node: true */
'use strict';

// command line options
var resolution = '1920x1080';

// load modules
var httpAgent = require('http-agent'),
	http = require('http'),
	url = require('url'),
	fs = require('fs');

// resolution definitions
var RESINFO = {
	// widescreen 16:10
	'2880x1800': '/wallpaper/downloads/date/widescreen/2880x1800/',
	'2560x1600': '/wallpaper/downloads/date/widescreen/2560x1600/',
	'2560x1440': '/wallpaper/downloads/date/widescreen/2560x1440/',
	'1920x1200': '/wallpaper/downloads/date/widescreen/1920x1200/',
	'1680x1050': '/wallpaper/downloads/date/widescreen/1680x1050/',
	'1440x900':  '/wallpaper/downloads/date/widescreen/1440x900/',
	'1280x800':  '/wallpaper/downloads/date/widescreen/1280x800/',
	// widescreen 16:9
	'1920x1080': '/wallpaper/downloads/date/hdtv/1080p/',
	'1280x720':  '/wallpaper/downloads/date/hdtv/720p/',
	// fullscreen 4:3
	'1600x1200': '/wallpaper/downloads/date/fullscreen/1600x1200/',
	'1400x1050': '/wallpaper/downloads/date/fullscreen/1400x1050/',
	'1280x1024': '/wallpaper/downloads/date/fullscreen/1280x1024/',
	'1280x960':  '/wallpaper/downloads/date/fullscreen/1280x960/',
	'1024x768':  '/wallpaper/downloads/date/fullscreen/1024x768/'
};

// define constants
var DLREGEX = /\/wallpaper\/[\w]+\/\d+_\w+\.jpg/ig,
	USERAGENT = 'Mozilla/4.8 [en] (Windows NT 6.0; U)',
	HOST = 'interfacelift.com',
	DOWNLOADPATH = 'downloads/';

// variable init
var imageLinks = [],
	skippedImages = [],
	startTime = new Date();

// program init
console.log('InterfaceLIFT Wallpaper Auto-Downloader\n');
processArguments();

// create directories if they do not already exist
if (!fs.existsSync(DOWNLOADPATH)) {
	fs.mkdirSync(DOWNLOADPATH);
}
if (!fs.existsSync(DOWNLOADPATH + resolution)) {
	fs.mkdirSync(DOWNLOADPATH + resolution);
}

// start scraping
var agent = httpAgent.create(
	HOST,
	[
		{
			method: 'GET',
			uri: RESINFO[resolution],
			headers: {
				'User-Agent': USERAGENT
			}
		}
	]
);
setupHttpAgent();
agent.start();

function processArguments() {
	var args = process.argv.slice(2);

	if (args.length > 1 || (args.length === 1 && args[0] === '--help')) {
		outputUsage();
		process.exit(0);
	}

	if (args.length === 1) {
		if (RESINFO[args[0]]) {
			resolution = args[0];
		} else {
			console.log('"' + args[0] + '" is not a known resolution.');
			process.exit(0);
		}
	}

	function outputUsage() {
		console.log([
			'Usage: node interfacelift-downloader.js [resolution]\n',
			'Resolution is the dimensions of the images you want to search for.',
			'For example: node interfacelift-downloader.js 1920x1080'
		].join('\n'));
	}
}

function setupHttpAgent() {
	var pageNumber = 1;

	// hook next event
	agent.addListener('next', function(err, agent) {
		console.log('Scanning Page ' + pageNumber + '...');

		// grab image download links
		var matches = agent.body.match(DLREGEX);
		matches.forEach(function(href) {
			// filter out preview images
			// i couldn't get regex lookaheads working
			if (href.indexOf('previews') === -1) {
				imageLinks.push(href);
			}
		});

		// grab next page link
		pageNumber++;
		var nextPageReg = new RegExp(RESINFO[resolution] + 'index' + pageNumber + '.html', 'ig'),
			match = agent.body.match(nextPageReg),
			nextPage = (match && match.length > 0) ? match[0] : null;

		// if there is a next page add it to the agent queue
		if (nextPage) {
			agent.addUrl(
				{
					method: 'GET',
					uri: nextPage,
					headers: {
						'User-Agent': USERAGENT
					}
				}
			);
		}

		// proceed to the next uri
		agent.next();
	});

	// hook stop event
	agent.addListener('stop', function(err) {
		var elapesdSeconds = (new Date() - startTime) / 1000;
		if (err) {
			console.log(err);
		}
		console.log('\nScrape completed in ' + elapesdSeconds + ' seconds. Found ' + imageLinks.length + ' images.');
		console.log('Starting Download...\n');
		downloadImages();
	});
}

function downloadImages() {
	var nextImage = imageLinks.shift();
	if (nextImage) {
		download(nextImage);
	} else {
		var elapesdSeconds = (new Date() - startTime) / 1000;
		console.log('Download competed in ' + elapesdSeconds + ' seconds.');
		console.log('Skipped ' + skippedImages.length + ' images.');
	}
}

function download(uri) {
	var fileNameRegEx = new RegExp('\\d+_\\w+_' + resolution + '\\.jpg', 'i'),
		fileName = fileNameRegEx.exec(uri),
		filePath = DOWNLOADPATH + resolution + '/' + fileName;

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
					'Referer': 'http://' + HOST + RESINFO[resolution]
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
						download(url.parse(response.headers.location).path);
						return;
					}

					// save the file
					fs.writeFile(filePath, imagedata, 'binary', function(err) {
						if (err) {
							console.log(err);
						}
						console.log('[' + imageLinks.length + '] Saved: ' + fileName);

						// continue through the download queue
						downloadImages();
					});
				});
			}
		);
	} else {
		skippedImages.push(fileName);
		//console.log('[' + (imageLinks.length + 1) + '] Skipped: ' + fileName + ' (File exists)');
		downloadImages();
	}
}
