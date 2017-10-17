import React from 'react';
import {Link} from 'react-router-dom';
import InvitationPanel from './InvitationPanel.jsx'
import { Button } from 'react-bootstrap';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import axios from 'axios';


class OptionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayPanel: false,
      invited: false,
      haveInvited: false,
      invitedUserIds: [],
      testers: [],
      testersCopy: []
    };
    this.renderInvited = this.renderInvited.bind(this);
    // this.renderHaveInvited = this.renderHaveInvited.bind(this);
    this.changeTestersCopy = this.changeTestersCopy.bind(this);
    this.renderPanel = this.renderPanel.bind(this);
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

  renderPanel() {
    this.setState({
      displayPanel: !this.state.displayPanel
    });
  }

  render() {
    return (
      <div className="currentSectionOptionListEntry">
        <Link to={'/option' + this.props.option.id}>
          <img src={this.props.option.thumbnail} alt="" onClick={() => this.props.onOptionClick(this.props.index)}/>
          <p className="closerText">{this.props.option.name}</p>
        </Link>
        {/* <br /> */}
        { this.state.haveInvited ? (
          <p className="closerText">You have previously invited testers to view this option</p> 
        ) : ( null )}
        { !this.state.invited ? (
          !this.state.displayPanel ? (
            <Button onClick={this.renderPanel}>Invite testers</Button>
          ) : (
            <InvitationPanel
              option={this.props.option}
              renderInvited={this.renderInvited}
              invitedUserIds={this.state.invitedUserIds}
              testers={this.state.testers}
              testersCopy={this.state.testersCopy}
              changeTestersCopy={this.changeTestersCopy}
              renderPanel={this.renderPanel}
            />
          )
        ) : (
          <p>Testers Invited!</p>
        )}
      </div>
    );
  }
}

export default OptionList;
