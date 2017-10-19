import React from 'react';
import axios from 'axios';
import { Form, FormControl, Button, ButtonToolbar, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

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
      showTesterAlreadyAddError: false
    }
    this.updateTypedTesterUsername = this.updateTypedTesterUsername.bind(this);
    this.updateTypedFocusGroupName = this.updateTypedFocusGroupName.bind(this);
    this.createNewFocusGroup = this.createNewFocusGroup.bind(this);
    this.addTesterToFocusGroup = this.addTesterToFocusGroup.bind(this);
    this.removeTesterFromFocusGroup = this.removeTesterFromFocusGroup.bind(this);
  }

  updateTypedTesterUsername(e) {
    this.setState({typedTesterUsername: e.target.value});
  }

  updateTypedFocusGroupName(e) {
    this.setState({typedFocusGroupName: e.target.value})
  }

  createNewFocusGroup() {
    axios.post('/api/creator/newFocusGroup', {
      focusGroupName: this.state.typedFocusGroupName,
      creatorUsername: this.props.loggedInUser.username
    })
      .then(res => {
        this.props.actions.addFocusGroup(res.data.name);
      })
  }

  addTesterToFocusGroup(e) {
    e.preventDefault();
    let focusGroupName = this.props.currentFocusGroup.name;
    let testerUsername = this.state.typedTesterUsername;
    axios.post('/api/creator/addToFocusGroup', {
      focusGroupName,
      testerUsername
    })
      .then(res => {
        if (res.data) this.props.actions.addTesterToFocusGroup(focusGroupName, testerUsername);
        else console.log('Error associating Tester with Focus Group:', res);
      })
      .catch(err => {
        console.log('Error adding Tester to Focus Group:', err);
      });
  }

  removeTesterFromFocusGroup(tester) {
    let focusGroupName = this.props.currentFocusGroup.name;
    let testerUsername = tester;
    axios.put('/api/creator/removeFromFocusGroup', {
      focusGroupName,
      testerUsername
    })
      .then(res => {
        if (res.data) this.props.actions.removeTesterFromFocusGroup(focusGroupName, testerUsername);
        else console.log('Error removing Tester from Focus Group');
      })
      .catch(err => {
        console.log('Error removing Tester from Focus Group:', err);
      });
  }

  render() {
    return (
      <div>
        <h2>Create New Focus Group</h2>
        <form>
          <FormControl
            type='text'
            value={this.state.typedFocusGroupName}
            placeholder='Focus Group Name'
            onChange={this.updateTypedFocusGroupName}
          />
        </form>
        <Button bsStyle='primary' onClick={this.createNewFocusGroup}>Create Group</Button>

        {this.props.focusGroups.length > 0 ?
          (<div>
            <h2>Your Focus Groups</h2>
            <ButtonToolbar>
              <ToggleButtonGroup
                type='radio'
                name='focusGroups'
                onChange={(e) => this.props.actions.changeCurrentFocusGroup(e, this.props.focusGroups)}
              >
                {this.props.focusGroups.map((group, i) => (
                  <ToggleButton key={i} value={i}>{group.name}</ToggleButton>
                ))}
              </ToggleButtonGroup>
            </ButtonToolbar>
          </div>)
        :
          null}

        {this.props.currentFocusGroup ?
          <div>
            <h2>Add Tester to {this.props.currentFocusGroup.name}</h2>

            <form>
              <FormControl
                type='text'
                value={this.state.typedTesterUsername}
                placeholder='Tester Username'
                onChange={this.updateTypedTesterUsername}
              />
            </form>
            <Button bsStyle='primary' onClick={this.addTesterToFocusGroup}>Add Tester</Button>

            <h2>{this.props.currentFocusGroup.name} Members</h2>

            {this.props.currentFocusGroup.testers.length > 0 ?
              <ul>
                {this.props.currentFocusGroup.testers.map((tester, i) => (
                  <li key={i} onClick={this.removeTesterFromFocusGroup.bind(null, tester)}>{tester}</li>
                ))}
              </ul>
            :
              'none'}

          </div>
        :
            null}

      </div>
    )
  }
}

// React-Redux connect() boilerplate
// 1. Include the properties in the Store you want this component to have access to
// 2. Change the Component name at the very end to the one in the current file
const mapStateToProps = (state) => ({
  loggedInUser: state.loggedInUser,
  focusGroups: state.focusGroups,
  currentFocusGroup: state.currentFocusGroup,
  router: state.router
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(FocusGroupsPage));