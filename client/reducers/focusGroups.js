import { REHYDRATE } from 'redux-persist/constants';

const focusGroups = (state = [], action) => {
  let focusGroupIdx = state.reduce((acc, group, i) => {
    if (group.name === action.focusGroupName) return i;
    else return acc;
  }, -1);

  switch (action.type) {
    case 'ADD_FOCUS_GROUP':
      return [...state, {name: action.focusGroupName, testers: []}];
    case 'DELETE_FOCUS_GROUP':
      return [...state.slice(0, focusGroupIdx), ...state.slice(focusGroupIdx + 1)];
    case 'ADD_TESTER_TO_FOCUS_GROUP':
      let focusGroup = state[focusGroupIdx];
      focusGroup.testers = [...focusGroup.testers, action.testerName]
      return [...state.slice(0, focusGroupIdx), focusGroup, ...state.slice(focusGroupIdx + 1)];
    case 'REMOVE_TESTER_FROM_FOCUS_GROUP':
      let focusGroup = state[focusGroupIdx];
      let testerIdx = focusGroup.indexOf(action.testerName);
      focusGroup.testers = [...focusGroup.testers.slice(0, testerIdx), ...focusGroup.testers.slice(testerIdx + 1)];
      return [...state.slice(0, focusGroupIdx), focusGroup, ...state.slice(focusGroupIdx + 1)];
    case 'persist/REHYDRATE':
      if (action.payload.focusGroups) return action.payload.focusGroups;
      else return state;
  }
};

export default focusGroups;