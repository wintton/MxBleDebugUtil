
var g = (function() { return this })() || Function("return this")();

var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

var oldRuntime = hadRuntime && g.regeneratorRuntime;

g.regeneratorRuntime = undefined;

module.exports = require("./runtime");

if (hadRuntime) {
  g.regeneratorRuntime = oldRuntime;
} else {
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}
