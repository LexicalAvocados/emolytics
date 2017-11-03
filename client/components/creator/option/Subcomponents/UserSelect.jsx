import React from 'react';
import axios from 'axios';
import { Col, Row, Grid, Form, FormGroup, FormControl, Checkbox, Button, ButtonToolbar, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../../actions';

class UserSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tempSelectedUsers: [],
      selectType: 1,
      allDemographicsObj: {}
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleAllUsers = this.toggleAllUsers.bind(this);
    this.handleSelectTypeChange = this.handleSelectTypeChange.bind(this);
    this.handleGenderChange = this.handleGenderChange.bind(this);
    this.handleRaceChange = this.handleRaceChange.bind(this);
    this.handleAgeRangeChange = this.handleAgeRangeChange.bind(this);
    this.handleDemographicChangeSubmit = this.handleDemographicChangeSubmit.bind(this);
  }

  componentWillMount() {
    this.setState({
      tempSelectedUsers: this.props.selectedUsers,
      allDemographicsObj: this.props.allDemographicsObj
    })
  }

  handleChange(userObj) {
    var indOfUser = this.state.tempSelectedUsers.indexOf(userObj);
    var tempArray = this.state.tempSelectedUsers.slice()
    indOfUser > -1 ? tempArray.splice(indOfUser, 1) : tempArray.push(userObj);
    this.setState({
      tempSelectedUsers: tempArray
    }, () => console.log('state after edit', this.state.tempSelectedUsers))
  }

  handleSubmit() {
    //callback with selected users state
    this.props.userSelectCb(this.state.tempSelectedUsers);
    this.props.changeSideNavSelection('overview');
  };

  toggleAllUsers() {
    let currStatus = this.state.tempSelectedUsers.length === this.props.allUsers.length;
    if (currStatus) {
      this.setState({
        tempSelectedUsers: []
      })
    } else {
      this.setState({
        tempSelectedUsers: this.props.allUsers
      })
    }
  }

  handleSelectTypeChange(num) {
    this.setState({
      selectType: num
    })
  }

  handleGenderChange(gender) {
    let desiredInd = this.props.setOptionDemographicsSelection.genders.indexOf(gender);
    var newArrayForState = this.props.setOptionDemographicsSelection.genders;
    if (desiredInd > -1) {
      newArrayForState.splice(desiredInd, 1);
    } else {
      newArrayForState.push(gender);
    }
    var newObjForState = this.props.setOptionDemographicsSelection;
    newObjForState['genders'] = newArrayForState
    this.props.actions.setOptionDemographicsSelection(newObjForState)
  }

  handleRaceChange(race) {
    let desiredInd = this.props.setOptionDemographicsSelection.races.indexOf(race);
    var newArrayForState = this.props.setOptionDemographicsSelection.races;
    if (desiredInd > -1) {
      newArrayForState.splice(desiredInd, 1);
    } else {
      newArrayForState.push(race);
    }
    var newObjForState = this.props.setOptionDemographicsSelection;
    newObjForState['races'] = newArrayForState;
    this.props.actions.setOptionDemographicsSelection(newObjForState)
  }

  handleAgeRangeChange(ageRange) {
    let desiredInd = this.props.setOptionDemographicsSelection.ageRanges.indexOf(ageRange);
    var newArrayForState = this.props.setOptionDemographicsSelection.ageRanges;
    if (desiredInd > -1) {
      newArrayForState.splice(desiredInd, 1);
    } else {
      newArrayForState.push(ageRange);
    }
    var newObjForState = this.props.setOptionDemographicsSelection;
    newObjForState['ageRanges'] = newArrayForState;
    this.props.actions.setOptionDemographicsSelection(newObjForState)
  }

  handleDemographicChangeSubmit() {
    let body = {
      optionId: this.props.optionId,
      selectedRaces: this.props.setOptionDemographicsSelection.races || [],
      selectedGenders: this.props.setOptionDemographicsSelection.genders || [],
      selectedAgeRanges: this.props.setOptionDemographicsSelection.ageRanges || []
    }
    axios.post('/api/getFramesBasedOnUserDemographics', body)
    .then((res) => {
      console.log('res from getFramesBasedOnUserDemographics', res)
      this.props.refreshDemographics();
      this.props.demographicSelectCb(res.data);
      this.props.changeSideNavSelection('overview');
    })
    .then(() => {
      //axios post to
    })
  }

  render() {
    return (
      <div className='userSelect' style={containerStyle}>
        <h3 style={headerStyle}> Select viewers </h3>
        <ButtonToolbar style={toggleStyle}>
          <ToggleButtonGroup type='radio' name='userSelect' defaultValue={1} onChange={this.handleSelectTypeChange}>
            <ToggleButton value={1}>By Demographics</ToggleButton>
            <ToggleButton value={2}>By Individuals</ToggleButton>
          </ToggleButtonGroup>
        </ButtonToolbar>
        <br/>
        { this.state.selectType === 1 && this.state.allDemographicsObj.ageRange ? (
          <div>
            <Row>

            <Col sm={2} md={2}>
              <FormGroup>
                <p>Race</p>
                {Object.keys(this.state.allDemographicsObj.race).map((race, i) => (
                  <Checkbox bsClass='checkbox'
                    key={i}
                    checked={this.props.setOptionDemographicsSelection.races.includes(race)}
                    onChange={() => this.handleRaceChange(race)}
                    >
                    {race} ({this.state.allDemographicsObj.race[race]})
                  </Checkbox>
                ))}
              </FormGroup>
            </Col>

            <Col sm={2} md={2}>
              <FormGroup>
                <p>Age</p>
                {Object.keys(this.state.allDemographicsObj.ageRange).map((ageRange, i) => (
                  <Checkbox bsClass='checkbox'
                    key={i}
                    checked={this.props.setOptionDemographicsSelection.ageRanges.includes(ageRange)}
                    onChange={() => this.handleAgeRangeChange(ageRange)}
                    >
                    {ageRange} ({this.state.allDemographicsObj.ageRange[ageRange]})
                  </Checkbox>
                ))}
              </FormGroup>
            </Col>

            <Col sm={2} md={2}>
              <FormGroup>
                <p>Sex</p>
                {Object.keys(this.state.allDemographicsObj.sex).map((sex, i) => (
                  <Checkbox bsClass='checkbox'
                    key={i}
                    checked={this.props.setOptionDemographicsSelection.genders.includes(sex)}
                    onChange={() => this.handleGenderChange(sex)}
                    >
                    {sex} ({this.state.allDemographicsObj.sex[sex]})
                  </Checkbox>
                ))}
              </FormGroup>
            </Col>
            </Row>

            <Row>
              <Button onClick={this.handleDemographicChangeSubmit} style={doneStyle}>Done</Button>
            </Row>

          </div>
        ) : (

          <FormGroup>
            <Checkbox bsClass='checkbox'
              checked={this.state.tempSelectedUsers.length === this.props.allUsers.length}
              onChange={this.toggleAllUsers}
              >All Testers</Checkbox>
            {this.props.allUsers.map((userObj, i) => (
              <Checkbox bsClass='checkbox'
                checked={this.state.tempSelectedUsers.reduce((acc, curr) => {
                  acc.push(curr.username); return acc;
                }, []).includes(userObj.username)}
                key={i}
                onChange={() => this.handleChange(userObj)}>
                {userObj.name || userObj.username}
              </Checkbox>
            ))}
          </FormGroup>
        )}

      </div>
    )
  }
};

const toggleStyle = {
  marginLeft: '3%'
}

const headerStyle = {
  marginLeft: '13%'
}

const doneStyle = {
  marginLeft: '20%'
}

const centered = {
  textAlign: 'center',
  align: 'center'
}

const containerStyle = {
    // backgroundColor: 'white',
    // // paddingTop: '6px',
    // boxShadow: 'rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px',
    // borderRadius: '4px'
}

const mapStateToProps = (state) => {
  console.log('state in user select', state)
  return ({
    router: state.router,
    currentProject: state.currentProject,
    currentSection: state.currentSection,
    loggedInUser: state.loggedInUser,
    currentOptionAnnotations: state.currentOptionAnnotations,
    currentOption: state.currentOption,
    lineGraphData: state.lineGraphData,
    setOptionDemographicsSelection: state.setOptionDemographicsSelection

  });
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
) (UserSelect);
