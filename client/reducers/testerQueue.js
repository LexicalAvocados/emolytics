import { REHYDRATE } from 'redux-persist/constants';

const testerQueue = (state = [], action) => {
  switch (action.type) {
    case 'POPULATE_TESTER_QUEUE':
      return action.queue;
    case 'SET_LOGGED_OUT':
      return [];
    case 'persist/REHYDRATE':
      if (action.payload.testerQueue) return action.payload.testerQueue;
      else return state;
    default:
      return state;
  }
};

export default testerQueue;