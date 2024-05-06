module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1712749178006, function(require, module, exports) {
module.exports = require('./lib/node-xlsx');

}, function(modId) {var map = {"./lib/node-xlsx":1712749178007}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1712749178007, function(require, module, exports) {


var debug = require('debug')('node-xlsx');
var fs = require('fs');
var xlsx = require(__dirname + '/xlsx/xlsx.js');

module.exports = {
  parse: function(mixed, options) {
    if(typeof mixed === 'string') mixed = fs.readFileSync(mixed);
    debug('parsed a %d-sized xml', mixed.length);
    return xlsx(mixed.toString('base64'), options);
  },
  build: function(object, options) {
    var data = xlsx(object, options); // [ 'base64', 'zipTime', 'processTime', 'href' ]
    if(!data.base64) return false;
    var buffer = new Buffer(data.base64, 'base64');
    debug('built a %d-sized xml, processTime:%dms, zipTime:%dms', buffer.length, data.processTime, data.zipTime);
    return buffer;
  }
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1712749178006);
})()
//miniprogram-npm-outsideDeps=["debug","fs"]
//# sourceMappingURL=index.js.map