import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';

class CreateProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: ''
    };
    this.submitProjectClick = this.submitProjectClick.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
  }

  handleNameChange(event) {
    this.setState({
      name: event.target.value
    });
  }

  handleDescriptionChange(event) {
    this.setState({
      description: event.target.value
    });
  }

  submitProjectClick(e) {
    e.preventDefault();
    axios.post('/api/createProject', {
      name: this.state.name,
      description: this.state.description
    })
      .then((response) => {
        this.setState({
          name: response.data.name,
          description: response.data.description
        });
        this.props.actions.changeCurrentProject(response.data);
        this.props.history.push('/addSection');
      })
      .catch((err) => {
        console.error('Request to create new project NOT sent to server!', err);
      });
  }

  render() {
    return (
      <div className="CreateProject">
        <h2>Create Project</h2>
        <form onSubmit={this.submitProjectClick}>
          Project Name: <br />
          <input type="text" name="projectname" value={this.state.name} onChange={this.handleNameChange} /><br />
          <br/>
          Project Description: <br />
          <input className="inputDescription" type="text" name="projectdescription" value={this.state.description} onChange={this.handleDescriptionChange} /><br />
          <br/>
          <input type="submit" value="Submit" />
          
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return({
    router: state.router,
    currentProject: state.currentProject
  });
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
) (CreateProject));

