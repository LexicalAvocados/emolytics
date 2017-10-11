import React from 'react';
import { Form, FormGroup, ControlLabel } from 'react-bootstrap';

class Signup extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Form>
          <FormGroup>
            <ControlLabel>
              Create New Account
            </ControlLabel>
          </FormGroup>
        </Form>
      </div>
    )
  }
}

export default Signup;