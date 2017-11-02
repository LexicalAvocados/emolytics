import React from 'react';
import axios from 'axios';
import { Col, Form, FormControl, Button, ButtonToolbar, ToggleButtonGroup, ToggleButton, Pagination, ListGroup, ListGroupItem } from 'react-bootstrap';
import FocusGroupsList from './FocusGroupsList.jsx';
import FocusGroupsPatreonModule from './FocusGroupsPatreonModule.jsx';

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
      applyUsers: [],
      addTo: 'none',
      activePage: 1
    };
    this.updateTypedTesterUsername = this.updateTypedTesterUsername.bind(this);
    this.updateTypedFocusGroupName = this.updateTypedFocusGroupName.bind(this);
    this.createNewFocusGroup = this.createNewFocusGroup.bind(this);
    this.deleteFocusGroup = this.deleteFocusGroup.bind(this);
    this.addTesterToFocusGroup = this.addTesterToFocusGroup.bind(this);
    this.removeTesterFromFocusGroup = this.removeTesterFromFocusGroup.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.applyFocusGroup = this.applyFocusGroup.bind(this);
    this.changeActivePage = this.changeActivePage.bind(this);
  }

  componentDidMount() {
    axios.get('/api/group/getApply')
      .then(applyUsers => {
        console.log(applyUsers);
        this.setState({
          applyUsers: applyUsers.data
        }, () => {
          console.log(this);
        })
      })
  }

  updateTypedTesterUsername(e) {
    this.setState({typedTesterUsername: e.target.value});
  }

  updateTypedFocusGroupName(e) {
    this.setState({typedFocusGroupName: e.target.value});
  }

  createNewFocusGroup(e) {
    e.preventDefault();
    axios.post('/api/creator/newFocusGroup', {
      focusGroupName: this.state.typedFocusGroupName,
      creatorUsername: this.props.loggedInUser.username
    })
      .then(res => {
        this.props.actions.addFocusGroup(res.data.name);
        this.setState({typedFocusGroupName: ''});
      });
  }

  deleteFocusGroup() {
    axios.put('/api/creator/deleteFocusGroup', {
      focusGroup: this.props.currentFocusGroup,
      creatorUsername: this.props.loggedInUser.username
    })
      .then(res => {
        if (res.data) this.props.actions.deleteFocusGroup(this.props.currentFocusGroup.name);
        else console.log('Error deleting Group');
      })
      .catch(err => {
        console.log('Error deleting Group:', err);
      });
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
        else console.log('Error associating Tester with Group:', res);
        this.setState({typedTesterUsername: ''});
      })
      .catch(err => {
        console.log('Error adding Tester to Group:', err);
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
        else console.log('Error removing Tester from Group');
      })
      .catch(err => {
        console.log('Error removing Tester from Group:', err);
      });
  }

  handleChange(e) {
    let val = e.target.value;
    this.setState({addTo: val}, () => {
      console.log(this);
    });
  }

  applyFocusGroup(username) {
    let data = {
      username: username,
      focusGroup: this.state.addTo
    }
    axios.post('/api/group/applyTester', data)
      .then(res => {
        console.log(res);
      })
  }

  changeActivePage(e) {
    this.setState({activePage: e});
  }

  render() {
    let focusGroups = this.props.focusGroups;
    let currentFocusGroup = this.props.currentFocusGroup;
    if (currentFocusGroup) var numOfPages = Math.ceil(currentFocusGroup.testers.length / 10) || 1;
    let appliedUsers = this.state.applyUsers.map((user, i) => {
      return (
        <div>
          <div>
            <p> {user.username} </p>
          </div>
          <div>
            <select onChange={this.handleChange}>
              <option name="addTo" value="none" > None </option>
              {this.props.focusGroups.map((group, i) => (
                <option name="addTo" value={group.name}>{group.name}</option>
              ))}
            </select>
          </div>
          <div>
            <button onClick={() => {
              this.applyFocusGroup(user)
            }}> Add </button>
          </div>
        </div>
        )
    })

    return (
      <div className='focusGroupPage'>

        <Col md={3}>

          <div className='lightPurpleModule'>
            <h3>New Group</h3>
            <form onSubmit={this.createNewFocusGroup}>
              <Col>
                <FormControl
                  className='focusGroupNameEntry'
                  type='text'
                  value={this.state.typedFocusGroupName}
                  placeholder='Group Name'
                  onChange={this.updateTypedFocusGroupName}
                />
              </Col>
              <Button
                bsStyle='primary'
                type='submit'
              > Create Group </Button>
            </form>
          </div>

          {this.props.patreonCampaign.id ?
            <FocusGroupsPatreonModule />
          :
            <div className='lightPurpleModule'>
              <h3>Connect Patreon</h3>
              <p>You may use your Patreon campaign and pledge information to
              quickly create & curate a Group.</p>
              <img src='patreon.jpg' className='focusGroupPatreonBtn'></img>
            </div>}
        </Col>

        <Col md={6}>

            <div className='lightPurpleModule'>
              {focusGroups.length > 0 ?
                <FocusGroupsList />
                :
                null}
            </div>

            {currentFocusGroup ? (
              <div className='lightPurpleModule'>
                <div className='focusGroupSubsectionTitle'>
                  <Button
                    className='focusGroupDeleteBtn'
                    bsStyle='danger'
                    onClick={this.deleteFocusGroup}
                  > Delete </Button>
                  <h3 className='focusGroupName'>{currentFocusGroup.name}</h3>
                </div>

                <hr className='standardHR'/>

                <div className='focusGroupSubsection'>
                  <h3>Members</h3>

                  {numOfPages > 1 ?
                    <div>
                      <Pagination
                        prev
                        next
                        ellipsis
                        boundaryLinks
                        items={numOfPages}
                        maxButtons={10}
                        activePage={this.state.activePage}
                        onSelect={this.changeActivePage}
                      />
                    </div>
                  :
                    null}

                  {currentFocusGroup.testers.length > 0 ?
                    <ListGroup className='focusGroupTesterList'>
                      {currentFocusGroup.testers.slice((numOfPages - 1) * 10, numOfPages * 10).map((tester, i) => (
                        <ListGroupItem
                          className='focusGroupTesterListEntry'
                          key={i}
                          onClick={this.removeTesterFromFocusGroup.bind(null, tester)}
                        > {tester} </ListGroupItem>
                      ))}
                    </ListGroup>
                  :
                    <p>No members yet :&#40; Why don't you invite some below?</p>}
                </div>

                <hr className='standardHR'/>

                <div className='focusGroupSubsection'>
                  <h3>Invite Testers</h3>
                  <form onSubmit={this.addTesterToFocusGroup}>
                    <FormControl
                      className='focusGroupTesterEntry'
                      type='text'
                      value={this.state.typedTesterUsername}
                      placeholder='Tester Username'
                      onChange={this.updateTypedTesterUsername}
                    />
                    <Button
                      bsStyle='primary'
                      type='submit'
                    > Invite Tester </Button>
                  </form>
                </div>

              </div>
            ) : null}

        </Col>

        <Col md={3}>
          <div className='lightPurpleModule'>
            <h3> Tester Requests </h3>
            {this.state.applyUsers.length > 0 ?
              {appliedUsers}
            :
              <p>You currently have no pending requests from
              Testers to join one of your groups.</p>}
          </div>
        </Col>

      </div>
    );
  }
}

// React-Redux connect() boilerplate
// 1. Include the properties in the Store you want this component to have access to
// 2. Change the Component name at the very end to the one in the current file
const mapStateToProps = (state) => ({
  loggedInUser: state.loggedInUser,
  focusGroups: state.focusGroups,
  currentFocusGroup: state.currentFocusGroup,
  patreonCampaign: state.patreonCampaign,
  router: state.router
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(FocusGroupsPage));