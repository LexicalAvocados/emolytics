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
      raceSelected: null,
      previous: [],
      filtered: false
    };
    this.grabTesters = this.grabTesters.bind(this);
    this.selectAge = this.selectAge.bind(this);
    this.selectSex = this.selectSex.bind(this);
    this.selectRace = this.selectRace.bind(this);
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
    let filteredTesters = this.filterTesters('age', event)
    this.setState({
      ageSelected: event,
      testersCopy: filteredTesters
    });
  }

  selectSex(event) {
    // let filteredTesters = this.filterTesters('sex', event)  
    console.log(event);
    console.log(filterTesters('sex', event, this.state.testers));
    // console.log('WHAT', a);

    this.setState({
      sexSelected: event,
      // testersCopy: filteredTesters
    });
  }

  selectRace(event) { // Can't test at the moment
    let filteredTesters = this.filterTesters('race', event)
    this.setState({
      raceSelected: event,
      testersCopy: filteredTesters
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
                <MenuItem eventKey="0-10">0-10</MenuItem>
                <MenuItem eventKey="11-20">11-20</MenuItem>
                <MenuItem eventKey="21-30">21-30</MenuItem>
                <MenuItem eventKey="31-40">31-40</MenuItem>
                <MenuItem eventKey="41-50">41-50</MenuItem>
                <MenuItem eventKey="51-60">51-60</MenuItem>
                <MenuItem eventKey="61-70">61-70</MenuItem>
                <MenuItem eventKey="71-80">71-80</MenuItem>
                <MenuItem eventKey="81-90">81-90</MenuItem>
                <MenuItem eventKey="91-100">91-100 Impressive!</MenuItem>
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


const filterTesters = _.memoize(function(selector, criteria, array) {
  if (selector === 'sex' || selector === 'race') {
    return array.filter((tester) => {
      if (tester[selector] === criteria) return tester;
    });
  } else {
    let index = criteria.indexOf('-');
    let first = criteria.slice(0, index);
    let second = criteria.slice(index + 1);
    return array.filter((tester) => {
      if (tester[selector] >= JSON.parse(first) && tester[selector] <= JSON.parse(second)) return tester;
    });
  }
});