'use strict';

function log(level, op, data) {

  var message = JSON.stringify({
    ts: new Date().toISOString(),
    level: level,
    op: op,
    _: data
  });

  switch (level) {
  case 'warn':
  case 'error':
    console.error(message);
    break;
  case 'info':
  default:
    console.log(message);
    break;
  }
}

module.exports.info = function(op, data) {
  log('info', op, data);
};

module.exports.warn = function(op, data) {
  log('warn', op, data);
};

module.exports.error = function(op, data) {
  log('error', op, data);
};