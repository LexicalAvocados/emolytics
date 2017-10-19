import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import loggedInUser from './loggedInUser';
import focusGroups from './focusGroups';
import currentFocusGroup from './currentFocusGroup';
import currentProject from './currentProject';
import currentSection from './currentSection';
import currentTesterOption from './currentTesterOption';

const rootReducer = combineReducers({
  loggedInUser,
  focusGroups,
  currentFocusGroup,
  currentProject,
  currentSection,
  currentTesterOption,
  router: routerReducer
});

export default rootReducer;