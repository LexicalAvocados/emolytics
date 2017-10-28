import React from 'react';
import { Col, Form, FormGroup, FieldGroup, FormControl, ControlLabel, Checkbox, Button, ButtonToolbar, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import axios from 'axios';

// React-Redux connect() boilerplate
// NOTE: you may have to modify the filepath for ChangeActions
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../actions';

export class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      password2: '',
      notSame: false,
      success: false,
      fail: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);



  }

  componentDidMount() {
    console.log(this.props.match.params.id);
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
    if (this.state.password !== this.state.password2) {
      this.setState({
        notSame: true
      })
    } else {
      this.setState({
        notSame: false
      })
      axios.post('/api/auth/resetPassword', {link: this.props.match.params.id, password: this.state.password})
        .then(res => {
          if (res.data === 'good') {
            this.setState({
              success: true,
              fail: false
            })
          } else {
            this.setState({
              sucess: false,
              fail: true
            })
          }
        })
    }
  }


  render() {
    return (
      <div className="forgotPassword">
        <h3> Reset Password </h3>
        <br/>
          <Form horizontal className='forgotForm' onSubmit={this.submit} >
            <FormGroup>
              <Col className='forgotInput'>
                <FormControl
                  type='text'
                  name='password'
                  placeholder='Password'
                  value={this.state.password}
                  onChange={this.handleChange}
                />
              </Col>
              <br/>
              <Col className='forgotInput'>
                <FormControl
                  type='text'
                  name='password2'
                  placeholder='Comfirm Password'
                  value={this.state.password2}
                  onChange={this.handleChange}
                />
              </Col>
              <br/>
              <Button className='authSubmit' type='submit'>Submit</Button><br/>
              <br/>
            </FormGroup>
          </Form>
          {this.state.notSame ? (
            <p> Password Not Matching </p>
            ) : ""}
          {this.state.success ? (
            <p> Password Changed </p>
            ) : ""}
          {this.state.fail ? (
            <p> Password Change Failed </p>
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
)(ResetPassword));
