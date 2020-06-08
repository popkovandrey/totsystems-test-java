"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseHistory2 = exports.parseSecurities2 = exports.parseHistory = exports.parseSecurities = void 0;

var _xml2js = _interopRequireDefault(require("xml2js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var parseSecurities = function parseSecurities(data) {
  var filterSecId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var domParser = new DOMParser();
  var doc = domParser.parseFromString(data, 'text/xml');

  var _doc$querySelectorAll = doc.querySelectorAll('row'),
      _doc$querySelectorAll2 = _toArray(_doc$querySelectorAll),
      rows = _doc$querySelectorAll2.slice(0);

  var securities = rows.filter(function (item) {
    var secId = item.attributes.getNamedItem('secid').value;
    return filterSecId === '' ? true : secId === filterSecId;
  }).map(function (item) {
    var id = item.attributes.getNamedItem('id').value;
    var secId = item.attributes.getNamedItem('secid').value;
    var shortName = item.attributes.getNamedItem('shortname').value;
    var name = item.attributes.getNamedItem('name').value;
    var emitentTitle = item.attributes.getNamedItem('emitent_title').value;
    var regNumber = item.attributes.getNamedItem('regnumber').value;
    var primaryBoardId = item.attributes.getNamedItem('primary_boardid').value;
    var isTraded = item.attributes.getNamedItem('is_traded').value;
    return {
      id: id,
      secId: secId,
      shortName: shortName,
      name: name,
      emitentTitle: emitentTitle,
      regNumber: regNumber,
      primaryBoardId: primaryBoardId,
      isTraded: isTraded
    };
  });
  return securities.reduce(function (acc, item) {
    return _objectSpread(_objectSpread({}, acc), {}, _defineProperty({}, item.secId, item));
  }, {});
};

exports.parseSecurities = parseSecurities;

var parseHistory = function parseHistory(data) {
  var domParser = new DOMParser();
  var doc = domParser.parseFromString(data, 'text/xml');
  var datas = doc.querySelectorAll('data');

  var _datas$0$querySelecto = datas[0].querySelectorAll('row'),
      _datas$0$querySelecto2 = _toArray(_datas$0$querySelecto),
      rows = _datas$0$querySelecto2.slice(0);

  var histories = rows.map(function (item) {
    var boardId = item.attributes.getNamedItem('BOARDID').value;
    var tradeDate = item.attributes.getNamedItem('TRADEDATE').value;
    var secId = item.attributes.getNamedItem('SECID').value;
    var numTrades = item.attributes.getNamedItem('NUMTRADES').value;
    var val = item.attributes.getNamedItem('VALUE').value;
    var open = item.attributes.getNamedItem('OPEN').value;
    var close = item.attributes.getNamedItem('CLOSE').value;
    var volume = item.attributes.getNamedItem('VOLUME').value;
    var low = item.attributes.getNamedItem('LOW').value;
    var high = item.attributes.getNamedItem('HIGH').value;
    return {
      boardId: boardId,
      tradeDate: tradeDate,
      secId: secId,
      numTrades: numTrades,
      val: val,
      open: open,
      close: close,
      volume: volume,
      low: low,
      high: high
    };
  });
  return histories;
};

exports.parseHistory = parseHistory;

var parseSecurities2 = function parseSecurities2(data) {
  var securities = [];

  _xml2js["default"].parseString(data, {
    mergeAttrs: true
  }, function (err, result) {
    var _result$document$data = _toArray(result.document.data[0].rows[0].row),
        rows = _result$document$data.slice(0);

    securities = rows.map(function (item) {
      var id = item.id[0];
      var secId = item.secid[0];
      var shortName = item.shortname[0];
      var name = item.name[0];
      var emitentTitle = item.emitent_title[0];
      var regNumber = item.regnumber[0];
      var primaryBoardId = item.primary_boardid[0];
      var isTraded = item.is_traded[0];
      return {
        id: id,
        secId: secId,
        shortName: shortName,
        name: name,
        emitentTitle: emitentTitle,
        regNumber: regNumber,
        primaryBoardId: primaryBoardId,
        isTraded: isTraded
      };
    });
  });

  return securities;
};

exports.parseSecurities2 = parseSecurities2;

var parseHistory2 = function parseHistory2(data) {
  var histories = [];

  _xml2js["default"].parseString(data, {
    mergeAttrs: true
  }, function (err, result) {
    var _result$document$data2 = _toArray(result.document.data[0].rows[0].row),
        rows = _result$document$data2.slice(0);

    histories = rows.map(function (item) {
      var boardId = item.BOARDID[0];
      var tradeDate = item.TRADEDATE[0];
      var secId = item.SECID[0];
      var numTrades = item.NUMTRADES[0];
      var val = item.VALUE[0];
      var open = item.OPEN[0];
      var close = item.CLOSE[0];
      var volume = item.VOLUME[0];
      var low = item.LOW[0];
      var high = item.HIGH[0];
      return {
        boardId: boardId,
        tradeDate: tradeDate,
        secId: secId,
        numTrades: numTrades,
        val: val,
        open: open,
        close: close,
        volume: volume,
        low: low,
        high: high
      };
    });
  });

  return histories;
};

exports.parseHistory2 = parseHistory2;