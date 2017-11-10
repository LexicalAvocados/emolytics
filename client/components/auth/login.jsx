import React from 'react';
import { Col, Form, FormGroup, FieldGroup, FormControl, ControlLabel, Checkbox, Button, ButtonToolbar, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import axios from 'axios';

// React-Redux connect() boilerplate
// NOTE: you may have to modify the filepath for ChangeActions
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../actions';

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typedUsername: '',
      typedPassword: '',
      loginError: null
    };
    this.updateTypedUsername = this.updateTypedUsername.bind(this);
    this.updateTypedPassword = this.updateTypedPassword.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
    this.submitPatreonLogin = this.submitPatreonLogin.bind(this);
    this.resetInputForms = this.resetInputForms.bind(this);
  }

  updateTypedUsername(e) {
    this.setState({typedUsername: e.target.value});
  }

  updateTypedPassword(e) {
    this.setState({typedPassword: e.target.value});
  }

  submitLogin(e) {
    e.preventDefault();
    axios.post('/login', {
      username: this.state.typedUsername,
      password: this.state.typedPassword
    })
      .then(res => {
        if (res.data.loggedIn) {
          let {id, username, name, age, sex, race, isCreator, credits, patreonId} = res.data.userData;
          this.props.actions.setLoggedIn(id, username, name, age, sex, race, isCreator, credits, patreonId);
          if (isCreator) {
            axios.get('/api/creator/getCreatorFocusGroups', {
              params: {
                id
              }
            })
              .then(res => {
                let focusGroups = res.data;
                console.log('focusGroups:', focusGroups);
                if (focusGroups.length > 0) this.props.actions.populateCreatorFocusGroups(focusGroups);
              })
              .catch(err => {
                console.log('Error fetching Creator\'s Focus Groups:', err);
              });
          } else {
            axios.post('/api/tester/getOptionsForTester', {
              id,
              mode: 'queue'
            })
              .then(res => {
                let queue = res.data;
                console.log('queue:', queue);
                if (queue.length > 0) this.props.actions.populateTesterQueue(queue);
              })
              .catch(err => {
                console.log('Error fetching Tester Queue from database:', err);
              })
          }

          this.props.history.push('/');
        } else {
          this.setState({loginError: res.data.reason});
          this.resetInputForms();
        }
      })
      .catch(err => {
        console.log('submitLogin Error:', err);
      });
  }

  submitPatreonLogin() {
    axios.get('/auth/patreon')
  }

  resetInputForms() {
    this.setState({typedUsername: '', typedPassword: ''});
  }

  render() {
    var forgotPassword = {
      textAlign: 'center'
    }
    const patreonOAuthLink =
      `https://patreon.com/oauth2/authorize?response_type=code&client_id=${process.env.PATREON_CLIENTID}&redirect_uri=http://localhost:3000/oauth/patreon/login`;
    return (
      <div className='authBody'>
        <div className='loginModule'>

          <h2 className='loginHeader'>Log In</h2>

          <Form horizontal className='authForm' onSubmit={this.submitLogin}>
            <Col className='authInput'>
              <FormControl
                type='text'
                value={this.state.typedUsername}
                placeholder='Username'
                onChange={this.updateTypedUsername}
              /></Col>
            <Col className='authInput'>
              <FormControl
                type='password'
                value={this.state.typedPassword}
                placeholder='Password'
                onChange={this.updateTypedPassword}
              /></Col>
            <Button className='authSubmit' type='submit'>Submit</Button>
            {<div>this.state.loginError</div> && this.state.loginError}
          </Form>

          <Link to='/forgotPassword' className='forgotPassword'>
            <small> Forgot Password? </small>
          </Link>

          <hr className='standardHR'/>

          <div className='oauthButtons'>
            <a href='/auth/facebook'>
              <img className='fbLoginBtn' src='facebook-login.png'></img>
            </a>
            <a href={patreonOAuthLink}>
              <img className='patreonLoginBtn' src='patreon.jpg'></img>
            </a>
            <a href='/auth/vimeo'>
              <img className='vimeoLoginBtn' src='vimeo-logo.jpg'></img>
            </a>
          </div>

        </div>
      </div>
    );
  }
}


// React-Redux connect() boilerplate
// 1. Include the properties in the Store you want this component to have access to
// 2. Change the Component name at the very end to the one in the current file

const mapStateToProps = (state) => ({
  loggedInUser: state.loggedInUser,
  router: state.router
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Login));
