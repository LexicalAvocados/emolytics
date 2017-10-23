import React from 'react';
import { Button } from 'react-bootstrap';
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
    axios.get('/api/updateProject', { params: { id: this.props.projectId, name: this.state.name, description: this.state.description}})
      .then((response) => {
        console.log(response);
        // Now trigger a rerender of the page.
        this.props.close();
      })
      .catch((error) => {
        console.log('Error updating project name', error);
      });
  }

  render() {
    return (
      <div className="EditProject">
        <h2>Edit Your Project</h2>
        <form onSubmit={this.submitEditedProject}>
          Project Name: <br />
          <input type="text" pattern=".{3,}" required title="3 characters minimum" name="name" value={this.state.name} onChange={this.handleChange} /><br />
          Project Description: <br />
          <input type="text" pattern=".{3,}" required title="3 characters minimum" name="description" value={this.state.description} onChange={this.handleChange} /><br />
          <Button type="submit">Submit</Button>
        </form>
      </div>
    );
  }
}

export default EditProject;