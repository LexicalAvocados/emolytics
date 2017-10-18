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
      selectedGroupIdx: 0
    }
    this.updateTypedTesterUsername = this.updateTypedTesterUsername.bind(this);
    this.updateTypedFocusGroupName = this.updateTypedFocusGroupName.bind(this);
    this.createNewFocusGroup = this.createNewFocusGroup.bind(this);
    this.addTesterToFocusGroup = this.addTesterToFocusGroup.bind(this);
    this.changeFocusGroupIdx = this.changeFocusGroupIdx.bind(this);
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
      .then(res => {
        this.props.actions.addFocusGroup(res.data.name);
      })
  }

  addTesterToFocusGroup() {
    let focusGroup = this.state.selectedFocusGroup;
    let testerUsername = this.state.typedTesterUsername;
    axios.post('/api/creator/addtoFocusGroup', {
      focusGroup,
      testerUsername
    })
      .then(res => {
        this.props.actions.addTesterToFocusGroup(focusGroup, testerUsername);
      })
      .catch(res => {
        console.log('Error adding Tester to Focus Group');
      });
  }

  changeFocusGroupIdx(e) {
    this.setState({selectedFocusGroup: e});
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
        <Button bsStyle='primary' onClick={this.createNewFocusGroup}>Create Group</Button>

        {this.props.focusGroups.length > 0 ?
          (<ButtonToolbar>
            <ToggleButtonGroup type='radio' name='focusGroups' onChange={this.selectFocusGroup}>
              {this.props.focusGroups.map((group, i) => (
                <ToggleButton value={i}>{group.name}</ToggleButton>
              ))}
            </ToggleButtonGroup>
          </ButtonToolbar>)
        :
          null}

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

        {this.props.focusGroups[this.state.selectedGroupIdx].testers.length > 0 ?
          <ul>
            {this.props.focusGroups[this.state.selectedGroupIdx].testers.map(tester => (
              <li>tester</li>
            ))}
          </ul>
        :
          'none'
        }
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
  router: state.router
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(FocusGroupsPage));