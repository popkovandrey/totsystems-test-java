import xml2js from 'xml2js';
// const xml2js = require('xml2js');

export const parseSecurities = (data, filterSecId = '') => {
  const domParser = new DOMParser();
  const doc = domParser.parseFromString(data, 'text/xml');
  const [...rows] = doc.querySelectorAll('row');

  const securities = rows
    .filter((item) => {
      const secId = item.attributes.getNamedItem('secid').value;
      return (filterSecId === '') ? true : (secId === filterSecId);
    })
    .map((item) => {
      const id = item.attributes.getNamedItem('id').value;
      const secId = item.attributes.getNamedItem('secid').value;
      const shortName = item.attributes.getNamedItem('shortname').value;
      const name = item.attributes.getNamedItem('name').value;
      const emitentTitle = item.attributes.getNamedItem('emitent_title').value;
      const regNumber = item.attributes.getNamedItem('regnumber').value;
      const primaryBoardId = item.attributes.getNamedItem('primary_boardid').value;
      const isTraded = item.attributes.getNamedItem('is_traded').value;

      return {
        id,
        secId,
        shortName,
        name,
        emitentTitle,
        regNumber,
        primaryBoardId,
        isTraded,
      };
    });

  return securities.reduce((acc, item) => ({ ...acc, [item.secId]: item }), {});
};

export const parseHistory = (data) => {
  const domParser = new DOMParser();
  const doc = domParser.parseFromString(data, 'text/xml');
  const datas = doc.querySelectorAll('data');
  const [...rows] = datas[0].querySelectorAll('row');

  const histories = rows.map((item) => {
    const boardId = item.attributes.getNamedItem('BOARDID').value;
    const tradeDate = item.attributes.getNamedItem('TRADEDATE').value;
    const secId = item.attributes.getNamedItem('SECID').value;
    const numTrades = item.attributes.getNamedItem('NUMTRADES').value;
    const val = item.attributes.getNamedItem('VALUE').value;
    const open = item.attributes.getNamedItem('OPEN').value;
    const close = item.attributes.getNamedItem('CLOSE').value;
    const volume = item.attributes.getNamedItem('VOLUME').value;
    const low = item.attributes.getNamedItem('LOW').value;
    const high = item.attributes.getNamedItem('HIGH').value;

    return {
      boardId,
      tradeDate,
      secId,
      numTrades,
      val,
      open,
      close,
      volume,
      low,
      high,
    };
  });

  return histories;
};

export const parseSecurities2 = (data) => {
  let securities = [];

  xml2js.parseString(data, { mergeAttrs: true }, (err, result) => {
    const [...rows] = result.document.data[0].rows[0].row;

    securities = rows
      .map((item) => {
        const id = item.id[0];
        const secId = item.secid[0];
        const shortName = item.shortname[0];
        const name = item.name[0];
        const emitentTitle = item.emitent_title[0];
        const regNumber = item.regnumber[0];
        const primaryBoardId = item.primary_boardid[0];
        const isTraded = item.is_traded[0];

        return {
          id,
          secId,
          shortName,
          name,
          emitentTitle,
          regNumber,
          primaryBoardId,
          isTraded,
        };
      });
  });

  return securities;
};

export const parseHistory2 = (data) => {
  let histories = [];

  xml2js.parseString(data, { mergeAttrs: true }, (err, result) => {
    const [...rows] = result.document.data[0].rows[0].row;

    histories = rows.map((item) => {
      const boardId = item.BOARDID[0];
      const tradeDate = item.TRADEDATE[0];
      const secId = item.SECID[0];
      const numTrades = item.NUMTRADES[0];
      const val = item.VALUE[0];
      const open = item.OPEN[0];
      const close = item.CLOSE[0];
      const volume = item.VOLUME[0];
      const low = item.LOW[0];
      const high = item.HIGH[0];

      return {
        boardId,
        tradeDate,
        secId,
        numTrades,
        val,
        open,
        close,
        volume,
        low,
        high,
      };
    });
  });

  return histories;
};

/* module.exports.parseSecurities = parseSecurities;
module.exports.parseHistory = parseHistory;
module.exports.parseSecurities2 = parseSecurities2;
module.exports.parseHistory2 = parseHistory2;
*/
