"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var path_1 = __importDefault(require("path"));
var sharp_1 = __importDefault(require("sharp"));
var through2_1 = __importDefault(require("through2"));
var vinyl_1 = __importDefault(require("vinyl"));
// https://sharp.pixelplumbing.com/api-output
var CompressOptions = /** @class */ (function () {
    function CompressOptions() {
    }
    return CompressOptions;
}());
var ALLOWED_EXTENTIONS = [
    ".jpeg",
    ".jpg",
    ".png",
    ".gif",
    ".tiff",
    ".webp",
    ".avif",
];
var consoleColorWarn = "\x1b[33m";
var consoleColorError = "\x1b[31m";
function optimizeImages(options) {
    if (options === void 0) { options = {}; }
    var compressOptions = options.compressOptions || {};
    var sizes = options.sizes || [];
    var sharpOptions = options.sharpOptions || {};
    if (typeof compressOptions !== "object") {
        throw Error("compressOptions has incorrect structure");
    }
    if (!Array.isArray(sizes)) {
        throw Error("sizes should be an Array");
    }
    for (var _i = 0, sizes_1 = sizes; _i < sizes_1.length; _i++) {
        var size = sizes_1[_i];
        if (typeof size !== "number") {
            throw Error("sizes can contain only numbers");
        }
    }
    return through2_1["default"].obj(function (file, enc, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var resizedArray, _i, resizedArray_1, resizedImage, compressedFile, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(!file.isDirectory() && !file.isNull())) return [3 /*break*/, 9];
                        if (!ALLOWED_EXTENTIONS.includes(file.extname)) return [3 /*break*/, 8];
                        return [4 /*yield*/, resize(file)];
                    case 1:
                        resizedArray = _a.sent();
                        _i = 0, resizedArray_1 = resizedArray;
                        _a.label = 2;
                    case 2:
                        if (!(_i < resizedArray_1.length)) return [3 /*break*/, 7];
                        resizedImage = resizedArray_1[_i];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, compress(resizedImage)];
                    case 4:
                        compressedFile = _a.sent();
                        this.push(compressedFile);
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        console.error(consoleColorError, "".concat(error_1, " at file ").concat(file.relative, ". Copy file."));
                        this.push(file);
                        return [3 /*break*/, 6];
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        console.warn(consoleColorWarn, "Extention ".concat(file.extname, " is not processed. Copy file ").concat(file.relative));
                        this.push(file);
                        _a.label = 9;
                    case 9: return [2 /*return*/, cb()];
                }
            });
        });
    });
    function resize(file) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var imagesArray, sharpInstance, meta, width_1, imgSizes, _i, imgSizes_1, size, buffer, parsesPath, newPath;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        imagesArray = [file];
                        if (!(sizes === null || sizes === void 0 ? void 0 : sizes.length)) return [3 /*break*/, 5];
                        sharpInstance = createSharpInstance(file);
                        return [4 /*yield*/, sharpInstance.metadata()];
                    case 1:
                        meta = _b.sent();
                        width_1 = (_a = meta.width) !== null && _a !== void 0 ? _a : 0;
                        imgSizes = sizes.filter(function (size) { return size < width_1; });
                        _i = 0, imgSizes_1 = imgSizes;
                        _b.label = 2;
                    case 2:
                        if (!(_i < imgSizes_1.length)) return [3 /*break*/, 5];
                        size = imgSizes_1[_i];
                        return [4 /*yield*/, sharpInstance
                                .clone()
                                .resize({
                                withoutEnlargement: true,
                                width: size
                            })
                                .toBuffer()];
                    case 3:
                        buffer = _b.sent();
                        parsesPath = path_1["default"].parse(file.path);
                        newPath = path_1["default"].format({
                            dir: parsesPath.dir,
                            name: parsesPath.name + "-" + size,
                            ext: parsesPath.ext
                        });
                        imagesArray.push(toVinyl(buffer, {
                            cwd: file.cwd,
                            base: file.base,
                            path: newPath
                        }));
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, imagesArray];
                }
            });
        });
    }
    function compress(file) {
        return __awaiter(this, void 0, void 0, function () {
            var sharpInstance, buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sharpInstance = createSharpInstance(file);
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
                                return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, sharpInstance.toBuffer()];
                    case 1:
                        buffer = _a.sent();
                        return [2 /*return*/, toVinyl(buffer, file)];
                }
            });
        });
    }
    function toVinyl(buffer, file) {
        return new vinyl_1["default"]({
            cwd: file.cwd,
            base: file.base,
            path: file.path,
            contents: buffer
        });
    }
    function createSharpInstance(file) {
        return (0, sharp_1["default"])(file.contents, __assign({ animated: true }, sharpOptions));
    }
}
module.exports = optimizeImages;
