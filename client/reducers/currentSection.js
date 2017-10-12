const currentSection = (state = {}, action) => {
    switch (action.type) {
      case 'CHANGE_CURRENTSECTION':
        return Object.assign({}, state, action.obj);
      default:
        return state;
    }
  }
  
  export default currentSection;