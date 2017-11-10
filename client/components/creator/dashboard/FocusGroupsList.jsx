import React from 'react';
import axios from 'axios';
import { Form, FormControl, Button, ButtonToolbar, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

// React-Redux connect() boilerplate
// NOTE: you may have to modify the filepath for ChangeActions
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';

class FocusGroupsList extends React.Component {
  constructor(props) {
    super(props);
  }

  changeCurrIdx(e) {
    console.log('e:', e);
    this.setState({currIdx: e})
  }

  render() {
    let focusGroups = this.props.focusGroups;
    let currentFocusGroup = this.props.currentFocusGroup;
    return (
      <div>
        {this.props.location.pathname === '/groups' ? <h3>Your Groups</h3> : null}
        <ButtonToolbar className="focusGroupButtonToolbar">
          <ToggleButtonGroup
            justified
            type='radio'
            name='groups'
            value={this.props.currGroupIdx}
            onChange={(e) => {
              this.props.actions.changeCurrentFocusGroup(e, focusGroups);
              this.props.changeCurrIdx(e);
            }}
          >
            {focusGroups.map((group, i) => (
              <ToggleButton key={i} value={i}>
                <span>{group.name + ' '}</span>
                {group.patreonCampaignId ? <img src='patreon_badge.png' height={20} width={20}></img> : null}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </ButtonToolbar>
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
  router: state.router
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(FocusGroupsList));