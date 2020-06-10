"use strict";
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
        while (_) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var jimp_1 = __importDefault(require("jimp"));
var LEDPanel = (function () {
    function LEDPanel(width, height) {
        this.textPixelLength = 13;
        this.backgroundColor = [0, 0, 0];
        this.backgroundBright = 128;
        this.textColor = [255, 255, 255];
        this.width = width;
        this.height = height;
        this.queue = ['Started'];
    }
    ;
    LEDPanel.prototype.printFrame = function (byteList) {
        var _this = this;
        if (byteList.length != this.width * this.height * 4) {
            throw new RangeError("A entrada n\u00E3o coincide com o tamanho da imagem");
        }
        var pixelList = [];
        var counter = 0;
        var tempValue = [];
        byteList.forEach(function (value) {
            if (++counter == 4) {
                counter = 0;
                pixelList.push(tempValue);
                tempValue = [];
            }
            tempValue.push(value);
        });
        pixelList.forEach(function () {
            var line = pixelList.splice(0, _this.width);
            var lineToPrint = line.map(function (v) {
                return v.toString() == [255, 255, 255, 255].toString() ? 'B' : '.';
            });
            console.log(lineToPrint.join(' '));
        });
    };
    ;
    LEDPanel.prototype.createImage = function (width, height, bgColor, bgBright) {
        var w = width ? width : this.width;
        var h = height ? height : this.height;
        var bg = bgColor ? bgColor : this.backgroundColor;
        var bgB = bgBright ? bgBright : this.backgroundBright;
        return Buffer.alloc(w * h * 4, bg[0])
            .map(function (v, i) {
            return (i + 1) % 2 == 0 ? bg[1] : v;
        })
            .map(function (v, i) {
            return (i + 1) % 3 == 0 ? bg[2] : v;
        })
            .map(function (v, i) {
            return (i + 1) % 4 == 0 ? bgB : v;
        });
    };
    LEDPanel.prototype.writePixel = function (coords, color, data) {
        var dataBuffer = data;
        var line = this.width * coords[1];
        var pixel = line + coords[0];
        var offset = pixel * 4;
        color.forEach(function (value, index) {
            dataBuffer.writeUInt8(value, offset + index);
        });
        return dataBuffer;
    };
    LEDPanel.prototype.playAnimation = function (text) {
        var _this = this;
        return new Promise(function (resolv) {
            var image = new jimp_1.default(_this.width, _this.height);
            jimp_1.default.loadFont('./RobotoMono/RobotoMono.fnt', function (err, font) { return __awaiter(_this, void 0, void 0, function () {
                var textPosition;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            textPosition = this.width;
                            if (!(text.length * this.textPixelLength > this.width)) return [3, 5];
                            textPosition;
                            _a.label = 1;
                        case 1:
                            if (!(textPosition > this.width - (text.length * this.textPixelLength) - this.width)) return [3, 4];
                            console.log();
                            console.log();
                            image.bitmap.data = this.createImage();
                            image.print(font, textPosition, -5, text);
                            panel.printFrame(image.bitmap.data);
                            return [4, new Promise(function (r) { setTimeout(r, 50); })];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            textPosition--;
                            return [3, 1];
                        case 4: return [3, 7];
                        case 5:
                            image.bitmap.data = this.createImage();
                            image.print(font, 0, -5, text);
                            panel.printFrame(image.bitmap.data);
                            return [4, new Promise(function (r) { setTimeout(r, 3000); })];
                        case 6:
                            _a.sent();
                            _a.label = 7;
                        case 7:
                            resolv();
                            return [2];
                    }
                });
            }); });
        });
    };
    LEDPanel.prototype.playQueue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var phase;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!true) return [3, 2];
                        phase = this.queue[0];
                        if (this.queue.length > 1) {
                            this.queue.shift();
                        }
                        return [4, this.playAnimation(phase)];
                    case 1:
                        _a.sent();
                        return [3, 0];
                    case 2: return [2];
                }
            });
        });
    };
    LEDPanel.prototype.add2Queue = function (phase) {
        this.queue.push(phase);
    };
    return LEDPanel;
}());
var panel = new LEDPanel(40, 24);
panel.playQueue();
panel.queue.push('Olá Mundo');
panel.queue.push('Hello');
panel.queue.push('AYAYA');
//# sourceMappingURL=index.js.map