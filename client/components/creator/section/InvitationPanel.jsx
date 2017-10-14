import React from 'react';
import InviteTesters from './InviteTesters.jsx';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import axios from 'axios';

class InvitationPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      testers: [],
      testersCopy: [],
      ageSelected: null,
      sexSelected: null,
      raceSelected: null
    };
    this.grabTesters = this.grabTesters.bind(this);
    this.selectAge = this.selectAge.bind(this);
    this.selectSex = this.selectSex.bind(this);
    this.selectRace = this.selectRace.bind(this);
    this.filterBySex = this.filterBySex.bind(this);
  }


  grabTesters() {
    axios.get('/api/getTesters')
      .then((response) => {
        this.setState({
          testers: response.data,
          testersCopy: response.data
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  selectAge(event) {
    let display = event.slice(2, 4) + '-' + event.slice(10);
    this.setState({
      ageSelected: display
    });
  }

  selectSex(event) {
    console.log(event);
    let filteredTesters = this.state.testers.filter((tester) => {
      if (tester.sex === event) return tester;
    });
    this.setState({
      sexSelected: event,
      testersCopy: filteredTesters
    });
  }

  filterBySex(sex) {

  }

  selectRace(event) {
    this.setState({
      raceSelected: event
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
              <DropdownButton onSelect={this.selectAge} id="dropdown-btn-menu" title={this.state.ageSelected || 'Select an age'}>
                <MenuItem eventKey=">=0 && <=10">0-10</MenuItem>
                <MenuItem eventKey=">=11 && <=20">11-20</MenuItem>
                <MenuItem eventKey=">=21 && <=30">21-30</MenuItem>
                <MenuItem eventKey=">=31 && <=40">31-40</MenuItem>
                <MenuItem eventKey=">=41 && <=50">41-50</MenuItem>
                <MenuItem eventKey=">=51 && <=60">51-60</MenuItem>
                <MenuItem eventKey=">=61 && <=70">61-70</MenuItem>
                <MenuItem eventKey=">=71 && <=80">71-80</MenuItem>
                <MenuItem eventKey=">=81 && <=90">81-90</MenuItem>
                <MenuItem eventKey=">=91 && <=100">91-100 Impressive!</MenuItem>
              </DropdownButton>
            </div>
            <br/>
            <div className="invitationPanelSelectors">
              <p>Sex:</p>
              <DropdownButton onSelect={this.selectSex} id="dropdown-btn-menu" title={this.state.sexSelected || 'Select a sex'}>
                <MenuItem eventKey="Male">Male</MenuItem>
                <MenuItem eventKey="Female">Female</MenuItem>
              </DropdownButton>
            </div>
            <br/>
            <div className="invitationPanelSelectors">
              <p>Race:</p>
              <DropdownButton onSelect={this.selectRace} id="dropdown-btn-menu" title={this.state.raceSelected || 'Select a race'}>
                <MenuItem eventKey="Martian">Martian</MenuItem>
              </DropdownButton>
            </div>
            <div className="testersList">
              {this.state.testersCopy.map((tester, i) => (
                <InviteTesters 
                  tester={tester}
                  key={i}
                  index={i}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  
};

export default InvitationPanel;