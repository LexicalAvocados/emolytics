import React from 'react';
import { Form, FormGroup, FormControl, ListGroup, ListGroupItem, Option, ButtonToolbar, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import axios from 'axios';

// React-Redux connect() boilerplate
// NOTE: you may have to modify the filepath for ChangeActions
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../actions';

class TesterProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editingAge: false,
      editingSex: false
    }
    this.startEditingAge = this.startEditingAge.bind(this);
    this.stopEditingAge = this.stopEditingAge.bind(this);
    this.startEditingSex = this.startEditingSex.bind(this);
    this.stopEditingSex = this.stopEditingSex.bind(this);
    this.startEditingRace = this.startEditingRace.bind(this);
    this.stopEditingRace = this.stopEditingRace.bind(this);
    this.updateAge = this.updateAge.bind(this);
    this.updateSex = this.updateSex.bind(this);
    this.updateRace = this.updateRace.bind(this);
  }

  startEditingAge() {
    this.setState({editingAge: true});
  }

  stopEditingAge(e) {
    e.preventDefault();
    this.setState({editingAge: false});
  }

  startEditingSex() {
    this.setState({editingSex: true});
  }

  stopEditingSex(e) {
    this.setState({editingSex: false});
  }

  startEditingRace() {
    this.setState({editingRace: true});
  }

  stopEditingRace(e) {
    this.setState({editingRace: false});
  }

  updateAge(e) {
    if (e.target.value === '') {
      this.props.actions.setAge(undefined);
    } else if (Number.isNaN(Number(e.target.value))) {
      return;
    } else {
      this.props.actions.setAge(parseInt(e.target.value));
    }
  }

  updateSex(e) {
    this.props.actions.setSex(e);
  }

  updateRace(e) {
    this.props.actions.setRace(e);
  }

  render() {
    return (
      <div>
        <ListGroup>

          <ListGroupItem onClick={this.startEditingAge}>
            Age: {this.state.editingAge ?
              <form onSubmit={this.stopEditingAge}>
                <FormGroup>
                  <FormControl type='text' value={this.props.loggedInUser.age} onChange={this.updateAge} />
                </FormGroup>
              </form>
            :
              <span>{this.props.loggedInUser.age}</span>}
          </ListGroupItem>

          <ListGroupItem onClick={this.startEditingSex}>
            Sex: {this.state.editingSex ?
              <ButtonToolbar>
                <ToggleButtonGroup type='radio' name='sexOptions' onChange={(e) => {this.updateSex(e); this.stopEditingSex(e)}}>
                  <ToggleButton value='Male'>Male</ToggleButton>
                  <ToggleButton value='Female'>Female</ToggleButton>
                </ToggleButtonGroup>
              </ButtonToolbar>
            :
              <span>{this.props.loggedInUser.sex}</span>
            }
          </ListGroupItem>

          <ListGroupItem onClick={this.startEditingRace}>
            Race: {this.state.editingRace ?
              <ButtonToolbar>
                <ToggleButtonGroup type='radio' name='raceOptions' onChange={(e) => {this.updateRace(e); this.stopEditingRace(e)}}>
                  <ToggleButton value='Caucasian'>Caucasian</ToggleButton>
                  <ToggleButton value='Hispanic'>Hispanic</ToggleButton>
                  <ToggleButton value='African American'>African American</ToggleButton>
                  <ToggleButton value='Asian'>Asian</ToggleButton>
                  <ToggleButton value='Pacific Islander'>Pacific Islander</ToggleButton>
                  <ToggleButton value='Native American'>Native American</ToggleButton>
                  <ToggleButton value='Other'>Other Ethnicity</ToggleButton>
                </ToggleButtonGroup>
              </ButtonToolbar>
            :
              <span>{this.props.loggedInUser.race}</span>}
          </ListGroupItem>

        </ListGroup>
      </div>
    )
  }
}

// React-Redux connect() boilerplate
// 1. Include the properties in the Store you want this component to have access to
// 2. Change the Component name at the very end to the one in the current file
const mapStateToProps = (state) => {
  console.log('state', state);
  return ({
    example: state.example,
    loggedInUser: state.loggedInUser,
    router: state.router
  })
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(TesterProfile));