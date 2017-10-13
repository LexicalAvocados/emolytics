import React from 'react';
import { Form, FormGroup, FormControl, ListGroup, ListGroupItem } from 'react-bootstrap';
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
    this.updateAge = this.updateAge.bind(this);
  }

  startEditingAge() {
    this.setState({editingAge: true});
  }

  stopEditingAge(e) {
    e.preventDefault();
    this.setState({editingAge: false});
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

  render() {
    return (
      <div>
        <form onSubmit={this.stopEditingAge}>
          <FormGroup>
            <ListGroup>
              <ListGroupItem onClick={this.startEditingAge}>
                Age: {this.state.editingAge ? 
                  <FormControl type='text' value={this.props.loggedInUser.age} onChange={this.updateAge} />
                :
                  <span>{this.props.loggedInUser.age}</span>}
              </ListGroupItem>
              <ListGroupItem>Sex</ListGroupItem>
              <ListGroupItem>Race</ListGroupItem>
            </ListGroup>
          </FormGroup>
        </form>
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