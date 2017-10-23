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
import { Button, Modal, Col } from 'react-bootstrap';
// import logo from '../photos/testerInfo.png'



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
        <hr/>
        <ScrollableAnchor id={'section2'}>
          <div className="landingSectionB"> 
            <Col md={6} className="landingSectionSub">
              <h3> Creators  </h3>
              <h5> Here are some descriptions about the creators. We should add something for creator to know what they are about to get into.  </h5>
            </Col>

            <Col md={6}>
              <img height="150px" src={'demo.png'} alt={"logo"}/> 
              <br/>
              <br/>
              <img height="200px" src={'emo.png'} alt={"logo"}/> 
              <br/>
              <br/>
              <img height="200px" src={'info.png'} alt={"logo"}/> 
            </Col>


        </div>
        </ScrollableAnchor>

        <ScrollableAnchor id={'section3'}>
          <div className='landingSectionB'> 
                  <hr/>
            <Col md={6}>
              
            </Col>

            <Col md={6} className="landingSectionSub">
              <h3> Testers  </h3>
              <h5> Here are some descriptions about the testers. We should add something for testers to know what they are about to get into.  </h5>
            </Col>

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
