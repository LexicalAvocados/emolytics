import { REHYDRATE } from 'redux-persist/constants';

const focusGroups = (state = [], action) => {
  let focusGroupIdx = state.reduce((acc, group, i) => {
    if (group.name === action.focusGroupName) return i;
    else return acc;
  }, -1);

  if (focusGroupIdx > -1) {
    let focusGroup = state[focusGroupIdx];
  }

  switch (action.type) {
    case 'ADD_FOCUS_GROUP':
      return [...state, {name: action.focusGroupName, testers: []}];
    case 'DELETE_FOCUS_GROUP':
      return [...state.slice(0, focusGroupIdx), ...state.slice(focusGroupIdx + 1)];
    case 'ADD_TESTER_TO_FOCUS_GROUP':
      focusGroup.testers = [...focusGroup.testers, action.testerUsername]
      return [...state.slice(0, focusGroupIdx), focusGroup, ...state.slice(focusGroupIdx + 1)];
    case 'REMOVE_TESTER_FROM_FOCUS_GROUP':
      let testerIdx = focusGroup.indexOf(action.testerUsername);
      focusGroup.testers = [...focusGroup.testers.slice(0, testerIdx), ...focusGroup.testers.slice(testerIdx + 1)];
      return [...state.slice(0, focusGroupIdx), focusGroup, ...state.slice(focusGroupIdx + 1)];
    case 'persist/REHYDRATE':
      if (action.payload.focusGroups) return action.payload.focusGroups;
      else return state;
    default:
      return state;
  }
};

export default focusGroups;