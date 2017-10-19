import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import example from './example';
import loggedInUser from './loggedInUser';
import currentProject from './currentProject';
import currentSection from './currentSection';
import currentTesterOption from './currentTesterOption';
import signupwithfb from './signupwithfb';

const rootReducer = combineReducers({
	example,
  loggedInUser,
  currentProject,
  currentSection,
  currentTesterOption,
	signupwithfb,
  router: routerReducer
});

export default rootReducer;
