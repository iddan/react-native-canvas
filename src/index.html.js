export default `<html><head>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scaleable=no" name="viewport">
    <style>
      html {
        -ms-content-zooming: none;
        -ms-touch-action: pan-x pan-y;
      }
      body {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: 0;
        padding: 0;
        overflow: hidden;
      }
      * {
        user-select: none;
        -ms-user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
      }
    </style>
  </head>
  <body>
    <script>(function () {
    if (CanvasRenderingContext2D.useSVGMatrix === void 0) {
        CanvasRenderingContext2D.useSVGMatrix = false;
    }
    CanvasRenderingContext2D.arrayToSVGMatrix = function (matrix) {
        if (matrix instanceof SVGMatrix) {
            return matrix;
        }
        else if (matrix instanceof Array) {
            var _matrix = document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGMatrix();
            _matrix.a = array[0];
            _matrix.b = array[1];
            _matrix.c = array[2];
            _matrix.d = array[3];
            _matrix.e = array[4];
            _matrix.f = array[5];
            return _matrix;
        }
        else {
            throw new Error('Matrix is not an Array');
        }
    };
    CanvasRenderingContext2D.svgMatrixToArray = function (matrix) {
        if (matrix instanceof Array) {
            return matrix;
        }
        else if (matrix instanceof SVGMatrix) {
            return [
                matrix.a,
                matrix.b,
                matrix.c,
                matrix.d,
                matrix.e,
                matrix.f
            ];
        }
        else {
            throw new Error('Matrix is not a SVGMatrix');
        }
    };
})();
(function () {
    var canvasRenderingContext2DPrototype = CanvasRenderingContext2D.prototype;
    var HTMLCanvasElementPrototype = HTMLCanvasElement.prototype;
    if (!('resetTransform' in canvasRenderingContext2DPrototype)) {
        canvasRenderingContext2DPrototype.resetTransform = function () {
            this.setTransform(1, 0, 0, 1, 0, 0);
        };
    }
    if (!('currentTransform' in canvasRenderingContext2DPrototype)) {
        if ('mozCurrentTransform' in canvasRenderingContext2DPrototype) {
            Object.defineProperty(canvasRenderingContext2DPrototype, 'currentTransform', {
                get: function () {
                    return this.mozCurrentTransform;
                },
                set: function (matrix) {
                    this.mozCurrentTransform = matrix;
                },
                enumerable: true,
                configurable: true
            });
        }
        else {
            var getContext = HTMLCanvasElementPrototype.getContext;
            HTMLCanvasElementPrototype.getContext = function (contextType, contextAttributes) {
                var context = getContext.call(this, contextType, contextAttributes);
                switch (contextType) {
                    case '2d':
                        Object.defineProperties(context, {
                            '_transformStack': { value: [], configurable: true, writable: true },
                            '_transformMatrix': { value: [1, 0, 0, 1, 0, 0], configurable: true, writable: true }
                        });
                        break;
                }
                return context;
            };
            Object.defineProperty(canvasRenderingContext2DPrototype, 'currentTransform', {
                get: function () {
                    return this._transformMatrix;
                },
                set: function (matrix) {
                    this._transformMatrix = matrix;
                    this.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
                },
                enumerable: true,
                configurable: true
            });
            var translate = canvasRenderingContext2DPrototype.translate;
            canvasRenderingContext2DPrototype.translate = function (x, y) {
                var matrix = this._transformMatrix;
                matrix[4] = matrix[0] * x + matrix[2] * y + matrix[4];
                matrix[5] = matrix[1] * x + matrix[3] * y + matrix[5];
                translate.call(this, x, y);
            };
            var scale = canvasRenderingContext2DPrototype.scale;
            canvasRenderingContext2DPrototype.scale = function (x, y) {
                var matrix = this._transformMatrix;
                matrix[0] *= x;
                matrix[1] *= x;
                matrix[2] *= y;
                matrix[3] *= y;
                scale.call(this, x, y);
            };
            var rotate = canvasRenderingContext2DPrototype.rotate;
            canvasRenderingContext2DPrototype.rotate = function (angle) {
                var cosValue = Math.cos(angle);
                var sinValue = Math.sin(angle);
                var matrix = this._transformMatrix;
                this._transformMatrix = [
                    matrix[0] * cosValue + matrix[2] * sinValue,
                    matrix[1] * cosValue + matrix[3] * sinValue,
                    matrix[0] * (-sinValue) + matrix[2] * cosValue,
                    matrix[1] * (-sinValue) + matrix[3] * cosValue,
                    matrix[4],
                    matrix[5]
                ];
                rotate.call(this, angle);
            };
            var transform = canvasRenderingContext2DPrototype.transform;
            canvasRenderingContext2DPrototype.transform = function (a, b, c, d, e, f) {
                var matrix = this._transformMatrix;
                this._transformMatrix = [
                    matrix[0] * a + matrix[2] * b,
                    matrix[1] * a + matrix[3] * b,
                    matrix[0] * c + matrix[2] * d,
                    matrix[1] * c + matrix[3] * d,
                    matrix[0] * e + matrix[2] * f + matrix[4],
                    matrix[1] * e + matrix[3] * f + matrix[5]
                ];
                transform.call(this, a, b, c, d, e, f);
            };
            var setTransform = canvasRenderingContext2DPrototype.setTransform;
            canvasRenderingContext2DPrototype.setTransform = function (a, b, c, d, e, f) {
                this._transformMatrix = [a, b, c, d, e, f];
                setTransform.call(this, a, b, c, d, e, f);
            };
            var resetTransform = canvasRenderingContext2DPrototype.resetTransform;
            canvasRenderingContext2DPrototype.resetTransform = function () {
                this._transformMatrix = [1, 0, 0, 1, 0, 0];
                resetTransform.call(this);
            };
            var save = canvasRenderingContext2DPrototype.save;
            canvasRenderingContext2DPrototype.save = function () {
                this._transformStack.push(this._transformMatrix);
                this._transformMatrix = this._transformMatrix.slice(0, 6);
                save.call(this);
            };
            var restore = canvasRenderingContext2DPrototype.restore;
            canvasRenderingContext2DPrototype.restore = function () {
                var matrix = this._transformStack.pop();
                if (matrix) {
                    this._transformMatrix = matrix;
                }
                restore.call(this);
            };
        }
    }
    var currentTransform = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, 'currentTransform');
    var currentTransformIsSVGMatrix = (document.createElement('canvas').getContext('2d').currentTransform instanceof SVGMatrix);
    Object.defineProperty(canvasRenderingContext2DPrototype, 'currentTransform', {
        get: function () {
            var value = currentTransform.get.call(this);
            return CanvasRenderingContext2D.useSVGMatrix ?
                CanvasRenderingContext2D.arrayToSVGMatrix(value) : CanvasRenderingContext2D.svgMatrixToArray(value);
        },
        set: function (matrix) {
            currentTransform.set.call(this, currentTransformIsSVGMatrix ?
                CanvasRenderingContext2D.svgMatrixToArray(matrix) : CanvasRenderingContext2D.svgMatrixToArray(matrix));
        },
        enumerable: true,
        configurable: true
    });
    if (!('imageSmoothingEnabled' in canvasRenderingContext2DPrototype)) {
        Object.defineProperty(canvasRenderingContext2DPrototype, 'imageSmoothingEnabled', {
            get: function () {
                if (this.mozImageSmoothingEnabled !== void 0) {
                    return this.mozImageSmoothingEnabled;
                }
                else if (this.webkitImageSmoothingEnabled !== void 0) {
                    return this.webkitImageSmoothingEnabled;
                }
                else if (this.msImageSmoothingEnabled !== void 0) {
                    return this.msImageSmoothingEnabled;
                }
                else {
                    return true;
                }
            },
            set: function (enable) {
                if (this.mozImageSmoothingEnabled !== void 0) {
                    this.mozImageSmoothingEnabled = enable;
                }
                else if (this.webkitImageSmoothingEnabled !== void 0) {
                    this.webkitImageSmoothingEnabled = enable;
                }
                else if (this.msImageSmoothingEnabled !== void 0) {
                    this.msImageSmoothingEnabled = enable;
                }
            },
            enumerable: true,
            configurable: true
        });
    }
    if (!('ellipse' in canvasRenderingContext2DPrototype)) {
        canvasRenderingContext2DPrototype.ellipse = function (x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise) {
            this.save();
            this.translate(x, y);
            this.rotate(rotation);
            this.scale(radiusX, radiusY);
            this.arc(0, 0, 1, startAngle, endAngle, antiClockwise);
            this.restore();
        };
    }
})();
(function () {
    if (!('Path2D' in window) || !('addPath' in window.Path2D.prototype)) {
        var _Path2D = window.Path2D;
        var Path2D = function (path2D) {
            Object.defineProperty(this, '_operations', {
                value: [],
                configurable: true,
                writable: true
            });
            if (path2D instanceof Path2D) {
                if (path2D._original && _Path2D) {
                    Object.defineProperty(this, '_original', {
                        value: new _Path2D(path2D._original),
                        configurable: true,
                        writable: true
                    });
                    this._operations = path2D._operations.slice(0);
                }
                else {
                    this.addPath(path2D);
                }
            }
            else if (_Path2D) {
                Object.defineProperty(this, '_original', {
                    value: new _Path2D(path2D),
                    configurable: true,
                    writable: true
                });
            }
        };
        window.Path2D = Path2D;
        var path2DPrototype = Path2D.prototype;
        ['arc', 'arcTo', 'bezierCurveTo', 'closePath', 'ellipse', 'lineTo', 'moveTo', 'quadraticCurveTo', 'rect']
            .forEach(function (attributeName) {
            path2DPrototype[attributeName] = function () {
                this._operations.push({ type: attributeName, arguments: Array.prototype.slice.call(arguments, 0) });
                if (this._original)
                    _Path2D.prototype[attributeName].apply(this._original, arguments);
            };
        });
        var canvasRenderingContext2DPrototype = CanvasRenderingContext2D.prototype;
        ['fill', 'stroke', 'clip', 'isPointInPath', 'isPointInStroke']
            .forEach(function (attributeName) {
            var original = canvasRenderingContext2DPrototype[attributeName];
            canvasRenderingContext2DPrototype[attributeName] = function (path2D) {
                if (path2D instanceof Path2D) {
                    if (path2D._original) {
                        return original.apply(this, [path2D._original].concat(Array.prototype.slice.call(arguments, 1)));
                    }
                    else {
                        this.beginPath();
                        var operation;
                        for (var i = 0, l = path2D._operations.length; i < l; i++) {
                            operation = path2D._operations[i];
                            canvasRenderingContext2DPrototype[operation.type].apply(this, operation.arguments);
                        }
                        return original.apply(this, Array.prototype.slice.call(arguments, 1));
                    }
                }
                else {
                    return original.apply(this, arguments);
                }
            };
        });
        if (!('addPath' in path2DPrototype)) {
            path2DPrototype.addPath = function (path2D, transform) {
                if (transform !== void 0) {
                    if (path2D._original)
                        delete path2D._original;
                    this._operations.push({ type: 'save', arguments: [] });
                    this._operations.push({
                        type: 'transform',
                        arguments: CanvasRenderingContext2D.svgMatrixToArray(transform)
                    });
                }
                var operation;
                for (var i = 0, l = path2D._operations.length; i < l; i++) {
                    operation = path2D._operations[i];
                    path2DPrototype[operation.type].apply(this, operation.arguments);
                }
                if (transform !== void 0) {
                    this._operations.push({ type: 'restore', arguments: [] });
                }
            };
        }
    }
})();
</script>
    <script>var scale = function (ratio) { return function (item) {
    if (typeof item === 'number') {
        return item * ratio;
    }
    return item;
}; };
function autoScaleCanvas(canvas) {
    var ctx = canvas.getContext('2d');
    var ratio = window.devicePixelRatio || 1;
    if (ratio !== 1) {
        canvas.style.width = canvas.width + 'px';
        canvas.style.height = canvas.height + 'px';
        canvas.width *= ratio;
        canvas.height *= ratio;
        ctx.scale(ratio, ratio);
        ctx.isPointInPath = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return CanvasRenderingContext2D.prototype.isPointInPath.apply(ctx, args.map(scale(ratio)));
        };
    }
    return canvas;
}
;
window.autoScaleCanvas = autoScaleCanvas;
</script>
    <script>var __assign = (this && this.__assign) || function () {
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var WEBVIEW_TARGET = '@@WEBVIEW_TARGET';
var ID = function () {
    return Math.random()
        .toString(32)
        .slice(2);
};
var flattenObjectCopyValue = function (flatObj, srcObj, key) {
    var value = srcObj[key];
    if (typeof value === 'function') {
        return;
    }
    if (typeof value === 'object' && value instanceof Node) {
        return;
    }
    flatObj[key] = flattenObject(value);
};
var flattenObject = function (object) {
    if (typeof object !== 'object' || object === null) {
        return object;
    }
    var flatObject = {};
    for (var key in object) {
        flattenObjectCopyValue(flatObject, object, key);
    }
    for (var key in Object.getOwnPropertyNames(object)) {
        flattenObjectCopyValue(flatObject, object, key);
    }
    return flatObject;
};
var AutoScaledCanvas = (function () {
    function AutoScaledCanvas(element) {
        this.element = element;
    }
    AutoScaledCanvas.prototype.toDataURL = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return (_a = this.element).toDataURL.apply(_a, args);
    };
    AutoScaledCanvas.prototype.autoScale = function () {
        if (this.savedHeight !== undefined) {
            this.element.height = this.savedHeight;
        }
        if (this.savedWidth !== undefined) {
            this.element.width = this.savedWidth;
        }
        window.autoScaleCanvas(this.element);
    };
    Object.defineProperty(AutoScaledCanvas.prototype, "width", {
        get: function () {
            return this.element.width;
        },
        set: function (value) {
            this.savedWidth = value;
            this.autoScale();
            return value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AutoScaledCanvas.prototype, "height", {
        get: function () {
            return this.element.height;
        },
        set: function (value) {
            this.savedHeight = value;
            this.autoScale();
            return value;
        },
        enumerable: false,
        configurable: true
    });
    return AutoScaledCanvas;
}());
var toMessage = function (result) {
    if (result instanceof Blob) {
        return {
            type: 'blob',
            payload: btoa(result),
            meta: {},
        };
    }
    if (result instanceof Object) {
        if (!result[WEBVIEW_TARGET]) {
            var id = ID();
            result[WEBVIEW_TARGET] = id;
            targets[id] = result;
        }
        return {
            type: 'json',
            payload: flattenObject(result),
            args: toArgs(flattenObject(result)),
            meta: {
                target: result[WEBVIEW_TARGET],
                constructor: result.__constructorName__ || result.constructor.name,
            },
        };
    }
    return {
        type: 'json',
        payload: JSON.stringify(result),
        meta: {},
    };
};
var toArgs = function (result) {
    var args = [];
    for (var key in result) {
        if (result[key] !== undefined && key !== '@@WEBVIEW_TARGET') {
            if (typedArrays[result[key].constructor.name] !== undefined) {
                result[key] = Array.from(result[key]);
            }
            args.push(result[key]);
        }
    }
    return args;
};
var createObjectsFromArgs = function (args) {
    var _a;
    for (var index = 0; index < args.length; index += 1) {
        var currentArg = args[index];
        if (currentArg && currentArg.className !== undefined) {
            var className = currentArg.className, classArgs = currentArg.classArgs;
            var object = new ((_a = constructors[className]).bind.apply(_a, __spreadArray([void 0], classArgs, false)))();
            args[index] = object;
        }
    }
    return args;
};
var canvas = document.createElement('canvas');
var autoScaledCanvas = new AutoScaledCanvas(canvas);
var targets = {
    canvas: autoScaledCanvas,
    context2D: canvas.getContext('2d'),
};
var constructors = {
    Image: Image,
    Path2D: Path2D,
    CanvasGradient: CanvasGradient,
    ImageData: ImageData,
    Uint8ClampedArray: Uint8ClampedArray,
};
var typedArrays = {
    Uint8ClampedArray: Uint8ClampedArray,
};
Image.bind =
    Image.bind ||
        function () {
            return Image;
        };
Path2D.bind =
    Path2D.bind ||
        function () {
            return Path2D;
        };
ImageData.bind =
    ImageData.bind ||
        function () {
            return ImageData;
        };
Uint8ClampedArray.bind =
    Uint8ClampedArray.bind ||
        function () {
            return Uint8ClampedArray;
        };
var populateRefs = function (arg) {
    if (arg && arg.__ref__) {
        return targets[arg.__ref__];
    }
    return arg;
};
document.body.appendChild(canvas);
function handleMessage(_a) {
    var _b, _c;
    var id = _a.id, type = _a.type, payload = _a.payload;
    switch (type) {
        case 'exec': {
            var target = payload.target, method = payload.method, args = payload.args;
            var result = (_b = targets[target])[method].apply(_b, args.map(populateRefs));
            var message = toMessage(result);
            if (typeof result === 'object' && !message.meta.constructor) {
                for (var constructorName in constructors) {
                    if (result instanceof constructors[constructorName]) {
                        message.meta.constructor = constructorName;
                    }
                }
            }
            window.ReactNativeWebView.postMessage(JSON.stringify(__assign({ id: id }, message)));
            break;
        }
        case 'set': {
            var target = payload.target, key = payload.key, value = payload.value;
            targets[target][key] = populateRefs(value);
            break;
        }
        case 'construct': {
            var constructor = payload.constructor, target = payload.id, _d = payload.args, args = _d === void 0 ? [] : _d;
            var newArgs = createObjectsFromArgs(args);
            var object = void 0;
            try {
                object = new ((_c = constructors[constructor]).bind.apply(_c, __spreadArray([void 0], newArgs, false)))();
            }
            catch (error) {
                throw new Error("Error while constructing ".concat(constructor, " ").concat(error.message));
            }
            object.__constructorName__ = constructor;
            var message = toMessage({});
            targets[target] = object;
            window.ReactNativeWebView.postMessage(JSON.stringify(__assign({ id: id }, message)));
            break;
        }
        case 'listen': {
            var types = payload.types, target_1 = payload.target;
            for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
                var eventType = types_1[_i];
                targets[target_1].addEventListener(eventType, function (e) {
                    var _a;
                    var message = toMessage({
                        type: 'event',
                        payload: {
                            type: e.type,
                            target: __assign(__assign({}, flattenObject(targets[target_1])), (_a = {}, _a[WEBVIEW_TARGET] = target_1, _a)),
                        },
                    });
                    window.ReactNativeWebView.postMessage(JSON.stringify(__assign({ id: id }, message)));
                });
            }
            break;
        }
    }
}
var handleError = function (err, message) {
    window.ReactNativeWebView.postMessage(JSON.stringify({
        id: message.id,
        type: 'error',
        payload: {
            message: err.message,
            stack: err.stack,
        },
    }));
    document.removeEventListener('message', handleIncomingMessage);
};
function handleIncomingMessage(e) {
    var data = JSON.parse(e.data);
    if (Array.isArray(data)) {
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var message = data_1[_i];
            try {
                handleMessage(message);
            }
            catch (err) {
                handleError(err, message);
            }
        }
    }
    else {
        try {
            handleMessage(data);
        }
        catch (err) {
            handleError(err, data);
        }
    }
}
window.addEventListener('message', handleIncomingMessage);
document.addEventListener('message', handleIncomingMessage);
</script>
  

</body></html>`