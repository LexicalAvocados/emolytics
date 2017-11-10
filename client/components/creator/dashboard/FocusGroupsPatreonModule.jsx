import React from 'react';
import axios from 'axios';
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';

// React-Redux connect() boilerplate
// NOTE: you may have to modify the filepath for ChangeActions
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';

class FocusGroupsPatreonModule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      patrons: []
    }
    this.createFocusGroupFromCampaign = this.createFocusGroupFromCampaign.bind(this);
  }

  componentWillMount() {
    axios.post('/patreon/patrons', {
      campaignId: this.props.patreonCampaign.id,
      patreonId: this.props.loggedInUser.patreonId
    })
      .then(res => {
        console.log('res:', res);
        this.setState({ patrons: res.data });
      })
      .catch(err => {
        console.log('Error fetching patrons:', err);
      });
  }

  createFocusGroupFromCampaign() {
    axios.post('/api/creator/newFocusGroup', {
      focusGroupName: this.props.patreonCampaign.vanity,
      creatorUsername: this.props.loggedInUser.username,
      campaignId: this.props.patreonCampaign.id,
      patrons: this.state.patrons.filter(patron => patron.hasOwnProperty('id'))
    })
      .then(res => {
        let data = res.data;
        console.log('data:', data);
        let idx = this.props.setCurrIdxToNewGroup();
        this.props.actions.addPatreonFocusGroup(data.group.name, data.patrons.map(patron => patron.username), data.patreonCampaignId);
        setTimeout(() => this.props.actions.changeCurrentFocusGroup(idx, this.props.focusGroups), 10);
      })
      .catch(err => {
        console.log('Error creating Focus Group from Patreon Campaign:', err);
      });
  }

  render() {
    let campaign = this.props.patreonCampaign;
    return (
      <div className='lightPurpleModule'>
        <h2>Patreon Campaign</h2>
        <h3>{campaign.vanity}</h3>
        <ListGroup>
          {this.state.patrons.map((patron, i) => (
            <ListGroupItem 
              key={i}
              className='focusGroupPatronListEntry'
            >
              {patron.username || patron.fullName}
            </ListGroupItem>
          ))}
        </ListGroup>
        <Button bsStyle='primary' onClick={this.createFocusGroupFromCampaign}>Create Group</Button>
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
)(FocusGroupsPatreonModule));