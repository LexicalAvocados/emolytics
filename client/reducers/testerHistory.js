import { REHYDRATE } from 'redux-persist/constants';

const testerHistory = (state = [], action) => {
  switch (action.type) {
    case 'POPULATE_TESTER_HISTORY':
      return action.history;
    case 'SET_LOGGED_OUT':
      return [];
    case 'persist/REHYDRATE':
      if (action.payload.testerHistory) return action.payload.testerHistory;
      else return state;
    default:
      return state;
  }
};

export default testerHistory;