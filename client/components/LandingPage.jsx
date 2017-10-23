import React from 'react';
import axios from 'axios';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../actions';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import { Route, Switch, withRouter } from 'react-router-dom';

import ScrollableAnchor from 'react-scrollable-anchor';
import TryItOutHome from './TryItOut/TryItOutHome.jsx';

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTry: false,
      tryerId: 0
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    // axios.post('api/createTryer', {})
    // .then( (res) => {
      this.setState({
        showTry: true
      })
    // })
  }

  render() {
    return (
      <div className='Landingcontainer'>
        <h3> Welcome! </h3>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
          <button onClick={this.handleClick}>Try it out </button>
          {this.state.showTry ? (
          <TryItOutHome tryerId={this.state.tryerId}/>
          ) : ''}
      </div>
    )
  }
};

const mapStateToProps = (state) => {
  console.log('state in LandingPage', state);
  return ({
    router: state.router,
    loggedInUser: state.loggedInUser,
    role: state.signupwithfb
  });
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(LandingPage));
