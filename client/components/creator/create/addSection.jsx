import React from 'react';
import {Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';

class AddSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: ''
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.submitSectionClick = this.submitSectionClick.bind(this);
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

  // handleYouTubeUrl() {

  // }

  submitSectionClick(e) {
    e.preventDefault();
    axios.post('/api/addSection', {
      name: this.state.name,
      description: this.state.description,
      projectId: this.props.currentProject.id
    })
      .then((response) => {
        this.setState({
          name: response.data.name,
          description: response.data.description,
        });
        this.props.actions.changeCurrentSection(response.data);
        this.props.history.push('/addOption');
      })
      .catch((err) => {
        console.error('Request to add new section NOT sent to server!', err);
      });
  }

  render() {
    return (
      <div className="CreateProject">
        <h2>Add Section</h2>
        <br/>
        <form onSubmit={this.submitSectionClick}>
          Section Name: <br />
          <input type="text" name="sectionname" value={this.state.name} onChange={this.handleNameChange} /><br />
          <br/>
          Section Description: <br />
          <input className="inputDescription" type="text" name="sectiondescription" value={this.state.description} onChange={this.handleDescriptionChange} /><br />
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
) (AddSection));











