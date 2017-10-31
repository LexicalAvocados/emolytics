import React from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import axios from 'axios';
import TesterEditingProfile from './TesterEditingProfile.jsx';
import TesterCreditsPage from './TesterCreditsPage.jsx';

// React-Redux connect() boilerplate
// NOTE: you may have to modify the filepath for ChangeActions
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../actions';

class TesterAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 1
    };
    this.changeActiveTab = this.changeActiveTab.bind(this);
  }

  changeActiveTab(num) {
    this.setState({
      activeTab: num
    })
  }

  render() {
    return (
      <div>

        <div className='accountTabs' style={tabsStyle}>
          <Nav bsStyle='tabs' justified activeKey={this.state.activeTab} onSelect={this.changeActiveTab}>
            <NavItem eventKey={1}>Profile</NavItem>
            <NavItem eventKey={2}>Credits</NavItem>
          </Nav>
        </div>
        <br/><br/>
        { this.state.activeTab === 1 ? (
          <TesterEditingProfile />
        ) : ''}

        { this.state.activeTab === 2 ? (
          <TesterCreditsPage />
        ) : ''}

      </div>
    )
  }
}

const tabsStyle = {
  width: '50%',
  margin: '0% 25%'
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
)(TesterAccount));