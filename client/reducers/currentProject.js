const currentProject = (state = {}, action) => {
    switch (action.type) {
      case 'CHANGE_CURRENTPROJECT':
        return { currentProject: action.obj }
      default:
        return state
    }
  }
  
  export default currentProject;