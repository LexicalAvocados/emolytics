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
      typedPassword: ''
    }
    this.updateTypedUsername = this.updateTypedUsername.bind(this);
    this.updateTypedPassword = this.updateTypedPassword.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
  }

  updateTypedUsername(e) {
    this.setState({typedUsername: e.target.value});
  }

  updateTypedPassword(e) {
    this.setState({typedPassword: e.target.value});
  }

  submitLogin(e) {
    e.preventDefault();
  }

  render() {
    return (
      <div>
        <Form horizontal onSubmit={this.submitLogin}>
          <FormGroup>
            <ControlLabel>Log In</ControlLabel>
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