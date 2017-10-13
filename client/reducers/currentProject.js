const currentProject = (state = {}, action) => {
  switch (action.type) {
    case 'CHANGE_CURRENT_PROJECT':
      return Object.assign({}, state, action.obj);
    default:
      return state;
  }
};
  
export default currentProject;