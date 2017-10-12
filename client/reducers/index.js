import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import example from './example';
import loggedInUser from './loggedInUser';
import currentProject from './currentProject';
import currentSection from './currentSection';

const rootReducer = combineReducers({
	example,
<<<<<<< HEAD
  loggedInUser,
  currentProject,
  currentSection,
  router: routerReducer
=======
  router: routerReducer,
  currentProject: currentProject,
  currentSection: currentSection,
>>>>>>> test
});

export default rootReducer;
