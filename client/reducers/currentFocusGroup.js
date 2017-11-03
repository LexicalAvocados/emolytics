const currentFocusGroup = (state = null, action) => {
  switch (action.type) {
    case 'CHANGE_CURRENT_FOCUS_GROUP':
      return action.focusGroups.reduce((placeholder, group, i) => {
        if (i === action.index) return group;
        else return placeholder;
      }, {});
    case 'SET_NO_CURRENT_FOCUS_GROUP':
      return null;
    case 'ADD_FOCUS_GROUP':
      return null;
    case 'DELETE_FOCUS_GROUP':
      return null;
    case 'SET_LOGGED_OUT':
      return null;
    default:
      return state;
  }
};

export default currentFocusGroup;