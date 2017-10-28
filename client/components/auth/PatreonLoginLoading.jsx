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
    setTimeout(this.fetchUserAndRedirect.bind(this), 3000);
  }
  
  fetchUserAndRedirect() {
    axios.get('/redirect/patreon')
      .then(res => {
        let userData = res.data.userData;
        let {id, username, name, age, sex, race, isCreator, credits} = userData;
        this.props.actions.setLoggedIn(id, username, name, age, sex, race, isCreator, credits);
        if (userData.publishedAt) {
          let {patreonId, patreonAbout, patreonVanity, isPlural, mainVideoUrl, patronCount, pledgeUrl, summary} = userData;
          let campaign = {
            patreonId,
            about: patreonAbout,
            vanity: patreonVanity,
            isPlural,
            mainVideoUrl,
            patronCount,
            pledgeUrl,
            summary
          };
          console.log('campaign:', campaign);
          this.props.actions.setPatreonCampaignInfo(campaign);
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
        <h2>Thank you for {isLogin ? 'logged in' : 'signed up'} with Patreon.</h2>

        {hasExisting ?
          <h2>We merged your Patreon details with your existing account.</h2>
        :
          <h2>We created a new account for you based on your Patreon details.</h2>}

        <h3>Your account type: {loginType === 'creator' ? 'Creator' : 'Tester'}</h3>

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