/// <reference types="node" />
import { Transform } from "stream";
type Sizes = number[];
declare class CompressOptions {
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
declare function optimizeImages(options: Options): Transform;
export = optimizeImages;
//# sourceMappingURL=index.d.ts.map