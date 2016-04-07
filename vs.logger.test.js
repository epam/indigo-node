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

/* declaration of modules  */
var assert = require('assert');
var Logger = require('../indigo-node/logger');

console.log('Test Logger');
console.log('should return Logger object');
assert.equal(true, Logger.hasOwnProperty('DEBUG'));
assert.equal(true, Logger.DEBUG.hasOwnProperty('level')); // the mainest property 
assert.equal(true, Logger.DEBUG.hasOwnProperty('name'));
assert.equal(true, Logger.DEBUG.hasOwnProperty('desc'));
assert.equal(true, Logger.hasOwnProperty('INFO'));
assert.equal(true, Logger.INFO.hasOwnProperty('level')); // the mainest property 
assert.equal(true, Logger.INFO.hasOwnProperty('name'));
assert.equal(true, Logger.INFO.hasOwnProperty('desc'));


var calls = [];
Logger.setHandler(function (messages, context) {
	calls.push({ messages: messages, context: context });
});
// Enable all log messages.
Logger.setLevel(Logger.DEBUG);

// Route some messages through to the logFunc.
Logger.debug("A debug message");
Logger.info("An info message");
Logger.warn("A warning message");
Logger.error("An error message");

// Check they were received.
assert.equal(calls[0].messages[0], "A debug message");
assert.strictEqual(calls[0].context.level, Logger.DEBUG);

assert.equal(calls[1].messages[0], "An info message");
assert.strictEqual(calls[1].context.level, Logger.INFO);

assert.equal(calls[2].messages[0], "A warning message");
assert.strictEqual(calls[2].context.level, Logger.WARN);

assert.equal(calls[3].messages[0], "An error message");
assert.strictEqual(calls[3].context.level, Logger.ERROR);

// Create a couple of named loggers (typically in their own module)
var loggerA = Logger.get('LoggerA');
var loggerB = Logger.get('LoggerB');

calls = [];
Logger.debug("A debug message");
Logger.info("An info message");
Logger.time("A time message");
Logger.warn("A warning message");
loggerB.error(['An error message', 'An error message 2']);
Logger.error("An error message");

// Check they were received.
assert.equal(calls[0].messages[0], "A debug message");
assert.strictEqual(calls[0].context.level, Logger.DEBUG);

assert.equal(calls[1].messages[0], "An info message");
assert.strictEqual(calls[1].context.level, Logger.INFO);

assert.equal(calls[2].messages[0], "A time message");
assert.strictEqual(calls[2].context.level, Logger.TIME);

assert.equal(calls[3].messages[0], "A warning message");
assert.strictEqual(calls[3].context.level, Logger.WARN);

assert.equal((calls[4].messages[0])[0], "An error message");
assert.strictEqual(calls[4].context.level, Logger.ERROR);

assert.equal(calls[5].messages[0], "An error message");
assert.strictEqual(calls[5].context.level, Logger.ERROR);

calls = [];
/* Only log WARN and ERROR messages. */
Logger.setLevel(Logger.WARN);
Logger.debug("A debug message"); // ingnore
Logger.warn("A warning message");

assert.equal(calls[0].messages[0], "A warning message");
assert.strictEqual(calls[0].context.level, Logger.WARN);

Logger.setLevel(Logger.TIME);
Logger.timeEnd('prof time'); // logs: 'prof time: 1022ms'.
assert.equal(calls[1].messages[0], "prof time");
assert.strictEqual(calls[1].context.level, Logger.TIME);
calls = [];
Logger.setLevel(Logger.OFF);
Logger.error("Nothing");
assert.equal(calls.length, 0);

Logger.useDefaults({
	logLevel: Logger.WARN,
	filterLevel: Logger.WARN,
	formatter: function (messages, context) {
		messages.unshift('[MyApp]');
		if (context.name) messages.unshift('[' + context.name + ']');
		calls.push({ messages: messages, context: context });
	}
})

loggerA.debug("A debug message");
loggerA.info("An info message");
loggerA.time("A time message"); // ignore
loggerA.warn("A warning message");
loggerA.error("An error message");

// Check they were received.
assert.deepStrictEqual(calls[0].messages, ["[LoggerA]", "[MyApp]", "A debug message"]);
assert.strictEqual(calls[0].context.level, Logger.DEBUG);

assert.deepStrictEqual(calls[1].messages, ["[LoggerA]", "[MyApp]", "An info message"]);
assert.strictEqual(calls[1].context.level, Logger.INFO);

assert.deepStrictEqual(calls[2].messages, ["[LoggerA]", "[MyApp]", "A warning message"]);
assert.equal(calls[2].messages[2], "A warning message");
assert.strictEqual(calls[2].context.level, Logger.WARN);

assert.deepStrictEqual(calls[3].messages, ["[LoggerA]", "[MyApp]", "An error message"]);
assert.equal(calls[3].messages[2], "An error message");
assert.strictEqual(calls[3].context.level, Logger.ERROR);

