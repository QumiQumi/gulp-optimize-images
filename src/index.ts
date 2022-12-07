import through = require("through2");
import Vinyl = require("vinyl");
import sharp = require("sharp");
import path = require("path");

type Sizes = number[];

// https://sharp.pixelplumbing.com/api-output
class CompressOptions {
	jpeg?: Object;
	png?: Object;
	webp?: Object;
	gif?: Object;
	tiff?: Object;
	avif?: Object;
	heif?: Object;
}

const ALLOWED_EXTENTIONS = [
	".jpeg",
	".jpg",
	".png",
	".gif",
	".tiff",
	".webp",
	".avif",
];

function optimizeImages(
	compressOptions= new CompressOptions(),
	sizes: Sizes = []
) {
	if (compressOptions instanceof CompressOptions) {
		throw Error("compressOptions has incorrect structure");
	}
	if (!Array.isArray(sizes)) {
		throw Error("sizes should be an Array");
	}
	for (const key in sizes) {
		if (typeof key !== "number") {
			throw Error("sizes can contain only numbers");	
		}
	}
	return through.obj(collect);

	async function collect(file, enc, cb) {
		if (ALLOWED_EXTENTIONS.includes(file.extname)) {
			const resizedArray = await resize(file);
			for (const resizedImage of resizedArray) {
				const compressedFile = await compress(resizedImage);
				if (compressedFile) {
					this.push(compressedFile);
				} else {
					this.push(file);
				}
			}
		} else {
			this.push(file);
		}

		return cb();
	}

	async function resize(file) {
		const imagesArray = [file];
		if (sizes.length) {
			const sharpInstance = sharp(file.contents);
			const meta = await sharpInstance.metadata();
			const width = meta.width;
			const imgSizes = sizes.filter((size) => size < width);
			for (const size of imgSizes) {
				const buffer = await sharpInstance
					.clone()
					.resize({
						withoutEnlargement: true,
						width: size,
					})
					.toBuffer();
				const parsesPath = path.parse(file.path);
				const newPath = path.format({
					dir: parsesPath.dir,
					name: parsesPath.name + "-" + size,
					ext: parsesPath.ext,
				});
				imagesArray.push(
					toVinyl(buffer, {
						cwd: file.cwd,
						base: file.base,
						path: newPath,
					})
				);
			}
		}

		return imagesArray;
	}
	async function compress(file) {
		let sharpInstance;
		try {
			sharpInstance = sharp(file.contents, { animated: true });
		} catch (error) {
			console.warn(Error);
			console.warn("Copy this file...");
			return false;
		}

		switch (file.extname) {
			case ".gif":
				sharpInstance = sharpInstance.gif(compressOptions.gif);
				break;
			case ".png":
				sharpInstance = sharpInstance.png(compressOptions.png);
				break;
			case ".jpg":
			case ".jpeg":
				sharpInstance = sharpInstance.jpeg(compressOptions.jpeg);
				break;
			case ".tiff":
				sharpInstance = sharpInstance.tiff(compressOptions.tiff);
				break;
			case ".avif":
				sharpInstance = sharpInstance.avif(compressOptions.avif);
				break;
			case ".heif":
				sharpInstance = sharpInstance.heif(compressOptions.heif);
				break;
			default:
				return false;
		}
		const buffer = await sharpInstance.toBuffer();
		return toVinyl(buffer, file);
	}
	function toVinyl(buffer, file) {
		return new Vinyl({
			cwd: file.cwd,
			base: file.base,
			path: file.path,
			contents: buffer,
		});
	}
}
module.exports = optimizeImages;
