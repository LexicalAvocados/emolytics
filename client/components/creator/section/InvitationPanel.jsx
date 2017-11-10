import React from 'react';
import { DropdownButton, MenuItem, Button, Col, Row, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';
import axios from 'axios';

class InvitationPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ageSelected: false,
      sexSelected: false,
      raceSelected: false,
      invited: [],
      testers: [],
      testersCopy: [],
      options: []
    };
    this.selectAge = this.selectAge.bind(this);
    this.selectSex = this.selectSex.bind(this);
    this.selectRace = this.selectRace.bind(this);
    this.filterTesters = this.filterTesters.bind(this);
    this.handleInvites = this.handleInvites.bind(this);
    this.sendInvites = this.sendInvites.bind(this);
    this.inviteAll = this.inviteAll.bind(this);
    this.changeTestersCopy = this.changeTestersCopy.bind(this);
    this.handleLowCrediteOptionClick = this.handleLowCrediteOptionClick.bind(this);
  }

  componentWillMount() {
    if (this.props.options) { // Inviting by section
      this.state.options = this.props.options;
      this.state.testers = this.props.testers;
      this.state.testersCopy = this.props.testersCopy;
    } else {
      this.state.options = [ {id: this.props.currentOption.id}];
      this.state.testers = this.props.currentOption.testers;
      this.state.testersCopy = this.props.currentOption.testersCopy;
    }
  }

  changeTestersCopy(filtered) {
    this.setState({
      testersCopy: filtered
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
  }

  sendInvites(e, invited) {
    if (e) {
      e.preventDefault();
    }
    axios.post('/api/sendEmails', { invitedArr: invited, options: this.state.options})
      .then((success) => {
        console.log(success);
        this.props.renderInvited();
        this.props.renderPanel();
      })
      .catch((failure) => {
        console.log('Invites NOT sent', failure);
      })
  }

  inviteAll() {
    console.log('Invites being sent to:', this.state.testersCopy);
    this.setState({
      invited: this.state.testersCopy
    }, this.sendInvites(null, this.state.testersCopy));
  }


  selectAge(event) {
    var filtered = this.filterTesters('age', event);
    this.setState({
      ageSelected: event
    });
    this.changeTestersCopy(filtered);
  }

  selectSex(event) {
    var filtered = this.filterTesters('sex', event);
    this.setState({
      sexSelected: event
    });
    this.changeTestersCopy(filtered);
  }

  selectRace(event) { // Can't test at the moment
    var filtered = this.filterTesters('race', event);
    this.setState({
      raceSelected: event
    });
    this.changeTestersCopy(filtered);
  }

  filterTesters(criteria, toFilterBy) {
    var filtered = [];
    // SEX
    if (criteria === 'sex' || this.state.sexSelected) {
      if (criteria === 'sex' && toFilterBy === 'None') {
        filtered = this.state.testers.map((tester) => {
          return tester;
        });
      } else if (criteria === 'sex') { // Catch for filtering by sex directly
        filtered = this.state.testers.filter((tester) => {
          if (tester.sex === toFilterBy) return tester;
        });
      } else if (this.state.sexSelected !== 'None') { // Catch for filtering by sex indirectly
        filtered = this.state.testers.filter((tester) => {
          if (tester.sex === this.state.sexSelected) return tester;
        });
      } else if (this.state.sexSelected === 'None') { // Catch for filtering by sex indirectly
        filtered = this.state.testers.map((tester) => {
          return tester;
        });
      }
    }
    // RACE FIX THIS
    if (criteria === 'race' || this.state.raceSelected) {
      if (criteria === 'race' && toFilterBy === 'None'  && this.state.sexSelected) {
        filtered = filtered.map((tester) => {
          return tester;
        });
      } else if (criteria === 'race' && this.state.sexSelected) { // Catch for filtering by race directly, with previosly selected sex.
        filtered = filtered.filter((tester) => {
          if (tester.race === toFilterBy) return tester;
        });
      } else if (criteria === 'race' && toFilterBy !== 'None') { // Catch for filtering by race directly and alone.
        filtered = this.state.testers.filter((tester) => {
          if (tester.race === toFilterBy) return tester;
        });
      } else if (criteria === 'race' && toFilterBy === 'None') { // Catch for filtering by race directly and alone.
        filtered = this.state.testers.map((tester) => {
          return tester;
        });
      } else if (this.state.raceSelected && this.state.raceSelected !== 'None') { // Catch for filtering by race indirectly without sex set.
        filtered = filtered.filter((tester) => {
          if (tester.race === this.state.raceSelected) return tester;
        });
      } else if (this.state.raceSelected === 'None') { // Catch for filtering by race indirectly without sex set.
        filtered = filtered.map((tester) => {
          return tester;
        });
      }
    }
    // AGE
    if (criteria === 'age' || this.state.ageSelected) {
      if (criteria === 'age' && toFilterBy === 'None'  && (this.state.sexSelected || this.state.raceSelected)) {
        filtered = filtered.map((tester) => {
          return tester;
        });
      } else if (criteria === 'age' && toFilterBy === 'None' && (this.state.sexSelected || this.state.raceSelected)) { // Filtering by age with sex and race selected
        let index = toFilterBy.indexOf('-');
        let first = toFilterBy.slice(0, index);
        let second = toFilterBy.slice(index + 1);
        filtered = filtered.filter((tester) => {
          if (tester.age >= JSON.parse(first) && tester.age <= JSON.parse(second)) return tester;
        });
      } else if (criteria === 'age'  && toFilterBy !== 'None') { // filtering by age directly
        let index = toFilterBy.indexOf('-');
        let first = toFilterBy.slice(0, index);
        let second = toFilterBy.slice(index + 1);
        filtered = this.state.testers.filter((tester) => {
          if (tester.age >= JSON.parse(first) && tester.age <= JSON.parse(second)) return tester;
        });
      } else if (criteria === 'age' && toFilterBy === 'None') {
        filtered = this.state.testers.map((tester) => {
          return tester;
        });
      } else if (this.state.ageSelected && this.state.ageSelected !== 'None') { // filter by age indirectly
        let index = this.state.ageSelected.indexOf('-');
        let first = this.state.ageSelected.slice(0, index);
        let second = this.state.ageSelected.slice(index + 1);
        filtered = filtered.filter((tester) => {
          if (tester.age >= JSON.parse(first) && tester.age <= JSON.parse(second)) return tester;
        });
      } else if (this.state.ageSelected === 'None') { // Catch for filtering by race indirectly without sex set.
        filtered = filtered.map((tester) => {
          return tester;
        });
      }
    }
    return filtered;
  }

  handleLowCrediteOptionClick(option) {
    this.props.actions.changeCurrentOption(option);
    this.props.onOptionClickCallbackForLowCredit(option)
  }

  render() {

    return (
      <div className="sectionHomeInviteModule">
        <h3>Invite by Demographic</h3>

        <hr className='standardHR'/>

        { this.props.fromSectionHomeToInvitationPanel ? (
          this.props.noCreditsAlert.length ? (
            <div>
              <ListGroup>
                {this.props.noCreditsAlert.map((option, i) => (
                  <ListGroupItem
                    key={i}
                    className='lowCreditListItem'
                    onClick={() => this.handleLowCrediteOptionClick(option)}
                  >
                    <div>
                      <Col md={4}>
                        <b>
                          {option.name}
                        </b>
                      </Col>
                      <Col md={4}>
                        <b className='lowCreditWarning'>
                          {option.totalcredits} credits
                        </b>
                      </Col>
                      <Col md={4}>
                        {Math.floor(option.totalcredits / option.creditsperview) || 0} views
                      </Col>
                    </div>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </div>
          ) : (
            null
          )
        ) : (
          null
        )}

        <div className="invitationPanelSelectorContainer">
          <div className="invitationPanelSelector1">
            <DropdownButton onSelect={this.selectAge} id="dropdown-btn-menu" title={this.state.ageSelected || 'Filter by age'}>
              <MenuItem eventKey="None">None</MenuItem>
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

          <div className="invitationPanelSelector2">
            <DropdownButton onSelect={this.selectSex} id="dropdown-btn-menu" title={this.state.sexSelected || 'Filter by sex'}>
              <MenuItem eventKey="None">None</MenuItem>
              <MenuItem eventKey="Male">Male</MenuItem>
              <MenuItem eventKey="Female">Female</MenuItem>
            </DropdownButton>
          </div>

          <div className="invitationPanelSelector3">
            <DropdownButton onSelect={this.selectRace} id="dropdown-btn-menu" title={this.state.raceSelected || 'Filter by race'}>
              <MenuItem eventKey="None">None</MenuItem>
              <MenuItem eventKey="Caucasian">Caucasian</MenuItem>
              <MenuItem eventKey="Hispanic">Hispanic</MenuItem>
              <MenuItem eventKey="African American">African American</MenuItem>
              <MenuItem eventKey="Asian">Asian</MenuItem>
              <MenuItem eventKey="Pacific Islander">Pacific Islander</MenuItem>
              <MenuItem eventKey="Native American">Native American</MenuItem>
              <MenuItem eventKey="Other">Other</MenuItem>
            </DropdownButton>
          </div>

        </div>

        <div className="testersList">
          <br/>
          <p>Available testers: {this.state.testersCopy.length}</p>
          <Button onClick={this.inviteAll}>Send the Invites</Button>
          <Button onClick={this.props.renderPanel}>Close Invites Panel</Button>
        </div>
      </div>
    );
  }

};

const verticalAlign = {
  marginTop: '23%'
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});

const mapStateToProps = (state) => {
  return ({
    router: state.router,
    currentOption: state.currentOption
  });
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(InvitationPanel));
