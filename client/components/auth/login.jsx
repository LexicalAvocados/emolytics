import React from 'react';
import { Form, FormGroup, FieldGroup, FormControl, ControlLabel, Checkbox, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { store, bindActionCreators } from 'redux';
import * as ChangeActions from '../../actions';
import axios from 'axios';

class Login extends React.Component {
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
          this.props.actions.setLoggedIn(res.data.userData.username, res.data.userData.isCreator);
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
      <div>
        <Form horizontal onSubmit={this.submitLogin}>
          <FormGroup>
            {<div>this.state.loginError</div> && this.state.loginError}<br/><br/>
            <ControlLabel>Log In</ControlLabel><br/>
            <FormControl
              type='text'
              value={this.state.typedUsername}
              placeholder='Username'
              onChange={this.updateTypedUsername}
            /><br/>
            <FormControl
              type='password'
              value={this.state.typedPassword}
              placeholder='Password'
              onChange={this.updateTypedPassword}
            /><br/>
            <Button type='submit'>Submit</Button>
          </FormGroup>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
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
)(Login);