import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import example from './example';

const rootReducer = combineReducers({
  example,
  router: routerReducer
});

export default rootReducer;
<<<<<<< HEAD

=======
>>>>>>> resolved merge conflicts
