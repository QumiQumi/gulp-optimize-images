# [gulp](http://gulpjs.com)-optimize-images 

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

const srcDir = "src";
const destDir = "dest";


const sizes = [360, 720];

// https://sharp.pixelplumbing.com/api-constructor
const sharpOptions = {
	limitInputPixels: false
}
// https://sharp.pixelplumbing.com/api-output
const compressOptions = {
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
    return src(srcDir + "/**/*")
        .pipe(optimizeImages({
			sharpOptions,
			compressOptions,
			sizes
		}))
        .pipe(dest(destDir));
}
exports.default = series(sharpImages);

```

## API

### responsive([options])

##### options.sharpOptions
Type: `Object`
Default: `{}` - Merged with default sharp constructor options

Sharp options available on https://sharp.pixelplumbing.com/api-constructor 
##### options.compressOptions

Type: `Object` 
Default: `{}` - Merged with default sharp image options
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
Available formats available on https://sharp.pixelplumbing.com/api-output. <br>
If not provided uses default sharp settings

##### options.sizes
Type: `number[]` 
Default: `[]`

Number array of width sizes. If provided, outputs images in this sizes including original size.



