import React from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import TesterProfile from './TesterProfileEdit.jsx';

class TesterProfileDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 1
    };
    this.handleSelect = this.handleSelect.bind(this);
  }
  
  handleSelect(num) {
    this.setState({
      activeTab: num
    });
  }

  render() {
    const tabsStyle = {
      width: '50%',
    }
    
    return (
      <div>
        <div className='testerAccountTabs' style={tabsStyle}>
          <Nav bsStyle='tabs' justified activeKey={this.state.activeTab} onSelect={this.handleSelect}>
            <NavItem eventKey={1}>Edit Profile</NavItem>
            <NavItem eventKey={2}>Cashout</NavItem>
          </Nav>
        </div>
        <br/>
        { this.state.activeTab === 1 ? (
          <TesterProfile />
        ) : (
          null
        )}
        { this.state.activeTab === 2 ? (
          // something nice
          <p>Hello!</p>
        ) : (
          null
        )}
      </div>
    );
  }
}

export default TesterProfileDashboard;