import React from 'react';
import { Form, FormGroup, FieldGroup, FormControl, ControlLabel, Checkbox, Button } from 'react-bootstrap';
import axios from 'axios';

// React-Redux connect() boilerplate
// NOTE: you may have to modify the filepath for ChangeActions
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../actions';

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

// React-Redux connect() boilerplate
// 1. Include the properties in the Store you want this component to have access to
// 2. Change the Component name at the very end to the one in the current file
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

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Login));