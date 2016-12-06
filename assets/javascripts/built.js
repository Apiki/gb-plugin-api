/*!

 handlebars v3.0.3

Copyright (C) 2011-2014 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

@license
*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["Handlebars"] = factory();
	else
		root["Handlebars"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireWildcard = __webpack_require__(7)['default'];

	var _interopRequireDefault = __webpack_require__(8)['default'];

	exports.__esModule = true;

	var _import = __webpack_require__(1);

	var base = _interopRequireWildcard(_import);

	// Each of these augment the Handlebars object. No need to setup here.
	// (This is done to easily share code between commonjs and browse envs)

	var _SafeString = __webpack_require__(2);

	var _SafeString2 = _interopRequireDefault(_SafeString);

	var _Exception = __webpack_require__(3);

	var _Exception2 = _interopRequireDefault(_Exception);

	var _import2 = __webpack_require__(4);

	var Utils = _interopRequireWildcard(_import2);

	var _import3 = __webpack_require__(5);

	var runtime = _interopRequireWildcard(_import3);

	var _noConflict = __webpack_require__(6);

	var _noConflict2 = _interopRequireDefault(_noConflict);

	// For compatibility and usage outside of module systems, make the Handlebars object a namespace
	function create() {
	  var hb = new base.HandlebarsEnvironment();

	  Utils.extend(hb, base);
	  hb.SafeString = _SafeString2['default'];
	  hb.Exception = _Exception2['default'];
	  hb.Utils = Utils;
	  hb.escapeExpression = Utils.escapeExpression;

	  hb.VM = runtime;
	  hb.template = function (spec) {
	    return runtime.template(spec, hb);
	  };

	  return hb;
	}

	var inst = create();
	inst.create = create;

	_noConflict2['default'](inst);

	inst['default'] = inst;

	exports['default'] = inst;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireWildcard = __webpack_require__(7)['default'];

	var _interopRequireDefault = __webpack_require__(8)['default'];

	exports.__esModule = true;
	exports.HandlebarsEnvironment = HandlebarsEnvironment;
	exports.createFrame = createFrame;

	var _import = __webpack_require__(4);

	var Utils = _interopRequireWildcard(_import);

	var _Exception = __webpack_require__(3);

	var _Exception2 = _interopRequireDefault(_Exception);

	var VERSION = '3.0.1';
	exports.VERSION = VERSION;
	var COMPILER_REVISION = 6;

	exports.COMPILER_REVISION = COMPILER_REVISION;
	var REVISION_CHANGES = {
	  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
	  2: '== 1.0.0-rc.3',
	  3: '== 1.0.0-rc.4',
	  4: '== 1.x.x',
	  5: '== 2.0.0-alpha.x',
	  6: '>= 2.0.0-beta.1'
	};

	exports.REVISION_CHANGES = REVISION_CHANGES;
	var isArray = Utils.isArray,
	    isFunction = Utils.isFunction,
	    toString = Utils.toString,
	    objectType = '[object Object]';

	function HandlebarsEnvironment(helpers, partials) {
	  this.helpers = helpers || {};
	  this.partials = partials || {};

	  registerDefaultHelpers(this);
	}

	HandlebarsEnvironment.prototype = {
	  constructor: HandlebarsEnvironment,

	  logger: logger,
	  log: log,

	  registerHelper: function registerHelper(name, fn) {
	    if (toString.call(name) === objectType) {
	      if (fn) {
	        throw new _Exception2['default']('Arg not supported with multiple helpers');
	      }
	      Utils.extend(this.helpers, name);
	    } else {
	      this.helpers[name] = fn;
	    }
	  },
	  unregisterHelper: function unregisterHelper(name) {
	    delete this.helpers[name];
	  },

	  registerPartial: function registerPartial(name, partial) {
	    if (toString.call(name) === objectType) {
	      Utils.extend(this.partials, name);
	    } else {
	      if (typeof partial === 'undefined') {
	        throw new _Exception2['default']('Attempting to register a partial as undefined');
	      }
	      this.partials[name] = partial;
	    }
	  },
	  unregisterPartial: function unregisterPartial(name) {
	    delete this.partials[name];
	  }
	};

	function registerDefaultHelpers(instance) {
	  instance.registerHelper('helperMissing', function () {
	    if (arguments.length === 1) {
	      // A missing field in a {{foo}} constuct.
	      return undefined;
	    } else {
	      // Someone is actually trying to call something, blow up.
	      throw new _Exception2['default']('Missing helper: "' + arguments[arguments.length - 1].name + '"');
	    }
	  });

	  instance.registerHelper('blockHelperMissing', function (context, options) {
	    var inverse = options.inverse,
	        fn = options.fn;

	    if (context === true) {
	      return fn(this);
	    } else if (context === false || context == null) {
	      return inverse(this);
	    } else if (isArray(context)) {
	      if (context.length > 0) {
	        if (options.ids) {
	          options.ids = [options.name];
	        }

	        return instance.helpers.each(context, options);
	      } else {
	        return inverse(this);
	      }
	    } else {
	      if (options.data && options.ids) {
	        var data = createFrame(options.data);
	        data.contextPath = Utils.appendContextPath(options.data.contextPath, options.name);
	        options = { data: data };
	      }

	      return fn(context, options);
	    }
	  });

	  instance.registerHelper('each', function (context, options) {
	    if (!options) {
	      throw new _Exception2['default']('Must pass iterator to #each');
	    }

	    var fn = options.fn,
	        inverse = options.inverse,
	        i = 0,
	        ret = '',
	        data = undefined,
	        contextPath = undefined;

	    if (options.data && options.ids) {
	      contextPath = Utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
	    }

	    if (isFunction(context)) {
	      context = context.call(this);
	    }

	    if (options.data) {
	      data = createFrame(options.data);
	    }

	    function execIteration(field, index, last) {
	      if (data) {
	        data.key = field;
	        data.index = index;
	        data.first = index === 0;
	        data.last = !!last;

	        if (contextPath) {
	          data.contextPath = contextPath + field;
	        }
	      }

	      ret = ret + fn(context[field], {
	        data: data,
	        blockParams: Utils.blockParams([context[field], field], [contextPath + field, null])
	      });
	    }

	    if (context && typeof context === 'object') {
	      if (isArray(context)) {
	        for (var j = context.length; i < j; i++) {
	          execIteration(i, i, i === context.length - 1);
	        }
	      } else {
	        var priorKey = undefined;

	        for (var key in context) {
	          if (context.hasOwnProperty(key)) {
	            // We're running the iterations one step out of sync so we can detect
	            // the last iteration without have to scan the object twice and create
	            // an itermediate keys array.
	            if (priorKey) {
	              execIteration(priorKey, i - 1);
	            }
	            priorKey = key;
	            i++;
	          }
	        }
	        if (priorKey) {
	          execIteration(priorKey, i - 1, true);
	        }
	      }
	    }

	    if (i === 0) {
	      ret = inverse(this);
	    }

	    return ret;
	  });

	  instance.registerHelper('if', function (conditional, options) {
	    if (isFunction(conditional)) {
	      conditional = conditional.call(this);
	    }

	    // Default behavior is to render the positive path if the value is truthy and not empty.
	    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
	    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
	    if (!options.hash.includeZero && !conditional || Utils.isEmpty(conditional)) {
	      return options.inverse(this);
	    } else {
	      return options.fn(this);
	    }
	  });

	  instance.registerHelper('unless', function (conditional, options) {
	    return instance.helpers['if'].call(this, conditional, { fn: options.inverse, inverse: options.fn, hash: options.hash });
	  });

	  instance.registerHelper('with', function (context, options) {
	    if (isFunction(context)) {
	      context = context.call(this);
	    }

	    var fn = options.fn;

	    if (!Utils.isEmpty(context)) {
	      if (options.data && options.ids) {
	        var data = createFrame(options.data);
	        data.contextPath = Utils.appendContextPath(options.data.contextPath, options.ids[0]);
	        options = { data: data };
	      }

	      return fn(context, options);
	    } else {
	      return options.inverse(this);
	    }
	  });

	  instance.registerHelper('log', function (message, options) {
	    var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
	    instance.log(level, message);
	  });

	  instance.registerHelper('lookup', function (obj, field) {
	    return obj && obj[field];
	  });
	}

	var logger = {
	  methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

	  // State enum
	  DEBUG: 0,
	  INFO: 1,
	  WARN: 2,
	  ERROR: 3,
	  level: 1,

	  // Can be overridden in the host environment
	  log: function log(level, message) {
	    if (typeof console !== 'undefined' && logger.level <= level) {
	      var method = logger.methodMap[level];
	      (console[method] || console.log).call(console, message); // eslint-disable-line no-console
	    }
	  }
	};

	exports.logger = logger;
	var log = logger.log;

	exports.log = log;

	function createFrame(object) {
	  var frame = Utils.extend({}, object);
	  frame._parent = object;
	  return frame;
	}

	/* [args, ]options */

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	// Build out our basic SafeString type
	function SafeString(string) {
	  this.string = string;
	}

	SafeString.prototype.toString = SafeString.prototype.toHTML = function () {
	  return '' + this.string;
	};

	exports['default'] = SafeString;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

	function Exception(message, node) {
	  var loc = node && node.loc,
	      line = undefined,
	      column = undefined;
	  if (loc) {
	    line = loc.start.line;
	    column = loc.start.column;

	    message += ' - ' + line + ':' + column;
	  }

	  var tmp = Error.prototype.constructor.call(this, message);

	  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
	  for (var idx = 0; idx < errorProps.length; idx++) {
	    this[errorProps[idx]] = tmp[errorProps[idx]];
	  }

	  if (Error.captureStackTrace) {
	    Error.captureStackTrace(this, Exception);
	  }

	  if (loc) {
	    this.lineNumber = line;
	    this.column = column;
	  }
	}

	Exception.prototype = new Error();

	exports['default'] = Exception;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.extend = extend;

	// Older IE versions do not directly support indexOf so we must implement our own, sadly.
	exports.indexOf = indexOf;
	exports.escapeExpression = escapeExpression;
	exports.isEmpty = isEmpty;
	exports.blockParams = blockParams;
	exports.appendContextPath = appendContextPath;
	var escape = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;',
	  '\'': '&#x27;',
	  '`': '&#x60;'
	};

	var badChars = /[&<>"'`]/g,
	    possible = /[&<>"'`]/;

	function escapeChar(chr) {
	  return escape[chr];
	}

	function extend(obj /* , ...source */) {
	  for (var i = 1; i < arguments.length; i++) {
	    for (var key in arguments[i]) {
	      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
	        obj[key] = arguments[i][key];
	      }
	    }
	  }

	  return obj;
	}

	var toString = Object.prototype.toString;

	exports.toString = toString;
	// Sourced from lodash
	// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
	/*eslint-disable func-style, no-var */
	var isFunction = function isFunction(value) {
	  return typeof value === 'function';
	};
	// fallback for older versions of Chrome and Safari
	/* istanbul ignore next */
	if (isFunction(/x/)) {
	  exports.isFunction = isFunction = function (value) {
	    return typeof value === 'function' && toString.call(value) === '[object Function]';
	  };
	}
	var isFunction;
	exports.isFunction = isFunction;
	/*eslint-enable func-style, no-var */

	/* istanbul ignore next */
	var isArray = Array.isArray || function (value) {
	  return value && typeof value === 'object' ? toString.call(value) === '[object Array]' : false;
	};exports.isArray = isArray;

	function indexOf(array, value) {
	  for (var i = 0, len = array.length; i < len; i++) {
	    if (array[i] === value) {
	      return i;
	    }
	  }
	  return -1;
	}

	function escapeExpression(string) {
	  if (typeof string !== 'string') {
	    // don't escape SafeStrings, since they're already safe
	    if (string && string.toHTML) {
	      return string.toHTML();
	    } else if (string == null) {
	      return '';
	    } else if (!string) {
	      return string + '';
	    }

	    // Force a string conversion as this will be done by the append regardless and
	    // the regex test will do this transparently behind the scenes, causing issues if
	    // an object's to string has escaped characters in it.
	    string = '' + string;
	  }

	  if (!possible.test(string)) {
	    return string;
	  }
	  return string.replace(badChars, escapeChar);
	}

	function isEmpty(value) {
	  if (!value && value !== 0) {
	    return true;
	  } else if (isArray(value) && value.length === 0) {
	    return true;
	  } else {
	    return false;
	  }
	}

	function blockParams(params, ids) {
	  params.path = ids;
	  return params;
	}

	function appendContextPath(contextPath, id) {
	  return (contextPath ? contextPath + '.' : '') + id;
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireWildcard = __webpack_require__(7)['default'];

	var _interopRequireDefault = __webpack_require__(8)['default'];

	exports.__esModule = true;
	exports.checkRevision = checkRevision;

	// TODO: Remove this line and break up compilePartial

	exports.template = template;
	exports.wrapProgram = wrapProgram;
	exports.resolvePartial = resolvePartial;
	exports.invokePartial = invokePartial;
	exports.noop = noop;

	var _import = __webpack_require__(4);

	var Utils = _interopRequireWildcard(_import);

	var _Exception = __webpack_require__(3);

	var _Exception2 = _interopRequireDefault(_Exception);

	var _COMPILER_REVISION$REVISION_CHANGES$createFrame = __webpack_require__(1);

	function checkRevision(compilerInfo) {
	  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
	      currentRevision = _COMPILER_REVISION$REVISION_CHANGES$createFrame.COMPILER_REVISION;

	  if (compilerRevision !== currentRevision) {
	    if (compilerRevision < currentRevision) {
	      var runtimeVersions = _COMPILER_REVISION$REVISION_CHANGES$createFrame.REVISION_CHANGES[currentRevision],
	          compilerVersions = _COMPILER_REVISION$REVISION_CHANGES$createFrame.REVISION_CHANGES[compilerRevision];
	      throw new _Exception2['default']('Template was precompiled with an older version of Handlebars than the current runtime. ' + 'Please update your precompiler to a newer version (' + runtimeVersions + ') or downgrade your runtime to an older version (' + compilerVersions + ').');
	    } else {
	      // Use the embedded version info since the runtime doesn't know about this revision yet
	      throw new _Exception2['default']('Template was precompiled with a newer version of Handlebars than the current runtime. ' + 'Please update your runtime to a newer version (' + compilerInfo[1] + ').');
	    }
	  }
	}

	function template(templateSpec, env) {
	  /* istanbul ignore next */
	  if (!env) {
	    throw new _Exception2['default']('No environment passed to template');
	  }
	  if (!templateSpec || !templateSpec.main) {
	    throw new _Exception2['default']('Unknown template object: ' + typeof templateSpec);
	  }

	  // Note: Using env.VM references rather than local var references throughout this section to allow
	  // for external users to override these as psuedo-supported APIs.
	  env.VM.checkRevision(templateSpec.compiler);

	  function invokePartialWrapper(partial, context, options) {
	    if (options.hash) {
	      context = Utils.extend({}, context, options.hash);
	    }

	    partial = env.VM.resolvePartial.call(this, partial, context, options);
	    var result = env.VM.invokePartial.call(this, partial, context, options);

	    if (result == null && env.compile) {
	      options.partials[options.name] = env.compile(partial, templateSpec.compilerOptions, env);
	      result = options.partials[options.name](context, options);
	    }
	    if (result != null) {
	      if (options.indent) {
	        var lines = result.split('\n');
	        for (var i = 0, l = lines.length; i < l; i++) {
	          if (!lines[i] && i + 1 === l) {
	            break;
	          }

	          lines[i] = options.indent + lines[i];
	        }
	        result = lines.join('\n');
	      }
	      return result;
	    } else {
	      throw new _Exception2['default']('The partial ' + options.name + ' could not be compiled when running in runtime-only mode');
	    }
	  }

	  // Just add water
	  var container = {
	    strict: function strict(obj, name) {
	      if (!(name in obj)) {
	        throw new _Exception2['default']('"' + name + '" not defined in ' + obj);
	      }
	      return obj[name];
	    },
	    lookup: function lookup(depths, name) {
	      var len = depths.length;
	      for (var i = 0; i < len; i++) {
	        if (depths[i] && depths[i][name] != null) {
	          return depths[i][name];
	        }
	      }
	    },
	    lambda: function lambda(current, context) {
	      return typeof current === 'function' ? current.call(context) : current;
	    },

	    escapeExpression: Utils.escapeExpression,
	    invokePartial: invokePartialWrapper,

	    fn: function fn(i) {
	      return templateSpec[i];
	    },

	    programs: [],
	    program: function program(i, data, declaredBlockParams, blockParams, depths) {
	      var programWrapper = this.programs[i],
	          fn = this.fn(i);
	      if (data || depths || blockParams || declaredBlockParams) {
	        programWrapper = wrapProgram(this, i, fn, data, declaredBlockParams, blockParams, depths);
	      } else if (!programWrapper) {
	        programWrapper = this.programs[i] = wrapProgram(this, i, fn);
	      }
	      return programWrapper;
	    },

	    data: function data(value, depth) {
	      while (value && depth--) {
	        value = value._parent;
	      }
	      return value;
	    },
	    merge: function merge(param, common) {
	      var obj = param || common;

	      if (param && common && param !== common) {
	        obj = Utils.extend({}, common, param);
	      }

	      return obj;
	    },

	    noop: env.VM.noop,
	    compilerInfo: templateSpec.compiler
	  };

	  function ret(context) {
	    var options = arguments[1] === undefined ? {} : arguments[1];

	    var data = options.data;

	    ret._setup(options);
	    if (!options.partial && templateSpec.useData) {
	      data = initData(context, data);
	    }
	    var depths = undefined,
	        blockParams = templateSpec.useBlockParams ? [] : undefined;
	    if (templateSpec.useDepths) {
	      depths = options.depths ? [context].concat(options.depths) : [context];
	    }

	    return templateSpec.main.call(container, context, container.helpers, container.partials, data, blockParams, depths);
	  }
	  ret.isTop = true;

	  ret._setup = function (options) {
	    if (!options.partial) {
	      container.helpers = container.merge(options.helpers, env.helpers);

	      if (templateSpec.usePartial) {
	        container.partials = container.merge(options.partials, env.partials);
	      }
	    } else {
	      container.helpers = options.helpers;
	      container.partials = options.partials;
	    }
	  };

	  ret._child = function (i, data, blockParams, depths) {
	    if (templateSpec.useBlockParams && !blockParams) {
	      throw new _Exception2['default']('must pass block params');
	    }
	    if (templateSpec.useDepths && !depths) {
	      throw new _Exception2['default']('must pass parent depths');
	    }

	    return wrapProgram(container, i, templateSpec[i], data, 0, blockParams, depths);
	  };
	  return ret;
	}

	function wrapProgram(container, i, fn, data, declaredBlockParams, blockParams, depths) {
	  function prog(context) {
	    var options = arguments[1] === undefined ? {} : arguments[1];

	    return fn.call(container, context, container.helpers, container.partials, options.data || data, blockParams && [options.blockParams].concat(blockParams), depths && [context].concat(depths));
	  }
	  prog.program = i;
	  prog.depth = depths ? depths.length : 0;
	  prog.blockParams = declaredBlockParams || 0;
	  return prog;
	}

	function resolvePartial(partial, context, options) {
	  if (!partial) {
	    partial = options.partials[options.name];
	  } else if (!partial.call && !options.name) {
	    // This is a dynamic partial that returned a string
	    options.name = partial;
	    partial = options.partials[partial];
	  }
	  return partial;
	}

	function invokePartial(partial, context, options) {
	  options.partial = true;

	  if (partial === undefined) {
	    throw new _Exception2['default']('The partial ' + options.name + ' could not be found');
	  } else if (partial instanceof Function) {
	    return partial(context, options);
	  }
	}

	function noop() {
	  return '';
	}

	function initData(context, data) {
	  if (!data || !('root' in data)) {
	    data = data ? _COMPILER_REVISION$REVISION_CHANGES$createFrame.createFrame(data) : {};
	    data.root = context;
	  }
	  return data;
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	exports.__esModule = true;
	/*global window */

	exports['default'] = function (Handlebars) {
	  /* istanbul ignore next */
	  var root = typeof global !== 'undefined' ? global : window,
	      $Handlebars = root.Handlebars;
	  /* istanbul ignore next */
	  Handlebars.noConflict = function () {
	    if (root.Handlebars === Handlebars) {
	      root.Handlebars = $Handlebars;
	    }
	  };
	};

	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports["default"] = function (obj) {
	  if (obj && obj.__esModule) {
	    return obj;
	  } else {
	    var newObj = {};

	    if (typeof obj === "object" && obj !== null) {
	      for (var key in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
	      }
	    }

	    newObj["default"] = obj;
	    return newObj;
	  }
	};

	exports.__esModule = true;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports["default"] = function (obj) {
	  return obj && obj.__esModule ? obj : {
	    "default": obj
	  };
	};

	exports.__esModule = true;

/***/ }
/******/ ])
});
;;;(function(factory) {
    if ( typeof window.MONKEY != 'function' ) {
        factory( jQuery || Zepto );
    }
}(function(LibraryDOM) {
(function(context, $) {

    'use strict';

    // Build a new module with the correct attributes and methods.
    function build() {
        var Constructor, Instance;

        Constructor = function() {
            // Initialize a new instance, which won't do nothing but
            // inheriting the prototype.
            var instance = new Instance();

            // Apply the initializer on the given instance.
            instance.initialize.apply( instance, arguments );

            return instance;
        };

        // Define the function that will be used to
        // initialize the instance.
        Instance = function() {};
        Instance.prototype = Constructor.prototype;

        // Save some typing and make an alias to the prototype.
        Constructor.fn = Constructor.prototype;

        // Define a noop initializer.
        Constructor.fn.initialize = function() {};

        return Constructor;
    }

    var MONKEY = function(namespace, callback, object, isGlobalScope) {
        var components = namespace.split(/[.:]+/)
          , scope      = context
          , component
          , last
        ;

        if ( !isGlobalScope ) {
            scope = scope.MONKEY = scope.MONKEY || {};
        }

        if ( typeof callback !== 'function' ) {
            object   = callback;
            callback = null;
        }

        object = object || build();

        // Process all components but the last, which will store the
        // specified object attribute.
        for ( var i = 0, count = components.length; i < count; i++ ) {
            last = ( i == count - 1 );
            scope[components[i]] = ( last ? object : ( scope[components[i]] || {} ) );
            scope = scope[components[i]];
        }

        if ( callback ) {
            callback.call( scope, scope, MONKEY.utils, $ );
        }

        return scope;
    };

    MONKEY.Wrapper = function(namespace, initializer) {
        return MONKEY(namespace, function(definition) {
            definition.fn.initialize = function(namespace, callback) {
                initializer.apply( definition, arguments );
            };

            return definition;
        }, null, true );
    };

    context.MONKEY = MONKEY;

})( window, LibraryDOM );
;(function(context) {

    'use strict';

    MONKEY.Components = {};
    MONKEY.Ajax       = {};

})( window );
;(function(context, $) {

    'use strict';

    MONKEY.utils = {
        toTitleCase : function(text) {
            text = text.replace(/(?:^|-)\w/g, function(match) {
                return match.toUpperCase();
            });

            return text.replace(/-/g, '');
        },

        toCamelCase : function(text) {
            text = text.replace(/(?:^|-)\w/g, function(match, index) {
                return ( !index ) ? match : match.toUpperCase();
            });

            return text.replace(/-/g, '');
        }
    };

})( window, LibraryDOM );
;(function(context) {

    'use strict';

    function call(callback, args) {
        if ( typeof callback === 'function' ) {
            callback.apply( null, ( args || [] ) );
        }
    }

    MONKEY.dispatcher = function(application, route, args) {
        //execute all application
        call( application.init, args );
        call( application[route], args );
    };

})( window );
;(function(context, $) {

    'use strict';

    var components = MONKEY.Components || {};

    //define plugin js is exist
    $.fn.isExist = function(selector, callback) {
        var element = this.find( selector );

        if ( element.length && typeof callback == 'function' ) {
            callback.call( null, element, this );
        }

        return element.length;
    };

    $.fn.getComponent = function() {
        return this.data( '_component' );
    };

    MONKEY.factory = {
        create : function(container) {
            container.isExist( '[data-component]', this.constructor.bind( this ) );
        },

        constructor : function(elements) {
            elements.each( this.each.bind( this ) );
        },

        extend : function(name, reflection) {
            var mirror
              , method
            ;

            if ( typeof components[name] != 'function' ) {
                return;
            }

            mirror = components[name].fn;

            for ( method in mirror ) {
                if ( !~( reflection.overrides || [] ).indexOf( method ) ) {
                    reflection.fn[method] = mirror[method];
                }
            }
        },

        each : function(index, target) {
            var $el       = $( target )
              , extend    = $el.data( 'extend' )
              , name      = MONKEY.utils.toTitleCase( $el.data( 'component' ) )
              , instance  = null
            ;

            if ( typeof components[name] != 'function' ) {
                return;
            }

            if ( extend ) {
                this.extend( MONKEY.utils.toTitleCase( extend ), components[name] );
            }

            instance = components[name].call( null, $el );
            $el.data( '_component', instance );
        }
    };

})( window, LibraryDOM );
;MONKEY.Wrapper( 'MONKEY.ComponentWrapper', function(namespace, callback) {

    'use strict';

    MONKEY( ['Components', namespace].join( '.' ), function(Model, utils, $) {
        Model.fn.initialize = function(container) {
            this.$el      = container;
            this.elements = {};
            this.on       = null;
            this.fire     = null;

            //start component
            this.loadDefaultMethods();
            this.init();
        };

        Model.fn.loadDefaultMethods = function() {
            this.setAttrs();
            this.setElements();
            this.emitter();
        };

        Model.fn.setElements = function() {
            this.$el
                .find( '[data-element]' )
                    .each( this._assignEachElements.bind( this ) )
            ;
        };

        Model.fn._assignEachElements = function(index, element) {
            var target = $( element )
              , name   = target.data( 'element' )
            ;

            this._insertElement( target, name );
        };

        Model.fn._insertElement = function(target, name) {
            name = utils.toCamelCase( name );

            //ser flag for captured element
            target.attr( 'data-eobj', true );

            //case is exist element
            if ( this.elements[name] ) {
                this.elements[name] = this.elements[name].add( target );
                return;
            }

            //set attr in object elements
            this.elements[name] = target;
        };

        Model.fn.reloadElements = function() {
            this.$el
                .find( '[data-element]:not([data-eobj])' )
                    .each( this._assignEachElements.bind( this ) )
            ;
        };

        Model.fn.getElement = function(name) {
            var target = this.$el.find( '[data-element="' + name + '"]' );

            if ( !target.length ) {
                return false;
            }

            this._insertElement( target, name );
            return target;
        };

        Model.fn.setAttrs = function() {
            var attrs = this.$el.data();

            for ( var name in attrs ) {
                this[name] = attrs[name];
            }
        };

        Model.fn.emitter = function() {
            this.on   = $.proxy( this.$el, 'on' );
            this.fire = $.proxy( this.$el, 'trigger' );
        };

        Model.fn.addEvent = function(event, action) {
            var handle = utils.toCamelCase( [ '_on', event, action ].join( '-' ) );

            this.on(
                  event
                , '[data-action="' + action + '"]'
                , ( this[handle] || $.noop ).bind( this )
            );
        };

        Model.fn.init = function() {

        };

        callback( Model, utils, $ );
    });

});
}));;/*!
Chosen, a Select Box Enhancer for jQuery and Prototype
by Patrick Filler for Harvest, http://getharvest.com

Version 1.4.2
Full source at https://github.com/harvesthq/chosen
Copyright (c) 2011-2015 Harvest http://getharvest.com

MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md
This file is generated by `grunt build`, do not edit it by hand.
*/

(function() {
  var $, AbstractChosen, Chosen, SelectParser, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SelectParser = (function() {
    function SelectParser() {
      this.options_index = 0;
      this.parsed = [];
    }

    SelectParser.prototype.add_node = function(child) {
      if (child.nodeName.toUpperCase() === "OPTGROUP") {
        return this.add_group(child);
      } else {
        return this.add_option(child);
      }
    };

    SelectParser.prototype.add_group = function(group) {
      var group_position, option, _i, _len, _ref, _results;
      group_position = this.parsed.length;
      this.parsed.push({
        array_index: group_position,
        group: true,
        label: this.escapeExpression(group.label),
        title: group.title ? group.title : void 0,
        children: 0,
        disabled: group.disabled,
        classes: group.className
      });
      _ref = group.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        _results.push(this.add_option(option, group_position, group.disabled));
      }
      return _results;
    };

    SelectParser.prototype.add_option = function(option, group_position, group_disabled) {
      if (option.nodeName.toUpperCase() === "OPTION") {
        if (option.text !== "") {
          if (group_position != null) {
            this.parsed[group_position].children += 1;
          }
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            value: option.value,
            text: option.text,
            html: option.innerHTML,
            title: option.title ? option.title : void 0,
            selected: option.selected,
            disabled: group_disabled === true ? group_disabled : option.disabled,
            group_array_index: group_position,
            group_label: group_position != null ? this.parsed[group_position].label : null,
            classes: option.className,
            style: option.style.cssText
          });
        } else {
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            empty: true
          });
        }
        return this.options_index += 1;
      }
    };

    SelectParser.prototype.escapeExpression = function(text) {
      var map, unsafe_chars;
      if ((text == null) || text === false) {
        return "";
      }
      if (!/[\&\<\>\"\'\`]/.test(text)) {
        return text;
      }
      map = {
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "`": "&#x60;"
      };
      unsafe_chars = /&(?!\w+;)|[\<\>\"\'\`]/g;
      return text.replace(unsafe_chars, function(chr) {
        return map[chr] || "&amp;";
      });
    };

    return SelectParser;

  })();

  SelectParser.select_to_array = function(select) {
    var child, parser, _i, _len, _ref;
    parser = new SelectParser();
    _ref = select.childNodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      parser.add_node(child);
    }
    return parser.parsed;
  };

  AbstractChosen = (function() {
    function AbstractChosen(form_field, options) {
      this.form_field = form_field;
      this.options = options != null ? options : {};
      if (!AbstractChosen.browser_is_supported()) {
        return;
      }
      this.is_multiple = this.form_field.multiple;
      this.set_default_text();
      this.set_default_values();
      this.setup();
      this.set_up_html();
      this.register_observers();
      this.on_ready();
    }

    AbstractChosen.prototype.set_default_values = function() {
      var _this = this;
      this.click_test_action = function(evt) {
        return _this.test_active_click(evt);
      };
      this.activate_action = function(evt) {
        return _this.activate_field(evt);
      };
      this.active_field = false;
      this.mouse_on_container = false;
      this.results_showing = false;
      this.result_highlighted = null;
      this.allow_single_deselect = (this.options.allow_single_deselect != null) && (this.form_field.options[0] != null) && this.form_field.options[0].text === "" ? this.options.allow_single_deselect : false;
      this.disable_search_threshold = this.options.disable_search_threshold || 0;
      this.disable_search = this.options.disable_search || false;
      this.enable_split_word_search = this.options.enable_split_word_search != null ? this.options.enable_split_word_search : true;
      this.group_search = this.options.group_search != null ? this.options.group_search : true;
      this.search_contains = this.options.search_contains || false;
      this.single_backstroke_delete = this.options.single_backstroke_delete != null ? this.options.single_backstroke_delete : true;
      this.max_selected_options = this.options.max_selected_options || Infinity;
      this.inherit_select_classes = this.options.inherit_select_classes || false;
      this.display_selected_options = this.options.display_selected_options != null ? this.options.display_selected_options : true;
      this.display_disabled_options = this.options.display_disabled_options != null ? this.options.display_disabled_options : true;
      return this.include_group_label_in_selected = this.options.include_group_label_in_selected || false;
    };

    AbstractChosen.prototype.set_default_text = function() {
      if (this.form_field.getAttribute("data-placeholder")) {
        this.default_text = this.form_field.getAttribute("data-placeholder");
      } else if (this.is_multiple) {
        this.default_text = this.options.placeholder_text_multiple || this.options.placeholder_text || AbstractChosen.default_multiple_text;
      } else {
        this.default_text = this.options.placeholder_text_single || this.options.placeholder_text || AbstractChosen.default_single_text;
      }
      return this.results_none_found = this.form_field.getAttribute("data-no_results_text") || this.options.no_results_text || AbstractChosen.default_no_result_text;
    };

    AbstractChosen.prototype.choice_label = function(item) {
      if (this.include_group_label_in_selected && (item.group_label != null)) {
        return "<b class='group-name'>" + item.group_label + "</b>" + item.html;
      } else {
        return item.html;
      }
    };

    AbstractChosen.prototype.mouse_enter = function() {
      return this.mouse_on_container = true;
    };

    AbstractChosen.prototype.mouse_leave = function() {
      return this.mouse_on_container = false;
    };

    AbstractChosen.prototype.input_focus = function(evt) {
      var _this = this;
      if (this.is_multiple) {
        if (!this.active_field) {
          return setTimeout((function() {
            return _this.container_mousedown();
          }), 50);
        }
      } else {
        if (!this.active_field) {
          return this.activate_field();
        }
      }
    };

    AbstractChosen.prototype.input_blur = function(evt) {
      var _this = this;
      if (!this.mouse_on_container) {
        this.active_field = false;
        return setTimeout((function() {
          return _this.blur_test();
        }), 100);
      }
    };

    AbstractChosen.prototype.results_option_build = function(options) {
      var content, data, _i, _len, _ref;
      content = '';
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        data = _ref[_i];
        if (data.group) {
          content += this.result_add_group(data);
        } else {
          content += this.result_add_option(data);
        }
        if (options != null ? options.first : void 0) {
          if (data.selected && this.is_multiple) {
            this.choice_build(data);
          } else if (data.selected && !this.is_multiple) {
            this.single_set_selected_text(this.choice_label(data));
          }
        }
      }
      return content;
    };

    AbstractChosen.prototype.result_add_option = function(option) {
      var classes, option_el;
      if (!option.search_match) {
        return '';
      }
      if (!this.include_option_in_results(option)) {
        return '';
      }
      classes = [];
      if (!option.disabled && !(option.selected && this.is_multiple)) {
        classes.push("active-result");
      }
      if (option.disabled && !(option.selected && this.is_multiple)) {
        classes.push("disabled-result");
      }
      if (option.selected) {
        classes.push("result-selected");
      }
      if (option.group_array_index != null) {
        classes.push("group-option");
      }
      if (option.classes !== "") {
        classes.push(option.classes);
      }
      option_el = document.createElement("li");
      option_el.className = classes.join(" ");
      option_el.style.cssText = option.style;
      option_el.setAttribute("data-option-array-index", option.array_index);
      option_el.innerHTML = option.search_text;
      if (option.title) {
        option_el.title = option.title;
      }
      return this.outerHTML(option_el);
    };

    AbstractChosen.prototype.result_add_group = function(group) {
      var classes, group_el;
      if (!(group.search_match || group.group_match)) {
        return '';
      }
      if (!(group.active_options > 0)) {
        return '';
      }
      classes = [];
      classes.push("group-result");
      if (group.classes) {
        classes.push(group.classes);
      }
      group_el = document.createElement("li");
      group_el.className = classes.join(" ");
      group_el.innerHTML = group.search_text;
      if (group.title) {
        group_el.title = group.title;
      }
      return this.outerHTML(group_el);
    };

    AbstractChosen.prototype.results_update_field = function() {
      this.set_default_text();
      if (!this.is_multiple) {
        this.results_reset_cleanup();
      }
      this.result_clear_highlight();
      this.results_build();
      if (this.results_showing) {
        return this.winnow_results();
      }
    };

    AbstractChosen.prototype.reset_single_select_options = function() {
      var result, _i, _len, _ref, _results;
      _ref = this.results_data;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        result = _ref[_i];
        if (result.selected) {
          _results.push(result.selected = false);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    AbstractChosen.prototype.results_toggle = function() {
      if (this.results_showing) {
        return this.results_hide();
      } else {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.results_search = function(evt) {
      if (this.results_showing) {
        return this.winnow_results();
      } else {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.winnow_results = function() {
      var escapedSearchText, option, regex, results, results_group, searchText, startpos, text, zregex, _i, _len, _ref;
      this.no_results_clear();
      results = 0;
      searchText = this.get_search_text();
      escapedSearchText = searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      zregex = new RegExp(escapedSearchText, 'i');
      regex = this.get_search_regex(escapedSearchText);
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        option.search_match = false;
        results_group = null;
        if (this.include_option_in_results(option)) {
          if (option.group) {
            option.group_match = false;
            option.active_options = 0;
          }
          if ((option.group_array_index != null) && this.results_data[option.group_array_index]) {
            results_group = this.results_data[option.group_array_index];
            if (results_group.active_options === 0 && results_group.search_match) {
              results += 1;
            }
            results_group.active_options += 1;
          }
          option.search_text = option.group ? option.label : option.html;
          if (!(option.group && !this.group_search)) {
            option.search_match = this.search_string_match(option.search_text, regex);
            if (option.search_match && !option.group) {
              results += 1;
            }
            if (option.search_match) {
              if (searchText.length) {
                startpos = option.search_text.search(zregex);
                text = option.search_text.substr(0, startpos + searchText.length) + '</em>' + option.search_text.substr(startpos + searchText.length);
                option.search_text = text.substr(0, startpos) + '<em>' + text.substr(startpos);
              }
              if (results_group != null) {
                results_group.group_match = true;
              }
            } else if ((option.group_array_index != null) && this.results_data[option.group_array_index].search_match) {
              option.search_match = true;
            }
          }
        }
      }
      this.result_clear_highlight();
      if (results < 1 && searchText.length) {
        this.update_results_content("");
        return this.no_results(searchText);
      } else {
        this.update_results_content(this.results_option_build());
        return this.winnow_results_set_highlight();
      }
    };

    AbstractChosen.prototype.get_search_regex = function(escaped_search_string) {
      var regex_anchor;
      regex_anchor = this.search_contains ? "" : "^";
      return new RegExp(regex_anchor + escaped_search_string, 'i');
    };

    AbstractChosen.prototype.search_string_match = function(search_string, regex) {
      var part, parts, _i, _len;
      if (regex.test(search_string)) {
        return true;
      } else if (this.enable_split_word_search && (search_string.indexOf(" ") >= 0 || search_string.indexOf("[") === 0)) {
        parts = search_string.replace(/\[|\]/g, "").split(" ");
        if (parts.length) {
          for (_i = 0, _len = parts.length; _i < _len; _i++) {
            part = parts[_i];
            if (regex.test(part)) {
              return true;
            }
          }
        }
      }
    };

    AbstractChosen.prototype.choices_count = function() {
      var option, _i, _len, _ref;
      if (this.selected_option_count != null) {
        return this.selected_option_count;
      }
      this.selected_option_count = 0;
      _ref = this.form_field.options;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        if (option.selected) {
          this.selected_option_count += 1;
        }
      }
      return this.selected_option_count;
    };

    AbstractChosen.prototype.choices_click = function(evt) {
      evt.preventDefault();
      if (!(this.results_showing || this.is_disabled)) {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.keyup_checker = function(evt) {
      var stroke, _ref;
      stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
      this.search_field_scale();
      switch (stroke) {
        case 8:
          if (this.is_multiple && this.backstroke_length < 1 && this.choices_count() > 0) {
            return this.keydown_backstroke();
          } else if (!this.pending_backstroke) {
            this.result_clear_highlight();
            return this.results_search();
          }
          break;
        case 13:
          evt.preventDefault();
          if (this.results_showing) {
            return this.result_select(evt);
          }
          break;
        case 27:
          if (this.results_showing) {
            this.results_hide();
          }
          return true;
        case 9:
        case 38:
        case 40:
        case 16:
        case 91:
        case 17:
          break;
        default:
          return this.results_search();
      }
    };

    AbstractChosen.prototype.clipboard_event_checker = function(evt) {
      var _this = this;
      return setTimeout((function() {
        return _this.results_search();
      }), 50);
    };

    AbstractChosen.prototype.container_width = function() {
      if (this.options.width != null) {
        return this.options.width;
      } else {
        return "" + this.form_field.offsetWidth + "px";
      }
    };

    AbstractChosen.prototype.include_option_in_results = function(option) {
      if (this.is_multiple && (!this.display_selected_options && option.selected)) {
        return false;
      }
      if (!this.display_disabled_options && option.disabled) {
        return false;
      }
      if (option.empty) {
        return false;
      }
      return true;
    };

    AbstractChosen.prototype.search_results_touchstart = function(evt) {
      this.touch_started = true;
      return this.search_results_mouseover(evt);
    };

    AbstractChosen.prototype.search_results_touchmove = function(evt) {
      this.touch_started = false;
      return this.search_results_mouseout(evt);
    };

    AbstractChosen.prototype.search_results_touchend = function(evt) {
      if (this.touch_started) {
        return this.search_results_mouseup(evt);
      }
    };

    AbstractChosen.prototype.outerHTML = function(element) {
      var tmp;
      if (element.outerHTML) {
        return element.outerHTML;
      }
      tmp = document.createElement("div");
      tmp.appendChild(element);
      return tmp.innerHTML;
    };

    AbstractChosen.browser_is_supported = function() {
      if (window.navigator.appName === "Microsoft Internet Explorer") {
        return document.documentMode >= 8;
      }
      if (/iP(od|hone)/i.test(window.navigator.userAgent)) {
        return false;
      }
      if (/Android/i.test(window.navigator.userAgent)) {
        if (/Mobile/i.test(window.navigator.userAgent)) {
          return false;
        }
      }
      return true;
    };

    AbstractChosen.default_multiple_text = "Select Some Options";

    AbstractChosen.default_single_text = "Select an Option";

    AbstractChosen.default_no_result_text = "No results match";

    return AbstractChosen;

  })();

  $ = jQuery;

  $.fn.extend({
    chosen: function(options) {
      if (!AbstractChosen.browser_is_supported()) {
        return this;
      }
      return this.each(function(input_field) {
        var $this, chosen;
        $this = $(this);
        chosen = $this.data('chosen');
        if (options === 'destroy' && chosen instanceof Chosen) {
          chosen.destroy();
        } else if (!(chosen instanceof Chosen)) {
          $this.data('chosen', new Chosen(this, options));
        }
      });
    }
  });

  Chosen = (function(_super) {
    __extends(Chosen, _super);

    function Chosen() {
      _ref = Chosen.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Chosen.prototype.setup = function() {
      this.form_field_jq = $(this.form_field);
      this.current_selectedIndex = this.form_field.selectedIndex;
      return this.is_rtl = this.form_field_jq.hasClass("chosen-rtl");
    };

    Chosen.prototype.set_up_html = function() {
      var container_classes, container_props;
      container_classes = ["chosen-container"];
      container_classes.push("chosen-container-" + (this.is_multiple ? "multi" : "single"));
      if (this.inherit_select_classes && this.form_field.className) {
        container_classes.push(this.form_field.className);
      }
      if (this.is_rtl) {
        container_classes.push("chosen-rtl");
      }
      container_props = {
        'class': container_classes.join(' '),
        'style': "width: " + (this.container_width()) + ";",
        'title': this.form_field.title
      };
      if (this.form_field.id.length) {
        container_props.id = this.form_field.id.replace(/[^\w]/g, '_') + "_chosen";
      }
      this.container = $("<div />", container_props);
      if (this.is_multiple) {
        this.container.html('<ul class="chosen-choices"><li class="search-field"><input type="text" value="' + this.default_text + '" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chosen-drop"><ul class="chosen-results"></ul></div>');
      } else {
        this.container.html('<a class="chosen-single chosen-default" tabindex="-1"><span>' + this.default_text + '</span><div><b></b></div></a><div class="chosen-drop"><div class="chosen-search"><input type="text" autocomplete="off" /></div><ul class="chosen-results"></ul></div>');
      }
      this.form_field_jq.hide().after(this.container);
      this.dropdown = this.container.find('div.chosen-drop').first();
      this.search_field = this.container.find('input').first();
      this.search_results = this.container.find('ul.chosen-results').first();
      this.search_field_scale();
      this.search_no_results = this.container.find('li.no-results').first();
      if (this.is_multiple) {
        this.search_choices = this.container.find('ul.chosen-choices').first();
        this.search_container = this.container.find('li.search-field').first();
      } else {
        this.search_container = this.container.find('div.chosen-search').first();
        this.selected_item = this.container.find('.chosen-single').first();
      }
      this.results_build();
      this.set_tab_index();
      return this.set_label_behavior();
    };

    Chosen.prototype.on_ready = function() {
      return this.form_field_jq.trigger("chosen:ready", {
        chosen: this
      });
    };

    Chosen.prototype.register_observers = function() {
      var _this = this;
      this.container.bind('touchstart.chosen', function(evt) {
        _this.container_mousedown(evt);
        return evt.preventDefault();
      });
      this.container.bind('touchend.chosen', function(evt) {
        _this.container_mouseup(evt);
        return evt.preventDefault();
      });
      this.container.bind('mousedown.chosen', function(evt) {
        _this.container_mousedown(evt);
      });
      this.container.bind('mouseup.chosen', function(evt) {
        _this.container_mouseup(evt);
      });
      this.container.bind('mouseenter.chosen', function(evt) {
        _this.mouse_enter(evt);
      });
      this.container.bind('mouseleave.chosen', function(evt) {
        _this.mouse_leave(evt);
      });
      this.search_results.bind('mouseup.chosen', function(evt) {
        _this.search_results_mouseup(evt);
      });
      this.search_results.bind('mouseover.chosen', function(evt) {
        _this.search_results_mouseover(evt);
      });
      this.search_results.bind('mouseout.chosen', function(evt) {
        _this.search_results_mouseout(evt);
      });
      this.search_results.bind('mousewheel.chosen DOMMouseScroll.chosen', function(evt) {
        _this.search_results_mousewheel(evt);
      });
      this.search_results.bind('touchstart.chosen', function(evt) {
        _this.search_results_touchstart(evt);
      });
      this.search_results.bind('touchmove.chosen', function(evt) {
        _this.search_results_touchmove(evt);
      });
      this.search_results.bind('touchend.chosen', function(evt) {
        _this.search_results_touchend(evt);
      });
      this.form_field_jq.bind("chosen:updated.chosen", function(evt) {
        _this.results_update_field(evt);
      });
      this.form_field_jq.bind("chosen:activate.chosen", function(evt) {
        _this.activate_field(evt);
      });
      this.form_field_jq.bind("chosen:open.chosen", function(evt) {
        _this.container_mousedown(evt);
      });
      this.form_field_jq.bind("chosen:close.chosen", function(evt) {
        _this.input_blur(evt);
      });
      this.search_field.bind('blur.chosen', function(evt) {
        _this.input_blur(evt);
      });
      this.search_field.bind('keyup.chosen', function(evt) {
        _this.keyup_checker(evt);
      });
      this.search_field.bind('keydown.chosen', function(evt) {
        _this.keydown_checker(evt);
      });
      this.search_field.bind('focus.chosen', function(evt) {
        _this.input_focus(evt);
      });
      this.search_field.bind('cut.chosen', function(evt) {
        _this.clipboard_event_checker(evt);
      });
      this.search_field.bind('paste.chosen', function(evt) {
        _this.clipboard_event_checker(evt);
      });
      if (this.is_multiple) {
        return this.search_choices.bind('click.chosen', function(evt) {
          _this.choices_click(evt);
        });
      } else {
        return this.container.bind('click.chosen', function(evt) {
          evt.preventDefault();
        });
      }
    };

    Chosen.prototype.destroy = function() {
      $(this.container[0].ownerDocument).unbind("click.chosen", this.click_test_action);
      if (this.search_field[0].tabIndex) {
        this.form_field_jq[0].tabIndex = this.search_field[0].tabIndex;
      }
      this.container.remove();
      this.form_field_jq.removeData('chosen');
      return this.form_field_jq.show();
    };

    Chosen.prototype.search_field_disabled = function() {
      this.is_disabled = this.form_field_jq[0].disabled;
      if (this.is_disabled) {
        this.container.addClass('chosen-disabled');
        this.search_field[0].disabled = true;
        if (!this.is_multiple) {
          this.selected_item.unbind("focus.chosen", this.activate_action);
        }
        return this.close_field();
      } else {
        this.container.removeClass('chosen-disabled');
        this.search_field[0].disabled = false;
        if (!this.is_multiple) {
          return this.selected_item.bind("focus.chosen", this.activate_action);
        }
      }
    };

    Chosen.prototype.container_mousedown = function(evt) {
      if (!this.is_disabled) {
        if (evt && evt.type === "mousedown" && !this.results_showing) {
          evt.preventDefault();
        }
        if (!((evt != null) && ($(evt.target)).hasClass("search-choice-close"))) {
          if (!this.active_field) {
            if (this.is_multiple) {
              this.search_field.val("");
            }
            $(this.container[0].ownerDocument).bind('click.chosen', this.click_test_action);
            this.results_show();
          } else if (!this.is_multiple && evt && (($(evt.target)[0] === this.selected_item[0]) || $(evt.target).parents("a.chosen-single").length)) {
            evt.preventDefault();
            this.results_toggle();
          }
          return this.activate_field();
        }
      }
    };

    Chosen.prototype.container_mouseup = function(evt) {
      if (evt.target.nodeName === "ABBR" && !this.is_disabled) {
        return this.results_reset(evt);
      }
    };

    Chosen.prototype.search_results_mousewheel = function(evt) {
      var delta;
      if (evt.originalEvent) {
        delta = evt.originalEvent.deltaY || -evt.originalEvent.wheelDelta || evt.originalEvent.detail;
      }
      if (delta != null) {
        evt.preventDefault();
        if (evt.type === 'DOMMouseScroll') {
          delta = delta * 40;
        }
        return this.search_results.scrollTop(delta + this.search_results.scrollTop());
      }
    };

    Chosen.prototype.blur_test = function(evt) {
      if (!this.active_field && this.container.hasClass("chosen-container-active")) {
        return this.close_field();
      }
    };

    Chosen.prototype.close_field = function() {
      $(this.container[0].ownerDocument).unbind("click.chosen", this.click_test_action);
      this.active_field = false;
      this.results_hide();
      this.container.removeClass("chosen-container-active");
      this.clear_backstroke();
      this.show_search_field_default();
      return this.search_field_scale();
    };

    Chosen.prototype.activate_field = function() {
      this.container.addClass("chosen-container-active");
      this.active_field = true;
      this.search_field.val(this.search_field.val());
      return this.search_field.focus();
    };

    Chosen.prototype.test_active_click = function(evt) {
      var active_container;
      active_container = $(evt.target).closest('.chosen-container');
      if (active_container.length && this.container[0] === active_container[0]) {
        return this.active_field = true;
      } else {
        return this.close_field();
      }
    };

    Chosen.prototype.results_build = function() {
      this.parsing = true;
      this.selected_option_count = null;
      this.results_data = SelectParser.select_to_array(this.form_field);
      if (this.is_multiple) {
        this.search_choices.find("li.search-choice").remove();
      } else if (!this.is_multiple) {
        this.single_set_selected_text();
        if (this.disable_search || this.form_field.options.length <= this.disable_search_threshold) {
          this.search_field[0].readOnly = true;
          this.container.addClass("chosen-container-single-nosearch");
        } else {
          this.search_field[0].readOnly = false;
          this.container.removeClass("chosen-container-single-nosearch");
        }
      }
      this.update_results_content(this.results_option_build({
        first: true
      }));
      this.search_field_disabled();
      this.show_search_field_default();
      this.search_field_scale();
      return this.parsing = false;
    };

    Chosen.prototype.result_do_highlight = function(el) {
      var high_bottom, high_top, maxHeight, visible_bottom, visible_top;
      if (el.length) {
        this.result_clear_highlight();
        this.result_highlight = el;
        this.result_highlight.addClass("highlighted");
        maxHeight = parseInt(this.search_results.css("maxHeight"), 10);
        visible_top = this.search_results.scrollTop();
        visible_bottom = maxHeight + visible_top;
        high_top = this.result_highlight.position().top + this.search_results.scrollTop();
        high_bottom = high_top + this.result_highlight.outerHeight();
        if (high_bottom >= visible_bottom) {
          return this.search_results.scrollTop((high_bottom - maxHeight) > 0 ? high_bottom - maxHeight : 0);
        } else if (high_top < visible_top) {
          return this.search_results.scrollTop(high_top);
        }
      }
    };

    Chosen.prototype.result_clear_highlight = function() {
      if (this.result_highlight) {
        this.result_highlight.removeClass("highlighted");
      }
      return this.result_highlight = null;
    };

    Chosen.prototype.results_show = function() {
      if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
        this.form_field_jq.trigger("chosen:maxselected", {
          chosen: this
        });
        return false;
      }
      this.container.addClass("chosen-with-drop");
      this.results_showing = true;
      this.search_field.focus();
      this.search_field.val(this.search_field.val());
      this.winnow_results();
      return this.form_field_jq.trigger("chosen:showing_dropdown", {
        chosen: this
      });
    };

    Chosen.prototype.update_results_content = function(content) {
      return this.search_results.html(content);
    };

    Chosen.prototype.results_hide = function() {
      if (this.results_showing) {
        this.result_clear_highlight();
        this.container.removeClass("chosen-with-drop");
        this.form_field_jq.trigger("chosen:hiding_dropdown", {
          chosen: this
        });
      }
      return this.results_showing = false;
    };

    Chosen.prototype.set_tab_index = function(el) {
      var ti;
      if (this.form_field.tabIndex) {
        ti = this.form_field.tabIndex;
        this.form_field.tabIndex = -1;
        return this.search_field[0].tabIndex = ti;
      }
    };

    Chosen.prototype.set_label_behavior = function() {
      var _this = this;
      this.form_field_label = this.form_field_jq.parents("label");
      if (!this.form_field_label.length && this.form_field.id.length) {
        this.form_field_label = $("label[for='" + this.form_field.id + "']");
      }
      if (this.form_field_label.length > 0) {
        return this.form_field_label.bind('click.chosen', function(evt) {
          if (_this.is_multiple) {
            return _this.container_mousedown(evt);
          } else {
            return _this.activate_field();
          }
        });
      }
    };

    Chosen.prototype.show_search_field_default = function() {
      if (this.is_multiple && this.choices_count() < 1 && !this.active_field) {
        this.search_field.val(this.default_text);
        return this.search_field.addClass("default");
      } else {
        this.search_field.val("");
        return this.search_field.removeClass("default");
      }
    };

    Chosen.prototype.search_results_mouseup = function(evt) {
      var target;
      target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
      if (target.length) {
        this.result_highlight = target;
        this.result_select(evt);
        return this.search_field.focus();
      }
    };

    Chosen.prototype.search_results_mouseover = function(evt) {
      var target;
      target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
      if (target) {
        return this.result_do_highlight(target);
      }
    };

    Chosen.prototype.search_results_mouseout = function(evt) {
      if ($(evt.target).hasClass("active-result" || $(evt.target).parents('.active-result').first())) {
        return this.result_clear_highlight();
      }
    };

    Chosen.prototype.choice_build = function(item) {
      var choice, close_link,
        _this = this;
      choice = $('<li />', {
        "class": "search-choice"
      }).html("<span>" + (this.choice_label(item)) + "</span>");
      if (item.disabled) {
        choice.addClass('search-choice-disabled');
      } else {
        close_link = $('<a />', {
          "class": 'search-choice-close',
          'data-option-array-index': item.array_index
        });
        close_link.bind('click.chosen', function(evt) {
          return _this.choice_destroy_link_click(evt);
        });
        choice.append(close_link);
      }
      return this.search_container.before(choice);
    };

    Chosen.prototype.choice_destroy_link_click = function(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      if (!this.is_disabled) {
        return this.choice_destroy($(evt.target));
      }
    };

    Chosen.prototype.choice_destroy = function(link) {
      if (this.result_deselect(link[0].getAttribute("data-option-array-index"))) {
        this.show_search_field_default();
        if (this.is_multiple && this.choices_count() > 0 && this.search_field.val().length < 1) {
          this.results_hide();
        }
        link.parents('li').first().remove();
        return this.search_field_scale();
      }
    };

    Chosen.prototype.results_reset = function() {
      this.reset_single_select_options();
      this.form_field.options[0].selected = true;
      this.single_set_selected_text();
      this.show_search_field_default();
      this.results_reset_cleanup();
      this.form_field_jq.trigger("change");
      if (this.active_field) {
        return this.results_hide();
      }
    };

    Chosen.prototype.results_reset_cleanup = function() {
      this.current_selectedIndex = this.form_field.selectedIndex;
      return this.selected_item.find("abbr").remove();
    };

    Chosen.prototype.result_select = function(evt) {
      var high, item;
      if (this.result_highlight) {
        high = this.result_highlight;
        this.result_clear_highlight();
        if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
          this.form_field_jq.trigger("chosen:maxselected", {
            chosen: this
          });
          return false;
        }
        if (this.is_multiple) {
          high.removeClass("active-result");
        } else {
          this.reset_single_select_options();
        }
        high.addClass("result-selected");
        item = this.results_data[high[0].getAttribute("data-option-array-index")];
        item.selected = true;
        this.form_field.options[item.options_index].selected = true;
        this.selected_option_count = null;
        if (this.is_multiple) {
          this.choice_build(item);
        } else {
          this.single_set_selected_text(this.choice_label(item));
        }
        if (!((evt.metaKey || evt.ctrlKey) && this.is_multiple)) {
          this.results_hide();
        }
        this.search_field.val("");
        if (this.is_multiple || this.form_field.selectedIndex !== this.current_selectedIndex) {
          this.form_field_jq.trigger("change", {
            'selected': this.form_field.options[item.options_index].value
          });
        }
        this.current_selectedIndex = this.form_field.selectedIndex;
        evt.preventDefault();
        return this.search_field_scale();
      }
    };

    Chosen.prototype.single_set_selected_text = function(text) {
      if (text == null) {
        text = this.default_text;
      }
      if (text === this.default_text) {
        this.selected_item.addClass("chosen-default");
      } else {
        this.single_deselect_control_build();
        this.selected_item.removeClass("chosen-default");
      }
      return this.selected_item.find("span").html(text);
    };

    Chosen.prototype.result_deselect = function(pos) {
      var result_data;
      result_data = this.results_data[pos];
      if (!this.form_field.options[result_data.options_index].disabled) {
        result_data.selected = false;
        this.form_field.options[result_data.options_index].selected = false;
        this.selected_option_count = null;
        this.result_clear_highlight();
        if (this.results_showing) {
          this.winnow_results();
        }
        this.form_field_jq.trigger("change", {
          deselected: this.form_field.options[result_data.options_index].value
        });
        this.search_field_scale();
        return true;
      } else {
        return false;
      }
    };

    Chosen.prototype.single_deselect_control_build = function() {
      if (!this.allow_single_deselect) {
        return;
      }
      if (!this.selected_item.find("abbr").length) {
        this.selected_item.find("span").first().after("<abbr class=\"search-choice-close\"></abbr>");
      }
      return this.selected_item.addClass("chosen-single-with-deselect");
    };

    Chosen.prototype.get_search_text = function() {
      return $('<div/>').text($.trim(this.search_field.val())).html();
    };

    Chosen.prototype.winnow_results_set_highlight = function() {
      var do_high, selected_results;
      selected_results = !this.is_multiple ? this.search_results.find(".result-selected.active-result") : [];
      do_high = selected_results.length ? selected_results.first() : this.search_results.find(".active-result").first();
      if (do_high != null) {
        return this.result_do_highlight(do_high);
      }
    };

    Chosen.prototype.no_results = function(terms) {
      var no_results_html;
      no_results_html = $('<li class="no-results">' + this.results_none_found + ' "<span></span>"</li>');
      no_results_html.find("span").first().html(terms);
      this.search_results.append(no_results_html);
      return this.form_field_jq.trigger("chosen:no_results", {
        chosen: this
      });
    };

    Chosen.prototype.no_results_clear = function() {
      return this.search_results.find(".no-results").remove();
    };

    Chosen.prototype.keydown_arrow = function() {
      var next_sib;
      if (this.results_showing && this.result_highlight) {
        next_sib = this.result_highlight.nextAll("li.active-result").first();
        if (next_sib) {
          return this.result_do_highlight(next_sib);
        }
      } else {
        return this.results_show();
      }
    };

    Chosen.prototype.keyup_arrow = function() {
      var prev_sibs;
      if (!this.results_showing && !this.is_multiple) {
        return this.results_show();
      } else if (this.result_highlight) {
        prev_sibs = this.result_highlight.prevAll("li.active-result");
        if (prev_sibs.length) {
          return this.result_do_highlight(prev_sibs.first());
        } else {
          if (this.choices_count() > 0) {
            this.results_hide();
          }
          return this.result_clear_highlight();
        }
      }
    };

    Chosen.prototype.keydown_backstroke = function() {
      var next_available_destroy;
      if (this.pending_backstroke) {
        this.choice_destroy(this.pending_backstroke.find("a").first());
        return this.clear_backstroke();
      } else {
        next_available_destroy = this.search_container.siblings("li.search-choice").last();
        if (next_available_destroy.length && !next_available_destroy.hasClass("search-choice-disabled")) {
          this.pending_backstroke = next_available_destroy;
          if (this.single_backstroke_delete) {
            return this.keydown_backstroke();
          } else {
            return this.pending_backstroke.addClass("search-choice-focus");
          }
        }
      }
    };

    Chosen.prototype.clear_backstroke = function() {
      if (this.pending_backstroke) {
        this.pending_backstroke.removeClass("search-choice-focus");
      }
      return this.pending_backstroke = null;
    };

    Chosen.prototype.keydown_checker = function(evt) {
      var stroke, _ref1;
      stroke = (_ref1 = evt.which) != null ? _ref1 : evt.keyCode;
      this.search_field_scale();
      if (stroke !== 8 && this.pending_backstroke) {
        this.clear_backstroke();
      }
      switch (stroke) {
        case 8:
          this.backstroke_length = this.search_field.val().length;
          break;
        case 9:
          if (this.results_showing && !this.is_multiple) {
            this.result_select(evt);
          }
          this.mouse_on_container = false;
          break;
        case 13:
          if (this.results_showing) {
            evt.preventDefault();
          }
          break;
        case 32:
          if (this.disable_search) {
            evt.preventDefault();
          }
          break;
        case 38:
          evt.preventDefault();
          this.keyup_arrow();
          break;
        case 40:
          evt.preventDefault();
          this.keydown_arrow();
          break;
      }
    };

    Chosen.prototype.search_field_scale = function() {
      var div, f_width, h, style, style_block, styles, w, _i, _len;
      if (this.is_multiple) {
        h = 0;
        w = 0;
        style_block = "position:absolute; left: -1000px; top: -1000px; display:none;";
        styles = ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height', 'text-transform', 'letter-spacing'];
        for (_i = 0, _len = styles.length; _i < _len; _i++) {
          style = styles[_i];
          style_block += style + ":" + this.search_field.css(style) + ";";
        }
        div = $('<div />', {
          'style': style_block
        });
        div.text(this.search_field.val());
        $('body').append(div);
        w = div.width() + 25;
        div.remove();
        f_width = this.container.outerWidth();
        if (w > f_width - 10) {
          w = f_width - 10;
        }
        return this.search_field.css({
          'width': w + 'px'
        });
      }
    };

    return Chosen;

  })(AbstractChosen);

}).call(this);
;/**
 * jquery.mask.js
 * @version: v1.13.4
 * @author: Igor Escobar
 *
 * Created by Igor Escobar on 2012-03-10. Please report any bug at http://blog.igorescobar.com
 *
 * Copyright (c) 2012 Igor Escobar http://blog.igorescobar.com
 *
 * The MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/* jshint laxbreak: true */
/* global define, jQuery, Zepto */

'use strict';

// UMD (Universal Module Definition) patterns for JavaScript modules that work everywhere.
// https://github.com/umdjs/umd/blob/master/jqueryPluginCommonjs.js
(function (factory) {

    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery || Zepto);
    }

}(function ($) {

    var Mask = function (el, mask, options) {
        el = $(el);

        var jMask = this, oldValue = el.val(), regexMask;

        mask = typeof mask === 'function' ? mask(el.val(), undefined, el,  options) : mask;

        var p = {
            invalid: [],
            getCaret: function () {
                try {
                    var sel,
                        pos = 0,
                        ctrl = el.get(0),
                        dSel = document.selection,
                        cSelStart = ctrl.selectionStart;

                    // IE Support
                    if (dSel && navigator.appVersion.indexOf('MSIE 10') === -1) {
                        sel = dSel.createRange();
                        sel.moveStart('character', el.is('input') ? -el.val().length : -el.text().length);
                        pos = sel.text.length;
                    }
                    // Firefox support
                    else if (cSelStart || cSelStart === '0') {
                        pos = cSelStart;
                    }

                    return pos;
                } catch (e) {}
            },
            setCaret: function(pos) {
                try {
                    if (el.is(':focus')) {
                        var range, ctrl = el.get(0);

                        if (ctrl.setSelectionRange) {
                            ctrl.setSelectionRange(pos,pos);
                        } else if (ctrl.createTextRange) {
                            range = ctrl.createTextRange();
                            range.collapse(true);
                            range.moveEnd('character', pos);
                            range.moveStart('character', pos);
                            range.select();
                        }
                    }
                } catch (e) {}
            },
            events: function() {
                el
                .on('input.mask keyup.mask', p.behaviour)
                .on('paste.mask drop.mask', function() {
                    setTimeout(function() {
                        el.keydown().keyup();
                    }, 100);
                })
                .on('change.mask', function(){
                    el.data('changed', true);
                })
                .on('blur.mask', function(){
                    if (oldValue !== el.val() && !el.data('changed')) {
                        el.triggerHandler('change');
                    }
                    el.data('changed', false);
                })
                // it's very important that this callback remains in this position
                // otherwhise oldValue it's going to work buggy
                .on('blur.mask', function() {
                    oldValue = el.val();
                })
                // select all text on focus
                .on('focus.mask', function (e) {
                    if (options.selectOnFocus === true) {
                        $(e.target).select();
                    }
                })
                // clear the value if it not complete the mask
                .on('focusout.mask', function() {
                    if (options.clearIfNotMatch && !regexMask.test(p.val())) {
                       p.val('');
                   }
                });
            },
            getRegexMask: function() {
                var maskChunks = [], translation, pattern, optional, recursive, oRecursive, r;

                for (var i = 0; i < mask.length; i++) {
                    translation = jMask.translation[mask.charAt(i)];

                    if (translation) {

                        pattern = translation.pattern.toString().replace(/.{1}$|^.{1}/g, '');
                        optional = translation.optional;
                        recursive = translation.recursive;

                        if (recursive) {
                            maskChunks.push(mask.charAt(i));
                            oRecursive = {digit: mask.charAt(i), pattern: pattern};
                        } else {
                            maskChunks.push(!optional && !recursive ? pattern : (pattern + '?'));
                        }

                    } else {
                        maskChunks.push(mask.charAt(i).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
                    }
                }

                r = maskChunks.join('');

                if (oRecursive) {
                    r = r.replace(new RegExp('(' + oRecursive.digit + '(.*' + oRecursive.digit + ')?)'), '($1)?')
                         .replace(new RegExp(oRecursive.digit, 'g'), oRecursive.pattern);
                }

                return new RegExp(r);
            },
            destroyEvents: function() {
                el.off(['input', 'keydown', 'keyup', 'paste', 'drop', 'blur', 'focusout', ''].join('.mask '));
            },
            val: function(v) {
                var isInput = el.is('input'),
                    method = isInput ? 'val' : 'text',
                    r;

                if (arguments.length > 0) {
                    if (el[method]() !== v) {
                        el[method](v);
                    }
                    r = el;
                } else {
                    r = el[method]();
                }

                return r;
            },
            getMCharsBeforeCount: function(index, onCleanVal) {
                for (var count = 0, i = 0, maskL = mask.length; i < maskL && i < index; i++) {
                    if (!jMask.translation[mask.charAt(i)]) {
                        index = onCleanVal ? index + 1 : index;
                        count++;
                    }
                }
                return count;
            },
            caretPos: function (originalCaretPos, oldLength, newLength, maskDif) {
                var translation = jMask.translation[mask.charAt(Math.min(originalCaretPos - 1, mask.length - 1))];

                return !translation ? p.caretPos(originalCaretPos + 1, oldLength, newLength, maskDif)
                                    : Math.min(originalCaretPos + newLength - oldLength - maskDif, newLength);
            },
            behaviour: function(e) {
                e = e || window.event;
                p.invalid = [];
                var keyCode = e.keyCode || e.which;
                if ($.inArray(keyCode, jMask.byPassKeys) === -1) {

                    var caretPos = p.getCaret(),
                        currVal = p.val(),
                        currValL = currVal.length,
                        changeCaret = caretPos < currValL,
                        newVal = p.getMasked(),
                        newValL = newVal.length,
                        maskDif = p.getMCharsBeforeCount(newValL - 1) - p.getMCharsBeforeCount(currValL - 1);

                    p.val(newVal);

                    // change caret but avoid CTRL+A
                    if (changeCaret && !(keyCode === 65 && e.ctrlKey)) {
                        // Avoid adjusting caret on backspace or delete
                        if (!(keyCode === 8 || keyCode === 46)) {
                            caretPos = p.caretPos(caretPos, currValL, newValL, maskDif);
                        }
                        p.setCaret(caretPos);
                    }

                    return p.callbacks(e);
                }
            },
            getMasked: function(skipMaskChars) {
                var buf = [],
                    value = p.val(),
                    m = 0, maskLen = mask.length,
                    v = 0, valLen = value.length,
                    offset = 1, addMethod = 'push',
                    resetPos = -1,
                    lastMaskChar,
                    check;

                if (options.reverse) {
                    addMethod = 'unshift';
                    offset = -1;
                    lastMaskChar = 0;
                    m = maskLen - 1;
                    v = valLen - 1;
                    check = function () {
                        return m > -1 && v > -1;
                    };
                } else {
                    lastMaskChar = maskLen - 1;
                    check = function () {
                        return m < maskLen && v < valLen;
                    };
                }

                while (check()) {
                    var maskDigit = mask.charAt(m),
                        valDigit = value.charAt(v),
                        translation = jMask.translation[maskDigit];

                    if (translation) {
                        if (valDigit.match(translation.pattern)) {
                            buf[addMethod](valDigit);
                             if (translation.recursive) {
                                if (resetPos === -1) {
                                    resetPos = m;
                                } else if (m === lastMaskChar) {
                                    m = resetPos - offset;
                                }

                                if (lastMaskChar === resetPos) {
                                    m -= offset;
                                }
                            }
                            m += offset;
                        } else if (translation.optional) {
                            m += offset;
                            v -= offset;
                        } else if (translation.fallback) {
                            buf[addMethod](translation.fallback);
                            m += offset;
                            v -= offset;
                        } else {
                          p.invalid.push({p: v, v: valDigit, e: translation.pattern});
                        }
                        v += offset;
                    } else {
                        if (!skipMaskChars) {
                            buf[addMethod](maskDigit);
                        }

                        if (valDigit === maskDigit) {
                            v += offset;
                        }

                        m += offset;
                    }
                }

                var lastMaskCharDigit = mask.charAt(lastMaskChar);
                if (maskLen === valLen + 1 && !jMask.translation[lastMaskCharDigit]) {
                    buf.push(lastMaskCharDigit);
                }

                return buf.join('');
            },
            callbacks: function (e) {
                var val = p.val(),
                    changed = val !== oldValue,
                    defaultArgs = [val, e, el, options],
                    callback = function(name, criteria, args) {
                        if (typeof options[name] === 'function' && criteria) {
                            options[name].apply(this, args);
                        }
                    };

                callback('onChange', changed === true, defaultArgs);
                callback('onKeyPress', changed === true, defaultArgs);
                callback('onComplete', val.length === mask.length, defaultArgs);
                callback('onInvalid', p.invalid.length > 0, [val, e, el, p.invalid, options]);
            }
        };


        // public methods
        jMask.mask = mask;
        jMask.options = options;
        jMask.remove = function() {
            var caret = p.getCaret();
            p.destroyEvents();
            p.val(jMask.getCleanVal());
            p.setCaret(caret - p.getMCharsBeforeCount(caret));
            return el;
        };

        // get value without mask
        jMask.getCleanVal = function() {
           return p.getMasked(true);
        };

       jMask.init = function(onlyMask) {
            onlyMask = onlyMask || false;
            options = options || {};

            jMask.byPassKeys = $.jMaskGlobals.byPassKeys;
            jMask.translation = $.jMaskGlobals.translation;

            jMask.translation = $.extend({}, jMask.translation, options.translation);
            jMask = $.extend(true, {}, jMask, options);

            regexMask = p.getRegexMask();

            if (onlyMask === false) {

                if (options.placeholder) {
                    el.attr('placeholder' , options.placeholder);
                }

                // this is necessary, otherwise if the user submit the form
                // and then press the "back" button, the autocomplete will erase
                // the data. Works fine on IE9+, FF, Opera, Safari.
                if ($('input').length && 'oninput' in $('input')[0] === false && el.attr('autocomplete') === 'on') {
                  el.attr('autocomplete', 'off');
                }

                p.destroyEvents();
                p.events();

                var caret = p.getCaret();
                p.val(p.getMasked());
                p.setCaret(caret + p.getMCharsBeforeCount(caret, true));

            } else {
                p.events();
                p.val(p.getMasked());
            }
        };

        jMask.init(!el.is('input'));
    };

    $.maskWatchers = {};
    var HTMLAttributes = function () {
            var input = $(this),
                options = {},
                prefix = 'data-mask-',
                mask = input.attr('data-mask');

            if (input.attr(prefix + 'reverse')) {
                options.reverse = true;
            }

            if (input.attr(prefix + 'clearifnotmatch')) {
                options.clearIfNotMatch = true;
            }

            if (input.attr(prefix + 'selectonfocus') === 'true') {
               options.selectOnFocus = true;
            }

            if (notSameMaskObject(input, mask, options)) {
                return input.data('mask', new Mask(this, mask, options));
            }
        },
        notSameMaskObject = function(field, mask, options) {
            options = options || {};
            var maskObject = $(field).data('mask'),
                stringify = JSON.stringify,
                value = $(field).val() || $(field).text();
            try {
                if (typeof mask === 'function') {
                    mask = mask(value);
                }
                return typeof maskObject !== 'object' || stringify(maskObject.options) !== stringify(options) || maskObject.mask !== mask;
            } catch (e) {}
        };


    $.fn.mask = function(mask, options) {
        options = options || {};
        var selector = this.selector,
            globals = $.jMaskGlobals,
            interval = $.jMaskGlobals.watchInterval,
            maskFunction = function() {
                if (notSameMaskObject(this, mask, options)) {
                    return $(this).data('mask', new Mask(this, mask, options));
                }
            };

        $(this).each(maskFunction);

        if (selector && selector !== '' && globals.watchInputs) {
            clearInterval($.maskWatchers[selector]);
            $.maskWatchers[selector] = setInterval(function(){
                $(document).find(selector).each(maskFunction);
            }, interval);
        }
        return this;
    };

    $.fn.unmask = function() {
        clearInterval($.maskWatchers[this.selector]);
        delete $.maskWatchers[this.selector];
        return this.each(function() {
            var dataMask = $(this).data('mask');
            if (dataMask) {
                dataMask.remove().removeData('mask');
            }
        });
    };

    $.fn.cleanVal = function() {
        return this.data('mask').getCleanVal();
    };

    $.applyDataMask = function(selector) {
        selector = selector || $.jMaskGlobals.maskElements;
        var $selector = (selector instanceof $) ? selector : $(selector);
        $selector.filter($.jMaskGlobals.dataMaskAttr).each(HTMLAttributes);
    };

    var globals = {
        maskElements: 'input,td,span,div',
        dataMaskAttr: '*[data-mask]',
        dataMask: true,
        watchInterval: 300,
        watchInputs: true,
        watchDataMask: false,
        byPassKeys: [9, 16, 17, 18, 36, 37, 38, 39, 40, 91],
        translation: {
            '0': {pattern: /\d/},
            '9': {pattern: /\d/, optional: true},
            '#': {pattern: /\d/, recursive: true},
            'A': {pattern: /[a-zA-Z0-9]/},
            'S': {pattern: /[a-zA-Z]/}
        }
    };

    $.jMaskGlobals = $.jMaskGlobals || {};
    globals = $.jMaskGlobals = $.extend(true, {}, globals, $.jMaskGlobals);

    // looking for inputs with data-mask attribute
    if (globals.dataMask) { $.applyDataMask(); }

    setInterval(function(){
        if ($.jMaskGlobals.watchDataMask) { $.applyDataMask(); }
    }, globals.watchInterval);
}));;;(function($, window) {

	var HTML = '<div class="[type] render-message"><p><strong>[message]</strong></p></div>';

	function compile(type, message) {
		return HTML.replace( /\[type\]/, type ).replace( /\[message\]/, message );
	};

	$.fn.messageShowAfter = function(type, message, isRemove) {
		( isRemove && this.messageHideAfter() );
		this.after( compile( type, message ) );
	};

	$.fn.messageShowBefore = function(type, message, isRemove) {
		( isRemove && this.messageHideBefore() );
		this.before( compile( type, message ) );
	};

	$.fn.messageHideBefore = function() {
		this.prev( '.render-message' ).remove();
	};

	$.fn.messageHideAfter = function() {
		this.next( '.render-message' ).remove();
	};

})( jQuery, window );
;;(function($, window) {
	
	var HTML = '<span class="spinner is-active" style="display: block;"></span>';

	$.fn.spinnerShow = function(insertion) {
		this[insertion].call( this, HTML );
	};

	$.fn.spinnerHide = function() {
		this.siblings( '.spinner' )
		    	.remove()
		    .end()	
		    .find( '.spinner' )
		    	.remove()
		;
	};

})( jQuery, window );;;(function($, window) {

	var Tabs = function(container, attrs) {
		this.container            = container;
		this.header               = this.container.find( '.contextual-tabs-header' );
		this.content              = this.container.find( '.contextual-tabs-content' );
		this._currentActiveHeader = null;
		this.afterShowCallback    = null;
		this.defaultIndex         = 1;
		this.assign( attrs );
	};

	Tabs.prototype.init = function() {
		this.showDefaultIndex();
		this.addEventListener();
	};

	Tabs.prototype.addEventListener = function() {
		this.header
			.on( 'click', '[data-action="change"]', this._onClickChangeTabs.bind( this ) )
		;
	};

	Tabs.prototype.showDefaultIndex = function() {
		var target = this.header.find( '[href=#' + this.defaultIndex + ']' );
		var active = target.parent();

		this.setCurrentAll( this.defaultIndex, active );
		this.content.fadeIn( 200 );
	};

	Tabs.prototype._onClickChangeTabs = function(event) {
		var target = $( event.currentTarget );
		var index  = target.attr( 'href' ).replace( '#', '' );
		var active = target.parent();

		this.setCurrentAll( index, active );
	};

	Tabs.prototype.setCurrentAll = function(index, active) {
		this.removeCurrentActiveHeader( active );
		this.show( index );

		//callback active tab
		( this.afterShowCallback || $.noop ).call( null, index, active );

		active.addClass( 'active' );
	};

	Tabs.prototype.removeCurrentActiveHeader = function(current) {
		if ( this._currentActiveHeader ) {
			this._currentActiveHeader.removeClass('active');
		}

		this._currentActiveHeader = current;
	};

	Tabs.prototype.show = function(index) {
		this.content
			.find( '.tab-item' )
				.addClass( 'hide' )
				.filter( '[data-index="' + index + '"]' )
				.removeClass( 'hide' )
		;
	};

	Tabs.prototype.assign = function(attrs) {
		for ( var item in attrs ) {
			if ( !this.hasOwnProperty(item) || this[item] != attrs[item] ) {
				this[item] = attrs[item];
			}
		}
	};

	$.fn.apikiTabs = function(options) {
		var tabs = new Tabs( this, options );
		tabs.init();
	};

})( jQuery, window );
;/*
 * jQuery timepicker addon
 * By: Trent Richardson [http://trentrichardson.com]
 * Version 1.1.2
 * Last Modified: 01/19/2013
 *
 * Copyright 2012 Trent Richardson
 * You may use this project under MIT or GPL licenses.
 * http://trentrichardson.com/Impromptu/GPL-LICENSE.txt
 * http://trentrichardson.com/Impromptu/MIT-LICENSE.txt
 */

/*jslint evil: true, white: false, undef: false, nomen: false */

(function($) {

	/*
	* Lets not redefine timepicker, Prevent "Uncaught RangeError: Maximum call stack size exceeded"
	*/
	$.ui.timepicker = $.ui.timepicker || {};
	if ($.ui.timepicker.version) {
		return;
	}

	/*
	* Extend jQueryUI, get it started with our version number
	*/
	$.extend($.ui, {
		timepicker: {
			version: "1.1.2"
		}
	});

	/*
	* Timepicker manager.
	* Use the singleton instance of this class, $.timepicker, to interact with the time picker.
	* Settings for (groups of) time pickers are maintained in an instance object,
	* allowing multiple different settings on the same page.
	*/
	function Timepicker() {
		this.regional = []; // Available regional settings, indexed by language code
		this.regional[''] = { // Default regional settings
			currentText: 'Now',
			closeText: 'Done',
			amNames: ['AM', 'A'],
			pmNames: ['PM', 'P'],
			timeFormat: 'HH:mm',
			timeSuffix: '',
			timeOnlyTitle: 'Choose Time',
			timeText: 'Time',
			hourText: 'Hour',
			minuteText: 'Minute',
			secondText: 'Second',
			millisecText: 'Millisecond',
			timezoneText: 'Time Zone',
			isRTL: false
		};
		this._defaults = { // Global defaults for all the datetime picker instances
			showButtonPanel: true,
			timeOnly: false,
			showHour: true,
			showMinute: true,
			showSecond: false,
			showMillisec: false,
			showTimezone: false,
			showTime: true,
			stepHour: 1,
			stepMinute: 1,
			stepSecond: 1,
			stepMillisec: 1,
			hour: 0,
			minute: 0,
			second: 0,
			millisec: 0,
			timezone: null,
			useLocalTimezone: false,
			defaultTimezone: "+0000",
			hourMin: 0,
			minuteMin: 0,
			secondMin: 0,
			millisecMin: 0,
			hourMax: 23,
			minuteMax: 59,
			secondMax: 59,
			millisecMax: 999,
			minDateTime: null,
			maxDateTime: null,
			onSelect: null,
			hourGrid: 0,
			minuteGrid: 0,
			secondGrid: 0,
			millisecGrid: 0,
			alwaysSetTime: true,
			separator: ' ',
			altFieldTimeOnly: true,
			altTimeFormat: null,
			altSeparator: null,
			altTimeSuffix: null,
			pickerTimeFormat: null,
			pickerTimeSuffix: null,
			showTimepicker: true,
			timezoneIso8601: false,
			timezoneList: null,
			addSliderAccess: false,
			sliderAccessArgs: null,
			controlType: 'slider',
			defaultValue: null,
			parse: 'strict'
		};
		$.extend(this._defaults, this.regional['']);
	}

	$.extend(Timepicker.prototype, {
		$input: null,
		$altInput: null,
		$timeObj: null,
		inst: null,
		hour_slider: null,
		minute_slider: null,
		second_slider: null,
		millisec_slider: null,
		timezone_select: null,
		hour: 0,
		minute: 0,
		second: 0,
		millisec: 0,
		timezone: null,
		defaultTimezone: "+0000",
		hourMinOriginal: null,
		minuteMinOriginal: null,
		secondMinOriginal: null,
		millisecMinOriginal: null,
		hourMaxOriginal: null,
		minuteMaxOriginal: null,
		secondMaxOriginal: null,
		millisecMaxOriginal: null,
		ampm: '',
		formattedDate: '',
		formattedTime: '',
		formattedDateTime: '',
		timezoneList: null,
		units: ['hour','minute','second','millisec'],
		control: null,

		/*
		* Override the default settings for all instances of the time picker.
		* @param  settings  object - the new settings to use as defaults (anonymous object)
		* @return the manager object
		*/
		setDefaults: function(settings) {
			extendRemove(this._defaults, settings || {});
			return this;
		},

		/*
		* Create a new Timepicker instance
		*/
		_newInst: function($input, o) {
			var tp_inst = new Timepicker(),
				inlineSettings = {},
                fns = {},
		        overrides, i;

			for (var attrName in this._defaults) {
				if(this._defaults.hasOwnProperty(attrName)){
					var attrValue = $input.attr('time:' + attrName);
					if (attrValue) {
						try {
							inlineSettings[attrName] = eval(attrValue);
						} catch (err) {
							inlineSettings[attrName] = attrValue;
						}
					}
				}
			}
		    overrides = {
		        beforeShow: function (input, dp_inst) {
		            if ($.isFunction(tp_inst._defaults.evnts.beforeShow)) {
		                return tp_inst._defaults.evnts.beforeShow.call($input[0], input, dp_inst, tp_inst);
		            }
		        },
		        onChangeMonthYear: function (year, month, dp_inst) {
		            // Update the time as well : this prevents the time from disappearing from the $input field.
		            tp_inst._updateDateTime(dp_inst);
		            if ($.isFunction(tp_inst._defaults.evnts.onChangeMonthYear)) {
		                tp_inst._defaults.evnts.onChangeMonthYear.call($input[0], year, month, dp_inst, tp_inst);
		            }
		        },
		        onClose: function (dateText, dp_inst) {
		            if (tp_inst.timeDefined === true && $input.val() !== '') {
		                tp_inst._updateDateTime(dp_inst);
		            }
		            if ($.isFunction(tp_inst._defaults.evnts.onClose)) {
		                tp_inst._defaults.evnts.onClose.call($input[0], dateText, dp_inst, tp_inst);
		            }
		        }
		    };
		    for (i in overrides) {
		        if (overrides.hasOwnProperty(i)) {
		            fns[i] = o[i] || null;
		        }
		    }
		    tp_inst._defaults = $.extend({}, this._defaults, inlineSettings, o, overrides, {
		        evnts:fns,
		        timepicker: tp_inst // add timepicker as a property of datepicker: $.datepicker._get(dp_inst, 'timepicker');
		    });
			tp_inst.amNames = $.map(tp_inst._defaults.amNames, function(val) {
				return val.toUpperCase();
			});
			tp_inst.pmNames = $.map(tp_inst._defaults.pmNames, function(val) {
				return val.toUpperCase();
			});

			// controlType is string - key to our this._controls
			if(typeof(tp_inst._defaults.controlType) === 'string'){
				if($.fn[tp_inst._defaults.controlType] === undefined){
					tp_inst._defaults.controlType = 'select';
				}
				tp_inst.control = tp_inst._controls[tp_inst._defaults.controlType];
			}
			// controlType is an object and must implement create, options, value methods
			else{
				tp_inst.control = tp_inst._defaults.controlType;
			}

			if (tp_inst._defaults.timezoneList === null) {
				var timezoneList = ['-1200', '-1100', '-1000', '-0930', '-0900', '-0800', '-0700', '-0600', '-0500', '-0430', '-0400', '-0330', '-0300', '-0200', '-0100', '+0000',
									'+0100', '+0200', '+0300', '+0330', '+0400', '+0430', '+0500', '+0530', '+0545', '+0600', '+0630', '+0700', '+0800', '+0845', '+0900', '+0930',
									'+1000', '+1030', '+1100', '+1130', '+1200', '+1245', '+1300', '+1400'];

				if (tp_inst._defaults.timezoneIso8601) {
					timezoneList = $.map(timezoneList, function(val) {
						return val == '+0000' ? 'Z' : (val.substring(0, 3) + ':' + val.substring(3));
					});
				}
				tp_inst._defaults.timezoneList = timezoneList;
			}

			tp_inst.timezone = tp_inst._defaults.timezone;
			tp_inst.hour = tp_inst._defaults.hour < tp_inst._defaults.hourMin? tp_inst._defaults.hourMin :
							tp_inst._defaults.hour > tp_inst._defaults.hourMax? tp_inst._defaults.hourMax : tp_inst._defaults.hour;
			tp_inst.minute = tp_inst._defaults.minute < tp_inst._defaults.minuteMin? tp_inst._defaults.minuteMin :
							tp_inst._defaults.minute > tp_inst._defaults.minuteMax? tp_inst._defaults.minuteMax : tp_inst._defaults.minute;
			tp_inst.second = tp_inst._defaults.second < tp_inst._defaults.secondMin? tp_inst._defaults.secondMin :
							tp_inst._defaults.second > tp_inst._defaults.secondMax? tp_inst._defaults.secondMax : tp_inst._defaults.second;
			tp_inst.millisec = tp_inst._defaults.millisec < tp_inst._defaults.millisecMin? tp_inst._defaults.millisecMin :
							tp_inst._defaults.millisec > tp_inst._defaults.millisecMax? tp_inst._defaults.millisecMax : tp_inst._defaults.millisec;
			tp_inst.ampm = '';
			tp_inst.$input = $input;

			if (o.altField) {
				tp_inst.$altInput = $(o.altField).css({
					cursor: 'pointer'
				}).focus(function() {
					$input.trigger("focus");
				});
			}

			if (tp_inst._defaults.minDate === 0 || tp_inst._defaults.minDateTime === 0) {
				tp_inst._defaults.minDate = new Date();
			}
			if (tp_inst._defaults.maxDate === 0 || tp_inst._defaults.maxDateTime === 0) {
				tp_inst._defaults.maxDate = new Date();
			}

			// datepicker needs minDate/maxDate, timepicker needs minDateTime/maxDateTime..
			if (tp_inst._defaults.minDate !== undefined && tp_inst._defaults.minDate instanceof Date) {
				tp_inst._defaults.minDateTime = new Date(tp_inst._defaults.minDate.getTime());
			}
			if (tp_inst._defaults.minDateTime !== undefined && tp_inst._defaults.minDateTime instanceof Date) {
				tp_inst._defaults.minDate = new Date(tp_inst._defaults.minDateTime.getTime());
			}
			if (tp_inst._defaults.maxDate !== undefined && tp_inst._defaults.maxDate instanceof Date) {
				tp_inst._defaults.maxDateTime = new Date(tp_inst._defaults.maxDate.getTime());
			}
			if (tp_inst._defaults.maxDateTime !== undefined && tp_inst._defaults.maxDateTime instanceof Date) {
				tp_inst._defaults.maxDate = new Date(tp_inst._defaults.maxDateTime.getTime());
			}
			tp_inst.$input.bind('focus', function() {
				tp_inst._onFocus();
			});

			return tp_inst;
		},

		/*
		* add our sliders to the calendar
		*/
		_addTimePicker: function(dp_inst) {
			var currDT = (this.$altInput && this._defaults.altFieldTimeOnly) ? this.$input.val() + ' ' + this.$altInput.val() : this.$input.val();

			this.timeDefined = this._parseTime(currDT);
			this._limitMinMaxDateTime(dp_inst, false);
			this._injectTimePicker();
		},

		/*
		* parse the time string from input value or _setTime
		*/
		_parseTime: function(timeString, withDate) {
			if (!this.inst) {
				this.inst = $.datepicker._getInst(this.$input[0]);
			}

			if (withDate || !this._defaults.timeOnly) {
				var dp_dateFormat = $.datepicker._get(this.inst, 'dateFormat');
				try {
					var parseRes = parseDateTimeInternal(dp_dateFormat, this._defaults.timeFormat, timeString, $.datepicker._getFormatConfig(this.inst), this._defaults);
					if (!parseRes.timeObj) {
						return false;
					}
					$.extend(this, parseRes.timeObj);
				} catch (err) {
					$.datepicker.log("Error parsing the date/time string: " + err +
									"\ndate/time string = " + timeString +
									"\ntimeFormat = " + this._defaults.timeFormat +
									"\ndateFormat = " + dp_dateFormat);
					return false;
				}
				return true;
			} else {
				var timeObj = $.datepicker.parseTime(this._defaults.timeFormat, timeString, this._defaults);
				if (!timeObj) {
					return false;
				}
				$.extend(this, timeObj);
				return true;
			}
		},

		/*
		* generate and inject html for timepicker into ui datepicker
		*/
		_injectTimePicker: function() {
			var $dp = this.inst.dpDiv,
				o = this.inst.settings,
				tp_inst = this,
				litem = '',
				uitem = '',
				max = {},
				gridSize = {},
				size = null;

			// Prevent displaying twice
			if ($dp.find("div.ui-timepicker-div").length === 0 && o.showTimepicker) {
				var noDisplay = ' style="display:none;"',
					html = '<div class="ui-timepicker-div'+ (o.isRTL? ' ui-timepicker-rtl' : '') +'"><dl>' + '<dt class="ui_tpicker_time_label"' + ((o.showTime) ? '' : noDisplay) + '>' + o.timeText + '</dt>' +
								'<dd class="ui_tpicker_time"' + ((o.showTime) ? '' : noDisplay) + '></dd>';

				// Create the markup
				for(var i=0,l=this.units.length; i<l; i++){
					litem = this.units[i];
					uitem = litem.substr(0,1).toUpperCase() + litem.substr(1);
					// Added by Peter Medeiros:
					// - Figure out what the hour/minute/second max should be based on the step values.
					// - Example: if stepMinute is 15, then minMax is 45.
					max[litem] = parseInt((o[litem+'Max'] - ((o[litem+'Max'] - o[litem+'Min']) % o['step'+uitem])), 10);
					gridSize[litem] = 0;

					html += '<dt class="ui_tpicker_'+ litem +'_label"' + ((o['show'+uitem]) ? '' : noDisplay) + '>' + o[litem +'Text'] + '</dt>' +
								'<dd class="ui_tpicker_'+ litem +'"><div class="ui_tpicker_'+ litem +'_slider"' + ((o['show'+uitem]) ? '' : noDisplay) + '></div>';

					if (o['show'+uitem] && o[litem+'Grid'] > 0) {
						html += '<div style="padding-left: 1px"><table class="ui-tpicker-grid-label"><tr>';

						if(litem == 'hour'){
							for (var h = o[litem+'Min']; h <= max[litem]; h += parseInt(o[litem+'Grid'], 10)) {
								gridSize[litem]++;
								var tmph = $.datepicker.formatTime(useAmpm(o.pickerTimeFormat || o.timeFormat)? 'hht':'HH', {hour:h}, o);
								html += '<td data-for="'+litem+'">' + tmph + '</td>';
							}
						}
						else{
							for (var m = o[litem+'Min']; m <= max[litem]; m += parseInt(o[litem+'Grid'], 10)) {
								gridSize[litem]++;
								html += '<td data-for="'+litem+'">' + ((m < 10) ? '0' : '') + m + '</td>';
							}
						}

						html += '</tr></table></div>';
					}
					html += '</dd>';
				}

				// Timezone
				html += '<dt class="ui_tpicker_timezone_label"' + ((o.showTimezone) ? '' : noDisplay) + '>' + o.timezoneText + '</dt>';
				html += '<dd class="ui_tpicker_timezone" ' + ((o.showTimezone) ? '' : noDisplay) + '></dd>';

				// Create the elements from string
				html += '</dl></div>';
				var $tp = $(html);

				// if we only want time picker...
				if (o.timeOnly === true) {
					$tp.prepend('<div class="ui-widget-header ui-helper-clearfix ui-corner-all">' + '<div class="ui-datepicker-title">' + o.timeOnlyTitle + '</div>' + '</div>');
					$dp.find('.ui-datepicker-header, .ui-datepicker-calendar').hide();
				}

				// add sliders, adjust grids, add events
				for(var i=0,l=tp_inst.units.length; i<l; i++){
					litem = tp_inst.units[i];
					uitem = litem.substr(0,1).toUpperCase() + litem.substr(1);

					// add the slider
					tp_inst[litem+'_slider'] = tp_inst.control.create(tp_inst, $tp.find('.ui_tpicker_'+litem+'_slider'), litem, tp_inst[litem], o[litem+'Min'], max[litem], o['step'+uitem]);

					// adjust the grid and add click event
					if (o['show'+uitem] && o[litem+'Grid'] > 0) {
						size = 100 * gridSize[litem] * o[litem+'Grid'] / (max[litem] - o[litem+'Min']);
						$tp.find('.ui_tpicker_'+litem+' table').css({
							width: size + "%",
							marginLeft: o.isRTL? '0' : ((size / (-2 * gridSize[litem])) + "%"),
							marginRight: o.isRTL? ((size / (-2 * gridSize[litem])) + "%") : '0',
							borderCollapse: 'collapse'
						}).find("td").click(function(e){
								var $t = $(this),
									h = $t.html(),
									n = parseInt(h.replace(/[^0-9]/g),10),
									ap = h.replace(/[^apm]/ig),
									f = $t.data('for'); // loses scope, so we use data-for

								if(f == 'hour'){
									if(ap.indexOf('p') !== -1 && n < 12){
										n += 12;
									}
									else{
										if(ap.indexOf('a') !== -1 && n === 12){
											n = 0;
										}
									}
								}

								tp_inst.control.value(tp_inst, tp_inst[f+'_slider'], litem, n);

								tp_inst._onTimeChange();
								tp_inst._onSelectHandler();
							})
						.css({
								cursor: 'pointer',
								width: (100 / gridSize[litem]) + '%',
								textAlign: 'center',
								overflow: 'hidden'
							});
					} // end if grid > 0
				} // end for loop

				// Add timezone options
				this.timezone_select = $tp.find('.ui_tpicker_timezone').append('<select></select>').find("select");
				$.fn.append.apply(this.timezone_select,
				$.map(o.timezoneList, function(val, idx) {
					return $("<option />").val(typeof val == "object" ? val.value : val).text(typeof val == "object" ? val.label : val);
				}));
				if (typeof(this.timezone) != "undefined" && this.timezone !== null && this.timezone !== "") {
					var local_date = new Date(this.inst.selectedYear, this.inst.selectedMonth, this.inst.selectedDay, 12);
					var local_timezone = $.timepicker.timeZoneOffsetString(local_date);
					if (local_timezone == this.timezone) {
						selectLocalTimeZone(tp_inst);
					} else {
						this.timezone_select.val(this.timezone);
					}
				} else {
					if (typeof(this.hour) != "undefined" && this.hour !== null && this.hour !== "") {
						this.timezone_select.val(o.defaultTimezone);
					} else {
						selectLocalTimeZone(tp_inst);
					}
				}
				this.timezone_select.change(function() {
					tp_inst._defaults.useLocalTimezone = false;
					tp_inst._onTimeChange();
					tp_inst._onSelectHandler();
				});
				// End timezone options

				// inject timepicker into datepicker
				var $buttonPanel = $dp.find('.ui-datepicker-buttonpane');
				if ($buttonPanel.length) {
					$buttonPanel.before($tp);
				} else {
					$dp.append($tp);
				}

				this.$timeObj = $tp.find('.ui_tpicker_time');

				if (this.inst !== null) {
					var timeDefined = this.timeDefined;
					this._onTimeChange();
					this.timeDefined = timeDefined;
				}

				// slideAccess integration: http://trentrichardson.com/2011/11/11/jquery-ui-sliders-and-touch-accessibility/
				if (this._defaults.addSliderAccess) {
					var sliderAccessArgs = this._defaults.sliderAccessArgs,
						rtl = this._defaults.isRTL;
					sliderAccessArgs.isRTL = rtl;

					setTimeout(function() { // fix for inline mode
						if ($tp.find('.ui-slider-access').length === 0) {
							$tp.find('.ui-slider:visible').sliderAccess(sliderAccessArgs);

							// fix any grids since sliders are shorter
							var sliderAccessWidth = $tp.find('.ui-slider-access:eq(0)').outerWidth(true);
							if (sliderAccessWidth) {
								$tp.find('table:visible').each(function() {
									var $g = $(this),
										oldWidth = $g.outerWidth(),
										oldMarginLeft = $g.css(rtl? 'marginRight':'marginLeft').toString().replace('%', ''),
										newWidth = oldWidth - sliderAccessWidth,
										newMarginLeft = ((oldMarginLeft * newWidth) / oldWidth) + '%',
										css = { width: newWidth, marginRight: 0, marginLeft: 0 };
									css[rtl? 'marginRight':'marginLeft'] = newMarginLeft;
									$g.css(css);
								});
							}
						}
					}, 10);
				}
				// end slideAccess integration

			}
		},

		/*
		* This function tries to limit the ability to go outside the
		* min/max date range
		*/
		_limitMinMaxDateTime: function(dp_inst, adjustSliders) {
			var o = this._defaults,
				dp_date = new Date(dp_inst.selectedYear, dp_inst.selectedMonth, dp_inst.selectedDay);

			if (!this._defaults.showTimepicker) {
				return;
			} // No time so nothing to check here

			if ($.datepicker._get(dp_inst, 'minDateTime') !== null && $.datepicker._get(dp_inst, 'minDateTime') !== undefined && dp_date) {
				var minDateTime = $.datepicker._get(dp_inst, 'minDateTime'),
					minDateTimeDate = new Date(minDateTime.getFullYear(), minDateTime.getMonth(), minDateTime.getDate(), 0, 0, 0, 0);

				if (this.hourMinOriginal === null || this.minuteMinOriginal === null || this.secondMinOriginal === null || this.millisecMinOriginal === null) {
					this.hourMinOriginal = o.hourMin;
					this.minuteMinOriginal = o.minuteMin;
					this.secondMinOriginal = o.secondMin;
					this.millisecMinOriginal = o.millisecMin;
				}

				if (dp_inst.settings.timeOnly || minDateTimeDate.getTime() == dp_date.getTime()) {
					this._defaults.hourMin = minDateTime.getHours();
					if (this.hour <= this._defaults.hourMin) {
						this.hour = this._defaults.hourMin;
						this._defaults.minuteMin = minDateTime.getMinutes();
						if (this.minute <= this._defaults.minuteMin) {
							this.minute = this._defaults.minuteMin;
							this._defaults.secondMin = minDateTime.getSeconds();
							if (this.second <= this._defaults.secondMin) {
								this.second = this._defaults.secondMin;
								this._defaults.millisecMin = minDateTime.getMilliseconds();
							} else {
								if (this.millisec < this._defaults.millisecMin) {
									this.millisec = this._defaults.millisecMin;
								}
								this._defaults.millisecMin = this.millisecMinOriginal;
							}
						} else {
							this._defaults.secondMin = this.secondMinOriginal;
							this._defaults.millisecMin = this.millisecMinOriginal;
						}
					} else {
						this._defaults.minuteMin = this.minuteMinOriginal;
						this._defaults.secondMin = this.secondMinOriginal;
						this._defaults.millisecMin = this.millisecMinOriginal;
					}
				} else {
					this._defaults.hourMin = this.hourMinOriginal;
					this._defaults.minuteMin = this.minuteMinOriginal;
					this._defaults.secondMin = this.secondMinOriginal;
					this._defaults.millisecMin = this.millisecMinOriginal;
				}
			}

			if ($.datepicker._get(dp_inst, 'maxDateTime') !== null && $.datepicker._get(dp_inst, 'maxDateTime') !== undefined && dp_date) {
				var maxDateTime = $.datepicker._get(dp_inst, 'maxDateTime'),
					maxDateTimeDate = new Date(maxDateTime.getFullYear(), maxDateTime.getMonth(), maxDateTime.getDate(), 0, 0, 0, 0);

				if (this.hourMaxOriginal === null || this.minuteMaxOriginal === null || this.secondMaxOriginal === null) {
					this.hourMaxOriginal = o.hourMax;
					this.minuteMaxOriginal = o.minuteMax;
					this.secondMaxOriginal = o.secondMax;
					this.millisecMaxOriginal = o.millisecMax;
				}

				if (dp_inst.settings.timeOnly || maxDateTimeDate.getTime() == dp_date.getTime()) {
					this._defaults.hourMax = maxDateTime.getHours();
					if (this.hour >= this._defaults.hourMax) {
						this.hour = this._defaults.hourMax;
						this._defaults.minuteMax = maxDateTime.getMinutes();
						if (this.minute >= this._defaults.minuteMax) {
							this.minute = this._defaults.minuteMax;
							this._defaults.secondMax = maxDateTime.getSeconds();
							if (this.second >= this._defaults.secondMax) {
								this.second = this._defaults.secondMax;
								this._defaults.millisecMax = maxDateTime.getMilliseconds();
							} else {
								if (this.millisec > this._defaults.millisecMax) {
									this.millisec = this._defaults.millisecMax;
								}
								this._defaults.millisecMax = this.millisecMaxOriginal;
							}
						} else {
							this._defaults.secondMax = this.secondMaxOriginal;
							this._defaults.millisecMax = this.millisecMaxOriginal;
						}
					} else {
						this._defaults.minuteMax = this.minuteMaxOriginal;
						this._defaults.secondMax = this.secondMaxOriginal;
						this._defaults.millisecMax = this.millisecMaxOriginal;
					}
				} else {
					this._defaults.hourMax = this.hourMaxOriginal;
					this._defaults.minuteMax = this.minuteMaxOriginal;
					this._defaults.secondMax = this.secondMaxOriginal;
					this._defaults.millisecMax = this.millisecMaxOriginal;
				}
			}

			if (adjustSliders !== undefined && adjustSliders === true) {
				var hourMax = parseInt((this._defaults.hourMax - ((this._defaults.hourMax - this._defaults.hourMin) % this._defaults.stepHour)), 10),
					minMax = parseInt((this._defaults.minuteMax - ((this._defaults.minuteMax - this._defaults.minuteMin) % this._defaults.stepMinute)), 10),
					secMax = parseInt((this._defaults.secondMax - ((this._defaults.secondMax - this._defaults.secondMin) % this._defaults.stepSecond)), 10),
					millisecMax = parseInt((this._defaults.millisecMax - ((this._defaults.millisecMax - this._defaults.millisecMin) % this._defaults.stepMillisec)), 10);

				if (this.hour_slider) {
					this.control.options(this, this.hour_slider, 'hour', { min: this._defaults.hourMin, max: hourMax });
					this.control.value(this, this.hour_slider, 'hour', this.hour - (this.hour % this._defaults.stepHour));
				}
				if (this.minute_slider) {
					this.control.options(this, this.minute_slider, 'minute', { min: this._defaults.minuteMin, max: minMax });
					this.control.value(this, this.minute_slider, 'minute', this.minute - (this.minute % this._defaults.stepMinute));
				}
				if (this.second_slider) {
					this.control.options(this, this.second_slider, 'second', { min: this._defaults.secondMin, max: secMax });
					this.control.value(this, this.second_slider, 'second', this.second - (this.second % this._defaults.stepSecond));
				}
				if (this.millisec_slider) {
					this.control.options(this, this.millisec_slider, 'millisec', { min: this._defaults.millisecMin, max: millisecMax });
					this.control.value(this, this.millisec_slider, 'millisec', this.millisec - (this.millisec % this._defaults.stepMillisec));
				}
			}

		},

		/*
		* when a slider moves, set the internal time...
		* on time change is also called when the time is updated in the text field
		*/
		_onTimeChange: function() {
			var hour = (this.hour_slider) ? this.control.value(this, this.hour_slider, 'hour') : false,
				minute = (this.minute_slider) ? this.control.value(this, this.minute_slider, 'minute') : false,
				second = (this.second_slider) ? this.control.value(this, this.second_slider, 'second') : false,
				millisec = (this.millisec_slider) ? this.control.value(this, this.millisec_slider, 'millisec') : false,
				timezone = (this.timezone_select) ? this.timezone_select.val() : false,
				o = this._defaults,
				pickerTimeFormat = o.pickerTimeFormat || o.timeFormat,
				pickerTimeSuffix = o.pickerTimeSuffix || o.timeSuffix;

			if (typeof(hour) == 'object') {
				hour = false;
			}
			if (typeof(minute) == 'object') {
				minute = false;
			}
			if (typeof(second) == 'object') {
				second = false;
			}
			if (typeof(millisec) == 'object') {
				millisec = false;
			}
			if (typeof(timezone) == 'object') {
				timezone = false;
			}

			if (hour !== false) {
				hour = parseInt(hour, 10);
			}
			if (minute !== false) {
				minute = parseInt(minute, 10);
			}
			if (second !== false) {
				second = parseInt(second, 10);
			}
			if (millisec !== false) {
				millisec = parseInt(millisec, 10);
			}

			var ampm = o[hour < 12 ? 'amNames' : 'pmNames'][0];

			// If the update was done in the input field, the input field should not be updated.
			// If the update was done using the sliders, update the input field.
			var hasChanged = (hour != this.hour || minute != this.minute || second != this.second || millisec != this.millisec
								|| (this.ampm.length > 0 && (hour < 12) != ($.inArray(this.ampm.toUpperCase(), this.amNames) !== -1))
								|| ((this.timezone === null && timezone != this.defaultTimezone) || (this.timezone !== null && timezone != this.timezone)));

			if (hasChanged) {

				if (hour !== false) {
					this.hour = hour;
				}
				if (minute !== false) {
					this.minute = minute;
				}
				if (second !== false) {
					this.second = second;
				}
				if (millisec !== false) {
					this.millisec = millisec;
				}
				if (timezone !== false) {
					this.timezone = timezone;
				}

				if (!this.inst) {
					this.inst = $.datepicker._getInst(this.$input[0]);
				}

				this._limitMinMaxDateTime(this.inst, true);
			}
			if (useAmpm(o.timeFormat)) {
				this.ampm = ampm;
			}

			// Updates the time within the timepicker
			this.formattedTime = $.datepicker.formatTime(o.timeFormat, this, o);
			if (this.$timeObj) {
				if(pickerTimeFormat === o.timeFormat){
					this.$timeObj.text(this.formattedTime + pickerTimeSuffix);
				}
				else{
					this.$timeObj.text($.datepicker.formatTime(pickerTimeFormat, this, o) + pickerTimeSuffix);
				}
			}

			this.timeDefined = true;
			if (hasChanged) {
				this._updateDateTime();
			}
		},

		/*
		* call custom onSelect.
		* bind to sliders slidestop, and grid click.
		*/
		_onSelectHandler: function() {
			var onSelect = this._defaults.onSelect || this.inst.settings.onSelect;
			var inputEl = this.$input ? this.$input[0] : null;
			if (onSelect && inputEl) {
				onSelect.apply(inputEl, [this.formattedDateTime, this]);
			}
		},

		/*
		* update our input with the new date time..
		*/
		_updateDateTime: function(dp_inst) {
			dp_inst = this.inst || dp_inst;
			var dt = $.datepicker._daylightSavingAdjust(new Date(dp_inst.selectedYear, dp_inst.selectedMonth, dp_inst.selectedDay)),
				dateFmt = $.datepicker._get(dp_inst, 'dateFormat'),
				formatCfg = $.datepicker._getFormatConfig(dp_inst),
				timeAvailable = dt !== null && this.timeDefined;
			this.formattedDate = $.datepicker.formatDate(dateFmt, (dt === null ? new Date() : dt), formatCfg);
			var formattedDateTime = this.formattedDate;

			/*
			* remove following lines to force every changes in date picker to change the input value
			* Bug descriptions: when an input field has a default value, and click on the field to pop up the date picker.
			* If the user manually empty the value in the input field, the date picker will never change selected value.
			*/
			//if (dp_inst.lastVal !== undefined && (dp_inst.lastVal.length > 0 && this.$input.val().length === 0)) {
			//	return;
			//}

			if (this._defaults.timeOnly === true) {
				formattedDateTime = this.formattedTime;
			} else if (this._defaults.timeOnly !== true && (this._defaults.alwaysSetTime || timeAvailable)) {
				formattedDateTime += this._defaults.separator + this.formattedTime + this._defaults.timeSuffix;
			}

			this.formattedDateTime = formattedDateTime;

			if (!this._defaults.showTimepicker) {
				this.$input.val(this.formattedDate);
			} else if (this.$altInput && this._defaults.altFieldTimeOnly === true) {
				this.$altInput.val(this.formattedTime);
				this.$input.val(this.formattedDate);
			} else if (this.$altInput) {
				this.$input.val(formattedDateTime);
				var altFormattedDateTime = '',
					altSeparator = this._defaults.altSeparator ? this._defaults.altSeparator : this._defaults.separator,
					altTimeSuffix = this._defaults.altTimeSuffix ? this._defaults.altTimeSuffix : this._defaults.timeSuffix;

				if (this._defaults.altFormat) altFormattedDateTime = $.datepicker.formatDate(this._defaults.altFormat, (dt === null ? new Date() : dt), formatCfg);
				else altFormattedDateTime = this.formattedDate;
				if (altFormattedDateTime) altFormattedDateTime += altSeparator;
				if (this._defaults.altTimeFormat) altFormattedDateTime += $.datepicker.formatTime(this._defaults.altTimeFormat, this, this._defaults) + altTimeSuffix;
				else altFormattedDateTime += this.formattedTime + altTimeSuffix;
				this.$altInput.val(altFormattedDateTime);
			} else {
				this.$input.val(formattedDateTime);
			}

			this.$input.trigger("change");
		},

		_onFocus: function() {
			if (!this.$input.val() && this._defaults.defaultValue) {
				this.$input.val(this._defaults.defaultValue);
				var inst = $.datepicker._getInst(this.$input.get(0)),
					tp_inst = $.datepicker._get(inst, 'timepicker');
				if (tp_inst) {
					if (tp_inst._defaults.timeOnly && (inst.input.val() != inst.lastVal)) {
						try {
							$.datepicker._updateDatepicker(inst);
						} catch (err) {
							$.datepicker.log(err);
						}
					}
				}
			}
		},

		/*
		* Small abstraction to control types
		* We can add more, just be sure to follow the pattern: create, options, value
		*/
		_controls: {
			// slider methods
			slider: {
				create: function(tp_inst, obj, unit, val, min, max, step){
					var rtl = tp_inst._defaults.isRTL; // if rtl go -60->0 instead of 0->60
					return obj.prop('slide', null).slider({
						orientation: "horizontal",
						value: rtl? val*-1 : val,
						min: rtl? max*-1 : min,
						max: rtl? min*-1 : max,
						step: step,
						slide: function(event, ui) {
							tp_inst.control.value(tp_inst, $(this), unit, rtl? ui.value*-1:ui.value);
							tp_inst._onTimeChange();
						},
						stop: function(event, ui) {
							tp_inst._onSelectHandler();
						}
					});
				},
				options: function(tp_inst, obj, unit, opts, val){
					if(tp_inst._defaults.isRTL){
						if(typeof(opts) == 'string'){
							if(opts == 'min' || opts == 'max'){
								if(val !== undefined)
									return obj.slider(opts, val*-1);
								return Math.abs(obj.slider(opts));
							}
							return obj.slider(opts);
						}
						var min = opts.min,
							max = opts.max;
						opts.min = opts.max = null;
						if(min !== undefined)
							opts.max = min * -1;
						if(max !== undefined)
							opts.min = max * -1;
						return obj.slider(opts);
					}
					if(typeof(opts) == 'string' && val !== undefined)
							return obj.slider(opts, val);
					return obj.slider(opts);
				},
				value: function(tp_inst, obj, unit, val){
					if(tp_inst._defaults.isRTL){
						if(val !== undefined)
							return obj.slider('value', val*-1);
						return Math.abs(obj.slider('value'));
					}
					if(val !== undefined)
						return obj.slider('value', val);
					return obj.slider('value');
				}
			},
			// select methods
			select: {
				create: function(tp_inst, obj, unit, val, min, max, step){
					var sel = '<select class="ui-timepicker-select" data-unit="'+ unit +'" data-min="'+ min +'" data-max="'+ max +'" data-step="'+ step +'">',
						ul = tp_inst._defaults.timeFormat.indexOf('t') !== -1? 'toLowerCase':'toUpperCase',
						m = 0;

					for(var i=min; i<=max; i+=step){
						sel += '<option value="'+ i +'"'+ (i==val? ' selected':'') +'>';
						if(unit == 'hour' && useAmpm(tp_inst._defaults.pickerTimeFormat || tp_inst._defaults.timeFormat))
							sel += $.datepicker.formatTime("hh TT", {hour:i}, tp_inst._defaults);
						else if(unit == 'millisec' || i >= 10) sel += i;
						else sel += '0'+ i.toString();
						sel += '</option>';
					}
					sel += '</select>';

					obj.children('select').remove();

					$(sel).appendTo(obj).change(function(e){
						tp_inst._onTimeChange();
						tp_inst._onSelectHandler();
					});

					return obj;
				},
				options: function(tp_inst, obj, unit, opts, val){
					var o = {},
						$t = obj.children('select');
					if(typeof(opts) == 'string'){
						if(val === undefined)
							return $t.data(opts);
						o[opts] = val;
					}
					else o = opts;
					return tp_inst.control.create(tp_inst, obj, $t.data('unit'), $t.val(), o.min || $t.data('min'), o.max || $t.data('max'), o.step || $t.data('step'));
				},
				value: function(tp_inst, obj, unit, val){
					var $t = obj.children('select');
					if(val !== undefined)
						return $t.val(val);
					return $t.val();
				}
			}
		} // end _controls

	});

	$.fn.extend({
		/*
		* shorthand just to use timepicker..
		*/
		timepicker: function(o) {
			o = o || {};
			var tmp_args = Array.prototype.slice.call(arguments);

			if (typeof o == 'object') {
				tmp_args[0] = $.extend(o, {
					timeOnly: true
				});
			}

			return $(this).each(function() {
				$.fn.datetimepicker.apply($(this), tmp_args);
			});
		},

		/*
		* extend timepicker to datepicker
		*/
		datetimepicker: function(o) {
			o = o || {};
			var tmp_args = arguments;

			if (typeof(o) == 'string') {
				if (o == 'getDate') {
					return $.fn.datepicker.apply($(this[0]), tmp_args);
				} else {
					return this.each(function() {
						var $t = $(this);
						$t.datepicker.apply($t, tmp_args);
					});
				}
			} else {
				return this.each(function() {
					var $t = $(this);
					$t.datepicker($.timepicker._newInst($t, o)._defaults);
				});
			}
		}
	});

	/*
	* Public Utility to parse date and time
	*/
	$.datepicker.parseDateTime = function(dateFormat, timeFormat, dateTimeString, dateSettings, timeSettings) {
		var parseRes = parseDateTimeInternal(dateFormat, timeFormat, dateTimeString, dateSettings, timeSettings);
		if (parseRes.timeObj) {
			var t = parseRes.timeObj;
			parseRes.date.setHours(t.hour, t.minute, t.second, t.millisec);
		}

		return parseRes.date;
	};

	/*
	* Public utility to parse time
	*/
	$.datepicker.parseTime = function(timeFormat, timeString, options) {
		var o = extendRemove(extendRemove({}, $.timepicker._defaults), options || {});

		// Strict parse requires the timeString to match the timeFormat exactly
		var strictParse = function(f, s, o){

			// pattern for standard and localized AM/PM markers
			var getPatternAmpm = function(amNames, pmNames) {
				var markers = [];
				if (amNames) {
					$.merge(markers, amNames);
				}
				if (pmNames) {
					$.merge(markers, pmNames);
				}
				markers = $.map(markers, function(val) {
					return val.replace(/[.*+?|()\[\]{}\\]/g, '\\$&');
				});
				return '(' + markers.join('|') + ')?';
			};

			// figure out position of time elements.. cause js cant do named captures
			var getFormatPositions = function(timeFormat) {
				var finds = timeFormat.toLowerCase().match(/(h{1,2}|m{1,2}|s{1,2}|l{1}|t{1,2}|z|'.*?')/g),
					orders = {
						h: -1,
						m: -1,
						s: -1,
						l: -1,
						t: -1,
						z: -1
					};

				if (finds) {
					for (var i = 0; i < finds.length; i++) {
						if (orders[finds[i].toString().charAt(0)] == -1) {
							orders[finds[i].toString().charAt(0)] = i + 1;
						}
					}
				}
				return orders;
			};

			var regstr = '^' + f.toString()
					.replace(/([hH]{1,2}|mm?|ss?|[tT]{1,2}|[lz]|'.*?')/g, function (match) {
							var ml = match.length;
							switch (match.charAt(0).toLowerCase()) {
								case 'h': return ml === 1? '(\\d?\\d)':'(\\d{'+ml+'})';
								case 'm': return ml === 1? '(\\d?\\d)':'(\\d{'+ml+'})';
								case 's': return ml === 1? '(\\d?\\d)':'(\\d{'+ml+'})';
								case 'l': return '(\\d?\\d?\\d)';
								case 'z': return '(z|[-+]\\d\\d:?\\d\\d|\\S+)?';
								case 't': return getPatternAmpm(o.amNames, o.pmNames);
								default:    // literal escaped in quotes
									return '(' + match.replace(/\'/g, "").replace(/(\.|\$|\^|\\|\/|\(|\)|\[|\]|\?|\+|\*)/g, function (m) { return "\\" + m; }) + ')?';
							}
						})
					.replace(/\s/g, '\\s?') +
					o.timeSuffix + '$',
				order = getFormatPositions(f),
				ampm = '',
				treg;

			treg = s.match(new RegExp(regstr, 'i'));

			var resTime = {
				hour: 0,
				minute: 0,
				second: 0,
				millisec: 0
			};

			if (treg) {
				if (order.t !== -1) {
					if (treg[order.t] === undefined || treg[order.t].length === 0) {
						ampm = '';
						resTime.ampm = '';
					} else {
						ampm = $.inArray(treg[order.t].toUpperCase(), o.amNames) !== -1 ? 'AM' : 'PM';
						resTime.ampm = o[ampm == 'AM' ? 'amNames' : 'pmNames'][0];
					}
				}

				if (order.h !== -1) {
					if (ampm == 'AM' && treg[order.h] == '12') {
						resTime.hour = 0; // 12am = 0 hour
					} else {
						if (ampm == 'PM' && treg[order.h] != '12') {
							resTime.hour = parseInt(treg[order.h], 10) + 12; // 12pm = 12 hour, any other pm = hour + 12
						} else {
							resTime.hour = Number(treg[order.h]);
						}
					}
				}

				if (order.m !== -1) {
					resTime.minute = Number(treg[order.m]);
				}
				if (order.s !== -1) {
					resTime.second = Number(treg[order.s]);
				}
				if (order.l !== -1) {
					resTime.millisec = Number(treg[order.l]);
				}
				if (order.z !== -1 && treg[order.z] !== undefined) {
					var tz = treg[order.z].toUpperCase();
					switch (tz.length) {
					case 1:
						// Z
						tz = o.timezoneIso8601 ? 'Z' : '+0000';
						break;
					case 5:
						// +hhmm
						if (o.timezoneIso8601) {
							tz = tz.substring(1) == '0000' ? 'Z' : tz.substring(0, 3) + ':' + tz.substring(3);
						}
						break;
					case 6:
						// +hh:mm
						if (!o.timezoneIso8601) {
							tz = tz == 'Z' || tz.substring(1) == '00:00' ? '+0000' : tz.replace(/:/, '');
						} else {
							if (tz.substring(1) == '00:00') {
								tz = 'Z';
							}
						}
						break;
					}
					resTime.timezone = tz;
				}


				return resTime;
			}
			return false;
		};// end strictParse

		// First try JS Date, if that fails, use strictParse
		var looseParse = function(f,s,o){
			try{
				var d = new Date('2012-01-01 '+ s);
				if(isNaN(d.getTime())){
					d = new Date('2012-01-01T'+ s);
					if(isNaN(d.getTime())){
						d = new Date('01/01/2012 '+ s);
						if(isNaN(d.getTime())){
							throw "Unable to parse time with native Date: "+ s;
						}
					}
				}

				return {
					hour: d.getHours(),
					minute: d.getMinutes(),
					second: d.getSeconds(),
					millisec: d.getMilliseconds(),
					timezone: $.timepicker.timeZoneOffsetString(d)
				};
			}
			catch(err){
				try{
					return strictParse(f,s,o);
				}
				catch(err2){
					$.datepicker.log("Unable to parse \ntimeString: "+ s +"\ntimeFormat: "+ f);
				}
			}
			return false;
		}; // end looseParse

		if(typeof o.parse === "function"){
			return o.parse(timeFormat, timeString, o)
		}
		if(o.parse === 'loose'){
			return looseParse(timeFormat, timeString, o);
		}
		return strictParse(timeFormat, timeString, o);
	};

	/*
	* Public utility to format the time
	* format = string format of the time
	* time = a {}, not a Date() for timezones
	* options = essentially the regional[].. amNames, pmNames, ampm
	*/
	$.datepicker.formatTime = function(format, time, options) {
		options = options || {};
		options = $.extend({}, $.timepicker._defaults, options);
		time = $.extend({
			hour: 0,
			minute: 0,
			second: 0,
			millisec: 0,
			timezone: '+0000'
		}, time);

		var tmptime = format,
			ampmName = options.amNames[0],
			hour = parseInt(time.hour, 10);

		if (hour > 11) {
			ampmName = options.pmNames[0];
		}

		tmptime = tmptime.replace(/(?:HH?|hh?|mm?|ss?|[tT]{1,2}|[lz]|('.*?'|".*?"))/g, function(match) {
		switch (match) {
			case 'HH':
				return ('0' + hour).slice(-2);
			case 'H':
				return hour;
			case 'hh':
				return ('0' + convert24to12(hour)).slice(-2);
			case 'h':
				return convert24to12(hour);
			case 'mm':
				return ('0' + time.minute).slice(-2);
			case 'm':
				return time.minute;
			case 'ss':
				return ('0' + time.second).slice(-2);
			case 's':
				return time.second;
			case 'l':
				return ('00' + time.millisec).slice(-3);
			case 'z':
				return time.timezone === null? options.defaultTimezone : time.timezone;
			case 'T':
				return ampmName.charAt(0).toUpperCase();
			case 'TT':
				return ampmName.toUpperCase();
			case 't':
				return ampmName.charAt(0).toLowerCase();
			case 'tt':
				return ampmName.toLowerCase();
			default:
				return match.replace(/\'/g, "") || "'";
			}
		});

		tmptime = $.trim(tmptime);
		return tmptime;
	};

	/*
	* the bad hack :/ override datepicker so it doesnt close on select
	// inspired: http://stackoverflow.com/questions/1252512/jquery-datepicker-prevent-closing-picker-when-clicking-a-date/1762378#1762378
	*/
	$.datepicker._base_selectDate = $.datepicker._selectDate;
	$.datepicker._selectDate = function(id, dateStr) {
		var inst = this._getInst($(id)[0]),
			tp_inst = this._get(inst, 'timepicker');

		if (tp_inst) {
			tp_inst._limitMinMaxDateTime(inst, true);
			inst.inline = inst.stay_open = true;
			//This way the onSelect handler called from calendarpicker get the full dateTime
			this._base_selectDate(id, dateStr);
			inst.inline = inst.stay_open = false;
			this._notifyChange(inst);
			this._updateDatepicker(inst);
		} else {
			this._base_selectDate(id, dateStr);
		}
	};

	/*
	* second bad hack :/ override datepicker so it triggers an event when changing the input field
	* and does not redraw the datepicker on every selectDate event
	*/
	$.datepicker._base_updateDatepicker = $.datepicker._updateDatepicker;
	$.datepicker._updateDatepicker = function(inst) {

		// don't popup the datepicker if there is another instance already opened
		var input = inst.input[0];
		if ($.datepicker._curInst && $.datepicker._curInst != inst && $.datepicker._datepickerShowing && $.datepicker._lastInput != input) {
			return;
		}

		if (typeof(inst.stay_open) !== 'boolean' || inst.stay_open === false) {

			this._base_updateDatepicker(inst);

			// Reload the time control when changing something in the input text field.
			var tp_inst = this._get(inst, 'timepicker');
			if (tp_inst) {
				tp_inst._addTimePicker(inst);

//				if (tp_inst._defaults.useLocalTimezone) { //checks daylight saving with the new date.
//					var date = new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay, 12);
//					selectLocalTimeZone(tp_inst, date);
//					tp_inst._onTimeChange();
//				}
			}
		}
	};

	/*
	* third bad hack :/ override datepicker so it allows spaces and colon in the input field
	*/
	$.datepicker._base_doKeyPress = $.datepicker._doKeyPress;
	$.datepicker._doKeyPress = function(event) {
		var inst = $.datepicker._getInst(event.target),
			tp_inst = $.datepicker._get(inst, 'timepicker');

		if (tp_inst) {
			if ($.datepicker._get(inst, 'constrainInput')) {
				var ampm = useAmpm(tp_inst._defaults.timeFormat),
					dateChars = $.datepicker._possibleChars($.datepicker._get(inst, 'dateFormat')),
					datetimeChars = tp_inst._defaults.timeFormat.toString()
											.replace(/[hms]/g, '')
											.replace(/TT/g, ampm ? 'APM' : '')
											.replace(/Tt/g, ampm ? 'AaPpMm' : '')
											.replace(/tT/g, ampm ? 'AaPpMm' : '')
											.replace(/T/g, ampm ? 'AP' : '')
											.replace(/tt/g, ampm ? 'apm' : '')
											.replace(/t/g, ampm ? 'ap' : '') +
											" " + tp_inst._defaults.separator +
											tp_inst._defaults.timeSuffix +
											(tp_inst._defaults.showTimezone ? tp_inst._defaults.timezoneList.join('') : '') +
											(tp_inst._defaults.amNames.join('')) + (tp_inst._defaults.pmNames.join('')) +
											dateChars,
					chr = String.fromCharCode(event.charCode === undefined ? event.keyCode : event.charCode);
				return event.ctrlKey || (chr < ' ' || !dateChars || datetimeChars.indexOf(chr) > -1);
			}
		}

		return $.datepicker._base_doKeyPress(event);
	};

	/*
	* Fourth bad hack :/ override _updateAlternate function used in inline mode to init altField
	*/
	$.datepicker._base_updateAlternate = $.datepicker._updateAlternate;
	/* Update any alternate field to synchronise with the main field. */
	$.datepicker._updateAlternate = function(inst) {
		var tp_inst = this._get(inst, 'timepicker');
		if(tp_inst){
			var altField = tp_inst._defaults.altField;
			if (altField) { // update alternate field too
				var altFormat = tp_inst._defaults.altFormat || tp_inst._defaults.dateFormat,
					date = this._getDate(inst),
					formatCfg = $.datepicker._getFormatConfig(inst),
					altFormattedDateTime = '',
					altSeparator = tp_inst._defaults.altSeparator ? tp_inst._defaults.altSeparator : tp_inst._defaults.separator,
					altTimeSuffix = tp_inst._defaults.altTimeSuffix ? tp_inst._defaults.altTimeSuffix : tp_inst._defaults.timeSuffix,
					altTimeFormat = tp_inst._defaults.altTimeFormat !== null ? tp_inst._defaults.altTimeFormat : tp_inst._defaults.timeFormat;

				altFormattedDateTime += $.datepicker.formatTime(altTimeFormat, tp_inst, tp_inst._defaults) + altTimeSuffix;
				if(!tp_inst._defaults.timeOnly && !tp_inst._defaults.altFieldTimeOnly && date !== null){
					if(tp_inst._defaults.altFormat)
						altFormattedDateTime = $.datepicker.formatDate(tp_inst._defaults.altFormat, date, formatCfg) + altSeparator + altFormattedDateTime;
					else altFormattedDateTime = tp_inst.formattedDate + altSeparator + altFormattedDateTime;
				}
				$(altField).val(altFormattedDateTime);
			}
		}
		else{
			$.datepicker._base_updateAlternate(inst);
		}
	};

	/*
	* Override key up event to sync manual input changes.
	*/
	$.datepicker._base_doKeyUp = $.datepicker._doKeyUp;
	$.datepicker._doKeyUp = function(event) {
		var inst = $.datepicker._getInst(event.target),
			tp_inst = $.datepicker._get(inst, 'timepicker');

		if (tp_inst) {
			if (tp_inst._defaults.timeOnly && (inst.input.val() != inst.lastVal)) {
				try {
					$.datepicker._updateDatepicker(inst);
				} catch (err) {
					$.datepicker.log(err);
				}
			}
		}

		return $.datepicker._base_doKeyUp(event);
	};

	/*
	* override "Today" button to also grab the time.
	*/
	$.datepicker._base_gotoToday = $.datepicker._gotoToday;
	$.datepicker._gotoToday = function(id) {
		var inst = this._getInst($(id)[0]),
			$dp = inst.dpDiv;
		this._base_gotoToday(id);
		var tp_inst = this._get(inst, 'timepicker');
		selectLocalTimeZone(tp_inst);
		var now = new Date();
		this._setTime(inst, now);
		$('.ui-datepicker-today', $dp).click();
	};

	/*
	* Disable & enable the Time in the datetimepicker
	*/
	$.datepicker._disableTimepickerDatepicker = function(target) {
		var inst = this._getInst(target);
		if (!inst) {
			return;
		}

		var tp_inst = this._get(inst, 'timepicker');
		$(target).datepicker('getDate'); // Init selected[Year|Month|Day]
		if (tp_inst) {
			tp_inst._defaults.showTimepicker = false;
			tp_inst._updateDateTime(inst);
		}
	};

	$.datepicker._enableTimepickerDatepicker = function(target) {
		var inst = this._getInst(target);
		if (!inst) {
			return;
		}

		var tp_inst = this._get(inst, 'timepicker');
		$(target).datepicker('getDate'); // Init selected[Year|Month|Day]
		if (tp_inst) {
			tp_inst._defaults.showTimepicker = true;
			tp_inst._addTimePicker(inst); // Could be disabled on page load
			tp_inst._updateDateTime(inst);
		}
	};

	/*
	* Create our own set time function
	*/
	$.datepicker._setTime = function(inst, date) {
		var tp_inst = this._get(inst, 'timepicker');
		if (tp_inst) {
			var defaults = tp_inst._defaults;

			// calling _setTime with no date sets time to defaults
			tp_inst.hour = date ? date.getHours() : defaults.hour;
			tp_inst.minute = date ? date.getMinutes() : defaults.minute;
			tp_inst.second = date ? date.getSeconds() : defaults.second;
			tp_inst.millisec = date ? date.getMilliseconds() : defaults.millisec;

			//check if within min/max times..
			tp_inst._limitMinMaxDateTime(inst, true);

			tp_inst._onTimeChange();
			tp_inst._updateDateTime(inst);
		}
	};

	/*
	* Create new public method to set only time, callable as $().datepicker('setTime', date)
	*/
	$.datepicker._setTimeDatepicker = function(target, date, withDate) {
		var inst = this._getInst(target);
		if (!inst) {
			return;
		}

		var tp_inst = this._get(inst, 'timepicker');

		if (tp_inst) {
			this._setDateFromField(inst);
			var tp_date;
			if (date) {
				if (typeof date == "string") {
					tp_inst._parseTime(date, withDate);
					tp_date = new Date();
					tp_date.setHours(tp_inst.hour, tp_inst.minute, tp_inst.second, tp_inst.millisec);
				} else {
					tp_date = new Date(date.getTime());
				}
				if (tp_date.toString() == 'Invalid Date') {
					tp_date = undefined;
				}
				this._setTime(inst, tp_date);
			}
		}

	};

	/*
	* override setDate() to allow setting time too within Date object
	*/
	$.datepicker._base_setDateDatepicker = $.datepicker._setDateDatepicker;
	$.datepicker._setDateDatepicker = function(target, date) {
		var inst = this._getInst(target);
		if (!inst) {
			return;
		}

		var tp_date = (date instanceof Date) ? new Date(date.getTime()) : date;

		this._updateDatepicker(inst);
		this._base_setDateDatepicker.apply(this, arguments);
		this._setTimeDatepicker(target, tp_date, true);
	};

	/*
	* override getDate() to allow getting time too within Date object
	*/
	$.datepicker._base_getDateDatepicker = $.datepicker._getDateDatepicker;
	$.datepicker._getDateDatepicker = function(target, noDefault) {
		var inst = this._getInst(target);
		if (!inst) {
			return;
		}

		var tp_inst = this._get(inst, 'timepicker');

		if (tp_inst) {
			// if it hasn't yet been defined, grab from field
			if(inst.lastVal === undefined){
				this._setDateFromField(inst, noDefault);
			}

			var date = this._getDate(inst);
			if (date && tp_inst._parseTime($(target).val(), tp_inst.timeOnly)) {
				date.setHours(tp_inst.hour, tp_inst.minute, tp_inst.second, tp_inst.millisec);
			}
			return date;
		}
		return this._base_getDateDatepicker(target, noDefault);
	};

	/*
	* override parseDate() because UI 1.8.14 throws an error about "Extra characters"
	* An option in datapicker to ignore extra format characters would be nicer.
	*/
	$.datepicker._base_parseDate = $.datepicker.parseDate;
	$.datepicker.parseDate = function(format, value, settings) {
		var date;
		try {
			date = this._base_parseDate(format, value, settings);
		} catch (err) {
			// Hack!  The error message ends with a colon, a space, and
			// the "extra" characters.  We rely on that instead of
			// attempting to perfectly reproduce the parsing algorithm.
			date = this._base_parseDate(format, value.substring(0,value.length-(err.length-err.indexOf(':')-2)), settings);
			$.datepicker.log("Error parsing the date string: " + err + "\ndate string = " + value + "\ndate format = " + format);
		}
		return date;
	};

	/*
	* override formatDate to set date with time to the input
	*/
	$.datepicker._base_formatDate = $.datepicker._formatDate;
	$.datepicker._formatDate = function(inst, day, month, year) {
		var tp_inst = this._get(inst, 'timepicker');
		if (tp_inst) {
			tp_inst._updateDateTime(inst);
			return tp_inst.$input.val();
		}
		return this._base_formatDate(inst);
	};

	/*
	* override options setter to add time to maxDate(Time) and minDate(Time). MaxDate
	*/
	$.datepicker._base_optionDatepicker = $.datepicker._optionDatepicker;
	$.datepicker._optionDatepicker = function(target, name, value) {
		var inst = this._getInst(target),
	        name_clone;
		if (!inst) {
			return null;
		}

		var tp_inst = this._get(inst, 'timepicker');
		if (tp_inst) {
			var min = null,
				max = null,
				onselect = null,
				overrides = tp_inst._defaults.evnts,
				fns = {},
				prop;
		    if (typeof name == 'string') { // if min/max was set with the string
		        if (name === 'minDate' || name === 'minDateTime') {
		            min = value;
		        } else if (name === 'maxDate' || name === 'maxDateTime') {
		            max = value;
		        } else if (name === 'onSelect') {
		            onselect = value;
		        } else if (overrides.hasOwnProperty(name)) {
		            if (typeof (value) === 'undefined') {
		                return overrides[name];
		            }
		            fns[name] = value;
		            name_clone = {}; //empty results in exiting function after overrides updated
		        }
		    } else if (typeof name == 'object') { //if min/max was set with the JSON
		        if (name.minDate) {
		            min = name.minDate;
		        } else if (name.minDateTime) {
		            min = name.minDateTime;
		        } else if (name.maxDate) {
		            max = name.maxDate;
		        } else if (name.maxDateTime) {
		            max = name.maxDateTime;
		        }
		        for (prop in overrides) {
		            if (overrides.hasOwnProperty(prop) && name[prop]) {
		                fns[prop] = name[prop];
		            }
		        }
		    }
		    for (prop in fns) {
		        if (fns.hasOwnProperty(prop)) {
		            overrides[prop] = fns[prop];
		            if (!name_clone) { name_clone = $.extend({}, name);}
		            delete name_clone[prop];
		        }
		    }
		    if (name_clone && isEmptyObject(name_clone)) { return; }
		    if (min) { //if min was set
		        if (min === 0) {
		            min = new Date();
		        } else {
		            min = new Date(min);
		        }
		        tp_inst._defaults.minDate = min;
		        tp_inst._defaults.minDateTime = min;
		    } else if (max) { //if max was set
		        if (max === 0) {
		            max = new Date();
		        } else {
		            max = new Date(max);
		        }
		        tp_inst._defaults.maxDate = max;
		        tp_inst._defaults.maxDateTime = max;
		    } else if (onselect) {
		        tp_inst._defaults.onSelect = onselect;
		    }
		}
		if (value === undefined) {
			return this._base_optionDatepicker.call($.datepicker, target, name);
		}
		return this._base_optionDatepicker.call($.datepicker, target, name_clone || name, value);
	};
	/*
	* jQuery isEmptyObject does not check hasOwnProperty - if someone has added to the object prototype,
	* it will return false for all objects
	*/
	var isEmptyObject = function(obj) {
		var prop;
		for (prop in obj) {
			if (obj.hasOwnProperty(obj)) {
				return false;
			}
		}
		return true;
	};

	/*
	* jQuery extend now ignores nulls!
	*/
	var extendRemove = function(target, props) {
		$.extend(target, props);
		for (var name in props) {
			if (props[name] === null || props[name] === undefined) {
				target[name] = props[name];
			}
		}
		return target;
	};

	/*
	* Determine by the time format if should use ampm
	* Returns true if should use ampm, false if not
	*/
	var useAmpm = function(timeFormat){
		return (timeFormat.indexOf('t') !== -1 && timeFormat.indexOf('h') !== -1);
	};

	/*
	* Converts 24 hour format into 12 hour
	* Returns 12 hour without leading 0
	*/
	var convert24to12 = function(hour) {
		if (hour > 12) {
			hour = hour - 12;
		}

		if (hour == 0) {
			hour = 12;
		}

		return String(hour);
	};

	/*
	* Splits datetime string into date ans time substrings.
	* Throws exception when date can't be parsed
	* Returns [dateString, timeString]
	*/
	var splitDateTime = function(dateFormat, dateTimeString, dateSettings, timeSettings) {
		try {
			// The idea is to get the number separator occurances in datetime and the time format requested (since time has
			// fewer unknowns, mostly numbers and am/pm). We will use the time pattern to split.
			var separator = timeSettings && timeSettings.separator ? timeSettings.separator : $.timepicker._defaults.separator,
				format = timeSettings && timeSettings.timeFormat ? timeSettings.timeFormat : $.timepicker._defaults.timeFormat,
				timeParts = format.split(separator), // how many occurances of separator may be in our format?
				timePartsLen = timeParts.length,
				allParts = dateTimeString.split(separator),
				allPartsLen = allParts.length;

			if (allPartsLen > 1) {
				return [
						allParts.splice(0,allPartsLen-timePartsLen).join(separator),
						allParts.splice(0,timePartsLen).join(separator)
					];
			}

		} catch (err) {
			$.datepicker.log('Could not split the date from the time. Please check the following datetimepicker options' +
					"\nthrown error: " + err +
					"\ndateTimeString" + dateTimeString +
					"\ndateFormat = " + dateFormat +
					"\nseparator = " + timeSettings.separator +
					"\ntimeFormat = " + timeSettings.timeFormat);

			if (err.indexOf(":") >= 0) {
				// Hack!  The error message ends with a colon, a space, and
				// the "extra" characters.  We rely on that instead of
				// attempting to perfectly reproduce the parsing algorithm.
				var dateStringLength = dateTimeString.length - (err.length - err.indexOf(':') - 2),
					timeString = dateTimeString.substring(dateStringLength);

				return [$.trim(dateTimeString.substring(0, dateStringLength)), $.trim(dateTimeString.substring(dateStringLength))];

			} else {
				throw err;
			}
		}
		return [dateTimeString, ''];
	};

	/*
	* Internal function to parse datetime interval
	* Returns: {date: Date, timeObj: Object}, where
	*   date - parsed date without time (type Date)
	*   timeObj = {hour: , minute: , second: , millisec: } - parsed time. Optional
	*/
	var parseDateTimeInternal = function(dateFormat, timeFormat, dateTimeString, dateSettings, timeSettings) {
		var date;
		var splitRes = splitDateTime(dateFormat, dateTimeString, dateSettings, timeSettings);
		date = $.datepicker._base_parseDate(dateFormat, splitRes[0], dateSettings);
		if (splitRes[1] !== '') {
			var timeString = splitRes[1],
				parsedTime = $.datepicker.parseTime(timeFormat, timeString, timeSettings);

			if (parsedTime === null) {
				throw 'Wrong time format';
			}
			return {
				date: date,
				timeObj: parsedTime
			};
		} else {
			return {
				date: date
			};
		}
	};

	/*
	* Internal function to set timezone_select to the local timezone
	*/
	var selectLocalTimeZone = function(tp_inst, date) {
		if (tp_inst && tp_inst.timezone_select) {
			tp_inst._defaults.useLocalTimezone = true;
			var now = typeof date !== 'undefined' ? date : new Date();
			var tzoffset = $.timepicker.timeZoneOffsetString(now);
			if (tp_inst._defaults.timezoneIso8601) {
				tzoffset = tzoffset.substring(0, 3) + ':' + tzoffset.substring(3);
			}
			tp_inst.timezone_select.val(tzoffset);
		}
	};

	/*
	* Create a Singleton Insance
	*/
	$.timepicker = new Timepicker();

	/**
	 * Get the timezone offset as string from a date object (eg '+0530' for UTC+5.5)
	 * @param  date
	 * @return string
	 */
	$.timepicker.timeZoneOffsetString = function(date) {
		var off = date.getTimezoneOffset() * -1,
			minutes = off % 60,
			hours = (off - minutes) / 60;
		return (off >= 0 ? '+' : '-') + ('0' + (hours * 101).toString()).slice(-2) + ('0' + (minutes * 101).toString()).slice(-2);
	};

	/**
	 * Calls `timepicker()` on the `startTime` and `endTime` elements, and configures them to
	 * enforce date range limits.
	 * n.b. The input value must be correctly formatted (reformatting is not supported)
	 * @param  Element startTime
	 * @param  Element endTime
	 * @param  obj options Options for the timepicker() call
	 * @return jQuery
	 */
	$.timepicker.timeRange = function(startTime, endTime, options) {
		return $.timepicker.handleRange('timepicker', startTime, endTime, options);
	};

	/**
	 * Calls `datetimepicker` on the `startTime` and `endTime` elements, and configures them to
	 * enforce date range limits.
	 * @param  Element startTime
	 * @param  Element endTime
	 * @param  obj options Options for the `timepicker()` call. Also supports `reformat`,
	 *   a boolean value that can be used to reformat the input values to the `dateFormat`.
	 * @param  string method Can be used to specify the type of picker to be added
	 * @return jQuery
	 */
	$.timepicker.dateTimeRange = function(startTime, endTime, options) {
		$.timepicker.dateRange(startTime, endTime, options, 'datetimepicker');
	};

	/**
	 * Calls `method` on the `startTime` and `endTime` elements, and configures them to
	 * enforce date range limits.
	 * @param  Element startTime
	 * @param  Element endTime
	 * @param  obj options Options for the `timepicker()` call. Also supports `reformat`,
	 *   a boolean value that can be used to reformat the input values to the `dateFormat`.
	 * @param  string method Can be used to specify the type of picker to be added
	 * @return jQuery
	 */
	$.timepicker.dateRange = function(startTime, endTime, options, method) {
		method = method || 'datepicker';
		$.timepicker.handleRange(method, startTime, endTime, options);
	};

	/**
	 * Calls `method` on the `startTime` and `endTime` elements, and configures them to
	 * enforce date range limits.
	 * @param  string method Can be used to specify the type of picker to be added
	 * @param  Element startTime
	 * @param  Element endTime
	 * @param  obj options Options for the `timepicker()` call. Also supports `reformat`,
	 *   a boolean value that can be used to reformat the input values to the `dateFormat`.
	 * @return jQuery
	 */
	$.timepicker.handleRange = function(method, startTime, endTime, options) {
		$.fn[method].call(startTime, $.extend({
			onClose: function(dateText, inst) {
				checkDates(this, endTime, dateText);
			},
			onSelect: function(selectedDateTime) {
				selected(this, endTime, 'minDate');
			}
		}, options, options.start));
		$.fn[method].call(endTime, $.extend({
			onClose: function(dateText, inst) {
				checkDates(this, startTime, dateText);
			},
			onSelect: function(selectedDateTime) {
				selected(this, startTime, 'maxDate');
			}
		}, options, options.end));
		// timepicker doesn't provide access to its 'timeFormat' option,
		// nor could I get datepicker.formatTime() to behave with times, so I
		// have disabled reformatting for timepicker
		if (method != 'timepicker' && options.reformat) {
			$([startTime, endTime]).each(function() {
				var format = $(this)[method].call($(this), 'option', 'dateFormat'),
					date = new Date($(this).val());
				if ($(this).val() && date) {
					$(this).val($.datepicker.formatDate(format, date));
				}
			});
		}
		checkDates(startTime, endTime, startTime.val());

		function checkDates(changed, other, dateText) {
			if (other.val() && (new Date(startTime.val()) > new Date(endTime.val()))) {
				other.val(dateText);
			}
		}
		selected(startTime, endTime, 'minDate');
		selected(endTime, startTime, 'maxDate');

		function selected(changed, other, option) {
			if (!$(changed).val()) {
				return;
			}
			var date = $(changed)[method].call($(changed), 'getDate');
			// timepicker doesn't implement 'getDate' and returns a jQuery
			if (date.getTime) {
				$(other)[method].call($(other), 'option', option, date);
			}
		}
		return $([startTime.get(0), endTime.get(0)]);
	};

	/*
	* Keep up with the version
	*/
	$.timepicker.version = "1.1.2";

})(jQuery);;;(function($) {

	$.fn.byElement = function(name) {
		return this.find( '[data-element="' + name + '"]' );
	};	

	$.fn.compileHandlebars = function() {
		return Handlebars.compile( this.html() );
	};

	$.fn.fadeOutRemove = function(time) {
		var _self = this;

		_self.fadeOut(time , function() {
			_self.remove();
		});
	};

	$.fn.isEmptyValue = function() {
		return !( $.trim( this.val() ) );
	};

	$.fn.valInt = function() {
		return parseInt( this.val(), 10 );
	};

	$.fn.addClassReFlow = function(name) {
		this.css( 'display', 'block' );
		//force reflow
		this[0].offsetWidth;
		this.addClass( name );
	};

})( jQuery );
;MONKEY.Wrapper( 'MONKEY.AjaxWrapper', function(namespace, callback) {

	MONKEY( 'Ajax.' + namespace, function(Model) {

		Model.fn.initialize = function() {
			this.emitter();
		};

		Model.fn.emitter = function() {
			var emitter = jQuery({});
			this.on     = jQuery.proxy( emitter, 'on' );
			this.fire   = jQuery.proxy( emitter, 'trigger' );
		};

		Model.fn._done = function(identifier, response) {
			this.fire( 'ajax.done' + identifier, [ response ] );
		};

		Model.fn._fail = function(identifier, throwError, status) {
			this.fire( 'ajax.fail' + identifier, [ throwError.responseJSON, status ] );
		};

		Model.fn._request = function(identifier, params, options) {
			var defaults = {
				type     :'GET',
				dataType :'json',
				data     :( params || {} )
			};

			var ajax = jQuery.ajax( jQuery.extend( defaults, options ) );

			ajax.done( jQuery.proxy( this, '_done', identifier ) );
			ajax.fail( jQuery.proxy( this, '_fail', identifier ) );
		};

		callback( Model );

	});

});
;MONKEY( 'Application', function(Application) {

	Application.init = function(container) {
		MONKEY.Translations.init();
		MONKEY.factory.create( container );
	};

}, {} );
;MONKEY.ComponentWrapper( 'Chosen', function(Chosen) {

	Chosen.fn.init = function() {
		this.$el.chosen( this.attr || {} );
	};

});
;MONKEY.ComponentWrapper( 'DatePickerMask', function(DatePickerMask) {

	DatePickerMask.fn.init = function() {
		this.$el.datepicker( this.datePickerAttr || {} );
		this.$el.mask( this.maskPattern, this.maskAttr || {} );
	};

});;MONKEY.ComponentWrapper( 'DatePicker', function(DatePicker) {

	DatePicker.fn.init = function() {
		this.$el.datepicker();
	};

});;MONKEY.ComponentWrapper( 'DateTimePicker', function(DateTimePicker) {

	DateTimePicker.fn.init = function() {
		this.$el.datetimepicker();
	};

});;MONKEY.ComponentWrapper( 'Duplicate', function(Duplicate, utils, $) {

	Duplicate.fn.init = function() {
		this.cloned = this.$el.find( this.closest ).eq( 0 ).clone();
		this.load();
	};

	Duplicate.fn.load = function() {
		this.setDefaultSortable();
		this.addEventListener();
	};

	Duplicate.fn.addEventListener = function() {
		this.addEvent( 'click', 'add-item' );
		this.addEvent( 'click', 'remove-item' );
		MONKEY.vars.body.on( 'submit', this._onSubmitForm.bind( this ) );
	};

	Duplicate.fn._onSubmitForm = function(event) {
		this.$el
			.find( this.closest )
				.each( this.setIterateRows.bind( this ) )
		;
	};

	Duplicate.fn.setIterateRows = function(index, element) {
		$( element )
			.find( this.fields )
				.each( $.proxy( this, 'setIterateItems', index ) )
		;
	};

	Duplicate.fn.setIterateItems = function(origin, index, element) {
		var name = element.name;

		if ( !~name.indexOf( '#' ) ) {
			return;
		}

		element.name = name.replace( '#', origin );
	};

	Duplicate.fn._onClickAddItem = function(event) {
		this.addRow( $( event.currentTarget ) );
	};

	Duplicate.fn._onClickRemoveItem = function(event) {
		this.removeRow( $( event.currentTarget ) );
	};

	Duplicate.fn.removeRow = function(target) {
		if ( this.isLastRow() ) {
			return;
		}

		if ( window.confirm( 'Você realmente deseja apagar esse item?' ) ) {
			target.closest( this.closest ).remove();
		}
	};

	Duplicate.fn.addRow = function(target) {
		target.closest( this.closest )
		      .after( this.getClone() )
		;
	};

	Duplicate.fn.getClone = function() {
		var clone = this.cloned.clone();

		clone.find( this.fields ).val( '' );
		this.setComponents( clone );

		return clone;
	};

	Duplicate.fn.isLastRow = function() {
		return ( this.$el.find( this.closest ).length == 1 );
	};

	Duplicate.fn.setComponents = function(clone) {
		MONKEY.factory.create( clone );
	};

	Duplicate.fn.setDefaultSortable = function() {
		this.$el.sortable({
			handle      : this.handle,
			placeholder : 'sortable-placeholder',
			cursor      : 'move',
			opacity     : 0.65,
			start       : function(e, ui) {
				ui.placeholder.height( ui.helper.outerHeight() - 2 );
			},
		});
	};

});;MONKEY.ComponentWrapper( 'FormAjax', function(FormAjax) {

	FormAjax.fn.init = function() {
		this.addEventListener();
	};

	FormAjax.fn.addEventListener = function() {
		this.$el
			.on( 'submit', this._onSubmit.bind( this ) )
		;
	};

	FormAjax.fn._onSubmit = function(event) {
		event.preventDefault();
		this.fire( 'before-submit' );
		this.send();
	};

	FormAjax.fn.beforeSend = function() {
		this.elements.submit.attr( 'disabled', 'disabled' );
		this.elements.submit.spinnerShow( 'after' );
	};

	FormAjax.fn.send = function() {
		var url    = this.$el.attr( 'action' )
		  , params = this.$el.serialize()
		;

		var ajax = jQuery.ajax({
			url       : url,
			data      : params,
			dataType  : 'json',
			type      : 'POST'
		});

		this.beforeSend();
		ajax.done( this._done.bind( this ) );
		ajax.fail( this._fail.bind( this ) );
	};

	FormAjax.fn._done = function(response) {
		this.elements.submit.removeAttr( 'disabled' );
		this.elements.submit.spinnerHide();
		this.$el.messageShowBefore( 'updated', response.message, true );
	};

	FormAjax.fn._fail = function(throwError, status) {
		var response = ( throwError.responseJSON || {} );

		this.elements.submit.removeAttr( 'disabled' );
		this.elements.submit.spinnerHide();
		this.$el.messageShowBefore( 'error', response.message, true );
	};

});
;MONKEY.ComponentWrapper( 'Mask', function(Mask) {

	Mask.fn.init = function() {
		this.$el.mask( this.pattern, this.attr || {} );
	};

});
;MONKEY.ComponentWrapper( 'TimePickerMask', function(TimePickerMask) {

	TimePickerMask.fn.init = function() {
		this.$el.timepicker( this.timePickerAttr || {} );
		this.$el.mask( this.maskPattern, this.maskAttr || {} );
	};

});;MONKEY.ComponentWrapper( 'TimePicker', function(TimePicker) {

	TimePicker.fn.init = function() {
		this.$el.timepicker();
	};

});;MONKEY.ComponentWrapper( 'UploadFile', function(UploadFile, utils, $) {

	if ( !wp.media ) {
		return;
	}

	var upload = wp.media({
		title     : 'Imagem',
		frame     : 'select',
        multiple  : false,
		library   : {
			type: 'image'
		},
		button    : {
			text : 'Selecione uma imagem'
		}
	});

	upload.on( 'select', function() {
		var model = upload.state().get( 'selection' ).first().toJSON();

		if ( typeof upload.control == 'object' ) {
			upload.control.select.call( upload.control, model );
		}

		upload.control = null;
	});

	upload.on( 'open', function() {
		var attachment = wp.media.attachment( upload.current )
		  , selection  = upload.state().get( 'selection' )
		;
  		
  		selection.add( attachment ? [attachment] : [] );
	});

	/*Image*/
	var FieldImage = function(container) {
		this.container = container;
		this.src       = this.container.data( 'attr-image-src' );
		this.empty     = this.container.data( 'attr-image-empty' );
		this.position  = this.container.data( 'attr-image-position' );
		this.$el       = $( '<img>' );
		this.on        = $.proxy( this.$el, 'on' );
		this.fire      = $.proxy( this.$el, 'trigger' );
		this.inserted  = false;
		this.create();
	};

	FieldImage.prototype.create = function() {
		if ( !this.src && !this.empty ) {
			return;
		}

		this.$el
			.addClass( 'image-create-component' )
			.attr( 'src', this.getSrc() )
		;

		!this.inserted && this.insert();
	};

	FieldImage.prototype.getSrc = function() {
		return ( this.src || this.empty );
	};

	FieldImage.prototype.setEmptyImage = function() {
		if ( this.empty ) {
			this.$el.attr( 'src', this.empty );
			return;
		}

		this.$el.hide();
	};

	FieldImage.prototype.insert = function() {
		this.inserted = true;
		this.container[this.position || 'before']( this.$el );
		this.container.addClass( 'created-image' );
	};

	FieldImage.prototype.reload = function(src) {
		this.src = src;
		this.create();
		this.$el.show();
	};

	/*Hidden*/
	var FieldHidden = function(container) {
		this.container = container;
		this.value     = this.container.data( 'attr-hidden-value' );
		this.name      = this.container.data( 'attr-hidden-name' );
		this.$el       = null;
		this.create();
	};

	FieldHidden.prototype.create = function() {
		this.$el = $( '<input>', {
			type  : 'hidden',
			class : 'hidden-create-component',
			value : this.value,
			name  : this.name
		});

		this.container.before( this.$el );
	};

	FieldHidden.prototype.val = function(value) {
		this.value = value;
		this.$el.val( value );
	};

	FieldHidden.prototype.isEmpty = function() {
		return ( !this.value );
	};

	/*Remove*/
	var FieldRemove = function(container) {
		this.container = container;
		this.className = this.container.data( 'attr-remove-class' );
		this.text      = this.container.data( 'attr-remove-text' );
		this.$el       = $( '<a href="javascript:void(0);">' );
		this.on        = $.proxy( this.$el, 'on' );
		this.fire      = $.proxy( this.$el, 'trigger' );
		this.create();
	};

	FieldRemove.prototype.create = function() {
		this.$el
			.addClass( this.className || 'button-remove' )
			.text( this.text || 'Remover imagem destacada' )
			.hide()
		;

		this.container.after( this.$el );
	};

	/*Component*/
	UploadFile.fn.initialize = function(container) {
		this.container = container;
		this.image     = null;
		this.hidden    = null;
		this.remove    = null;
		this.init();
	};

	UploadFile.fn.init = function() {
		this.setElements();
		this.setControlButtonRemove();
		this.addEventListener();
	};

	UploadFile.fn.setElements = function() {
		this.image  = new FieldImage( this.container );
		this.hidden = new FieldHidden( this.container );
		this.remove = new FieldRemove( this.container ); 
	};

	UploadFile.fn.setControlButtonRemove = function() {
		if ( this.hidden.isEmpty() ) {
			return;
		}
		
		this.setVisibleActions();
	};

	UploadFile.fn.setVisibleActions = function() {
		this.remove.$el.show();
		this.container.hide();
	};

	UploadFile.fn.addEventListener = function() {
		this.container.on( 'click', this._onClickOpen.bind( this ) );
		this.image.on( 'click', this._onClickOpen.bind( this ) );
		this.remove.on( 'click', this._onClickRemove.bind( this ) );
	};

	UploadFile.fn._onClickOpen = function(event) {
		this.open();
	};

	UploadFile.fn._onClickRemove = function() {
		this.reset();
	};

	UploadFile.fn.reset = function() {
		this.hidden.val( '' );
		this.image.setEmptyImage();
		this.container.show();
		this.remove.$el.hide();
	};

	UploadFile.fn.open = function() {
		upload.control = this;
		upload.current = this.hidden.$el.val();
		upload.open();
	};

	UploadFile.fn.select = function(model) {
		this.image.reload( model.url );
		this.hidden.val( model.id );
		this.setVisibleActions();
	};

});;MONKEY.ComponentWrapper( 'UploadUrl', function(UploadUrl, utils, $) {

	if ( !wp.media ) {
		return;
	}

	var upload = wp.media({
		title     : 'Arquivo',
		frame     : 'select',
        multiple  : false,		
		button    : {
			text : 'Selecione um arquivo'
		}
	});

	upload.on( 'select', function() {
		var model = upload.state().get( 'selection' ).first().toJSON();

		if ( typeof upload.control == 'object' ) {
			upload.control.select.call( upload.control, model );
		}

		upload.control = null;
	});

	/*File*/
	var FieldFile = function(container) {
		this.container = container;
		this.value     = this.container.data( 'attr-input-value' );
		this.name      = this.container.data( 'attr-input-name' );
		this.position  = this.container.data( 'attr-input-position' );
		this.$el       = null;
		this.inserted  = false;
		this.create();
	};

	FieldFile.prototype.create = function() {
		this.$el = $( '<input>', {
			type  : 'text',
			class : 'file-input-create-component large-text',
			value : this.value,
			name  : this.name
		});

		!this.inserted && this.insert();
	};

	FieldFile.prototype.insert = function() {
		this.inserted = true;
		this.container[this.position || 'after']( this.$el );
		this.container.addClass( 'create-input-text' );
	};

	FieldFile.prototype.val = function(value) {
		this.value = value;
		this.$el.val( value );
	};

	/*Component*/
	UploadUrl.fn.initialize = function(container) {
		this.container = container;
		this.file      = null;
		this.init();
	};

	UploadUrl.fn.init = function() {
		this.setElements();
		this.addEventListener();
	};

	UploadUrl.fn.setElements = function() {
		this.file = new FieldFile( this.container );
	};

	UploadUrl.fn.addEventListener = function() {
		this.container.on( 'click', this._onClickOpen.bind( this ) );
	};

	UploadUrl.fn._onClickOpen = function(event) {
		this.open();
	};

	UploadUrl.fn.open = function() {
		upload.control = this;
		upload.open();
	};

	UploadUrl.fn.select = function(model) {
		this.file.val( model.url );
	};

});;MONKEY( 'Translations', function(Translations) {

	Translations.init = function() {
		this.datePicker();
		this.timePicker();
	};

	Translations.datePicker = function() {
		if ( !jQuery.datepicker ) {
			return;
		}

		jQuery.datepicker.regional['pt-BR'] = {
			closeText		: 'Fechar',
			prevText		: '&#x3c;Anterior',
			nextText		: 'Pr&oacute;ximo&#x3e;',
			currentText		: 'Hoje',
			monthNames 		: ['Janeiro','Fevereiro','Mar&ccedil;o','Abril','Maio','Junho', 'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
			monthNamesShort : ['Jan','Fev','Mar','Abr','Mai','Jun', 'Jul','Ago','Set','Out','Nov','Dez'],
			dayNames 		: ['Domingo','Segunda-feira','Ter&ccedil;a-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sabado'],
			dayNamesShort 	: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'],
			dayNamesMin 	: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'],
			weekHeader 		: 'Sm',
			dateFormat 		: 'dd/mm/yy',
			firstDay 		: 0,
			isRTL 			: false,
			yearSuffix 		: '',
			showMonthAfterYear: false
		};

		jQuery.datepicker.setDefaults(jQuery.datepicker.regional['pt-BR']);
	};

	Translations.timePicker = function() {
		if ( !jQuery.timepicker ) {
			return;
		}

		jQuery.timepicker.regional['pt-BR'] = {
			timeOnlyTitle: 'Escolha o horário',
			timeText: 'Horário',
			hourText: 'Hora',
			minuteText: 'Minutos',
			secondText: 'Segundos',
			millisecText: 'Milissegundos',
			timezoneText: 'Fuso horário',
			currentText: 'Agora',
			closeText: 'Fechar',
			timeFormat: 'HH:mm',
			amNames: ['a.m.', 'AM', 'A'],
			pmNames: ['p.m.', 'PM', 'P'],
			isRTL: false
		};

		jQuery.timepicker.setDefaults(jQuery.timepicker.regional['pt-BR']);
	};

}, {} );
;MONKEY( 'Utils', function(Utils) {
	
	Utils.addQueryVars = function(params, url) {
		var listParams = [];

		for ( var item in params ) {
			listParams.push( item + '=' + params[ item ] );
		}

		return url + ( url.match(/\/\?/) ? '&' : '?' ) + listParams.join( '&' );
	};

	Utils.getUrlAjax = function() {
		return ( window.AdminGlobalVars || {} ).urlAjax;
	};

}, MONKEY.utils );
;jQuery(function() {
	var context = jQuery( 'body' );

	MONKEY.vars = {
		body : context
	};

	//set route in application
	MONKEY.dispatcher( MONKEY.Application, window.pagenow, [context] );
});
