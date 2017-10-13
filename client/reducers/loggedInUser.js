const loggedInUser = (state = {username: undefined, isCreator: undefined, age: undefined, sex: undefined, race: undefined}, action) => {
  switch (action.type) {
    case 'SET_LOGGED_IN':
      return Object.assign({}, state, {username: action.username, isCreator: action.isCreator});
    case 'SET_LOGGED_OUT':
      return {username: undefined, isCreator: undefined, age: undefined, sex: undefined, race: undefined};
    case 'SET_AGE':
      return Object.assign({}, state, {age: action.age});
    case 'SET_SEX':
      return Object.assign({}, state, {sex: action.sex});
    case 'SET_RACE':
      return Object.assign({}, state, {race: action.race});
    default:
      return state;
  }
};

export default loggedInUser;