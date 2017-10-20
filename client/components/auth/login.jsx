import React from 'react';
import { Col, Form, FormGroup, FieldGroup, FormControl, ControlLabel, Checkbox, Button, ButtonToolbar, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import axios from 'axios';

// React-Redux connect() boilerplate
// NOTE: you may have to modify the filepath for ChangeActions
import { withRouter } from 'react-router-dom';
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
    }
    this.updateTypedUsername = this.updateTypedUsername.bind(this);
    this.updateTypedPassword = this.updateTypedPassword.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
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
          let {id, username, name, age, sex, race, isCreator} = res.data.userData;
          this.props.actions.setLoggedIn(id, username, name, age, sex, race, isCreator);

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
            axios.post('/api/tester/getTesterQueue', {
              id
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

  resetInputForms() {
    this.setState({typedUsername: '', typedPassword: ''});
  }

  render() {
    return (
      <div className='auth'>
        <h2 className='loginHeader'>Log In</h2>
        <Form horizontal className='authForm' onSubmit={this.submitLogin}>
          <FormGroup>
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
            <Button className='authSubmit' type='submit'>Submit</Button><br/>
            {<div>this.state.loginError</div> && this.state.loginError}
          </FormGroup>
        </Form>
        <hr/>
           <a href='/auth/facebook'>
             <img className='fblogin' src='https://jstarpass.com/resources/img/default/facebook-login.png'></img>
           </a>
      </div>
    )
  }
}

// React-Redux connect() boilerplate
// 1. Include the properties in the Store you want this component to have access to
// 2. Change the Component name at the very end to the one in the current file
const mapStateToProps = (state) => {
  return ({
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
)(Login));
