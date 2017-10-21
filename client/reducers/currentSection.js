const currentSection = (state = { options: [] }, action) => {
  switch (action.type) {
    case 'CHANGE_CURRENT_SECTION':
      return Object.assign({}, state, state.options = [], action.obj);
    case 'CHANGE_CURRENT_OPTION':
      // return Object.assign({}, state, action.optionObj);
      return { ...state, option: action.optionObj }
    case 'ADD_OPTIONS_TO_CURRENT_SECTION':
      return { ...state, options: [...action.optionObj]};
      // return { ...state, option: action.optionObj };
    case 'REMOVE_OPTION_FROM_OPTIONS':
      return { ...state, options: [ ...action.obj ]};
    case 'ADD_FEEDBACK_TO_OPTION':
      return { ...state, options: [ ...state.options], option: { ...state.option, feedback: action.feedbackString }}
    case 'SET_LOGGED_OUT':
      return {};
    default:
      return state;
  }
}

  export default currentSection;
