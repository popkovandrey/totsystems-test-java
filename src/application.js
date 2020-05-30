import {
  readFileSecurities,
  readFileHistory,
  querySecurities,
  updateTable,
} from './common';
import setWatches from './watches';

const app = () => {
  const state = {
    data: {
      securities: {},
      history: [],
    },
    form: {
      sortCol: '',
      sortDirection: 'asc',
      filterEmitent: '',
      filterTradeDate: '',
      querySecurities: '',
    },
  };

  const selectSortField = document.getElementById('select_sort_field');
  const selectSortDerection = document.getElementById('select_sort_direction');
  const inputEmitent = document.getElementById('input_emitent');
  const selectFilterTradeDate = document.getElementById('select_filter_trade_date');
  const buttonQuerySec = document.getElementById('button_query_sec');
  const spanQuery = document.getElementById('span_query');

  readFileSecurities('/xml/securities_1.xml')
    .then((objSecurities) => {
      state.data.securities = { ...state.data.securities, ...objSecurities };
    });

  readFileSecurities('/xml/securities_2.xml')
    .then((objSecurities) => {
      state.data.securities = { ...state.data.securities, ...objSecurities };
    });

  readFileHistory('/xml/history_1.xml')
    .then((arrHistory) => {
      state.data.history = [...state.data.history, ...arrHistory];
    });

  readFileHistory('/xml/history_2.xml')
    .then((arrHistory) => {
      state.data.history = [...state.data.history, ...arrHistory];
    });

  readFileHistory('/xml/history_3.xml')
    .then((arrHistory) => {
      state.data.history = [...state.data.history, ...arrHistory];
    });

  readFileHistory('/xml/history_4.xml')
    .then((arrHistory) => {
      state.data.history = [...state.data.history, ...arrHistory];
      state.form.sortCol = 'secId';
    });

  console.log(state);

  selectSortField.addEventListener('change', (evt) => {
    state.form.sortCol = evt.target.value;
  });

  selectSortDerection.addEventListener('change', (evt) => {
    state.form.sortDirection = evt.target.value;
  });

  inputEmitent.addEventListener('change', (evt) => {
    state.form.filterEmitent = evt.target.value.trim().toUpperCase();
  });

  selectFilterTradeDate.addEventListener('change', (evt) => {
    state.form.filterTradeDate = evt.target.value;
  });

  buttonQuerySec.addEventListener('click', () => {
    const filtred = state.data.history
      .filter((item) => !state.data.securities[item.secId]);

    if (filtred.length === 0) {
      spanQuery.innerHTML = 'нет "неопознанных" историй';

      return;
    }

    const arrSecId = filtred.map((item) => item.secId);

    const setSecId = new Set(arrSecId);

    Array.from(setSecId).forEach((item, index, arr) => {
      querySecurities(item)
        .then((objSecurities) => {
          spanQuery.innerHTML = `${item}...done`;
          state.data.securities = { ...state.data.securities, ...objSecurities };

          if (index === (arr.length - 1)) {
            updateTable(state);
          }
        });
    });
  });

  setWatches(state);
};

export default app;
