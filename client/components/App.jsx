import React from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import App from './components/App.jsx';
import rootReducer from './reducers';
import { changeExample } from './actions';

import ProjectHome from './creator/project/projectHome.jsx';
import SectionHome from './creator/section/SectionHome.jsx';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.onClick = this.onClick.bind(this);
    console.log(this);
  }

  onClick() {
    this.props.actions.changeExample('changed');
  }

  render() {
    return (
      <div>
        {this.props.example.text}
        <button onClick={this.onClick}> test </button>
        <div>
          <Route exact path="/" component={Home}/>
          <Route path="/new" component={Home}/>
          <Route path="/testvideo" component={TesterVideo}/>
          <Route path="/project/:id" component={ProjectHome}/>
          <Route path="/section/:id" component={SectionHome}/>
        </div>
      </div>
    )
  }
}



const mapStateToProps = (state) => {
  console.log('state', state);
  return ({
    example: state.example,
    router: state.router
  })
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);