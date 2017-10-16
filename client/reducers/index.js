import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import example from './example';
import loggedInUser from './loggedInUser';
import currentProject from './currentProject';
import currentSection from './currentSection';
import currentTesterOption from './currentTesterOption';
import submitProject from './submitProject';

const rootReducer = combineReducers({
	example,
  loggedInUser,
  currentProject,
  currentSection,
  currentTesterOption,
  submitProject,
  router: routerReducer
});

export default rootReducer;
