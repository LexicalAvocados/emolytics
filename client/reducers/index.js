import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import loggedInUser from './loggedInUser';
import focusGroups from './focusGroups';
import currentProject from './currentProject';
import currentSection from './currentSection';
import currentTesterOption from './currentTesterOption';

const rootReducer = combineReducers({
  loggedInUser,
  focusGroups,
  currentProject,
  currentSection,
  currentTesterOption,
  router: routerReducer
});

export default rootReducer;
