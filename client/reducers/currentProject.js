const currentProject = (state = {}, action) => {
  switch (action.type) {
    case 'CHANGE_CURRENT_PROJECT':
      return Object.assign({}, state, action.obj);
    case 'SET_LOGGED_OUT':
      return {};
    default:
      return state;
  }
};

export default currentProject;
