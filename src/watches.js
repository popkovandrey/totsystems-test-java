import { watch } from 'melanke-watchjs';
// import _ from 'lodash';
import { updateTable } from './common';

const setWatches = (state) => {
  const { data, form } = state;
  const selectFilterTradeDate = document.getElementById('select_filter_trade_date');
  const buttonQuerySec = document.getElementById('button_query_sec');

  watch(data, 'history', () => {
    const arrTradeDate = data.history.map((item) => item.tradeDate);
    const set = new Set(arrTradeDate);
    const str = Array.from(set).reduce((acc, item) => (
      `${acc}<option value="${item}">${item}</option>`
    ), '');

    selectFilterTradeDate.innerHTML = `<option value="">все даты</option>${str}`;
  });

  watch(form, ['sortCol', 'sortDirection', 'filterEmitent', 'filterTradeDate'], () => {
    updateTable(state);
  });

  watch(form, 'processQuery', () => {
    switch (form.processQuery) {
      case 'sending':
        buttonQuerySec.disabled = true;
        buttonQuerySec.textContent = '...запрос';

        break;
      case 'finished':
        buttonQuerySec.disabled = false;
        buttonQuerySec.textContent = 'Запросить';

        break;
      default:
        break;
    }
  });
};

export default setWatches;
