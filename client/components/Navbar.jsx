import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// React-Redux connect() boilerplate
// NOTE: you may have to modify the filepath for ChangeActions
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../actions';

export class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    this.props.actions.setLoggedOut();
    axios.get('/logout');
  }

  render() {
    return (
      <div className="navBar">
        <div className="websiteTitle">
          <Link to='/'>
            <h4>Emolytics</h4>
          </Link>
        </div>
        {
          this.props.loggedInUser.username ? (
            this.props.loggedInUser.isCreator || this.props.role.isCreator ? (
              <div className='navContainer'>
                <Link to='/' style={noUnderline}>
                  <p className='navItem'>Home</p>
                </Link>
                <Link to='/createProject' style={noUnderline}>
                  <p className='navItem'>Create</p>
                </Link>
                <Link to='/groups' style={noUnderline}>
                  <p className='navItem'>Groups</p>
                </Link>
                <Link to='/account' style={noUnderline}>
                  <p className='navItem'>Account</p>
                </Link>
                <Link to='/login' style={noUnderline} onClick={this.handleLogout}>
                  <p className='navItem'>Log Out</p>
                </Link>
              </div>
            ) : (
              <div className='navContainer' style={navbarContainerStyle}>
                <Link to='/' style={noUnderline}>
                  <p className='navItem'>Home</p>
                </Link>
                <Link to='/queue' style={noUnderline}>
                  <p className='navItem'>Queue</p>
                </Link>
                <Link to='/history' style={noUnderline}>
                  <p className='navItem'>History</p>
                </Link>
                <Link to='/account' style={noUnderline}>
                  <p className='navItem'>Account</p>
                </Link>
                <Link to='/browse' style={noUnderline}>
                  <p className='navItem'>Browse</p>
                </Link>
                <Link to='/login' style={noUnderline} onClick={this.props.actions.setLoggedOut}>
                  <p className='navItem'>Log Out</p>
                </Link>
              </div>
            )
          ) : (
            <div className='navContainer' style={navbarContainerStyle}>
              <Link to='/login' style={noUnderline}>
                <p className='navItem'>Log In</p>
              </Link>
              <Link to='/signup' style={noUnderline}>
                <p className='navItem'>Sign Up</p>
              </Link>
            </div>
          )
        }
      </div>
    )
  }
}

const navbarContainerStyle = {
  // float: "right",
  // display: "flex",
  // padding: "0px 3% 3% 3%",
  // marginLeft: "3%",
  // right: 0,
  // fontSize: "20px"
};

const noUnderline = {
  textDecoration: 'none'
};

// React-Redux connect() boilerplate
// 1. Include the properties in the Store you want this component to have access to
// 2. Change the Component name at the very end to the one in the current file
const mapStateToProps = (state) => ({
  loggedInUser: state.loggedInUser,
  role: state.signupwithfb,
  router: state.router
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar));
