"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.putSecurities = exports.postSecurities = exports.deleteSecurities = exports.getSecurities = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _joi = _interopRequireDefault(require("@hapi/joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable no-param-reassign */
var schema = _joi["default"].string().regex(/^[а-яА-Я0-9 ]+$/);

var getSecurities = function getSecurities(securities) {
  var findStr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var columns = Object.keys(securities[0]);
  var data = securities.filter(function (item) {
    var secId = item.secId,
        shortName = item.shortName,
        name = item.name,
        emitentTitle = item.emitentTitle,
        regNumber = item.regNumber;
    return findStr === '' ? true : secId.toUpperCase().indexOf(findStr.toUpperCase()) > -1 || shortName.toUpperCase().indexOf(findStr.toUpperCase()) > -1 || name.toUpperCase().indexOf(findStr.toUpperCase()) > -1 || emitentTitle.toUpperCase().indexOf(findStr.toUpperCase()) > -1 || regNumber.toUpperCase().indexOf(findStr.toUpperCase()) > -1;
  }).map(function (item) {
    return Object.values(item);
  });
  return JSON.stringify({
    securities: {
      columns: columns,
      data: data
    }
  }, null, 4);
};

exports.getSecurities = getSecurities;

var deleteSecurities = function deleteSecurities(securities, secId) {
  var index = _lodash["default"].findIndex(securities, function (item) {
    return item.secId.toUpperCase() === secId.toUpperCase();
  });

  if (index === -1) {
    return {
      status: 404,
      send: {
        error: "secid = ".concat(secId, " - not found")
      }
    };
  }

  securities.splice(index, 1);
  return {
    status: 200,
    send: {
      success: "secid = ".concat(secId, " - removed")
    }
  };
};

exports.deleteSecurities = deleteSecurities;

var postSecurities = function postSecurities(securities, queryParams) {
  var secId = queryParams.secid || '';
  var shortName = queryParams.shortname || '';
  var regNumber = queryParams.regnumber || '';
  var name = queryParams.name || '';
  var emitentTitle = queryParams.emitent_title || '';
  var primaryBoardId = queryParams.primary_boardid || '';
  var isTraded = queryParams.is_traded || '';
  secId = secId.trim();
  shortName = shortName.trim();
  regNumber = regNumber.trim();
  name = name.trim();
  emitentTitle = emitentTitle.trim();
  primaryBoardId = primaryBoardId.trim();
  isTraded = isTraded.trim();

  if (secId === '' || shortName === '' || regNumber === '' || name === '' || emitentTitle === '' || primaryBoardId === '' || isTraded === '') {
    return {
      status: 400,
      send: {
        error: 'all fields must be filled in'
      }
    };
  }

  var index = _lodash["default"].findIndex(securities, function (item) {
    return item.secId.toUpperCase() === secId.toUpperCase();
  });

  if (index !== -1) {
    return {
      status: 400,
      send: {
        error: "secid = ".concat(secId, " - already exist")
      }
    };
  }

  var _schema$validate = schema.validate(name),
      error = _schema$validate.error;

  if (error) {
    return {
      status: 400,
      send: {
        error: "\"name\" with value \"".concat(name, "\" fails to match the required pattern: /[\u0430-\u044F\u0410-\u042F0-9 ]/")
      }
    };
  }

  securities.push({
    id: _lodash["default"].uniqueId(),
    secId: secId,
    shortName: shortName,
    regNumber: regNumber,
    name: name,
    emitentTitle: emitentTitle,
    primaryBoardId: primaryBoardId,
    isTraded: isTraded
  });
  return {
    status: 200,
    send: {
      success: "secid = ".concat(secId, " - added")
    }
  };
};

exports.postSecurities = postSecurities;

var putSecurities = function putSecurities(securities, secId, queryParams) {
  var regNumber = queryParams.regnumber || '';
  var name = queryParams.name || '';
  var emitentTitle = queryParams.emitent_title || '';

  var index = _lodash["default"].findIndex(securities, function (item) {
    return item.secId.toUpperCase() === secId.toUpperCase();
  });

  if (index === -1) {
    return {
      status: 404,
      send: {
        error: "secid = ".concat(secId, " - not found")
      }
    };
  }

  regNumber = regNumber.trim();
  name = name.trim();
  emitentTitle = emitentTitle.trim();

  if (name !== '') {
    var _schema$validate2 = schema.validate(name),
        error = _schema$validate2.error;

    if (error) {
      return {
        status: 400,
        send: {
          error: "\"name\" with value \"".concat(name, "\" fails to match the required pattern: /[\u0430-\u044F\u0410-\u042F0-9 ]/")
        }
      };
    }
  }

  if (regNumber !== '') {
    securities[index].regNumber = regNumber;
  }

  if (name !== '') {
    securities[index].name = name;
  }

  if (emitentTitle !== '') {
    securities[index].emitentTitle = emitentTitle;
  }

  return {
    status: 200,
    send: {
      success: "secid = ".concat(secId, " - updated")
    }
  };
};

exports.putSecurities = putSecurities;