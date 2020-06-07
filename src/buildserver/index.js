"use strict";

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _fs = require("fs");

var _parsers = require("./parsers");

var _crud = require("./crud");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* const express = require('express');
const path = require('path');
const fs = require('fs');
const parseSecurities2 = require('./parsers');
const parseHistory2 = require('./parsers');
const getSecurities = require('./crud');
const deleteSecurities = require('./crud');
const postSecurities = require('./crud');
const putSecurities = require('./crud');

const fsPromises = fs.promises;
*/
var readFileSecurities = function readFileSecurities(filePath) {
  return _fs.promises.readFile(filePath, 'utf-8').then(function (text) {
    return (0, _parsers.parseSecurities2)(text);
  });
};

var readFileHistory = function readFileHistory(filePath) {
  return _fs.promises.readFile(filePath, 'utf-8').then(function (text) {
    return (0, _parsers.parseHistory2)(text);
  });
};

var securities = [];
var history = [];
var port = process.env.PORT || 5000;
var app = (0, _express["default"])();
app.use(_express["default"]["static"](_path["default"].resolve(__dirname, '../../dist')));
app.get('/api', function (request, reply) {
  reply.send('API is running');
});
app.get('/api/securities/:text', function (request, reply) {
  reply.status(200);
  reply.send((0, _crud.getSecurities)(securities, request.params.text));
});
app.get('/api/securities', function (request, reply) {
  reply.status(200);
  reply.send((0, _crud.getSecurities)(securities));
});
app["delete"]('/api/securities/:secId', function (request, reply) {
  var del = (0, _crud.deleteSecurities)(securities, request.params.secId);
  reply.status(del.status);
  reply.send(del.send);
});
app.put('/api/securities/:secId', function (request, reply) {
  var secId = request.params.secId;
  var put = (0, _crud.putSecurities)(securities, secId, request.query);
  reply.status(put.status);
  reply.send(put.send);
});
app.post('/api/securities/', function (request, reply) {
  var post = (0, _crud.postSecurities)(securities, request.query);
  reply.status(post.status);
  reply.send(post.send);
});
app.get('/api/raw/securities', function (request, reply) {
  reply.send(securities.reduce(function (acc, item) {
    return _objectSpread(_objectSpread({}, acc), {}, _defineProperty({}, item.secId, item));
  }, {}));
});
app.get('/api/raw/history', function (request, reply) {
  reply.send(history);
});
app.listen(port, function () {
  console.log('listen port 5000');
  readFileSecurities('./xml/securities_1.xml').then(function (arrSecurities) {
    securities = [].concat(_toConsumableArray(securities), _toConsumableArray(arrSecurities));
  });
  readFileSecurities('./xml/securities_2.xml', false).then(function (arrSecurities) {
    securities = [].concat(_toConsumableArray(securities), _toConsumableArray(arrSecurities));
  });
  readFileHistory('./xml/history_1.xml').then(function (arrHistory) {
    history = [].concat(_toConsumableArray(history), _toConsumableArray(arrHistory));
  });
  readFileHistory('./xml/history_2.xml').then(function (arrHistory) {
    history = [].concat(_toConsumableArray(history), _toConsumableArray(arrHistory));
  });
  readFileHistory('./xml/history_3.xml').then(function (arrHistory) {
    history = [].concat(_toConsumableArray(history), _toConsumableArray(arrHistory));
  });
  readFileHistory('./xml/history_4.xml').then(function (arrHistory) {
    history = [].concat(_toConsumableArray(history), _toConsumableArray(arrHistory)); // console.log(history);
  });
});
app.use(function (request, reply) {
  reply.status(404);
  console.log("Not found URL: ".concat(request.url));
  reply.send({
    error: 'Not found'
  });
});
app.use(function (err, request, reply) {
  reply.status(err.status || 500);
  console.log("Internal error(".concat(reply.statusCode, "): ").concat(err.message));
  reply.send({
    error: err.message
  });
});