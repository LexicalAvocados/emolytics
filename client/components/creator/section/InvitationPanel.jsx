import React from 'react';
import InviteTesters from './InviteTesters.jsx';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import axios from 'axios';

class InvitationPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      testers: []
    };
    this.grabTesters = this.grabTesters.bind(this);
  }


  grabTesters() {
    axios.get('/api/getTesters')
      .then((response) => {
        this.setState({
          testers: response.data
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
        { !this.state.testers.length ? (
          <button onClick={this.grabTesters}>Invite testers</button>
        ):(
          <div className="invitationPanel">
            <div className="invitationPanelSelectors">
              <p>Age:</p>
              <DropdownButton id="dropdown-btn-menu" title="Select an age range">
                <MenuItem key="1">0-10</MenuItem>
              </DropdownButton>
            </div>
            <br/>
            <div className="invitationPanelSelectors">
              <p>Sex:</p>
              <DropdownButton id="dropdown-btn-menu" title="Select a sex">
                <MenuItem key="1">Male</MenuItem>
                <MenuItem key="2">Female</MenuItem>
              </DropdownButton>
            </div>
            <br/>
            <div className="invitationPanelSelectors">
              <p>Race:</p>
              <DropdownButton id="dropdown-btn-menu" title="Select a race">
                <MenuItem key="1">Martian</MenuItem>
              </DropdownButton>
            </div>
            {this.state.testers.map((tester, i) => (
              <InviteTesters 
                tester={tester}
                key={i}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
  
};

export default InvitationPanel;


//                {/* addInvitee={this.addInvitee} */}
{/* // <DropdownButton onClick={this.grabTesters} id="dropdown-btn-menu" title="Invite testers">
//         {this.state.testers.map((tester, i) => (
//             <MenuItem key={i}>Name: {tester.username} Age: {tester.age} Sex: {tester.sex}</MenuItem>
//           ))}
//         </DropdownButton> */}