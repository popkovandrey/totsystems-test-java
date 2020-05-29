import { readFileSecurities, readFileHistory } from './common';
import setWatches from './watches';

const app = () => {
  const state = {
    data: {
      securities: {},
      history: [],
    },
    form: {
      needMakeTable: null,
      sortCol: 'secId',
      sortDirection: 'asc',
    },
  };

  const selectSortField = document.getElementById('select_sort_field');
  const selectSortDerection = document.getElementById('select_sort_direction');

  console.log('Hello, world!');

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
    });

  console.log(state);

  selectSortField.addEventListener('change', (evt) => {
    state.form.sortCol = evt.target.value;
    // state.form.needMakeTable = Date.now();
  });

  selectSortDerection.addEventListener('change', (evt) => {
    state.form.sortDirection = evt.target.value;
  });

  setWatches(state);
};

export default app;
