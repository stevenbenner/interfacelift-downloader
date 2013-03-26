# InterfaceLIFT Wallpaper Auto-Downloader

An InterfaceLIFT wallpaper auto-downloader for node.js.

## Introduction

It takes way too long to download all of the great images in InterfaceLIFT's wallpaper collection by hand, and I'm too much of a cheap bastard to pay them for the privilege of using their bulk download service. So here is the leechers way of grabbing all of their wallpapers quickly, easily, and for free.

## Install

Install this package globally via NPM by running the following command:

```shell
npm install -g interfacelift-downloader
```

You now have access to the `interfacelift-downloader` command.

## Usage

`interfacelift-downloader [resolution] [path]`

The `interfacelift-downloader` command accepts two arguments:

* The **resolution** option needs to be the image resolution that you want to search for (e.g. 1920x1080).
* The **path** is the path to save the downloaded files to. If specified this must be a path to a folder based on your current working directory (e.g. downloads, or ../wallpaper/1080). If this option is omitted then files will be saved to your current working directory.

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

## Reporting Bugs

If you find any bugs, want to request a new feature, or have any questions then please feel free to [open a new issue](https://github.com/stevenbenner/interfacelift-downloader/issues/new) in this GitHub project. You can also contact me on twitter at [@stevenbenner](https://twitter.com/stevenbenner).

## Contributing

Please feel free to add features or fix bugs yourself! I welcome pull requests for this project. If you would like to submit a patch then simply [fork this project](https://github.com/stevenbenner/interfacelift-downloader/fork), make your changes and submit a new pull request.

## License

*(This project is released under the [MIT license](https://raw.github.com/stevenbenner/interfacelift-downloader/master/LICENSE.txt).)*

Copyright (c) 2013 Steven Benner (http://stevenbenner.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
