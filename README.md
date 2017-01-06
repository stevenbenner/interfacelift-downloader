# InterfaceLIFT Wallpaper Downloader

An InterfaceLIFT wallpaper auto-downloader and sync tool for node.js.

[![Build Status](https://travis-ci.org/stevenbenner/interfacelift-downloader.svg?branch=master)](https://travis-ci.org/stevenbenner/interfacelift-downloader)
[![Dependency Status](https://gemnasium.com/stevenbenner/interfacelift-downloader.svg)](https://gemnasium.com/stevenbenner/interfacelift-downloader)
[![NPM version](http://img.shields.io/npm/v/interfacelift-downloader.svg)](https://www.npmjs.org/package/interfacelift-downloader)

## Introduction

It takes way too long to download all of the great images in InterfaceLIFT's wallpaper collection by hand, and I'm too much of a cheap bastard to pay them for the privilege of using their bulk download service. So here is the leechers way of grabbing all of their wallpapers quickly, easily, and for free.

## Install

Install this package globally via NPM by running the following command:

```shell
npm install -g interfacelift-downloader
```

You now have access to the `interfacelift-downloader` command.

## Usage

`interfacelift-downloader [resolution] [path] [download limit]`

The `interfacelift-downloader` command accepts two arguments:

* The **resolution** option needs to be the image resolution that you want to search for (e.g. 1920x1080).
* The **path** is the path to save the downloaded files to. If specified this must be a path to a folder based on your current working directory (e.g. downloads, or ../wallpaper/1080) or the full path. (e.g. ~/downloads, or /Users/steven/downloads) If this option is omitted then files will be saved to your current working directory.
* The **download limit** is the number of files to download. For example, if this option is set to 5, the 5 most recent images will be downloaded. If this option is omitted or set to 0, there is no limit and all the images are downloaded.

### To save files to your current folder

Navigate to the path that you want to save the files in and execute the `interfacelift-downloader` command with the resolution that you want to search for as an argument. Here is an example:

```shell
interfacelift-downloader 1920x1080
```
This will tell the script to search for all images with a resolution of 1920x1080 pixels and save them to your current working directory. It will not download or overwrite any existing files.

### To save files to a specific folder

Same as above but specify the path to the save directory from your current working directory as the third argument. For example:

```shell
interfacelift-downloader 1920x1080 downloads/1920x1080
```

This will tell the script to search for all images with a resolution of 1920x1080 pixels and save them to the downloads/1920x1080 directory. It will not download or overwrite any existing files.

You can also specify a full path.

```shell
interfacelift-downloader 1920x1080 ~/downloads/1920x1080
```

```shell
interfacelift-downloader 1920x1080 /Users/steven/downloads/1920x1080
```

### To limit the total number of files downloaded

You can also limit the total number of images that the script will attempt to download. This is a great way to speed up the process and limit the size of your download. Simply pass the maximum number of images to download to the command after the download path. For example:

```shell
interfacelift-downloader 1920x1080 ~/downloads/1920x1080 15
```

That command will download up to a maximum of 15 images. Note that you must include the resolution and download path in the command for it to work.

## Reporting Bugs

If you find any bugs, want to request a new feature, or have any questions then please feel free to [open a new issue](https://github.com/stevenbenner/interfacelift-downloader/issues/new) in this GitHub project. You can also contact me on twitter at [@stevenbenner](https://twitter.com/stevenbenner).

## Contributing

Please feel free to add features or fix bugs yourself! I welcome pull requests for this project. If you would like to submit a patch then simply [fork this project](https://github.com/stevenbenner/interfacelift-downloader/fork), make your changes and submit a new pull request.

## Change Log

**v2.3.0** (Jan 6, 2017)
* Added download limit option.
* Added iphone resolutions.
* Added ipad resolutions.

**v2.2.0** (Sep 19, 2015)
* Added support for absolute paths.

**v2.1.2** (Nov 16, 2014)
* Added 21:9 monitor resolutions.
* Added portrait mode monitor resolutions.
* Added more widescreen monitor resolution.

**v2.1.1** (Apr 27, 2014)
* Added 2x2 monitor resolutions.

**v2.1.0** (Mar 22, 2014)
* Fixed unhandled exception thrown on random image redirects.
* Fixed unhandled exception thrown on 404 errors.
* Fixed resolution parameter being ignored when path is specified.
* Argument errors will now cause the process to exit with a failure code.
* Optimized how files are saved to disk.
* Optimized call stack memory usage for image downloader.

**v2.0.2** (Dec 14, 2013)
* Added dual monitor resolutions.
* Added triple monitor resolutions.
* Added netbook monitor resolutions.
* Added 1600x900 monitor resolution.

**v2.0.1** (Mar 27, 2013)
* Added destination path option to CLI.

**v2.0.0** (Mar 20, 2013)
* Removed http-agent dependency to support Node.js 0.10.0.
* Added NPM support to the project.
* The script will no longer create download folders.
* Major refactor of the project to use modular code.

**v1.0.0** (Feb 23, 2013)
* Initial public release.

## License

*(This project is released under the [MIT license](https://raw.github.com/stevenbenner/interfacelift-downloader/master/LICENSE.txt).)*

Copyright (c) 2017 Steven Benner (http://stevenbenner.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
