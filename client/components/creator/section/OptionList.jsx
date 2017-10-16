import React from 'react';
import {Link} from 'react-router-dom';
import InvitationPanel from './InvitationPanel.jsx'
import { DropdownButton, MenuItem } from 'react-bootstrap';
import axios from 'axios';


class OptionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invited: false,
      haveInvited: false,
      invitedUserIds: []
    };
    this.renderInvited = this.renderInvited.bind(this);
    this.renderHaveInvited = this.renderHaveInvited.bind(this);
  }

  componentDidMount() {
    axios.get('/api/getTestersForOption', { params: { optionId: this.props.option.id }})
      .then((response) => {
        this.setState({
          invitedUserIds: response.data
        });
      })
      .catch((error) => {
        console.log(error);
      })
  }

  renderInvited() {
    this.setState({
      invited: !this.state.invited
    });
  }

  renderHaveInvited() {
    this.setState({
      haveInvited: !this.state.haveInvited
    });
  }


  render() {
    return (
      <div className="currentSectionOptionListEntry">
        <Link to={'/option' + this.props.option.id}>
          <img src={this.props.option.thumbnail} alt="" onClick={() => this.props.onOptionClick(this.props.index)}/>
        </Link>
        { this.state.haveInvited ? (
          <p>You have invited testers to view this option</p> 
        ) : ( null )}
        { this.state.invited ? (
          <p>Testers Invited!</p>
        ) : (
          <InvitationPanel
            option={this.props.option}
            renderInvited={this.renderInvited}
            invitedUserIds={this.state.invitedUserIds}
            renderHaveInvited={this.renderHaveInvited}
          />
        )}
      </div>
    );
  }
}

export default OptionList;