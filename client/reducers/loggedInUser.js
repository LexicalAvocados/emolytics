const loggedInUser = (state = {username: null, isCreator: false}, action) => {
  switch (action.type) {
    case 'SET_LOGGED_IN':
      let newState = Object.assign({}, state);
      newState.username = action.username;
      newState.isCreator = action.isCreator;
      return newState;
    case 'SET_LOGGED_OUT':
      return {username: null, isCreator: false};
    default:
      return state;
  }
};

export default loggedInUser;