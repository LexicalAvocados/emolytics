const setOptionDemographicsSelection = (state = {}, action) => {
  switch(action.type) {
    case 'SET_OPTION_DEMOGRAPHICS_SELECTION':
      return Object.assign({}, state, action.objectOfArrays);
    case 'SET_LOGGED_OUT':
      return {};
    default:
      return state;
  }
};

export default setOptionDemographicsSelection;
