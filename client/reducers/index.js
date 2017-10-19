import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import example from './example';
import loggedInUser from './loggedInUser';
import currentProject from './currentProject';
import currentSection from './currentSection';
import currentTesterOption from './currentTesterOption';
import currentOptionAnnotations from './currentOptionAnnotations';
import currentOption from './currentOption';
import annotations from './annotations';
import lineGraphData from './lineGraphData';

const rootReducer = combineReducers({
	example,
  loggedInUser,
  currentProject,
  currentSection,
  currentTesterOption,
  currentOptionAnnotations,
  currentOption,
  annotations,
  lineGraphData,
  router: routerReducer
});

export default rootReducer;
