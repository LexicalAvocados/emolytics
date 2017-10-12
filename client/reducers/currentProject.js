const currentProject = (state = {}, action) => {
    switch (action.type) {
      case 'CHANGE_CURRENTPROJECT':
        return state['currentProject'] = action.obj;
      case 'ADD_OPTION_TO_CURRENTPROJECT':
        return state['options'] = action.arr;
      default:
        return state
    }
  }
  
  export default currentProject;