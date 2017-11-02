import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers/index.js';
import { changeExample } from '../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../actions';
import DashboardHome from './creator/dashboard/DashboardHome.jsx';
import FocusGroupsPage from './creator/dashboard/FocusGroupsPage.jsx';
import Navbar from './Navbar.jsx';
import Signup from './auth/signup.jsx';
import Login from './auth/login.jsx';
import TesterHome from './tester/TesterHome.jsx';
import TesterAccount from './tester/TesterAccount.jsx';
import TesterVideo from './tester/TesterVideo.jsx';
import TesterQueuePage from './tester/TesterQueuePage.jsx';
import TesterHistoryPage from './tester/TesterHistoryPage.jsx';
import TesterOptionResults from './tester/TesterOptionResults.jsx';
import ProjectHome from './creator/project/ProjectHome.jsx';
import SectionHome from './creator/section/SectionHome.jsx';
import OptionHome from './creator/option/OptionHome.jsx';
import CreateProject from './creator/create/createProject.jsx';
import AddSection from './creator/create/addSection.jsx';
import AddOption from './creator/create/addOption.jsx';
import PatreonLoginLoading from './auth/PatreonLoginLoading.jsx';
import Loading from './auth/loading.jsx';
import LandingPage from './LandingPage.jsx';
import CreatorAccount from './creator/account/CreatorAccount.jsx';
import Browse from './tester/Browse/Browse.jsx';
import ForgotPassword from './auth/ForgotPassword.jsx';
import ResetPassword from './auth/ResetPassword.jsx';
import CreatorPublicProfile from './creator/account/CreatorPublicProfile.jsx';
import TesterJoinFocusGroup from './tester/FocusGroupInvite.jsx';
import vimeoLoading from './auth/vimeoLoading.jsx';

export class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="app">
        <Navbar />

        <div className="appBody">
          {
            this.props.loggedInUser.username ? (
              this.props.loggedInUser.isCreator || this.props.role.isCreator ? (
                <Switch>
                  {/* routes for CREATOR */}
                  <Route exact path="/" component={DashboardHome}/>
                  <Route path="/new" component={DashboardHome}/>
                  <Route path='/groups' component={FocusGroupsPage}/>
                  <Route path="/testvideo" component={TesterVideo}/>
                  <Route path="/project:id" component={ProjectHome}/>
                  <Route path="/section:id" component={SectionHome}/>
                  <Route path="/option:id" component={OptionHome}/>
                  <Route path="/createProject" component={CreateProject}/>
                  <Route path="/addSection" component={AddSection}/>
                  <Route path="/addOption" component={AddOption}/>
                  <Route path="/account" component={CreatorAccount}/>
                  <Route path="/profile:id" component={CreatorPublicProfile}/>
                </Switch>
              ) : (
                <Switch>
                  {/* routes for TESTER */}
                  <Route exact path="/" component={TesterHome}/>
                  <Route exact path="/history" component={TesterHistoryPage}/>
                  <Route path="/history/:id" component={TesterOptionResults}/>
                  <Route path="/queue" component={TesterQueuePage}/>
                  <Route path="/account" component={TesterAccount}/>
                  <Route path="/video/:id" component={TesterVideo}/>
                  <Route path="/browse" component={Browse}/>
                  <Route path="/profile:id" component={CreatorPublicProfile}/>
                  <Route path="/joinGroup" component={TesterJoinFocusGroup}/>
                </Switch>
              )
            ) : (
              <Switch>
                {/* routes for NOT LOGGED IN */}
                <Route exact path="/" component={LandingPage}/>
                <Route exact path="/loading" component={Loading}/>
                <Route exact path="/vimeoloading" component={vimeoLoading}/>
                <Route path="/loading/patreon" component={PatreonLoginLoading}/>
                <Route path="/signup" component={Signup}/>
                <Route path="/forgotPassword" component={ForgotPassword}/>
                <Route path="/reset/:id" component={ResetPassword}/>
                <Route path="*" component={Login}/>
              </Switch>
            )
          }
        </div>

      </div>
    );
  }
};

// React-Redux connect() boilerplate
// 1. Include the properties in the Store you want this component to have access to
// 2. Change the Component name at the very end to the one in the current file
const mapStateToProps = (state) => ({
  router: state.router,
  loggedInUser: state.loggedInUser,
  role: state.signupwithfb
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App));
