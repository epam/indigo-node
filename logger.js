/****************************************************************************
 * Copyright (C) 2015-2016 EPAM Systems
 * 
 * This file is part of Indigo-Node binding.
 * 
 * This file may be distributed and/or modified under the terms of the
 * GNU General Public License version 3 as published by the Free Software
 * Foundation and appearing in the file LICENSE.md  included in the
 * packaging of this file.
 * 
 * This file is provided AS IS with NO WARRANTY OF ANY KIND, INCLUDING THE
 * WARRANTY OF DESIGN, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
 ***************************************************************************/

var LoggerAPI = {
	/* Predefined logging levels. */
	DEBUG: { name: 'DEBUG', desc : 'handles all incoming log messages', level: 1 },
	INFO: { name: 'INFO' , desc : 'can be used as common log messages', level: 2 },
	TIME: { name: 'TIME' , desc : 'profiling level', level: 3 },
	WARN: { name: 'WARN' , desc : 'handles all notices', level: 4 },
	ERROR: { name: 'ERROR', desc : 'handles critical or error log messages', level: 5 },
	OFF: { name: 'OFF', desc : 'switch off all incoming log messages', level: 6 }
};

var LogInner = {
	/* Function which handles all incoming log messages.*/
	logHandler: "function (messages, context) like ",
	/*  Inner class which performs the bulk of the work;
	 *  logContextual instances can be configured independentlyof each other. */
	logContextual : function (defaultContext) {
		this.context = defaultContext;
		this.setLevel(defaultContext.filterLevel);
		this.log = this.info;  /* Convenience alias.*/
	},
	/* Map of logContextual instances by name; used by LoggerAPI.get() to return the same named instance. */
	logContextualByNameMap: {}
};

/*
 *  Set the global logging handler. The supplied function should expect two arguments, the first being an arguments
 *  object with the supplied log messages and the second being a context object which contains a hash of stateful
 *  parameters which the logging function can consume.
 */
LoggerAPI.setHandler = function (func) {
	LogInner.logHandler = func;
};

LogInner.bind = function (scope, func) {
	return function () {
		return func.apply(scope, arguments);
	};
};

LogInner.merge = function () {
	var args = arguments, target = args[0], key, i;
	for (i = 1; i < args.length; i++) {
		for (key in args[i]) {
			if (!(key in target) && args[i].hasOwnProperty(key)) {
				target[key] = args[i][key];
			}
		}
	}
	return target;
};

LogInner.logContextual.prototype = {
	/* Changes the current logging level for the logging instance. */
	setLevel: function (newLevel) {
		/* Ensure the supplied Level object looks valid. */
		if (newLevel && "level" in newLevel) {
			this.context.filterLevel = newLevel;
		}
	},
	/* Is the logger configured to output messages at the supplied level? */
	enabledFor: function (lvl) {
		var filterLevel = this.context.filterLevel;
		return lvl.level >= filterLevel.level;
	},
	debug: function () {
		this.invoke(LoggerAPI.DEBUG, arguments);
	},
	info: function () {
		this.invoke(LoggerAPI.INFO, arguments);
	},
	warn: function () {
		this.invoke(LoggerAPI.WARN, arguments);
	},
	error: function () {
		this.invoke(LoggerAPI.ERROR, arguments);
	},
	time: function (label) {
		if (typeof label === 'string' && label.length > 0) {
			this.invoke(LoggerAPI.TIME, [label, 'start']);
		}
	},
	timeEnd: function (label) {
		if (typeof label === 'string' && label.length > 0) {
			this.invoke(LoggerAPI.TIME, [label, 'end']);
		}
	},
	/* Invokes the logger callback if it's not being filtered. */
	invoke: function (level, msgArgs) {
		if ((typeof (LogInner.logHandler) === "function") && this.enabledFor(level)) {
			LogInner.logHandler(msgArgs, LogInner.merge({ level: level }, this.context));
		}
	}
};

/* Protected instance which all calls to the to level `Logger` module will be routed through. */
var gLogger = new LogInner.logContextual({ filterLevel: LoggerAPI.OFF });
LoggerAPI.enabledFor = LogInner.bind(gLogger, gLogger.enabledFor);
LoggerAPI.debug = LogInner.bind(gLogger, gLogger.debug);
LoggerAPI.time = LogInner.bind(gLogger, gLogger.time);
LoggerAPI.timeEnd = LogInner.bind(gLogger, gLogger.timeEnd);
LoggerAPI.info = LogInner.bind(gLogger, gLogger.info);
LoggerAPI.warn = LogInner.bind(gLogger, gLogger.warn);
LoggerAPI.error = LogInner.bind(gLogger, gLogger.error);
LoggerAPI.log = LoggerAPI.info; /*convenience alias */

/*
 *  Sets the global logging filter level which applies to *all* previously registered, and future Logger instances.
 *  (note that named loggers (retrieved via `LoggerAPI.get`) can be configured independently if required).
 */
LoggerAPI.setLevel = function (level) {
	/* Set the global Logger's level. */
	gLogger.setLevel(level);
	/* Apply this level to all registered contextual loggers. */
	for (var key in LogInner.logContextualByNameMap) {
		if (LogInner.logContextualByNameMap.hasOwnProperty(key)) {
			LogInner.logContextualByNameMap[key].setLevel(level);
		}
	}
};

/*
 *  Retrieve a logContextual instance.  Note that named loggers automatically inherit the global logger's level,
 *   default context and log handler.
 */   
 
LoggerAPI.get = function (name) {
	/* All logger instances are cached so they can be configured ahead of use.*/
	return LogInner.logContextualByNameMap[name] ||
			(LogInner.logContextualByNameMap[name] = new LogInner.logContextual(LogInner.merge({ name: name }, gLogger.context)));
};

/*
 *  Configure and example a Default implementation which writes to the `window.console` (if present).  The
 *  `options` hash can be used to configure the default logLevel and provide a custom message formatter.
 */
LoggerAPI.useDefaults = function (options) {
	options = options || {};
	options.formatter = options.formatter || function defaultMessageFormatter(messages, context) {
		/* Prepend the logger's name to the log message for easy identification. */
		if (context.name) {
			messages.unshift("[" + context.name + "]");
		}
	};
	/* Check for the presence of a logger. */
	if (typeof console === "undefined") {
		return;
	}
	/* Map of timestamps by timer labels used to track `#time` and `#timeEnd()` invocations
	 * in environments that don't offer a native console method. */
	var timerStartTimeByLabelMap = {};
	/* Support for IE8+ (and other, slightly more sane environments) */
	var invokeConsoleMethod = function (hdlr, messages) {
		Function.prototype.apply.call(hdlr, console, messages);
	};
	
	LoggerAPI.setLevel(options.defaultLevel || LoggerAPI.DEBUG);
	LoggerAPI.setHandler(function (messages, context) {
		/* Convert arguments object to Array. */
		messages = Array.prototype.slice.call(messages);
		var hdlr = console.log;
		var timerLabel;
		
		if (context.level === LoggerAPI.TIME) {
			timerLabel = (context.name ? '[' + context.name + '] ' : '') + messages[0];
			if (messages[1] === 'start') {
				if (console.time) {
					console.time(timerLabel);
				}
				else {
					timerStartTimeByLabelMap[timerLabel] = new Date().getTime();
				}
			}
			else {
				if (console.timeEnd) {
					console.timeEnd(timerLabel);
				}
				else {
					invokeConsoleMethod(hdlr, [timerLabel + ': ' + (new Date().getTime() - timerStartTimeByLabelMap[timerLabel]) + 'ms']);
				}
			}
		}
		else {
			/* Delegate through to custom warn/error loggers if present on the console.*/
			if (context.level === LoggerAPI.WARN && console.warn) {
				hdlr = console.warn;
			} else if (context.level === LoggerAPI.ERROR && console.error) {
				hdlr = console.error;
			} else if (context.level === LoggerAPI.INFO && console.info) {
				hdlr = console.info;
			}
			options.formatter(messages, context);
			invokeConsoleMethod(hdlr, messages);
		}
	});
};

module.exports = LoggerAPI;
