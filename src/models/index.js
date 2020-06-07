import {
  readFileSecurities,
  readFileHistory,
} from '../common';

let securities = {};
let history = [];

readFileSecurities('../xml/securities_1.xml')
  .then((objSecurities) => {
    securities = { ...securities, ...objSecurities };
  });

readFileSecurities('../xml/securities_2.xml')
  .then((objSecurities) => {
    securities = { ...securities, ...objSecurities };
  });

readFileHistory('../xml/history_1.xml')
  .then((arrHistory) => {
    history = [...history, ...arrHistory];
  });

readFileHistory('../xml/history_2.xml')
  .then((arrHistory) => {
    history = [...history, ...arrHistory];
  });

readFileHistory('../xml/history_3.xml')
  .then((arrHistory) => {
    history = [...history, ...arrHistory];
  });

readFileHistory('../xml/history_4.xml')
  .then((arrHistory) => {
    history = [...history, ...arrHistory];
  });

export default {
  securities,
  history,
};
