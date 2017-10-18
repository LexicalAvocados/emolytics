import React from 'react';
import { Col, Form, FormGroup, FieldGroup, FormControl, ControlLabel, Checkbox, Button } from 'react-bootstrap';

// React-Redux connect() boilerplate
// NOTE: you may have to modify the filepath for ChangeActions
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';

class FocusGroupsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typedUsername: ''
    }
    this.updateTypedUsername = this.updateTypedUsername.bind(this);
  }

  updateTypedUsername() {
    this.setState({typedUsername: e.target.value});
  }

  render() {
    return (
      <div>
        <h2>Create a Focus Group</h2>
        <form>
          <FormControl
            type='text'
            value={this.state.typedUsername}
            placeholder='Tester Username'
            onChange={this.updateTypedUsername}
          />
        </form>
      </div>
    )
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
)(FocusGroupsPage));