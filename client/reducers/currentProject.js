const currentProject = (state = {}, action) => {
    switch (action.type) {
      case 'CHANGE_CURRENTPROJECT':
        return Object.assign({}, state, action.obj);
      default:
        return state
    }
  }
  
  export default currentProject;