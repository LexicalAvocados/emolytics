import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import example from './example';
import loggedInUser from './loggedIn';

const rootReducer = combineReducers({
	example,
  loggedInUser,
  router: routerReducer
});

export default rootReducer;