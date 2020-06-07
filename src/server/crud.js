/* eslint-disable no-param-reassign */
import _ from 'lodash';
import Joi from '@hapi/joi';

// const _ = require('lodash');
// const Joi = require('@hapi/joi');

const schema = Joi.string().regex(/^[а-яА-Я0-9 ]+$/);

export const getSecurities = (securities, findStr = '') => {
  const columns = Object.keys(securities[0]);
  const data = securities
    .filter((item) => {
      const {
        secId,
        shortName,
        name,
        emitentTitle,
        regNumber,
      } = item;

      return findStr === ''
        ? true
        : (secId.toUpperCase().indexOf(findStr.toUpperCase()) > -1)
          || (shortName.toUpperCase().indexOf(findStr.toUpperCase()) > -1)
          || (name.toUpperCase().indexOf(findStr.toUpperCase()) > -1)
          || (emitentTitle.toUpperCase().indexOf(findStr.toUpperCase()) > -1)
          || (regNumber.toUpperCase().indexOf(findStr.toUpperCase()) > -1);
    })
    .map((item) => Object.values(item));

  return JSON.stringify({
    securities: {
      columns,
      data,
    },
  }, null, 4);
};

export const deleteSecurities = (securities, secId) => {
  const index = _.findIndex(securities, (item) => (
    item.secId.toUpperCase() === secId.toUpperCase()
  ));

  if (index === -1) {
    return {
      status: 404,
      send: {
        error: `secid = ${secId} - not found`,
      },
    };
  }

  securities.splice(index, 1);

  return {
    status: 200,
    send: {
      success: `secid = ${secId} - removed`,
    },
  };
};

export const postSecurities = (securities, queryParams) => {
  let secId = queryParams.secid || '';
  let shortName = queryParams.shortname || '';
  let regNumber = queryParams.regnumber || '';
  let name = queryParams.name || '';
  let emitentTitle = queryParams.emitent_title || '';
  let primaryBoardId = queryParams.primary_boardid || '';
  let isTraded = queryParams.is_traded || '';

  secId = secId.trim();
  shortName = shortName.trim();
  regNumber = regNumber.trim();
  name = name.trim();
  emitentTitle = emitentTitle.trim();
  primaryBoardId = primaryBoardId.trim();
  isTraded = isTraded.trim();

  if (secId === ''
    || shortName === ''
    || regNumber === ''
    || name === ''
    || emitentTitle === ''
    || primaryBoardId === ''
    || isTraded === '') {
    return {
      status: 400,
      send: {
        error: 'all fields must be filled in',
      },
    };
  }

  if (_.findIndex(securities, (item) => (item.secId === secId)) !== -1) {
    return {
      status: 400,
      send: {
        error: `secid = ${secId} - already exist`,
      },
    };
  }

  const { error } = schema.validate(name);

  if (error) {
    return {
      status: 400,
      send: {
        error: `"name" with value "${name}" fails to match the required pattern: /[а-яА-Я0-9 ]/`,
      },
    };
  }

  securities.push({
    id: _.uniqueId(),
    secId,
    shortName,
    regNumber,
    name,
    emitentTitle,
    primaryBoardId,
    isTraded,
  });

  return {
    status: 200,
    send: {
      success: `secid = ${secId} - added`,
    },
  };
};

export const putSecurities = (securities, secId, queryParams) => {
  let regNumber = queryParams.regnumber || '';
  let name = queryParams.name || '';
  let emitentTitle = queryParams.emitent_title || '';

  const index = _.findIndex(securities, (item) => (item.secId === secId));

  if (index === -1) {
    return {
      status: 404,
      send: {
        error: `secid = ${secId} - not found`,
      },
    };
  }

  regNumber = regNumber.trim();
  name = name.trim();
  emitentTitle = emitentTitle.trim();

  if (name !== '') {
    const { error } = schema.validate(name);

    if (error) {
      return {
        status: 400,
        send: {
          error: `"name" with value "${name}" fails to match the required pattern: /[а-яА-Я0-9 ]/`,
        },
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
      success: `secid = ${secId} - updated`,
    },
  };
};

/* module.exports.getSecurities = getSecurities;
module.exports.deleteSecurities = deleteSecurities;
module.exports.postSecurities = postSecurities;
module.exports.putSecurities = putSecurities;
*/
