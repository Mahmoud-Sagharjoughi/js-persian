var checks = 0;
function check(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
  checks += 1;
}
function deepEqual(left, right) {
  if (left === right) return true;
  if (!left || !right || typeof left !== 'object' || typeof right !== 'object') return false;
  if (Array.isArray(left) !== Array.isArray(right)) return false;
  var keys = Object.keys(left).sort();
  var otherKeys = Object.keys(right).sort();
  if (keys.length !== otherKeys.length) return false;
  for (var index = 0; index < keys.length; index += 1) {
    if (keys[index] !== otherKeys[index] || !deepEqual(left[keys[index]], right[keys[index]])) return false;
  }
  return true;
}
var assert = {
  strictEqual: function (actual, expected) {
    check(actual === expected, 'Expected ' + String(expected) + ', got ' + String(actual));
  },
  deepEqual: function (actual, expected) { check(deepEqual(actual, expected), 'Values differ'); },
  ok: check,
  throws: function (action, expected) {
    var caught;
    try { action(); } catch (error) { caught = error; }
    check(!!caught, 'Expected an exception');
    if (expected === Error || expected.prototype instanceof Error) {
      check(caught instanceof expected, 'Unexpected exception type: ' + caught);
    } else check(expected(caught) === true, 'Unexpected exception: ' + caught);
  },
};
function require(name) {
  if (name === 'assert') return assert;
  check(name === '../', 'Unexpected regression dependency: ' + name);
  return self.persian;
}
