"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../node_modules/remeda/dist/es/purry.js
function purry(fn, args, lazy) {
  var diff = fn.length - args.length;
  var arrayArgs = Array.from(args);
  if (diff === 0) {
    return fn.apply(void 0, arrayArgs);
  }
  if (diff === 1) {
    var ret = function(data) {
      return fn.apply(void 0, __spreadArrays([data], arrayArgs));
    };
    if (lazy || fn.lazy) {
      ret.lazy = lazy || fn.lazy;
      ret.lazyArgs = args;
    }
    return ret;
  }
  throw new Error("Wrong number of arguments");
}
var __spreadArrays;
var init_purry = __esm({
  "../../node_modules/remeda/dist/es/purry.js"() {
    __spreadArrays = function() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++)
        s += arguments[i].length;
      for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
      return r;
    };
  }
});

// ../../node_modules/remeda/dist/es/addProp.js
function addProp() {
  return purry(_addProp, arguments);
}
function _addProp(obj, prop2, value) {
  var _a;
  return __assign(__assign({}, obj), (_a = {}, _a[prop2] = value, _a));
}
var __assign;
var init_addProp = __esm({
  "../../node_modules/remeda/dist/es/addProp.js"() {
    init_purry();
    __assign = function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
  }
});

// ../../node_modules/remeda/dist/es/allPass.js
function allPass() {
  return purry(_allPass, arguments);
}
function _allPass(data, fns) {
  return fns.every(function(fn) {
    return fn(data);
  });
}
var init_allPass = __esm({
  "../../node_modules/remeda/dist/es/allPass.js"() {
    init_purry();
  }
});

// ../../node_modules/remeda/dist/es/anyPass.js
function anyPass() {
  return purry(_anyPass, arguments);
}
function _anyPass(data, fns) {
  return fns.some(function(fn) {
    return fn(data);
  });
}
var init_anyPass = __esm({
  "../../node_modules/remeda/dist/es/anyPass.js"() {
    init_purry();
  }
});

// ../../node_modules/remeda/dist/es/chunk.js
function chunk() {
  return purry(_chunk, arguments);
}
function _chunk(array, size) {
  var ret = [];
  var current = null;
  array.forEach(function(x) {
    if (!current) {
      current = [];
      ret.push(current);
    }
    current.push(x);
    if (current.length === size) {
      current = null;
    }
  });
  return ret;
}
var init_chunk = __esm({
  "../../node_modules/remeda/dist/es/chunk.js"() {
    init_purry();
  }
});

// ../../node_modules/remeda/dist/es/clamp.js
function clamp() {
  return purry(_clamp, arguments);
}
function _clamp(value, limits) {
  if (limits.min != null) {
    if (limits.min > value) {
      return limits.min;
    }
  }
  if (limits.max != null) {
    if (limits.max < value) {
      return limits.max;
    }
  }
  return value;
}
var init_clamp = __esm({
  "../../node_modules/remeda/dist/es/clamp.js"() {
    init_purry();
  }
});

// ../../node_modules/remeda/dist/es/type.js
function type(val) {
  return val === null ? "Null" : val === void 0 ? "Undefined" : Object.prototype.toString.call(val).slice(8, -1);
}
var init_type = __esm({
  "../../node_modules/remeda/dist/es/type.js"() {
  }
});

// ../../node_modules/remeda/dist/es/clone.js
function _cloneRegExp(pattern) {
  return new RegExp(pattern.source, (pattern.global ? "g" : "") + (pattern.ignoreCase ? "i" : "") + (pattern.multiline ? "m" : "") + (pattern.sticky ? "y" : "") + (pattern.unicode ? "u" : ""));
}
function _clone(value, refFrom, refTo, deep) {
  function copy(copiedValue) {
    var len = refFrom.length;
    var idx = 0;
    while (idx < len) {
      if (value === refFrom[idx]) {
        return refTo[idx];
      }
      idx += 1;
    }
    refFrom[idx + 1] = value;
    refTo[idx + 1] = copiedValue;
    for (var key in value) {
      copiedValue[key] = deep ? _clone(value[key], refFrom, refTo, true) : value[key];
    }
    return copiedValue;
  }
  switch (type(value)) {
    case "Object":
      return copy({});
    case "Array":
      return copy([]);
    case "Date":
      return new Date(value.valueOf());
    case "RegExp":
      return _cloneRegExp(value);
    default:
      return value;
  }
}
function clone(value) {
  return value != null && typeof value.clone === "function" ? value.clone() : _clone(value, [], [], true);
}
var init_clone = __esm({
  "../../node_modules/remeda/dist/es/clone.js"() {
    init_type();
  }
});

// ../../node_modules/remeda/dist/es/guards.js
function isString(data) {
  return typeof data === "string";
}
function isNumber(data) {
  return typeof data === "number" && !isNaN(data);
}
function isDefined(data) {
  return typeof data !== "undefined" && data !== null;
}
function isBoolean(data) {
  return typeof data === "boolean";
}
function isPromise(data) {
  return data instanceof Promise;
}
function isArray(data) {
  return Array.isArray(data);
}
function isObject(data) {
  return !!data && !Array.isArray(data) && typeof data === "object";
}
function isFunction(data) {
  return typeof data === "function";
}
function isNil(data) {
  return data == null;
}
function isError(data) {
  return data instanceof Error;
}
function isDate(data) {
  return data instanceof Date;
}
function isTruthy(data) {
  return !!data;
}
function isNot(predicate) {
  return function(data) {
    return !predicate(data);
  };
}
var init_guards = __esm({
  "../../node_modules/remeda/dist/es/guards.js"() {
  }
});

// ../../node_modules/remeda/dist/es/compact.js
function compact(items) {
  return items.filter(isTruthy);
}
var init_compact = __esm({
  "../../node_modules/remeda/dist/es/compact.js"() {
    init_guards();
  }
});

// ../../node_modules/remeda/dist/es/concat.js
function concat() {
  return purry(_concat, arguments);
}
function _concat(arr1, arr2) {
  return arr1.concat(arr2);
}
var init_concat = __esm({
  "../../node_modules/remeda/dist/es/concat.js"() {
    init_purry();
  }
});

// ../../node_modules/remeda/dist/es/countBy.js
function countBy() {
  return purry(_countBy(false), arguments);
}
var _countBy;
var init_countBy = __esm({
  "../../node_modules/remeda/dist/es/countBy.js"() {
    init_purry();
    _countBy = function(indexed) {
      return function(array, fn) {
        return array.reduce(function(ret, item, index) {
          var value = indexed ? fn(item, index, array) : fn(item);
          return ret + (value ? 1 : 0);
        }, 0);
      };
    };
    (function(countBy2) {
      function indexed() {
        return purry(_countBy(true), arguments);
      }
      countBy2.indexed = indexed;
    })(countBy || (countBy = {}));
  }
});

// ../../node_modules/remeda/dist/es/pipe.js
function pipe(value) {
  var operations = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    operations[_i - 1] = arguments[_i];
  }
  var ret = value;
  var lazyOps = operations.map(function(op2) {
    var _a = op2, lazy = _a.lazy, lazyArgs = _a.lazyArgs;
    if (lazy) {
      var fn = lazy.apply(void 0, lazyArgs);
      fn.indexed = lazy.indexed;
      fn.single = lazy.single;
      fn.index = 0;
      fn.items = [];
      return fn;
    }
    return null;
  });
  var opIdx = 0;
  while (opIdx < operations.length) {
    var op = operations[opIdx];
    var lazyOp = lazyOps[opIdx];
    if (!lazyOp) {
      ret = op(ret);
      opIdx++;
      continue;
    }
    var lazySeq = [];
    for (var j = opIdx; j < operations.length; j++) {
      if (lazyOps[j]) {
        lazySeq.push(lazyOps[j]);
        if (lazyOps[j].single) {
          break;
        }
      } else {
        break;
      }
    }
    var acc = [];
    for (var j = 0; j < ret.length; j++) {
      var item = ret[j];
      if (_processItem({ item, acc, lazySeq })) {
        break;
      }
    }
    var lastLazySeq = lazySeq[lazySeq.length - 1];
    if (lastLazySeq.single) {
      ret = acc[0];
    } else {
      ret = acc;
    }
    opIdx += lazySeq.length;
  }
  return ret;
}
function _processItem(_a) {
  var item = _a.item, lazySeq = _a.lazySeq, acc = _a.acc;
  if (lazySeq.length === 0) {
    acc.push(item);
    return false;
  }
  var lazyResult = { done: false, hasNext: false };
  var isDone = false;
  for (var i = 0; i < lazySeq.length; i++) {
    var lazyFn = lazySeq[i];
    var indexed = lazyFn.indexed;
    var index = lazyFn.index;
    var items = lazyFn.items;
    items.push(item);
    lazyResult = indexed ? lazyFn(item, index, items) : lazyFn(item);
    lazyFn.index++;
    if (lazyResult.hasNext) {
      if (lazyResult.hasMany) {
        var nextValues = lazyResult.next;
        for (var _i = 0, nextValues_1 = nextValues; _i < nextValues_1.length; _i++) {
          var subItem = nextValues_1[_i];
          var subResult = _processItem({
            item: subItem,
            acc,
            lazySeq: lazySeq.slice(i + 1)
          });
          if (subResult) {
            return true;
          }
        }
        return false;
      } else {
        item = lazyResult.next;
      }
    }
    if (!lazyResult.hasNext) {
      break;
    }
    if (lazyResult.done) {
      isDone = true;
    }
  }
  if (lazyResult.hasNext) {
    acc.push(item);
  }
  if (isDone) {
    return true;
  }
  return false;
}
var init_pipe = __esm({
  "../../node_modules/remeda/dist/es/pipe.js"() {
  }
});

// ../../node_modules/remeda/dist/es/createPipe.js
function createPipe() {
  var operations = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    operations[_i] = arguments[_i];
  }
  return function(value) {
    return pipe.apply(void 0, __spreadArrays2([value], operations));
  };
}
var __spreadArrays2;
var init_createPipe = __esm({
  "../../node_modules/remeda/dist/es/createPipe.js"() {
    init_pipe();
    __spreadArrays2 = function() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++)
        s += arguments[i].length;
      for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
      return r;
    };
  }
});

// ../../node_modules/remeda/dist/es/_reduceLazy.js
function _reduceLazy(array, lazy, indexed) {
  return array.reduce(function(acc, item, index) {
    var result = indexed ? lazy(item, index, array) : lazy(item);
    if (result.hasMany === true) {
      acc.push.apply(acc, result.next);
    } else if (result.hasNext === true) {
      acc.push(result.next);
    }
    return acc;
  }, []);
}
var init_reduceLazy = __esm({
  "../../node_modules/remeda/dist/es/_reduceLazy.js"() {
  }
});

// ../../node_modules/remeda/dist/es/difference.js
function difference() {
  return purry(_difference, arguments, difference.lazy);
}
function _difference(array, other) {
  var lazy = difference.lazy(other);
  return _reduceLazy(array, lazy);
}
var init_difference = __esm({
  "../../node_modules/remeda/dist/es/difference.js"() {
    init_purry();
    init_reduceLazy();
    (function(difference2) {
      function lazy(other) {
        var set2 = new Set(other);
        return function(value) {
          if (!set2.has(value)) {
            return {
              done: false,
              hasNext: true,
              next: value
            };
          }
          return {
            done: false,
            hasNext: false
          };
        };
      }
      difference2.lazy = lazy;
    })(difference || (difference = {}));
  }
});

// ../../node_modules/remeda/dist/es/drop.js
function drop() {
  return purry(_drop, arguments, drop.lazy);
}
function _drop(array, n) {
  return _reduceLazy(array, drop.lazy(n));
}
var init_drop = __esm({
  "../../node_modules/remeda/dist/es/drop.js"() {
    init_purry();
    init_reduceLazy();
    (function(drop2) {
      function lazy(n) {
        var left = n;
        return function(value) {
          if (left > 0) {
            left--;
            return {
              done: false,
              hasNext: false
            };
          }
          return {
            done: false,
            hasNext: true,
            next: value
          };
        };
      }
      drop2.lazy = lazy;
    })(drop || (drop = {}));
  }
});

// ../../node_modules/remeda/dist/es/dropLast.js
function dropLast() {
  return purry(_dropLast, arguments);
}
function _dropLast(array, n) {
  var copy = __spreadArrays3(array);
  if (n !== 0) {
    copy.splice(-n);
  }
  return copy;
}
var __spreadArrays3;
var init_dropLast = __esm({
  "../../node_modules/remeda/dist/es/dropLast.js"() {
    init_purry();
    __spreadArrays3 = function() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++)
        s += arguments[i].length;
      for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
      return r;
    };
  }
});

// ../../node_modules/remeda/dist/es/equals.js
function equals() {
  return purry(_equals, arguments);
}
function _equals(a, b) {
  if (a === b) {
    return true;
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    var arrA = isArray2(a);
    var arrB = isArray2(b);
    var i = void 0;
    var length = void 0;
    var key = void 0;
    if (arrA && arrB) {
      length = a.length;
      if (length !== b.length) {
        return false;
      }
      for (i = length; i-- !== 0; ) {
        if (!equals(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }
    if (arrA !== arrB) {
      return false;
    }
    var dateA = a instanceof Date;
    var dateB = b instanceof Date;
    if (dateA !== dateB) {
      return false;
    }
    if (dateA && dateB) {
      return a.getTime() === b.getTime();
    }
    var regexpA = a instanceof RegExp;
    var regexpB = b instanceof RegExp;
    if (regexpA !== regexpB) {
      return false;
    }
    if (regexpA && regexpB) {
      return a.toString() === b.toString();
    }
    var keys2 = keyList(a);
    length = keys2.length;
    if (length !== keyList(b).length) {
      return false;
    }
    for (i = length; i-- !== 0; ) {
      if (!hasProp.call(b, keys2[i])) {
        return false;
      }
    }
    for (i = length; i-- !== 0; ) {
      key = keys2[i];
      if (!equals(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }
  return a !== a && b !== b;
}
var isArray2, keyList, hasProp;
var init_equals = __esm({
  "../../node_modules/remeda/dist/es/equals.js"() {
    init_purry();
    isArray2 = Array.isArray;
    keyList = Object.keys;
    hasProp = Object.prototype.hasOwnProperty;
  }
});

// ../../node_modules/remeda/dist/es/_toLazyIndexed.js
var _toLazyIndexed;
var init_toLazyIndexed = __esm({
  "../../node_modules/remeda/dist/es/_toLazyIndexed.js"() {
    _toLazyIndexed = function(fn) {
      fn.indexed = true;
      return fn;
    };
  }
});

// ../../node_modules/remeda/dist/es/filter.js
function filter() {
  return purry(_filter(false), arguments, filter.lazy);
}
var _filter, _lazy;
var init_filter = __esm({
  "../../node_modules/remeda/dist/es/filter.js"() {
    init_purry();
    init_reduceLazy();
    init_toLazyIndexed();
    _filter = function(indexed) {
      return function(array, fn) {
        return _reduceLazy(array, indexed ? filter.lazyIndexed(fn) : filter.lazy(fn), indexed);
      };
    };
    _lazy = function(indexed) {
      return function(fn) {
        return function(value, index, array) {
          var valid = indexed ? fn(value, index, array) : fn(value);
          if (!!valid === true) {
            return {
              done: false,
              hasNext: true,
              next: value
            };
          }
          return {
            done: false,
            hasNext: false
          };
        };
      };
    };
    (function(filter2) {
      function indexed() {
        return purry(_filter(true), arguments, filter2.lazyIndexed);
      }
      filter2.indexed = indexed;
      filter2.lazy = _lazy(false);
      filter2.lazyIndexed = _toLazyIndexed(_lazy(true));
    })(filter || (filter = {}));
  }
});

// ../../node_modules/remeda/dist/es/_toSingle.js
var _toSingle;
var init_toSingle = __esm({
  "../../node_modules/remeda/dist/es/_toSingle.js"() {
    _toSingle = function(fn) {
      fn.single = true;
      return fn;
    };
  }
});

// ../../node_modules/remeda/dist/es/find.js
function find() {
  return purry(_find(false), arguments, find.lazy);
}
var _find, _lazy2;
var init_find = __esm({
  "../../node_modules/remeda/dist/es/find.js"() {
    init_purry();
    init_toLazyIndexed();
    init_toSingle();
    _find = function(indexed) {
      return function(array, fn) {
        if (indexed) {
          return array.find(fn);
        }
        return array.find(function(x) {
          return fn(x);
        });
      };
    };
    _lazy2 = function(indexed) {
      return function(fn) {
        return function(value, index, array) {
          var valid = indexed ? fn(value, index, array) : fn(value);
          return {
            done: valid,
            hasNext: valid,
            next: value
          };
        };
      };
    };
    (function(find2) {
      function indexed() {
        return purry(_find(true), arguments, find2.lazyIndexed);
      }
      find2.indexed = indexed;
      find2.lazy = _toSingle(_lazy2(false));
      find2.lazyIndexed = _toSingle(_toLazyIndexed(_lazy2(true)));
    })(find || (find = {}));
  }
});

// ../../node_modules/remeda/dist/es/findIndex.js
function findIndex() {
  return purry(_findIndex(false), arguments, findIndex.lazy);
}
var _findIndex, _lazy3;
var init_findIndex = __esm({
  "../../node_modules/remeda/dist/es/findIndex.js"() {
    init_purry();
    init_toLazyIndexed();
    init_toSingle();
    _findIndex = function(indexed) {
      return function(array, fn) {
        if (indexed) {
          return array.findIndex(fn);
        }
        return array.findIndex(function(x) {
          return fn(x);
        });
      };
    };
    _lazy3 = function(indexed) {
      return function(fn) {
        var i = 0;
        return function(value, index, array) {
          var valid = indexed ? fn(value, index, array) : fn(value);
          if (valid) {
            return {
              done: true,
              hasNext: true,
              next: i
            };
          }
          i++;
          return {
            done: false,
            hasNext: false
          };
        };
      };
    };
    (function(findIndex2) {
      function indexed() {
        return purry(_findIndex(true), arguments, findIndex2.lazyIndexed);
      }
      findIndex2.indexed = indexed;
      findIndex2.lazy = _toSingle(_lazy3(false));
      findIndex2.lazyIndexed = _toSingle(_toLazyIndexed(_lazy3(true)));
    })(findIndex || (findIndex = {}));
  }
});

// ../../node_modules/remeda/dist/es/first.js
function first() {
  return purry(_first, arguments, first.lazy);
}
function _first(array) {
  return array[0];
}
var init_first = __esm({
  "../../node_modules/remeda/dist/es/first.js"() {
    init_purry();
    (function(first2) {
      function lazy() {
        return function(value) {
          return {
            done: true,
            hasNext: true,
            next: value
          };
        };
      }
      first2.lazy = lazy;
      (function(lazy2) {
        lazy2.single = true;
      })(lazy = first2.lazy || (first2.lazy = {}));
    })(first || (first = {}));
  }
});

// ../../node_modules/remeda/dist/es/flatten.js
function flatten() {
  return purry(_flatten, arguments, flatten.lazy);
}
function _flatten(items) {
  return _reduceLazy(items, flatten.lazy());
}
var init_flatten = __esm({
  "../../node_modules/remeda/dist/es/flatten.js"() {
    init_reduceLazy();
    init_purry();
    (function(flatten2) {
      function lazy() {
        return function(next) {
          if (Array.isArray(next)) {
            return {
              done: false,
              hasNext: true,
              hasMany: true,
              next
            };
          }
          return {
            done: false,
            hasNext: true,
            next
          };
        };
      }
      flatten2.lazy = lazy;
    })(flatten || (flatten = {}));
  }
});

// ../../node_modules/remeda/dist/es/flatMap.js
function flatMap() {
  return purry(_flatMap, arguments, flatMap.lazy);
}
function _flatMap(array, fn) {
  return flatten(array.map(function(item) {
    return fn(item);
  }));
}
var init_flatMap = __esm({
  "../../node_modules/remeda/dist/es/flatMap.js"() {
    init_flatten();
    init_purry();
    (function(flatMap2) {
      function lazy(fn) {
        return function(value) {
          var next = fn(value);
          if (Array.isArray(next)) {
            return {
              done: false,
              hasNext: true,
              hasMany: true,
              next
            };
          }
          return {
            done: false,
            hasNext: true,
            next
          };
        };
      }
      flatMap2.lazy = lazy;
    })(flatMap || (flatMap = {}));
  }
});

// ../../node_modules/remeda/dist/es/flatMapToObj.js
function flatMapToObj() {
  return purry(_flatMapToObj(false), arguments);
}
var _flatMapToObj;
var init_flatMapToObj = __esm({
  "../../node_modules/remeda/dist/es/flatMapToObj.js"() {
    init_purry();
    _flatMapToObj = function(indexed) {
      return function(array, fn) {
        return array.reduce(function(result, element, index) {
          var items = indexed ? fn(element, index, array) : fn(element);
          items.forEach(function(_a) {
            var key = _a[0], value = _a[1];
            result[key] = value;
          });
          return result;
        }, {});
      };
    };
    (function(flatMapToObj2) {
      function indexed() {
        return purry(_flatMapToObj(true), arguments);
      }
      flatMapToObj2.indexed = indexed;
    })(flatMapToObj || (flatMapToObj = {}));
  }
});

// ../../node_modules/remeda/dist/es/flattenDeep.js
function flattenDeep() {
  return purry(_flattenDeep, arguments, flattenDeep.lazy);
}
function _flattenDeep(items) {
  return _reduceLazy(items, flattenDeep.lazy());
}
function _flattenDeepValue(value) {
  if (!Array.isArray(value)) {
    return value;
  }
  var ret = [];
  value.forEach(function(item) {
    if (Array.isArray(item)) {
      ret.push.apply(ret, flattenDeep(item));
    } else {
      ret.push(item);
    }
  });
  return ret;
}
var init_flattenDeep = __esm({
  "../../node_modules/remeda/dist/es/flattenDeep.js"() {
    init_reduceLazy();
    init_purry();
    (function(flattenDeep2) {
      function lazy() {
        return function(value) {
          var next = _flattenDeepValue(value);
          if (Array.isArray(next)) {
            return {
              done: false,
              hasNext: true,
              hasMany: true,
              next
            };
          }
          return {
            done: false,
            hasNext: true,
            next
          };
        };
      }
      flattenDeep2.lazy = lazy;
    })(flattenDeep || (flattenDeep = {}));
  }
});

// ../../node_modules/remeda/dist/es/forEach.js
function forEach() {
  return purry(_forEach(false), arguments, forEach.lazy);
}
var _forEach, _lazy4;
var init_forEach = __esm({
  "../../node_modules/remeda/dist/es/forEach.js"() {
    init_purry();
    init_reduceLazy();
    init_toLazyIndexed();
    _forEach = function(indexed) {
      return function(array, fn) {
        return _reduceLazy(array, indexed ? forEach.lazyIndexed(fn) : forEach.lazy(fn), indexed);
      };
    };
    _lazy4 = function(indexed) {
      return function(fn) {
        return function(value, index, array) {
          if (indexed) {
            fn(value, index, array);
          } else {
            fn(value);
          }
          return {
            done: false,
            hasNext: true,
            next: value
          };
        };
      };
    };
    (function(forEach2) {
      function indexed() {
        return purry(_forEach(true), arguments, forEach2.lazyIndexed);
      }
      forEach2.indexed = indexed;
      forEach2.lazy = _lazy4(false);
      forEach2.lazyIndexed = _toLazyIndexed(_lazy4(true));
    })(forEach || (forEach = {}));
  }
});

// ../../node_modules/remeda/dist/es/forEachObj.js
function forEachObj() {
  return purry(_forEachObj(false), arguments);
}
var _forEachObj;
var init_forEachObj = __esm({
  "../../node_modules/remeda/dist/es/forEachObj.js"() {
    init_purry();
    _forEachObj = function(indexed) {
      return function(object, fn) {
        for (var key in object) {
          if (object.hasOwnProperty(key)) {
            var val = object[key];
            if (indexed)
              fn(val, key, object);
            else
              fn(val);
          }
        }
        return object;
      };
    };
    (function(forEachObj2) {
      function indexed() {
        return purry(_forEachObj(true), arguments);
      }
      forEachObj2.indexed = indexed;
    })(forEachObj || (forEachObj = {}));
  }
});

// ../../node_modules/remeda/dist/es/fromPairs.js
function fromPairs(tuples) {
  return tuples.reduce(function(acc, curr) {
    if (curr && curr.length === 2) {
      acc[curr[0]] = curr[1];
    }
    return acc;
  }, {});
}
var init_fromPairs = __esm({
  "../../node_modules/remeda/dist/es/fromPairs.js"() {
  }
});

// ../../node_modules/remeda/dist/es/groupBy.js
function groupBy() {
  return purry(_groupBy(false), arguments);
}
var _groupBy;
var init_groupBy = __esm({
  "../../node_modules/remeda/dist/es/groupBy.js"() {
    init_purry();
    _groupBy = function(indexed) {
      return function(array, fn) {
        var ret = {};
        array.forEach(function(item, index) {
          var value = indexed ? fn(item, index, array) : fn(item);
          var key = String(value);
          if (!ret[key]) {
            ret[key] = [];
          }
          ret[key].push(item);
        });
        return ret;
      };
    };
    (function(groupBy2) {
      function indexed() {
        return purry(_groupBy(true), arguments);
      }
      groupBy2.indexed = indexed;
    })(groupBy || (groupBy = {}));
  }
});

// ../../node_modules/remeda/dist/es/identity.js
function identity(value) {
  return value;
}
var init_identity = __esm({
  "../../node_modules/remeda/dist/es/identity.js"() {
  }
});

// ../../node_modules/remeda/dist/es/indexBy.js
function indexBy() {
  return purry(_indexBy(false), arguments);
}
var _indexBy;
var init_indexBy = __esm({
  "../../node_modules/remeda/dist/es/indexBy.js"() {
    init_purry();
    _indexBy = function(indexed) {
      return function(array, fn) {
        return array.reduce(function(ret, item, index) {
          var value = indexed ? fn(item, index, array) : fn(item);
          var key = String(value);
          ret[key] = item;
          return ret;
        }, {});
      };
    };
    (function(indexBy2) {
      function indexed() {
        return purry(_indexBy(true), arguments);
      }
      indexBy2.indexed = indexed;
    })(indexBy || (indexBy = {}));
  }
});

// ../../node_modules/remeda/dist/es/intersection.js
function intersection() {
  return purry(_intersection, arguments, intersection.lazy);
}
function _intersection(array, other) {
  var lazy = intersection.lazy(other);
  return _reduceLazy(array, lazy);
}
var init_intersection = __esm({
  "../../node_modules/remeda/dist/es/intersection.js"() {
    init_purry();
    init_reduceLazy();
    (function(intersection2) {
      function lazy(other) {
        return function(value) {
          var set2 = new Set(other);
          if (set2.has(value)) {
            return {
              done: false,
              hasNext: true,
              next: value
            };
          }
          return {
            done: false,
            hasNext: false
          };
        };
      }
      intersection2.lazy = lazy;
    })(intersection || (intersection = {}));
  }
});

// ../../node_modules/remeda/dist/es/keys.js
function keys(source) {
  return Object.keys(source);
}
var init_keys = __esm({
  "../../node_modules/remeda/dist/es/keys.js"() {
  }
});

// ../../node_modules/remeda/dist/es/last.js
function last() {
  return purry(_last, arguments, last.lazy);
}
function _last(array) {
  return array[array.length - 1];
}
var init_last = __esm({
  "../../node_modules/remeda/dist/es/last.js"() {
    init_purry();
    (function(last2) {
      function lazy() {
        return function(value) {
          return {
            done: true,
            hasNext: true,
            next: value
          };
        };
      }
      last2.lazy = lazy;
      (function(lazy2) {
        lazy2.single = true;
      })(lazy = last2.lazy || (last2.lazy = {}));
    })(last || (last = {}));
  }
});

// ../../node_modules/remeda/dist/es/map.js
function map() {
  return purry(_map(false), arguments, map.lazy);
}
var _map, _lazy5;
var init_map = __esm({
  "../../node_modules/remeda/dist/es/map.js"() {
    init_purry();
    init_reduceLazy();
    init_toLazyIndexed();
    _map = function(indexed) {
      return function(array, fn) {
        return _reduceLazy(array, indexed ? map.lazyIndexed(fn) : map.lazy(fn), indexed);
      };
    };
    _lazy5 = function(indexed) {
      return function(fn) {
        return function(value, index, array) {
          return {
            done: false,
            hasNext: true,
            next: indexed ? fn(value, index, array) : fn(value)
          };
        };
      };
    };
    (function(map2) {
      function indexed() {
        return purry(_map(true), arguments, map2.lazyIndexed);
      }
      map2.indexed = indexed;
      map2.lazy = _lazy5(false);
      map2.lazyIndexed = _toLazyIndexed(_lazy5(true));
    })(map || (map = {}));
  }
});

// ../../node_modules/remeda/dist/es/mapKeys.js
function mapKeys(arg1, arg2) {
  if (arguments.length === 1) {
    return function(data) {
      return _mapKeys(data, arg1);
    };
  }
  return _mapKeys(arg1, arg2);
}
function _mapKeys(obj, fn) {
  return Object.keys(obj).reduce(function(acc, key) {
    acc[fn(key, obj[key])] = obj[key];
    return acc;
  }, {});
}
var init_mapKeys = __esm({
  "../../node_modules/remeda/dist/es/mapKeys.js"() {
  }
});

// ../../node_modules/remeda/dist/es/mapToObj.js
function mapToObj() {
  return purry(_mapToObj(false), arguments);
}
var _mapToObj;
var init_mapToObj = __esm({
  "../../node_modules/remeda/dist/es/mapToObj.js"() {
    init_purry();
    _mapToObj = function(indexed) {
      return function(array, fn) {
        return array.reduce(function(result, element, index) {
          var _a = indexed ? fn(element, index, array) : fn(element), key = _a[0], value = _a[1];
          result[key] = value;
          return result;
        }, {});
      };
    };
    (function(mapToObj2) {
      function indexed() {
        return purry(_mapToObj(true), arguments);
      }
      mapToObj2.indexed = indexed;
    })(mapToObj || (mapToObj = {}));
  }
});

// ../../node_modules/remeda/dist/es/mapValues.js
function mapValues(arg1, arg2) {
  if (arguments.length === 1) {
    return function(data) {
      return _mapValues(data, arg1);
    };
  }
  return _mapValues(arg1, arg2);
}
function _mapValues(obj, fn) {
  return Object.keys(obj).reduce(function(acc, key) {
    acc[key] = fn(obj[key], key);
    return acc;
  }, {});
}
var init_mapValues = __esm({
  "../../node_modules/remeda/dist/es/mapValues.js"() {
  }
});

// ../../node_modules/remeda/dist/es/maxBy.js
function maxBy() {
  return purry(_maxBy(false), arguments);
}
var _maxBy;
var init_maxBy = __esm({
  "../../node_modules/remeda/dist/es/maxBy.js"() {
    init_purry();
    _maxBy = function(indexed) {
      return function(array, fn) {
        var ret = void 0;
        var retMax = void 0;
        array.forEach(function(item, i) {
          var max = indexed ? fn(item, i, array) : fn(item);
          if (retMax === void 0 || max > retMax) {
            ret = item;
            retMax = max;
          }
        });
        return ret;
      };
    };
    (function(maxBy2) {
      function indexed() {
        return purry(_maxBy(true), arguments);
      }
      maxBy2.indexed = indexed;
    })(maxBy || (maxBy = {}));
  }
});

// ../../node_modules/remeda/dist/es/merge.js
function merge() {
  return purry(_merge, arguments);
}
function _merge(a, b) {
  return Object.assign({}, a, b);
}
var init_merge = __esm({
  "../../node_modules/remeda/dist/es/merge.js"() {
    init_purry();
  }
});

// ../../node_modules/remeda/dist/es/mergeAll.js
function mergeAll(items) {
  return items.reduce(function(acc, x) {
    return __assign2(__assign2({}, acc), x);
  }, {});
}
var __assign2;
var init_mergeAll = __esm({
  "../../node_modules/remeda/dist/es/mergeAll.js"() {
    __assign2 = function() {
      __assign2 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
        }
        return t;
      };
      return __assign2.apply(this, arguments);
    };
  }
});

// ../../node_modules/remeda/dist/es/minBy.js
function minBy() {
  return purry(_minBy(false), arguments);
}
var _minBy;
var init_minBy = __esm({
  "../../node_modules/remeda/dist/es/minBy.js"() {
    init_purry();
    _minBy = function(indexed) {
      return function(array, fn) {
        var ret = void 0;
        var retMin = void 0;
        array.forEach(function(item, i) {
          var min = indexed ? fn(item, i, array) : fn(item);
          if (retMin === void 0 || min < retMin) {
            ret = item;
            retMin = min;
          }
        });
        return ret;
      };
    };
    (function(minBy2) {
      function indexed() {
        return purry(_minBy(true), arguments);
      }
      minBy2.indexed = indexed;
    })(minBy || (minBy = {}));
  }
});

// ../../node_modules/remeda/dist/es/noop.js
var noop;
var init_noop = __esm({
  "../../node_modules/remeda/dist/es/noop.js"() {
    noop = function() {
      return void 0;
    };
  }
});

// ../../node_modules/remeda/dist/es/objOf.js
function objOf() {
  return purry(_objOf, arguments);
}
function _objOf(value, key) {
  var _a;
  return _a = {}, _a[key] = value, _a;
}
var init_objOf = __esm({
  "../../node_modules/remeda/dist/es/objOf.js"() {
    init_purry();
  }
});

// ../../node_modules/remeda/dist/es/omit.js
function omit() {
  return purry(_omit, arguments);
}
function _omit(object, names) {
  var set2 = new Set(names);
  return Object.entries(object).reduce(function(acc, _a) {
    var name = _a[0], value = _a[1];
    if (!set2.has(name)) {
      acc[name] = value;
    }
    return acc;
  }, {});
}
var init_omit = __esm({
  "../../node_modules/remeda/dist/es/omit.js"() {
    init_purry();
  }
});

// ../../node_modules/remeda/dist/es/once.js
function once(fn) {
  var called = false;
  var ret;
  return function() {
    if (!called) {
      ret = fn();
      called = true;
    }
    return ret;
  };
}
var init_once = __esm({
  "../../node_modules/remeda/dist/es/once.js"() {
  }
});

// ../../node_modules/remeda/dist/es/partition.js
function partition() {
  return purry(_partition(false), arguments);
}
var _partition;
var init_partition = __esm({
  "../../node_modules/remeda/dist/es/partition.js"() {
    init_purry();
    _partition = function(indexed) {
      return function(array, fn) {
        var ret = [[], []];
        array.forEach(function(item, index) {
          var matches = indexed ? fn(item, index, array) : fn(item);
          ret[matches ? 0 : 1].push(item);
        });
        return ret;
      };
    };
    (function(partition2) {
      function indexed() {
        return purry(_partition(true), arguments);
      }
      partition2.indexed = indexed;
    })(partition || (partition = {}));
  }
});

// ../../node_modules/remeda/dist/es/pathOr.js
function pathOr() {
  return purry(_pathOr, arguments);
}
function _pathOr(object, path, defaultValue) {
  var current = object;
  for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
    var prop2 = path_1[_i];
    if (current == null || current[prop2] == null) {
      return defaultValue;
    }
    current = current[prop2];
  }
  return current;
}
var init_pathOr = __esm({
  "../../node_modules/remeda/dist/es/pathOr.js"() {
    init_purry();
  }
});

// ../../node_modules/remeda/dist/es/pick.js
function pick() {
  return purry(_pick, arguments);
}
function _pick(object, names) {
  if (object == null) {
    return {};
  }
  return names.reduce(function(acc, name) {
    if (name in object) {
      acc[name] = object[name];
    }
    return acc;
  }, {});
}
var init_pick = __esm({
  "../../node_modules/remeda/dist/es/pick.js"() {
    init_purry();
  }
});

// ../../node_modules/remeda/dist/es/prop.js
function prop(name) {
  return function(obj) {
    return obj[name];
  };
}
var init_prop = __esm({
  "../../node_modules/remeda/dist/es/prop.js"() {
  }
});

// ../../node_modules/remeda/dist/es/range.js
function range() {
  return purry(_range, arguments);
}
function _range(start, end) {
  var ret = [];
  for (var i = start; i < end; i++) {
    ret.push(i);
  }
  return ret;
}
var init_range = __esm({
  "../../node_modules/remeda/dist/es/range.js"() {
    init_purry();
  }
});

// ../../node_modules/remeda/dist/es/randomString.js
function randomString(length) {
  var characterSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var randomChar = function() {
    return characterSet[Math.floor(Math.random() * characterSet.length)];
  };
  return range(0, length).reduce(function(text) {
    return text + randomChar();
  }, "");
}
var init_randomString = __esm({
  "../../node_modules/remeda/dist/es/randomString.js"() {
    init_range();
  }
});

// ../../node_modules/remeda/dist/es/reduce.js
function reduce() {
  return purry(_reduce(false), arguments);
}
var _reduce;
var init_reduce = __esm({
  "../../node_modules/remeda/dist/es/reduce.js"() {
    init_purry();
    _reduce = function(indexed) {
      return function(items, fn, initialValue) {
        return items.reduce(function(acc, item, index) {
          return indexed ? fn(acc, item, index, items) : fn(acc, item);
        }, initialValue);
      };
    };
    (function(reduce2) {
      function indexed() {
        return purry(_reduce(true), arguments);
      }
      reduce2.indexed = indexed;
    })(reduce || (reduce = {}));
  }
});

// ../../node_modules/remeda/dist/es/reject.js
function reject() {
  return purry(_reject(false), arguments, reject.lazy);
}
var _reject, _lazy6;
var init_reject = __esm({
  "../../node_modules/remeda/dist/es/reject.js"() {
    init_purry();
    init_reduceLazy();
    init_toLazyIndexed();
    _reject = function(indexed) {
      return function(array, fn) {
        return _reduceLazy(array, indexed ? reject.lazyIndexed(fn) : reject.lazy(fn), indexed);
      };
    };
    _lazy6 = function(indexed) {
      return function(fn) {
        return function(value, index, array) {
          var valid = indexed ? fn(value, index, array) : fn(value);
          if (!valid === true) {
            return {
              done: false,
              hasNext: true,
              next: value
            };
          }
          return {
            done: false,
            hasNext: false
          };
        };
      };
    };
    (function(reject2) {
      function indexed() {
        return purry(_reject(true), arguments, reject2.lazyIndexed);
      }
      reject2.indexed = indexed;
      reject2.lazy = _lazy6(false);
      reject2.lazyIndexed = _toLazyIndexed(_lazy6(true));
    })(reject || (reject = {}));
  }
});

// ../../node_modules/remeda/dist/es/reverse.js
function reverse() {
  return purry(_reverse, arguments);
}
function _reverse(array) {
  return array.slice().reverse();
}
var init_reverse = __esm({
  "../../node_modules/remeda/dist/es/reverse.js"() {
    init_purry();
  }
});

// ../../node_modules/remeda/dist/es/set.js
function set() {
  return purry(_set, arguments);
}
function _set(obj, prop2, value) {
  var _a;
  return __assign3(__assign3({}, obj), (_a = {}, _a[prop2] = value, _a));
}
var __assign3;
var init_set = __esm({
  "../../node_modules/remeda/dist/es/set.js"() {
    init_purry();
    __assign3 = function() {
      __assign3 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
        }
        return t;
      };
      return __assign3.apply(this, arguments);
    };
  }
});

// ../../node_modules/remeda/dist/es/sort.js
function sort() {
  return purry(_sort, arguments);
}
function _sort(items, cmp) {
  var ret = __spreadArrays4(items);
  ret.sort(cmp);
  return ret;
}
var __spreadArrays4;
var init_sort = __esm({
  "../../node_modules/remeda/dist/es/sort.js"() {
    init_purry();
    __spreadArrays4 = function() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++)
        s += arguments[i].length;
      for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
      return r;
    };
  }
});

// ../../node_modules/remeda/dist/es/sortBy.js
function sortBy(arrayOrSort) {
  var sorts = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    sorts[_i - 1] = arguments[_i];
  }
  if (!isSortRule(arrayOrSort)) {
    return purry(_sortBy, [arrayOrSort, sorts]);
  }
  return purry(_sortBy, [__spreadArrays5([arrayOrSort], sorts)]);
}
function isSortRule(x) {
  if (typeof x == "function")
    return true;
  if (x.length != 2)
    return false;
  return typeof x[0] == "function" && (x[1] === "asc" || x[1] === "desc");
}
function _sortBy(array, sorts) {
  var sort2 = function(a, b, sortRule, sortRules) {
    var _a;
    var fn;
    var direction;
    if (Array.isArray(sortRule)) {
      _a = sortRule, fn = _a[0], direction = _a[1];
    } else {
      direction = "asc";
      fn = sortRule;
    }
    var dir = direction !== "desc" ? function(x, y) {
      return x > y;
    } : function(x, y) {
      return x < y;
    };
    if (!fn) {
      return 0;
    }
    if (dir(fn(a), fn(b))) {
      return 1;
    }
    if (dir(fn(b), fn(a))) {
      return -1;
    }
    return sort2(a, b, sortRules[0], sortRules.slice(1));
  };
  var copied = __spreadArrays5(array);
  return copied.sort(function(a, b) {
    return sort2(a, b, sorts[0], sorts.slice(1));
  });
}
var __spreadArrays5;
var init_sortBy = __esm({
  "../../node_modules/remeda/dist/es/sortBy.js"() {
    init_purry();
    __spreadArrays5 = function() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++)
        s += arguments[i].length;
      for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
      return r;
    };
  }
});

// ../../node_modules/remeda/dist/es/splitAt.js
function splitAt() {
  return purry(_splitAt, arguments);
}
function _splitAt(array, index) {
  var copy = __spreadArrays6(array);
  var tail = copy.splice(index);
  return [copy, tail];
}
var __spreadArrays6;
var init_splitAt = __esm({
  "../../node_modules/remeda/dist/es/splitAt.js"() {
    init_purry();
    __spreadArrays6 = function() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++)
        s += arguments[i].length;
      for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
      return r;
    };
  }
});

// ../../node_modules/remeda/dist/es/splitWhen.js
function splitWhen() {
  return purry(_splitWhen, arguments);
}
function _splitWhen(array, fn) {
  for (var i = 0; i < array.length; i++) {
    if (fn(array[i])) {
      return splitAt(array, i);
    }
  }
  return [array, []];
}
var init_splitWhen = __esm({
  "../../node_modules/remeda/dist/es/splitWhen.js"() {
    init_splitAt();
    init_purry();
  }
});

// ../../node_modules/remeda/dist/es/take.js
function take() {
  return purry(_take, arguments, take.lazy);
}
function _take(array, n) {
  return _reduceLazy(array, take.lazy(n));
}
var init_take = __esm({
  "../../node_modules/remeda/dist/es/take.js"() {
    init_purry();
    init_reduceLazy();
    (function(take2) {
      function lazy(n) {
        return function(value) {
          if (n === 0) {
            return {
              done: true,
              hasNext: false
            };
          }
          n--;
          if (n === 0) {
            return {
              done: true,
              hasNext: true,
              next: value
            };
          }
          return {
            done: false,
            hasNext: true,
            next: value
          };
        };
      }
      take2.lazy = lazy;
    })(take || (take = {}));
  }
});

// ../../node_modules/remeda/dist/es/takeWhile.js
function takeWhile() {
  return purry(_takeWhile, arguments);
}
function _takeWhile(array, fn) {
  var ret = [];
  for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
    var item = array_1[_i];
    if (!fn(item)) {
      break;
    }
    ret.push(item);
  }
  return ret;
}
var init_takeWhile = __esm({
  "../../node_modules/remeda/dist/es/takeWhile.js"() {
    init_purry();
  }
});

// ../../node_modules/remeda/dist/es/times.js
function times() {
  return purry(_times, arguments);
}
function _times(count, fn) {
  if (count < 0) {
    throw new RangeError("n must be a non-negative number");
  }
  var res = [];
  for (var i = 0; i < count; i++) {
    res.push(fn(i));
  }
  return res;
}
var init_times = __esm({
  "../../node_modules/remeda/dist/es/times.js"() {
    init_purry();
  }
});

// ../../node_modules/remeda/dist/es/toPairs.js
function toPairs(object) {
  return Object.entries(object);
}
var init_toPairs = __esm({
  "../../node_modules/remeda/dist/es/toPairs.js"() {
  }
});

// ../../node_modules/remeda/dist/es/uniq.js
function uniq() {
  return purry(_uniq, arguments, uniq.lazy);
}
function _uniq(array) {
  return _reduceLazy(array, uniq.lazy());
}
var init_uniq = __esm({
  "../../node_modules/remeda/dist/es/uniq.js"() {
    init_purry();
    init_reduceLazy();
    (function(uniq2) {
      function lazy() {
        var set2 = /* @__PURE__ */ new Set();
        return function(value) {
          if (set2.has(value)) {
            return {
              done: false,
              hasNext: false
            };
          }
          set2.add(value);
          return {
            done: false,
            hasNext: true,
            next: value
          };
        };
      }
      uniq2.lazy = lazy;
    })(uniq || (uniq = {}));
  }
});

// ../../node_modules/remeda/dist/es/uniqBy.js
function uniqBy() {
  return purry(_uniqBy, arguments, lazyUniqBy);
}
function _uniqBy(array, transformer) {
  return _reduceLazy(array, lazyUniqBy(transformer));
}
function lazyUniqBy(transformer) {
  var set2 = /* @__PURE__ */ new Set();
  return function(value) {
    var appliedItem = transformer(value);
    if (set2.has(appliedItem)) {
      return {
        done: false,
        hasNext: false
      };
    }
    set2.add(appliedItem);
    return {
      done: false,
      hasNext: true,
      next: value
    };
  };
}
var init_uniqBy = __esm({
  "../../node_modules/remeda/dist/es/uniqBy.js"() {
    init_purry();
    init_reduceLazy();
  }
});

// ../../node_modules/remeda/dist/es/values.js
function values(source) {
  return Object.values(source);
}
var init_values = __esm({
  "../../node_modules/remeda/dist/es/values.js"() {
  }
});

// ../../node_modules/remeda/dist/es/zip.js
function zip() {
  return purry(_zip, arguments);
}
function _zip(first2, second) {
  var resultLength = first2.length > second.length ? second.length : first2.length;
  var result = [];
  for (var i = 0; i < resultLength; i++) {
    result.push([first2[i], second[i]]);
  }
  return result;
}
var init_zip = __esm({
  "../../node_modules/remeda/dist/es/zip.js"() {
    init_purry();
  }
});

// ../../node_modules/remeda/dist/es/zipWith.js
function zipWith() {
  var args = Array.from(arguments);
  if (typeof args[0] === "function" && args.length === 1) {
    return function(f, s) {
      return _zipWith(f, s, args[0]);
    };
  }
  if (typeof args[0] === "function" && args.length === 2) {
    return function(f) {
      return _zipWith(f, args[1], args[0]);
    };
  }
  if (args.length === 3) {
    return _zipWith(args[0], args[1], args[2]);
  }
}
function _zipWith(first2, second, fn) {
  var resultLength = first2.length > second.length ? second.length : first2.length;
  var result = [];
  for (var i = 0; i < resultLength; i++) {
    result.push(fn(first2[i], second[i]));
  }
  return result;
}
var init_zipWith = __esm({
  "../../node_modules/remeda/dist/es/zipWith.js"() {
  }
});

// ../../node_modules/remeda/dist/es/index.js
var es_exports = {};
__export(es_exports, {
  addProp: () => addProp,
  allPass: () => allPass,
  anyPass: () => anyPass,
  chunk: () => chunk,
  clamp: () => clamp,
  clone: () => clone,
  compact: () => compact,
  concat: () => concat,
  countBy: () => countBy,
  createPipe: () => createPipe,
  difference: () => difference,
  drop: () => drop,
  dropLast: () => dropLast,
  equals: () => equals,
  filter: () => filter,
  find: () => find,
  findIndex: () => findIndex,
  first: () => first,
  flatMap: () => flatMap,
  flatMapToObj: () => flatMapToObj,
  flatten: () => flatten,
  flattenDeep: () => flattenDeep,
  forEach: () => forEach,
  forEachObj: () => forEachObj,
  fromPairs: () => fromPairs,
  groupBy: () => groupBy,
  identity: () => identity,
  indexBy: () => indexBy,
  intersection: () => intersection,
  isArray: () => isArray,
  isBoolean: () => isBoolean,
  isDate: () => isDate,
  isDefined: () => isDefined,
  isError: () => isError,
  isFunction: () => isFunction,
  isNil: () => isNil,
  isNot: () => isNot,
  isNumber: () => isNumber,
  isObject: () => isObject,
  isPromise: () => isPromise,
  isString: () => isString,
  isTruthy: () => isTruthy,
  keys: () => keys,
  last: () => last,
  map: () => map,
  mapKeys: () => mapKeys,
  mapToObj: () => mapToObj,
  mapValues: () => mapValues,
  maxBy: () => maxBy,
  merge: () => merge,
  mergeAll: () => mergeAll,
  minBy: () => minBy,
  noop: () => noop,
  objOf: () => objOf,
  omit: () => omit,
  once: () => once,
  partition: () => partition,
  pathOr: () => pathOr,
  pick: () => pick,
  pipe: () => pipe,
  prop: () => prop,
  purry: () => purry,
  randomString: () => randomString,
  range: () => range,
  reduce: () => reduce,
  reject: () => reject,
  reverse: () => reverse,
  set: () => set,
  sort: () => sort,
  sortBy: () => sortBy,
  splitAt: () => splitAt,
  splitWhen: () => splitWhen,
  take: () => take,
  takeWhile: () => takeWhile,
  times: () => times,
  toPairs: () => toPairs,
  type: () => type,
  uniq: () => uniq,
  uniqBy: () => uniqBy,
  values: () => values,
  zip: () => zip,
  zipWith: () => zipWith
});
var init_es = __esm({
  "../../node_modules/remeda/dist/es/index.js"() {
    init_addProp();
    init_allPass();
    init_anyPass();
    init_chunk();
    init_clamp();
    init_clone();
    init_compact();
    init_concat();
    init_countBy();
    init_createPipe();
    init_difference();
    init_drop();
    init_dropLast();
    init_equals();
    init_filter();
    init_find();
    init_findIndex();
    init_first();
    init_flatMap();
    init_flatMapToObj();
    init_flatten();
    init_flattenDeep();
    init_forEach();
    init_forEachObj();
    init_fromPairs();
    init_groupBy();
    init_guards();
    init_identity();
    init_indexBy();
    init_intersection();
    init_keys();
    init_last();
    init_map();
    init_mapKeys();
    init_mapToObj();
    init_mapValues();
    init_maxBy();
    init_merge();
    init_mergeAll();
    init_minBy();
    init_noop();
    init_objOf();
    init_omit();
    init_once();
    init_partition();
    init_pathOr();
    init_pick();
    init_pipe();
    init_prop();
    init_purry();
    init_randomString();
    init_range();
    init_reduce();
    init_reject();
    init_reverse();
    init_set();
    init_sort();
    init_sortBy();
    init_splitAt();
    init_splitWhen();
    init_take();
    init_takeWhile();
    init_times();
    init_toPairs();
    init_type();
    init_uniq();
    init_uniqBy();
    init_values();
    init_zip();
    init_zipWith();
  }
});

// ../../packages/schema/dist/index.js
var require_dist = __commonJS({
  "../../packages/schema/dist/index.js"(exports, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var src_exports = {};
    __export2(src_exports, {
      SchemaILToJsonSchema: () => SchemaILToJsonSchema2
    });
    module2.exports = __toCommonJS2(src_exports);
    var import_remeda4 = (init_es(), __toCommonJS(es_exports));
    var SchemaILToJsonSchema2 = (ddl) => {
      const fields = (0, import_remeda4.pipe)(ddl.fields, (0, import_remeda4.mapValues)((value, field) => ({
        ...value,
        field
      })), import_remeda4.values);
      const required = (0, import_remeda4.pipe)(fields, (0, import_remeda4.filter)((f) => (0, import_remeda4.isTruthy)(f.required)), (0, import_remeda4.map)((f) => f.field));
      const pks = (0, import_remeda4.pipe)(fields, (0, import_remeda4.filter)((f) => (0, import_remeda4.isTruthy)(f.primary)), (0, import_remeda4.map)((f) => f.field));
      const properties = (0, import_remeda4.pipe)(fields, (0, import_remeda4.map)((f) => tuple(f.field, (0, import_remeda4.pick)(f, ["type", "label", "field"]))), (v) => (0, import_remeda4.fromPairs)(v));
      return {
        properties,
        type: "object",
        required,
        unique: pks,
        primary: pks[0]
      };
    };
    function tuple(a, b) {
      return [a, b];
    }
  }
});

// src/setup.ts
var setup_exports = {};
__export(setup_exports, {
  default: () => setup_default
});
module.exports = __toCommonJS(setup_exports);

// ../../packages/configure/dist/index.mjs
init_es();
var import_schema = __toESM(require_dist(), 1);
init_es();

// ../../node_modules/case-anything/dist/index.es.js
var magicSplit = /^[a-zà-öø-ÿ]+|[A-ZÀ-ÖØ-ß][a-zà-öø-ÿ]+|[a-zà-öø-ÿ]+|[0-9]+|[A-ZÀ-ÖØ-ß]+(?![a-zà-öø-ÿ])/g;
var spaceSplit = /\S+/g;
function getPartsAndIndexes(string, splitRegex) {
  const result = { parts: [], prefixes: [] };
  const matches = string.matchAll(splitRegex);
  let lastWordEndIndex = 0;
  for (const match of matches) {
    if (typeof match.index !== "number")
      continue;
    const word = match[0];
    result.parts.push(word);
    const prefix = string.slice(lastWordEndIndex, match.index).trim();
    result.prefixes.push(prefix);
    lastWordEndIndex = match.index + word.length;
  }
  const tail = string.slice(lastWordEndIndex).trim();
  if (tail) {
    result.parts.push("");
    result.prefixes.push(tail);
  }
  return result;
}
function splitAndPrefix(string, options) {
  const { keepSpecialCharacters = false, keep, prefix = "" } = options || {};
  const normalString = string.trim().normalize("NFC");
  const hasSpaces = normalString.includes(" ");
  const split = hasSpaces ? spaceSplit : magicSplit;
  const partsAndIndexes = getPartsAndIndexes(normalString, split);
  return partsAndIndexes.parts.map((_part, i) => {
    let foundPrefix = partsAndIndexes.prefixes[i] || "";
    let part = _part;
    if (keepSpecialCharacters === false) {
      if (keep) {
        part = part.normalize("NFD").replace(new RegExp(`[^a-zA-Z\xD8\xDF\xF80-9${keep.join("")}]`, "g"), "");
      }
      if (!keep) {
        part = part.normalize("NFD").replace(/[^a-zA-ZØßø0-9]/g, "");
        foundPrefix = "";
      }
    }
    if (keep) {
      foundPrefix = foundPrefix.replace(new RegExp(`[^${keep.join("")}]`, "g"), "");
    }
    if (i === 0) {
      return foundPrefix + part;
    }
    if (!foundPrefix && !part)
      return "";
    if (!hasSpaces) {
      return (foundPrefix || prefix) + part;
    }
    if (!foundPrefix && prefix.match(/\s/)) {
      return " " + part;
    }
    return (foundPrefix || prefix) + part;
  }).filter(Boolean);
}
function capitaliseWord(string) {
  var _a;
  const firstLetterIndex = ((_a = string.matchAll(magicSplit).next().value) === null || _a === void 0 ? void 0 : _a.index) || 0;
  return string.slice(0, firstLetterIndex + 1).toUpperCase() + string.slice(firstLetterIndex + 1).toLowerCase();
}
function capitalCase(string, options = { keepSpecialCharacters: true }) {
  return splitAndPrefix(string, { ...options, prefix: " " }).reduce((result, word) => {
    return result + capitaliseWord(word);
  }, "");
}

// ../../packages/configure/dist/index.mjs
init_es();
var FlatfileRecord = class {
  constructor(raw) {
    this._info = [];
    this.mutated = Object.assign({}, raw.rawData);
    this.data = Object.assign({}, raw.rawData);
    this._rowId = raw.rowId;
  }
  get rowId() {
    return this._rowId;
  }
  get originalValue() {
    return this.data;
  }
  get value() {
    return this.mutated;
  }
  verifyField(field) {
    if (!this.data.hasOwnProperty(field)) {
      console.error(`Record does not have field "${field}".`);
      return false;
    }
    return true;
  }
  set(field, value) {
    if (!this.verifyField(field)) {
      return this;
    }
    Object.defineProperty(this.mutated, field, {
      value
    });
    return this;
  }
  get(field) {
    if (this.verifyField(field)) {
      return this.mutated[field];
    }
    return null;
  }
  addInfo(fields, message) {
    return this.pushInfoMessage(fields, message, "info");
  }
  addComment(fields, message) {
    return this.addInfo(fields, message);
  }
  addError(fields, message) {
    return this.pushInfoMessage(fields, message, "error");
  }
  addWarning(fields, message) {
    return this.pushInfoMessage(fields, message, "warn");
  }
  pushInfoMessage(fields, message, level) {
    fields = Array.isArray(fields) ? fields : [fields];
    fields.forEach((field) => {
      if (this.verifyField(field)) {
        this._info.push({
          field,
          message,
          level
        });
      }
    });
    return this;
  }
  toJSON() {
    return {
      row: {
        rawData: this.mutated,
        rowId: this.rowId
      },
      info: this._info
    };
  }
};
var FlatfileRecords = class {
  constructor(rawRecords) {
    this._records = rawRecords.map((rawRecord) => new FlatfileRecord(rawRecord));
  }
  get records() {
    return this._records;
  }
  toJSON() {
    return this.records.map((record) => record.toJSON());
  }
};
var FlatfileSession = class {
  constructor(payload) {
    this.payload = payload;
  }
  get workspaceId() {
    return this.payload.workspaceId;
  }
  get workbookId() {
    return this.payload.workbookId;
  }
  get schemaId() {
    return this.payload.schemaId;
  }
  get schemaSlug() {
    return this.payload.schemaSlug;
  }
  get uploads() {
    return this.payload.uploads;
  }
  get endUser() {
    return this.payload.endUser;
  }
  get rows() {
    return this.payload.rows;
  }
  get env() {
    return this.payload.env;
  }
  get envSignature() {
    return this.payload.envSignature;
  }
};
var FlatfileEvent = class {
  constructor(name, data, session, logger, src) {
    this.name = name;
    this.data = data;
    this.session = session;
    this.logger = logger;
    this.src = src;
    this.target = [session.schemaSlug];
  }
  fork(name, data) {
    return new FlatfileEvent(name, data, this.session, this.logger, this);
  }
};
var Workbook = class {
  constructor(options) {
    this.options = options;
    this.runHookOnLambda = async ({
      recordBatch,
      session,
      logger,
      eventType = "records/change"
    }) => {
      const event = new FlatfileEvent(eventType, recordBatch, session, logger);
      await this.routeEvents(event);
      return recordBatch.toJSON();
    };
  }
  async routeEvents(event) {
    const { namespace } = this.options;
    const targets = Object.keys(this.options.sheets);
    const foundTarget = targets.find((t) => event.target.includes(namespace + "/" + t));
    console.log("FOUND TARGET", foundTarget, targets, event.target);
    if (foundTarget) {
      await this.options.sheets[foundTarget].routeEvents(event);
    } else {
      throw new Error("no target found");
    }
  }
  toJSONSchema() {
    return pipe(this.options.sheets, mapValues((m, k) => m.toJSONSchema(this.options.namespace, k)), values);
  }
  async handleLegacyDataHook(payload) {
    const recordBatch = new FlatfileRecords(payload.rows.map((r) => r.row));
    const session = new FlatfileSession(payload);
    const event = new FlatfileEvent("records/change", recordBatch, session, console);
    console.log({ event });
    await this.routeEvents(event);
    return recordBatch.toJSON();
  }
};
var HookProvider = class {
  constructor() {
    this.hooks = [];
  }
  on(event, callback) {
    this.hooks.push({ event, callback });
    return this;
  }
  getHookListeners(event) {
    return this.hooks.filter((l) => l.event === event).map((l) => l.callback);
  }
  runHookListeners(name, event) {
    return this.getHookListeners(name).map(async (cb) => cb(event));
  }
  async pipeHookListeners(name, event) {
    const listeners = this.getHookListeners(name);
    let e = event;
    for (const i in listeners) {
      const res = await listeners[i](e);
      if (res) {
        e = e.fork(name, res);
      }
    }
    return e;
  }
};
var Sheet = class extends HookProvider {
  constructor(name, fields, options) {
    super();
    this.name = name;
    this.fields = fields;
    this.options = options;
    if (options == null ? void 0 : options.onChange) {
      this.on("change", (e) => {
        const batch = e.data;
        return Promise.all(batch.records.map((r) => {
          return options.onChange(r, e.session);
        }));
      });
    }
  }
  usePlugin(plugin, config) {
  }
  async routeEvents(event) {
    switch (event.name) {
      case "records/change":
        await Promise.all(event.data.records.map((r) => {
          return toPairs(this.fields).map(([key, field]) => {
            return field.routeEvents(key, event.fork("change", r));
          });
        }));
        const modelListeners = this.getHookListeners("change");
        await Promise.all(modelListeners.map((l) => l(event)));
        break;
    }
  }
  get fieldArray() {
    const out = [];
    for (const key in this.fields) {
      out.push(this.fields[key]);
    }
    return out;
  }
  toSchemaIL(namespace, slug) {
    let base = {
      name: this.name,
      slug,
      namespace,
      fields: {}
    };
    for (const key in this.fields) {
      base = this.fields[key].toSchemaIL(base, key);
    }
    return base;
  }
  toJSONSchema(namespace, slug) {
    return (0, import_schema.SchemaILToJsonSchema)(this.toSchemaIL(namespace, slug));
  }
};
var Field = class extends HookProvider {
  constructor(options = {}) {
    super();
    this.options = options;
    this.configFactory = (base) => base;
    this.attachListenersFromOptions(options);
  }
  registerSerializer(cb) {
    this.configFactory = cb;
  }
  async routeEvents(key, event) {
    try {
      let e;
      e = event.fork("cast", { value: event.data.get(key) });
      e = await this.pipeHookListeners("cast", e);
      if (e.data.value === null) {
        e = await this.pipeHookListeners("empty", e);
      }
      if (e.data.value !== null) {
        e = await this.pipeHookListeners("value", e);
      }
      this.applyHookResponseToRecord(event.data, key, e.data.value);
      e = await this.pipeHookListeners("validate", e);
      this.applyHookResponseToRecord(event.data, key, void 0, e.data.messages);
    } catch (err) {
      this.applyHookResponseToRecord(event.data, key, void 0, err);
    }
  }
  toSchemaIL(baseSchema, key) {
    return this.configFactory(baseSchema, key);
  }
  applyHookResponseToRecord(record, key, value, message) {
    if (value !== void 0) {
      record.set(key, value);
    }
    if (message !== void 0) {
      if (isError(message)) {
        record.addError(key, message.message);
      } else if (typeof message === "string") {
        record.addError(key, message);
      } else if (message instanceof Message) {
        record.pushInfoMessage(key, message.message, message.level);
      }
    }
  }
  attachListenersFromOptions(options) {
    forEachObj.indexed(options, (cb, key) => {
      switch (key) {
        case "onCast":
          this.on("cast", (e) => {
            return { value: cb(e.data.value, e) };
          });
          break;
        case "onValue":
          this.on("value", (e) => {
            return { value: cb(e.data.value, e) };
          });
          break;
        case "onEmpty":
          this.on("empty", (e) => {
            return { value: cb(null, e) };
          });
          break;
        case "onValidate":
          this.on("validate", (e) => {
            return { messages: cb(e.data.value, e) };
          });
          break;
      }
    });
  }
};
function makeField(factory) {
  function fieldHelper(labelOpts, opts) {
    const label = typeof labelOpts === "string" ? labelOpts : void 0;
    const mergedOpts = (labelOpts !== "string" ? labelOpts : opts) ?? {};
    const options = {
      label,
      ...mergedOpts
    };
    const field = new Field(options);
    const serializer = factory(field);
    field.registerSerializer(serializer);
    return field;
  }
  return fieldHelper;
}
function setProp(base, key, prop2) {
  return {
    ...base,
    fields: {
      ...base.fields,
      [key]: {
        label: capitalCase(key),
        type: "string",
        ...prop2
      }
    }
  };
}
var Message = class {
  constructor(message, level = "info") {
    this.message = message;
    this.level = level;
  }
};
var TextField = makeField((opts) => {
  return (base, key) => setProp(base, key, { type: "string" });
});
var EmailField = makeField((field) => {
  field.on("value", ({ data: { value } }) => {
    if (field.options.nonPublic && value.toLowerCase().includes("gmail")) {
      throw new Error("GMail addresses not allowed");
    }
    return { value };
  });
  return (base, key) => setProp(base, key, { type: "string" });
});
var NumberField = makeField(() => {
  return (base) => ({ ...base, type: "number" });
});

// src/setup.ts
var Contact = new Sheet("Contact", {
  firstName: TextField({
    required: true,
    description: "foo"
  }),
  lastName: TextField(),
  email: EmailField({
    nonPublic: true,
    onValue: (v) => v.toUpperCase()
  }),
  phoneNumber: TextField(),
  startDate: TextField()
}, {
  allowCustomFields: true,
  readOnly: true,
  onChange(record, session, logger) {
    const fName = record.get("firstName");
    console.log(`lastName was ${record.get("lastName")}`);
    record.set("lastName", fName);
    return record;
  }
});
var setup_default = new Workbook({
  name: "Contact Onboarding",
  namespace: "onboarding",
  sheets: {
    contact: Contact
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
