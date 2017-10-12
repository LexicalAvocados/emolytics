import React from 'react';
<<<<<<< HEAD
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

=======
import { connect } from 'react-redux';
import { changeText} from '../actions';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../actions';
import { Route, Link } from 'react-router-dom';
import Home from './Home.jsx';
import TesterVideo from './tester/testerVideo.jsx';
import OptionHome from './creator/option/optionHome.jsx';
>>>>>>> viz

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
<<<<<<< HEAD
          <Route path="/project/:id" component={ProjectHome}/>
          <Route path="/section/:id" component={SectionHome}/>
=======
          <Route path="/testviz" component={OptionHome}/>
>>>>>>> viz
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
