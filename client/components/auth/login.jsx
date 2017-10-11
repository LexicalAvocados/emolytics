import React from 'react';
import { Form, FormGroup, ControlLabel } from 'react-bootstrap';

class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Form>
          <FormGroup>
            <ControlLabel>
              Log In
            </ControlLabel>
          </FormGroup>
        </Form>
      </div>
    )
  }
}

export default Login;