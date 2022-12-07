# Sharp optimize images for [gulp](http://gulpjs.com)

> Generates images at different sizes <br>
> Optimize images with given options

## Installation

`gulp-optimize-images` depends on [sharp](https://github.com/lovell/sharp).



```sh
$ npm install --save-dev gulp-optimize-image
```

## Usage

```js
const { dest, series, src } =require("gulp");
const optimizeImages =require("../dist/index");

const SRC_DIR = "src";
const DEST_DIR = "dest";


const IMG_SIZES = [360, 720];

// https://sharp.pixelplumbing.com/api-output
const IMG_COMPRESS_OPTIONS = {
    jpeg: {
        quality: 80,
        progressive: true,
    },
    png: {
        quality: 90,
        progressive: true,
        compressionLevel: 6,
    },
    webp: {
        quality: 80,
    },
};

function sharpImages() {
    return src(SRC_DIR + "/**/*")
        .pipe(optimizeImages(IMG_COMPRESS_OPTIONS, IMG_SIZES))
        .pipe(dest(DEST_DIR));
}
exports.default = series(sharpImages);

```

## API

### responsive([compressOptions?](#compressOptions), [sizes?](#sizes))

#### compressOptions
Type: `Object` 
```ts
const compressOptions = {
	jpeg?: Object;
	png?: Object;
	webp?: Object;
	gif?: Object;
	tiff?: Object;
	avif?: Object;
	heif?: Object;
}
```
Object containing options for each image format. <br>
Available formats available in https://sharp.pixelplumbing.com/api-output. <br>
If not provided uses default sharp settings

#### sizes
Type: `number[]` 

Number array of width sizes. If provided, outputs images in this sizes including original size.



