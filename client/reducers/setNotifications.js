const setNotifications = (state = {}, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATIONS':
      return Object.assign({}, state, action.notifs);
    default:
      return state;
  }
};

export default setNotifications;
