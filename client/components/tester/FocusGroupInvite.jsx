import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../actions';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { Col, Form, FormGroup, FieldGroup, FormControl, Button } from 'react-bootstrap';

class FocusGroupInvite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focusGroup: ""
    }

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
    let data = {
      focusGroupId: this.state.focusGroup
    }
    axios.post('/api/tester/joinFocusGroup', data)
      .then(res => {
        console.log(res);
      })

  }


  render() {
      return (
        <div className="forgotPassword">
        <h3> Join Focus Group </h3>
        <br/>
          <Form horizontal className='forgotForm' onSubmit={this.submit} >
            <FormGroup>
              <Col className='forgotInput'>
                <FormControl
                  type='number'
                  name='focusGroup'
                  placeholder='Focus Group Code'
                  value={this.state.focusGroup}
                  onChange={this.handleChange}
                />
              </Col>
              <br/>
              <Button className='authSubmit' type='submit'>Submit</Button><br/>
              <br/>
            </FormGroup>
          </Form>     
      </div>
      )
    }

};

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
)(FocusGroupInvite));