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
      typedFocusGroupName: '',
      typedTesterUsername: '',
      focusGroupList: [],
      selectedFocusGroup: ''
    }
    this.updateTypedTesterUsername = this.updateTypedTesterUsername.bind(this);
    this.updateTypedFocusGroupName = this.updateTypedFocusGroupName.bind(this);
    this.createNewFocusGroup = this.createNewFocusGroup.bind(this);
    this.addTesterToFocusGroup = this.addTesterToFocusGroup.bind(this);
  }

  updateTypedTesterUsername(e) {
    this.setState({typedUsername: e.target.value});
  }

  updateTypedFocusGroupName(e) {
    this.setState({typedFocusGroupName: e.target.value})
  }

  createNewFocusGroup() {
    axios.post('/api/creator/newFocusGroup', {
      focusGroupName: this.state.typedFocusGroupName,
      creatorUsername: this.props.loggedInUser.username
    })
      .then(focusGroup => {
        this.setState({focusGroupList: [...this.state.focusGroupList, focusGroup.name]})
      })
  }

  addTesterToFocusGroup() {
    axios.post('/api/creator/addtoFocusGroup', {
      focusGroup: this.state.selectedFocusGroup,
      testerUsername: this.state.typedTesterUsername
    })
  }

  render() {
    return (
      <div>
        <h2>Create New Focus Group</h2>
        <form onSubmit={this.createNewFocusGroup}>
          <FormControl
            type='text'
            value={this.state.typedFocusGroupName}
            placeholder='Focus Group Name'
            onChange={this.updateTypedFocusGroupName}
          />
        </form>
        <Button onClick={this.createNewFocusGroup}></Button>
        {this.state.focusGroupList.length && 'Focus Groups Exist'}
        <h2>Add Tester to Focus Group</h2>
        <form onSubmit={this.addTesterToFocusGroup}>
          <FormControl
            type='text'
            value={this.state.typedUsername}
            placeholder='Tester Username'
            onChange={this.updateTypedTesterUsername}
          />
        </form>
        <h3>Focus Group Members</h3>
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