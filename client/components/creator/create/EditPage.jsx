import React from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import axios from 'axios';

class EditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      name: '',
      description: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    var name = e.target.name;
    var val = e.target.value;
    this.setState({
      [name]: val
    });
  }

  submitEdit(e) {
    e.preventDefault();
    let toEdit = this.props.toEdit;
    let reduxLocation = '' ;
    if (this.props.toEdit === 'Project') reduxLocation = 'currentProject';
    if (this.props.toEdit === 'Section') reduxLocation = 'currentSection';
    axios.get('/api/updateProject', { params: { id: this.props[reduxLocation].id, name: this.state.name, description: this.state.description, toEdit: toEdit}})
      .then((response) => {
        if (toEdit === 'Project')  this.props.getProjectsFromDatabase();
        if (toEdit === 'Section')  console.log(response);
        // console.log(response);
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
        <form onSubmit={this.submitEdit}>
          {this.props.toEdit} Name: <br />
          <input style={width} type="text" pattern=".{3,}" required title="3 characters minimum" name="name" value={this.state.name} onChange={this.handleChange} /><br />
          {this.props.toEdit} Description: <br />
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
    currentSection: state.currentSection
  });
};

export default connect(
  mapStateToProps
) (EditPage);