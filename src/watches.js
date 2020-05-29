import { watch } from 'melanke-watchjs';
// import _ from 'lodash';
import { buildTable } from './common';

const setWatches = (state) => {
  const { data, form } = state;

  watch(form, 'needMakeTable', () => {
    // console.log(preparationData(data.securities, data.history, form.sortCol));
  });

  watch(form, 'sortCol', () => {
    buildTable(data.securities, data.history, form.sortCol, form.sortDirection);
  });

  watch(form, 'sortDirection', () => {
    buildTable(data.securities, data.history, form.sortCol, form.sortDirection);
  });
};

export default setWatches;
