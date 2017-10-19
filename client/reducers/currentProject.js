const currentProject = (state = { sections: [] }, action) => {
  switch (action.type) {
    case 'CHANGE_CURRENT_PROJECT':
      return Object.assign({}, state, action.obj);
<<<<<<< HEAD
    case 'ADD_SECTIONS_TO_CURRENT_PROJECT':
      return { ...state, sections: [ ...state.sections, action.sectionObj]};
=======
    case 'SET_LOGGED_OUT':
      return {};
>>>>>>> passport
    default:
      return state;
  }
};

export default currentProject;
<<<<<<< HEAD

// return Object.assign({}, state, {sections: [ ...state.sections, action.sectionObj]});
=======
>>>>>>> passport
