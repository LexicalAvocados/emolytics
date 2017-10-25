import React from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';
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
    if (this.props.toEdit === 'Option') reduxLocation = 'currentOption';  // set to current option, update currentSection.options
    axios.get('/api/updateProject', { params: { id: this.props[reduxLocation].id, name: this.state.name, description: this.state.description, toEdit: toEdit}})
      .then((response) => {
        if (toEdit === 'Project')  this.props.getProjectsFromDatabase();
        if (toEdit === 'Section') {
          for (var i = 0; i < this.props.currentProject.sections.length; i++) {
            if (this.props.currentProject.sections[i].id === response.data.id) {
              this.props.currentProject.sections.splice(i, 1, response.data);
              this.props.splitSections();
            }
          }
        }
        if (toEdit === 'Option') {
          let newOptions = this.props.currentSection.options.map((option) => {
            if (option.id !== response.data.id) {
              return option;
            }
            return response.data;
          })
          this.props.actions.addOptionsToCurrentSection(newOptions);
        }
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
    currentSection: state.currentSection,
    currentOption: state.currentOption
  });
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
) (EditPage);