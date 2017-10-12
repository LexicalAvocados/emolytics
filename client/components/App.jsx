import React from 'react';
import { connect } from 'react-redux';
import { changeText} from '../actions';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../actions';
import { Route, Link } from 'react-router-dom';
import Home from './Home.jsx';
import Signup from './auth/signup.jsx';
import Login from './auth/login.jsx';
import TesterVideo from './tester/testerVideo.jsx';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.onClick = this.onClick.bind(this);
    console.log('App: this:', this);
  }

  onClick() {
    this.props.actions.changeExample('changed');
  }

  render() {
    return (
      <div>
        {this.props.example.text}
        <button onClick={this.onClick}> test </button><br/><br/>
        <div>
          <Route exact path="/" component={Home}/>
          <Route exact path="/testvideo" component={TesterVideo}/>
          <Route path="/signup" render={() =>
            <Signup />
          }/>
          <Route path="/login" render={() =>
            <Login />
          }/>
        </div>
      </div>
    )
  }
}



const mapStateToProps = (state) => {
  console.log('state', state);
  return ({
    example: state.example,
    setLoggedIn: state.setLoggedIn,
    router: state.router
  })
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);