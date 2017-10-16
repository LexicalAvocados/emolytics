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
      invitedUserIds: [],
      testers: [],
      testersCopy: []
    };
    this.renderInvited = this.renderInvited.bind(this);
    // this.renderHaveInvited = this.renderHaveInvited.bind(this);
    this.changeTestersCopy = this.changeTestersCopy.bind(this);
  }

  componentDidMount() {
    axios.get('/api/getTestersForOption', { params: { optionId: this.props.option.id }})
      .then((response) => {
        return response.data
      })
      .then((userIdsArray) => {
        let priorInvites = true;
        axios.get('/api/getTesters')
          .then((response) => {
            var uninvitedTesters = response.data.filter((tester) => {
              if (userIdsArray.indexOf(tester.id) === -1) return tester;
            });
            if (uninvitedTesters.length === response.data.length) { 
              priorInvites = false;
            }
            this.setState({
              testers: uninvitedTesters,
              testersCopy: uninvitedTesters,
              haveInvited: priorInvites
            });
          })
          .catch((err) => {
            console.log(err);
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

  changeTestersCopy(filtered) {
    this.setState({
      testersCopy: filtered
    })
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
            testers={this.state.testers}
            testersCopy={this.state.testersCopy}
            changeTestersCopy={this.changeTestersCopy}
          />
        )}
      </div>
    );
  }
}

export default OptionList;