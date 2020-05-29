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
