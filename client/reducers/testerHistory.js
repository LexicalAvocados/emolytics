const testerHistory = (state = [], action) => {
  switch (action.type) {
    case 'POPULATE_TESTER_HISTORY':
      return action.history;
    case 'SET_LOGGED_OUT':
      return [];
    default:
      return state;
  }
};

export default testerHistory;