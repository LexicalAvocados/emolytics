import React from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './components/App.jsx';
import reducer from './reducers';
import {changeExample} from './actions';

const store = createStore(reducer);

console.log(store.getState());

store.dispatch(changeExample('Learn about actions'));
console.log(store.getState());


ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>, document.getElementById('app'));