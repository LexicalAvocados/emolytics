import React from 'react';
import { Form, FormGroup, FieldGroup, FormControl, ControlLabel, Checkbox, Button } from 'react-bootstrap';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { store, bindActionCreators } from 'redux';
import * as ChangeActions from '../../actions';
import axios from 'axios';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typedUsername: '',
      typedPassword: '',
      typedEmail: '',
      isCreator: false
    }
    this.updateTypedUsername = this.updateTypedUsername.bind(this);
    this.updateTypedPassword = this.updateTypedPassword.bind(this);
    this.updateTypedEmail = this.updateTypedEmail.bind(this);
    this.updateIsCreator = this.updateIsCreator.bind(this);
    this.submitNewAccount = this.submitNewAccount.bind(this);
  }

  updateTypedUsername(e) {
    this.setState({typedUsername: e.target.value});
  }

  updateTypedPassword(e) {
    this.setState({typedPassword: e.target.value});
  }

  updateTypedEmail(e) {
    this.setState({typedEmail: e.target.value});
  }

  updateIsCreator(e) {
    this.setState({isCreator: !this.state.isCreator});
  }

  submitNewAccount(e) {
    e.preventDefault();
    axios.post('/signup', {
      username: this.state.typedUsername,
      password: this.state.typedPassword,
      email: this.state.typedEmail,
      isCreator: this.state.isCreator
    })
      .then(res => {
        this.props.actions.setLoggedIn(res.data.userData.username, res.data.userData.isCreator);
        this.props.history.push('/');
      })
      .catch(err => {
        console.log('submitNewAccount Error:', err);
      })
  }

//this.props.history.push('/signin');

  render() {
    return (
      <div>
        <Form horizontal onSubmit={this.submitNewAccount}>
          <FormGroup>
            <ControlLabel>Create New Account</ControlLabel><br/><br/>
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
            <FormControl
              type='text'
              value={this.state.typedEmail}
              placeholder='Email'
              onChange={this.updateTypedEmail}
            /><br/>
            <Checkbox onClick={this.updateIsCreator}>Register as a Creator</Checkbox><br/>
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

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Signup));