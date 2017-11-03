import React from 'react';
import axios from 'axios';

// React-Redux connect() boilerplate
// NOTE: you may have to modify the filepath for ChangeActions
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../actions';

export class PatreonLoginLoading extends React.Component {
  constructor(props) {
    super(props);
    console.log('props:', props);
  }

  componentDidMount() {
    setTimeout(this.fetchUserAndRedirect.bind(this), 2000);
  }
  
  fetchUserAndRedirect() {
    axios.get('/redirect/patreon')
      .then(res => {
        let userData = res.data.userData;
        let {id, username, name, age, sex, race, isCreator, credits, patreonId} = userData;
        this.props.actions.setLoggedIn(id, username, name, age, sex, race, isCreator, credits, patreonId);
        if (userData.publishedAt) {
          let {patreonAbout, patreonVanity, campaignId, creationName, isPlural, mainVideoUrl, patronCount, pledgeUrl, summary} = userData;
          let campaign = {
            id: campaignId,
            about: patreonAbout,
            vanity: patreonVanity,
            creationName,
            isPlural,
            mainVideoUrl,
            patronCount,
            pledgeUrl,
            summary
          };
          console.log('campaign:', campaign);
          this.props.actions.setPatreonCampaignInfo(campaign);
        }
        if (isCreator) {
          axios.get('/api/creator/getCreatorFocusGroups', {
            params: {
              id
            }
          })
            .then(res => {
              let focusGroups = res.data;
              console.log('focusGroups:', focusGroups);
              if (focusGroups.length > 0) this.props.actions.populateCreatorFocusGroups(focusGroups);
            })
            .catch(err => {
              console.log('Error fetching Creator\'s Focus Groups:', err);
            });
        } else {
          axios.post('/api/tester/getOptionsForTester', {
            id,
            mode: 'queue'
          })
            .then(res => {
              let queue = res.data;
              console.log('queue:', queue);
              if (queue.length > 0) this.props.actions.populateTesterQueue(queue);
            })
            .catch(err => {
              console.log('Error fetching Tester Queue from database:', err);
            })
        }
        this.props.history.push('/');
      })
      .catch(err => {
        console.log('Error fetching user info:', err);
      });
  }

  render() {
    let url = window.location.href;
    let mode = url.slice(url.indexOf('=') + 1, url.indexOf('&'));
    let hasExisting = Boolean(url.slice(url.lastIndexOf('=') + 1));
    let isLogin = (mode === 'login' ? true : false);
    if (!isLogin) var loginType = (mode === 'creator' ? 'creator' : 'tester');

    return (
      <div className='patreonLoginLoading'>
        <h2>Thank you for logging in with Patreon.</h2>

        {/*{hasExisting ?
          <h2>We merged your Patreon details with your existing account.</h2>
        :
          <h2>We created a new account for you based on your Patreon details.</h2>}*/}

        {/*<h3>Your account type: {loginType === 'creator' ? 'Creator' : 'Tester'}</h3>*/}

        <h3>Redirecting...</h3>
      </div>
    )
  }
}

// React-Redux connect() boilerplate
// 1. Include the properties in the Store you want this component to have access to
// 2. Change the Component name at the very end to the one in the current file
const mapStateToProps = (state) => ({
  setLoggedIn: state.setLoggedIn,
  patreonCampaign: state.patreonCampaign,
  router: state.router
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(PatreonLoginLoading));