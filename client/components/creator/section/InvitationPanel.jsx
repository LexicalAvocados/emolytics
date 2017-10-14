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
      raceSelected: false
    };
    this.grabTesters = this.grabTesters.bind(this);
    this.selectAge = this.selectAge.bind(this);
    this.selectSex = this.selectSex.bind(this);
    this.selectRace = this.selectRace.bind(this);
    this.filterTesters = this.filterTesters.bind(this);
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

  // Test placing filterTesters within setState 
  selectAge(event) { 
    this.setState({
      ageSelected: event,
    });
    this.filterTesters(event);
  }

  selectSex(event) {
    this.setState({
      sexSelected: event,
    });
    this.filterTesters(event);
  }

  // selectRace(event) { // Can't test at the moment
  //   let filteredTesters = this.filterTesters(this.state.sexSelected, 'race', this.state.ageSelected, event)  
  //   this.setState({
  //     raceSelected: event,
  //     testersCopy: filteredTesters
  //   });

  // }


  filterTesters(criteria) { // Race not ready to implement
    var filtered = [];
    if (this.sexSelected === criteria) { // They are setting sex
      filtered = this.state.testers.filter((tester) => {
        if (tester.sex === criteria) return tester;
      });
    }
    if (this.ageSelected === criteria && this.sexSelected) { // Then filter the filtered
      let index = criteria.indexOf('-');
      let first = criteria.slice(0, index);
      let second = criteria.slice(index + 1);
      filtered = filtered.filter((tester) => {
        if (tester.age >= JSON.parse(first) && tester.age <= JSON.parse(second)) return tester;
      });
    } else if (this.ageSelected === criteria) {
      let index = criteria.indexOf('-');
      let first = criteria.slice(0, index);
      let second = criteria.slice(index + 1);
      filtered = this.state.testers.filter((tester) => {
        if (tester.age >= JSON.parse(first) && tester.age <= JSON.parse(second)) return tester;
      });
    }
    this.setState({
      testersCopy: filtered
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


    // let returnArr = [];
    // let ageArr = [];
    // let sexArr = [];

    // if (sex !== '') {
    //   sexArr = this.state.testers.filter((tester) => {
    //     if (tester.sex === criteria) return tester;
    //   });
    // }
    // // if (race !== '') { // SKIP
    // //   raceArr = this.state.testers.filter((tester) => {
    // //     if (tester[race] === criteria) return tester;
    // //   });
    // // } 
    // if (age !== '') { // No criteria when sex selected.
    //   if (criteria.indexOf('-') === -1) { 
    //     criteria = this.state.ageSelected;
    //     // age = 'age';
    //   }
    //   let index = criteria.indexOf('-');
    //   let first = criteria.slice(0, index);
    //   let second = criteria.slice(index + 1);
    //   ageArr = this.state.testers.filter((tester) => {
    //     if (tester.age >= JSON.parse(first) && tester.age <= JSON.parse(second) && tester.sex === this.state.sexSelected) return tester;
    //   });
    // } 
    // returnArr = returnArr.concat(sexArr, ageArr);
    // return returnArr;