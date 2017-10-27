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
  }

  componentDidMount() {
    setTimeout(this.fetchUserAndRedirect.bind(this), 3000);
  }
  
  fetchUserAndRedirect() {
    axios.get('/redirect/patreon')
      .then(res => {
        let {id, username, name, age, sex, race, isCreator, credits} = res.data.userData;
        this.props.actions.setLoggedIn(id, username, name, age, sex, race, isCreator, credits);
        this.props.history.push('/');
      })
      .catch(err => {
        console.log('Error fetching user info:', err);
      });
  }

  render() {
    let query = window.location.href.slice(window.location.href.indexOf('=') + 1);
    let isLogin = query === 'login' ? true : false;
    if (!isLogin) var loginType = query === 'creator' ? 'creator' : 'tester';
    return (
      <div className='patreonLoginLoading'>
        <h2>You have successfully {isLogin ? 'logged in' : 'signed up'} with Patreon.</h2>
        {isLogin ? null : <h3>Your account type: {loginType === 'creator' ? 'Creator' : 'Tester'}</h3>}
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
  router: state.router
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(PatreonLoginLoading));