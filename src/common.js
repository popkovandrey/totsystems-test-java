// import _ from 'lodash';
import axios from 'axios';
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

const preparationData = (securities, history, filterEmitent, filterTradeDate, sort = 'secId', direction = 'asc') => {
  const data = history
    .filter((item) => securities[item.secId])
    .filter((item) => {
      const { tradeDate } = item;

      return (filterTradeDate === '') ? true : (tradeDate === filterTradeDate);
    })
    .filter((item) => {
      const emitent = securities[item.secId].emitentTitle.toUpperCase();

      return (filterEmitent === '') ? true : (emitent.indexOf(filterEmitent) !== -1);
    })
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

const buildTable = (data) => {
  const table = document.getElementById('table');
  let strData = '';

  strData = data.reduce((acc, item) => (`${acc}<tr>
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
    <caption><b>Кол-во: ${data.length}</b></caption>
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

export const updateTable = (state) => {
  const { data, form } = state;

  const tableData = preparationData(
    data.securities,
    data.history,
    form.filterEmitent,
    form.filterTradeDate,
    form.sortCol,
    form.sortDirection,
  );

  buildTable(tableData);
};

export const querySecurities = (textQuery) => {
  const url = 'http://iss.moex.com/iss/securities.xml';

  return axios.get(url, {
    params: {
      q: textQuery,
    },
  })
    .then((response) => parseSecurities(response.data, textQuery))
    .catch(console.log);
};
