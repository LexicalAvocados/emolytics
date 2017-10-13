import React from 'react';
import { Link } from 'react-router-dom';

// React-Redux connect() boilerplate
// NOTE: you may have to modify the filepath for ChangeActions
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../actions';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {
          this.props.loggedInUser.username ? (
            this.props.loggedInUser.isCreator ? (
              <div className='navContainer' style={navbarContainerStyle}>
                <Link to='/' style={noUnderline}>
                  <p className='navItem'>Home</p>
                </Link>
                <Link to='/createProject' style={noUnderline}>
                  <p className='navItem'>Create Project</p>
                </Link>
                <Link to='/' style={noUnderline} onClick={this.props.actions.setLoggedOut}>
                  <p className='navItem'>Log out</p>
                </Link>
              </div>
            ) : (
              <div className='navContainer' style={navbarContainerStyle}>
                <Link to='/' style={noUnderline}>
                  <p className='navItem'>Home</p>
                </Link>
                <Link to='/login' style={noUnderline} onClick={this.props.actions.setLoggedOut}>
                  <p className='navItem'>Log Out</p>
                </Link>
              </div>
            )
          ) : (
            <div className='navContainer' style={navbarContainerStyle}>
              <Link to='/login' style={noUnderline}>
                <p className='navItem'>Log in</p>
              </Link>
              <Link to='/signup' style={noUnderline}>
                <p className='navItem'>Sign up</p>
              </Link>
            </div>
          )
        }
      </div>
    )
  }
}

const navbarContainerStyle = {
  float: "right",
  display: "flex",
  padding: "10px",
  marginRight: "3%"
}

const noUnderline = {
  textDecoration: "none"
}

// React-Redux connect() boilerplate
// 1. Include the properties in the Store you want this component to have access to
// 2. Change the Component name at the very end to the one in the current file
const mapStateToProps = (state) => {
  console.log('state', state);
  return ({
    example: state.example,
    loggedInUser: state.loggedInUser,
    router: state.router
  })
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar));
