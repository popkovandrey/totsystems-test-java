// import _ from 'lodash';
import { parseSecurities, parseHistory } from './parsers';

export const readFileSecurities = (filePath) => fetch(filePath)
  .then((response) => response.text())
  .then((text) => parseSecurities(text));

export const readFileHistory = (filePath) => fetch(filePath)
  .then((response) => response.text())
  .then((text) => parseHistory(text));

const compareNumbers = (fieldName, sortDirection) => {
  const mapping = {
    asc: (a, b) => a[fieldName] - b[fieldName],
    desc: (a, b) => b[fieldName] - a[fieldName],
  };

  return mapping[sortDirection];
};

const compareStrings = (fieldName, sortDirection) => {
  const mapping = {
    asc: (a, b) => {
      let res = 0;

      if (a[fieldName] > b[fieldName]) {
        res = 1;
      } else if (a[fieldName] === b[fieldName]) {
        res = 0;
      } else {
        res = -1;
      }

      return res;
    },
    desc: (a, b) => {
      let res = 0;

      if (a[fieldName] > b[fieldName]) {
        res = -1;
      } else if (a[fieldName] === b[fieldName]) {
        res = 0;
      } else {
        res = 1;
      }

      return res;
    },
  };

  return mapping[sortDirection];
};

export const preparationData = (securities, history, sort = 'secId', direction = 'asc') => {
  const data = history
    .filter((item) => securities[item.secId])
    .map((item) => {
      const sec = securities[item.secId];

      return { ...item, ...sec };
    });

  const mapping = {
    secId: data.sort(compareStrings(sort, direction)),
    regNumber: data.sort(compareStrings(sort, direction)),
    name: data.sort(compareStrings(sort, direction)),
    emitentTitle: data.sort(compareStrings(sort, direction)),
    tradeDate: data.sort(compareStrings(sort, direction)),
    numTrades: data.sort(compareNumbers(sort, direction)),
    open: data.sort(compareNumbers(sort, direction)),
    close: data.sort(compareNumbers(sort, direction)),
  };

  return mapping[sort];
};

export const buildTable = (securities, history, sortCol, sortDirection) => {
  const table = document.getElementById('table');
  const rawData = preparationData(
    securities,
    history,
    sortCol,
    sortDirection,
  );
  let strData = '';

  strData = rawData.reduce((acc, item) => (`${acc}<tr>
    <td>${item.secId}</td>
    <td>${item.regNumber}</td>
    <td>${item.name}</td>
    <td>${item.emitentTitle}</td>
    <td>${item.tradeDate}</td>
    <td>${item.numTrades}</td>
    <td>${item.open}</td>
    <td>${item.close}</td>
    </tr>`), '');

  table.innerHTML = `<table border=1>
    <caption>Кол-во: ${rawData.length}</caption>
    <tr>
    <th>secid</th>
    <th>regnumber</th>
    <th>name</th>
    <th>emitent_title</th>
    <th>tradedate</th>
    <th>numtrades</th>
    <th>open</th>
    <th>close</th>
    </tr>
    ${strData}
    </table>`;
};
