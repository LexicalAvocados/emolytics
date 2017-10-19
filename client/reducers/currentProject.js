const currentProject = (state = { sections: [] }, action) => {
  switch (action.type) {
    case 'CHANGE_CURRENT_PROJECT':
      return Object.assign({}, state, action.obj);
    case 'ADD_SECTIONS_TO_CURRENT_PROJECT':
      return { ...state, sections: [ ...state.sections, action.sectionObj]};
    case 'SET_LOGGED_OUT':
      return {};
    default:
      return state;
  }
};

export default currentProject;
