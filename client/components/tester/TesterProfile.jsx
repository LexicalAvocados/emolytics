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
    this.toggleEditingAge = this.toggleEditingAge.bind(this);
    this.updateTypedAge = this.updateTypedAge.bind(this);
  }

  updateTypedAge(e) {
    this.setState({typedAge: e.target.value})
  }

  toggleEditingAge() {
    this.setState({editingAge: !this.state.editingAge});
  }

  render() {
    return (
      <div>
        <form>
          <FormGroup>
            <ListGroup>
              <ListGroupItem>
                Age: {this.state.editingAge ? 
                  <FormControl type='text' value={this.state.typedAge} onChange={this.props.actions.setAge} />
                :
                  <span onClick={this.toggleEditingAge}>{this.props.loggedInUser.age}</span>}
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