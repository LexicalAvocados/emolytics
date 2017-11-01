import React from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Elements } from 'react-stripe-elements';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';

import AddCredits from './AddCredits.jsx';
import EditProfile from './EditProfile.jsx';
import EditSocial from './EditSocial.jsx';

class CreatorAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 1
    };
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {

  }

  handleSelect(num) {
    this.setState({
      activeTab: num
    });
  }

  render() {
    return (
      <div style={accountContainerStyle}>

        <div className='accountTabs' style={tabsStyle}>
          <Nav bsStyle='tabs' justified activeKey={this.state.activeTab} onSelect={this.handleSelect}>
            <NavItem eventKey={1}>Profile</NavItem>
            <NavItem eventKey={2}>Social</NavItem>
            <NavItem eventKey={3}>Credits</NavItem>
          </Nav>
        </div>
        <br/><br/><br/>
        { this.state.activeTab === 1 ? (
          <EditProfile />
        ) : ''}

        { this.state.activeTab === 2 ? (
          <EditSocial />
        ) : ''}

        { this.state.activeTab === 3 ? (
          <AddCredits />
        ) : ''}


      </div>
    )
  }
};

const tabsStyle = {
  width: '50%',
}

const accountContainerStyle = {
  marginLeft: '30%'
}

const mapStateToProps = (state) => ({
  loggedInUser: state.loggedInUser,
  router: state.router
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(CreatorAccount));
