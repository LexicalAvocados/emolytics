import React from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { StripeProvider } from 'react-stripe-elements';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import App from './components/App.jsx';
import rootReducer from './reducers';

const history = createHistory();
const historyMiddleware = routerMiddleware(history);

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(historyMiddleware),
    autoRehydrate()
  ),
  (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
);

persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <StripeProvider apiKey={process.env.STRIPE_APIKEY}>
        <App/>
      </StripeProvider>
    </ConnectedRouter>
  </Provider>, document.getElementById('app'));
