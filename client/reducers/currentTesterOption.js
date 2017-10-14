const currentTesterOption = (state = {}, action) => {
  switch (action.type) {
    case 'CHANGE_TESTER_OPTION':
      return Object.assign({}, state, action.obj);
    default:
      return state;
  }
};
  
export default currentTesterOption;