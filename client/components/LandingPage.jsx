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
import { Button, Modal } from 'react-bootstrap';

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
      <div className='landingContainer'>
        <div className='landingSectionA'> 
          <div className='aInfo'>
            <h2> Know Your Audiences Emotions  </h2>
            <br/>
            <a href='#section1'><Button>Try it out </Button></a>
          </div>
          <div className='aBackground'>
          </div>

        </div>
        <ScrollableAnchor id={'section1'}>
          <div className="landingSectionB">
            <TryItOutHome tryerId={this.state.tryerId}/>
          </div>
        </ScrollableAnchor>
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
