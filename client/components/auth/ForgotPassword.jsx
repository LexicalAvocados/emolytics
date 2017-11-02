import React from 'react';
import { Col, Form, FormGroup, FieldGroup, FormControl, ControlLabel, Checkbox, Button, ButtonToolbar, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import axios from 'axios';

// React-Redux connect() boilerplate
// NOTE: you may have to modify the filepath for ChangeActions
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../actions';

export class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      good: false,
      err: false,
      send: true
    };
    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);



  }

  handleChange(e) {
    e.preventDefault();
    var name = e.target.name;
    var val = e.target.value;
    this.setState({
      [name]: val
    })
  }

  submit(e) {
    e.preventDefault();
    if (this.state.send) {
      axios.post('/api/auth/forgotPassword', {username: this.state.username})
        .then(res => {
          if (res.data === 'good') {
            this.setState({
              good: true,
              err: false,
              send: false
            })
          } else {
            this.setState({
              err: true,
              good: false
            })
          }
        })
    }

  }


  render() {
    return (
      <div className="forgotPassword">
        <h3> Forgot Password? </h3>
        <br/>
          <Form horizontal className='forgotForm' onSubmit={this.submit} >
            <FormGroup>
              <Col className='forgotInput'>
                <FormControl
                  type='text'
                  name='username'
                  placeholder='Username'
                  value={this.state.username}
                  onChange={this.handleChange}
                />
              </Col>
              <br/>
              <Button className='authSubmit' type='submit'>Submit</Button><br/>
              <br/>
            </FormGroup>
          </Form>
          {this.state.good ? (
            <p> Sent </p>
            ) : this.state.err ? (
            <p> Error </p> 
            ) : ""}
       
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
)(ForgotPassword));
