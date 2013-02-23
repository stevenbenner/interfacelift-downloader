# InterfaceLIFT Wallpaper Auto-Downloader

An InterfaceLIFT wallpaper auto-downloader script for node.js.

## Introduction

It takes way too long to download all of the great photos in InterfaceLIFT's wallpaper collection by hand, and I'm too much of a cheap bastard to pay them for the privilege of using their bulk download service. So here is the leechers way of grabbing all of their wallpapers quickly, easily, for free.

## Usage

* Get the script from this repository
* Install the dependencies `npm install`, or `npm install http-agent`.
* Run it `node interfacelift-downloader.js 1920x1080` (replace 1920x1080 with the resolution you're looking for)

The script will save the downloaded images in the `downloads\1920x1080` folder. If the downloads folder or resolution folder do not exist it will create them. It will not overwrite any files in the downloads folder that already exist.

## Reporting Bugs

If you find any bugs or have any questions then please feel free to [open a new issue](https://github.com/stevenbenner/interfacelift-downloader/issues/new). You can also contact me on twitter at [@stevenbenner](https://twitter.com/stevenbenner).

## Contributing

Please feel free to add features or fix bugs yourself! I welcome all pull requests. Just fork this project, make your changes and submit a new pull request.

## License

*(This project is released under the [MIT license](https://raw.github.com/stevenbenner/interfacelift-downloader/master/LICENSE.txt).)*

Copyright (c) 2013 Steven Benner (http://stevenbenner.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
