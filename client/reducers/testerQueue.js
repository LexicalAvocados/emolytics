const testerQueue = (state = [], action) => {
  switch (action.type) {
    case 'POPULATE_TESTER_QUEUE':
      return action.queue;
    case 'SET_LOGGED_OUT':
      return [];
    default:
      return state;
  }
};

export default testerQueue;