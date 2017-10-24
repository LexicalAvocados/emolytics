import React from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import axios from 'axios';

class EditProject extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      name: '',
      description: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.submitEditedProject = this.submitEditedProject.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    var name = e.target.name;
    var val = e.target.value;
    this.setState({
      [name]: val
    });
  }

  submitEditedProject(e) {
    e.preventDefault();
    // Change the stuff here, cause a rerender on the original page.
    axios.get('/api/updateProject', { params: { id: this.props.currentProject.id, name: this.state.name, description: this.state.description}})
      .then((response) => {
        this.props.getProjectsFromDatabase();
        this.props.close();
      })
      .catch((error) => {
        console.log('Error updating project name', error);
      });
  }

  render() {
    var width = {
      width: '30%'
    }
    return (
      <div className="EditProject">
        <form onSubmit={this.submitEditedProject}>
          Project Name: <br />
          <input style={width} type="text" pattern=".{3,}" required title="3 characters minimum" name="name" value={this.state.name} onChange={this.handleChange} /><br />
          Project Description: <br />
          <input style={width} type="text" pattern=".{3,}" required title="3 characters minimum" name="description" value={this.state.description} onChange={this.handleChange} /><br />
          <Button type="submit">Submit</Button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return({
    router: state.router,
    currentProject: state.currentProject,
  });
};

export default connect(
  mapStateToProps
) (EditProject);