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
      ageSelected: false,
      sexSelected: false,
      raceSelected: false,
      invited: [],
      value: {}
    };
    this.grabTesters = this.grabTesters.bind(this);
    this.selectAge = this.selectAge.bind(this);
    this.selectSex = this.selectSex.bind(this);
    // this.selectRace = this.selectRace.bind(this);
    this.filterTesters = this.filterTesters.bind(this);
    this.handleInvites = this.handleInvites.bind(this);
    this.sendInvites = this.sendInvites.bind(this);
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

  handleInvites(event, index) {
    if (event.target.checked) {
      this.setState({
        invited: [...this.state.invited, this.state.testersCopy[index]]
      });
    } else { // Uninvited
      var removed = this.state.invited.slice(index, 1);
      this.setState({
        invited: removed
      });   
    }
    console.log(this.state.invited);
  }

  sendInvites(e) {
    e.preventDefault();
    axios.post('/api/sendEmails', { invitedArr: this.state.invited, option: this.props.option })
      .then((success) => {
        console.log(success);
        // this.setState({
        //   invited: []
        // })
      })
      .catch((failure) => {
        console.log('Invites NOT sent', failure);
      })
  }

  selectAge(event) { 
    var filtered = this.filterTesters('age', event);
    this.setState({
      ageSelected: event,
      testersCopy: filtered
    });
  }

  selectSex(event) {
    var filtered = this.filterTesters('sex', event);
    this.setState({
      sexSelected: event,
      testersCopy: filtered
    });
   
  }

  selectRace(event) { // Can't test at the moment
    var filtered = this.filterTesters('race', event);
    this.setState({
      raceSelected: event,
      testersCopy: filtered
    });
  }

  // }

  filterTesters(criteria, toFilterBy) {
    var filtered = [];
    // SEX
    if (criteria === 'sex') { // Catch for filtering by sex directly
      filtered = this.state.testers.filter((tester) => {
        if (tester.sex === toFilterBy) return tester;
      });
    } else if (this.state.sexSelected) { // Catch for filtering by sex indirectly
      filtered = this.state.testers.filter((tester) => {
        if (tester.sex === this.state.sexSelected) return tester;
      });
    }
    // RACE
    if (criteria === 'race' && this.state.sexSelected) { // Catch for filtering by race directly, with previosly selected sex. 
      filtered = filtered.filter((tester) => {
        if (tester.race === toFilterBy) return tester;
      });
    } else if (criteria === 'race') { // Catch for filtering by race directly and alone.
      filtered = this.state.testers.filter((tester) => {
        if (tester.race === toFilterBy) return tester;
      });
    } else if (this.state.raceSelected && this.state.sexSelected) { // Catch for filtering by race indirectly without sex set. 
      filtered = filtered.filter((tester) => {
        if (tester.race === this.state.raceSelected) return tester;
      });
    } else if (this.state.raceSelected) { // Catch for filtering by race indirectly without sex set. 
      filtered = this.state.testers.filter((tester) => {
        if (tester.race === this.state.raceSelected) return tester;
      });
    }
    // AGE
    if (criteria === 'age' && toFilterBy.indexOf('-') !== -1 && (this.state.sexSelected || this.state.raceSelected)) { // Filtering by age with sex and race selected
      let index = toFilterBy.indexOf('-');
      let first = toFilterBy.slice(0, index);
      let second = toFilterBy.slice(index + 1);
      filtered = filtered.filter((tester) => {
        if (tester.age >= JSON.parse(first) && tester.age <= JSON.parse(second)) return tester;
      });
    } else if (criteria === 'age') { // filtering by age directly
      let index = toFilterBy.indexOf('-');
      let first = toFilterBy.slice(0, index);
      let second = toFilterBy.slice(index + 1);
      filtered = this.state.testers.filter((tester) => {
        if (tester.age >= JSON.parse(first) && tester.age <= JSON.parse(second)) return tester;
      });
    } else if (this.state.ageSelected) { // filter by age indirectly
      let index = this.state.ageSelected.indexOf('-');
      let first = this.state.ageSelected.slice(0, index);
      let second = this.state.ageSelected.slice(index + 1);
      filtered = filtered.filter((tester) => {
        if (tester.age >= JSON.parse(first) && tester.age <= JSON.parse(second)) return tester;
      });
    }
    return filtered;
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
                <MenuItem eventKey="Caucasian">Caucasian</MenuItem>
                <MenuItem eventKey="Hispanic">Hispanic</MenuItem>
                <MenuItem eventKey="African American">African American</MenuItem>
                <MenuItem eventKey="Asian">Asian</MenuItem>
                <MenuItem eventKey="Pacific Islander">Pacific Islander</MenuItem>
                <MenuItem eventKey="Native American">Native American</MenuItem>
                <MenuItem eventKey="Other">Other</MenuItem> 
              </DropdownButton>
            </div>
            <div className="testersList">
              <form onSubmit={this.sendInvites}>
                {this.state.testersCopy.map((tester, i) => (
                  <InviteTesters 
                    handleInvites={this.handleInvites}
                    value={this.state.value}
                    tester={tester}
                    key={i}
                    index={i}
                  />
                ))}
                <input type="submit" value="Send Invites"/>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }
  
};

export default InvitationPanel;