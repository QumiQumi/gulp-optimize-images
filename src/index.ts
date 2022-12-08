import path from "path";
import sharp, { Sharp } from "sharp";
import { Transform } from "stream";
import through from "through2";
import Vinyl from "vinyl";

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
interface Options {
	sharpOptions: Object;
	compressOptions: CompressOptions;
	sizes: Sizes;
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
const consoleColorWarn = "\x1b[33m";
const consoleColorError = "\x1b[31m";
function optimizeImages(options: Options): Transform {
	const compressOptions = options.compressOptions || {};
	const sizes = options.sizes || [];
	const sharpOptions = options.sharpOptions || {};

	if (typeof compressOptions !== "object") {
		throw Error("compressOptions has incorrect structure");
	}
	if (!Array.isArray(sizes)) {
		throw Error("sizes should be an Array");
	}
	for (const size of sizes) {
		if (typeof size !== "number") {
			throw Error("sizes can contain only numbers");
		}
	}
	return through.obj(async function (file: Vinyl.BufferFile, enc, cb) {
		if (!file.isDirectory() && !file.isNull()) {
			if (ALLOWED_EXTENTIONS.includes(file.extname)) {
				const resizedArray = await resize(file);
				for (const resizedImage of resizedArray) {
					try {
						const compressedFile = await compress(resizedImage);
						this.push(compressedFile);
					} catch (error) {
						console.error(
							consoleColorError,
							`${error} at file ${file.relative}. Copy file.`
						);
						this.push(file);
					}
				}
			} else {
				console.warn(
					consoleColorWarn,
					`Extention ${file.extname} is not processed. Copy file ${file.relative}`
				);
				this.push(file);
			}
		}

		return cb();
	});

	async function resize(file: Vinyl.BufferFile) {
		const imagesArray = [file];
		if (sizes?.length) {
			const sharpInstance = createSharpInstance(file);
			const meta = await sharpInstance.metadata();
			const width = meta.width ?? 0;
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
	async function compress(file: Vinyl.BufferFile) {
		let sharpInstance = createSharpInstance(file);
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
			case ".webp":
				sharpInstance = sharpInstance.webp(compressOptions.webp);
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
	function toVinyl(buffer: Buffer, file) {
		return new Vinyl({
			cwd: file.cwd,
			base: file.base,
			path: file.path,
			contents: buffer,
		});
	}

	function createSharpInstance(file: Vinyl.BufferFile): Sharp {
		return sharp(file.contents, { animated: true, ...sharpOptions });
	}
}
export = optimizeImages;
