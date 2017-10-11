import React from 'react';
import { Form, FormGroup, FieldGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typedName: '',
      typedPassword: ''
    }
    this.updateTypedName = this.updateTypedName.bind(this);
    this.updateTypedPassword = this.updateTypedPassword.bind(this);
    this.submitNewAccount = this.submitNewAccount.bind(this);
  }

  updateTypedName(e) {
    this.setState({typedName: e.target.value});
  }

  updateTypedPassword(e) {
    this.setState({typedPassword: e.target.value});
  }

  submitNewAccount(e) {
    console.log('e.target.value:', e.target.value);
  }

  render() {
    return (
      <div>
        <Form horizontal onSubmit={this.submitNewAccount}>
          <FormGroup>
            <ControlLabel>Create New Account</ControlLabel><br/>
            <FormControl
              type='text'
              value={this.state.typedName}
              placeholder='Username'
              onChange={this.updateTypedName}
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

export default Signup;