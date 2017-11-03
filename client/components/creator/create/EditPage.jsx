import React from 'react';
import { Button, Col, Row, Form, FormGroup, FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';
import axios from 'axios';

class EditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      name: '',
      description: '',
      currentReduxLocation: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
  }

  componentWillMount() {
    var reduxLocation = '';
    if (this.props.toEdit === 'Project') reduxLocation = 'currentProject';
    if (this.props.toEdit === 'Section') reduxLocation = 'currentSection';
    if (this.props.toEdit === 'Option') reduxLocation = 'currentOption';
    this.setState({
      currentReduxLocation: reduxLocation
    })
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
  // set to current option, update currentSection.options
    if (this.props[this.state.currentReduxLocation].id === 0 || this.props[this.state.currentReduxLocation].id === 1) {
      alert('Nice try, but you cannot edit the demonstration material.');
      return;
    }
    axios.get('/api/updateProject', { params: { id: this.props[this.state.currentReduxLocation].id, name: this.state.name, description: this.state.description, toEdit: toEdit}})
      .then((response) => {
        if (toEdit === 'Project')  this.props.getProjectsFromDatabase(true);
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
          });
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
      width: '80%'
    };
    return (
      <div className="EditProject">
        <div style={header}>
          <h3>Edit {this.props.toEdit}</h3><p style={invisible}>No text</p>
        </div>
        {/*<form onSubmit={this.submitEdit}>
          {this.props.toEdit} Name: <br />
        <input style={width} type="text" pattern=".{3,}" required title="3 characters minimum" name="name" value={this.state.name} onChange={this.handleChange} placeholder={this.props[this.state.currentReduxLocation].name}/><br />
          {this.props.toEdit} Description: <br />
        <input style={width} type="text" pattern=".{3,}" required title="3 characters minimum" name="description" value={this.state.description} onChange={this.handleChange} placeholder={this.props[this.state.currentReduxLocation].description}/><br />
          <Button type="submit">Submit</Button>
        </form>*/}

        <Form onSubmit={this.submitEdit} horizontal>
          <FormGroup controlId="name">
            <Row>
              <Col sm={3} >
                <p style={verticalAlign}>Name:</p>
              </Col>
              <Col sm={6}>
                <FormControl type="text" value={this.state.name}  placeholder={this.props[this.state.currentReduxLocation].name} onChange={this.handleChange}/>
              </Col>
            </Row>
            <Row>
              <Col sm={3}>
                <p style={verticalAlign}>Description:</p>
              </Col>
              <Col sm={6}>
                <FormControl type="text" value={this.state.description} onChange={this.handleChange} placeholder={this.props[this.state.currentReduxLocation].description}/>
              </Col>
            </Row>
            <Row>
              <Col sm={7}></Col>
              <Col sm={2}>
                <Button type="submit" style={right}>Submit</Button>
              </Col>
            </Row>
          </FormGroup>
        </Form>

      </div>
    );
  }
}

const verticalAlign = {
  // display: 'table-cell',
  // verticalAlign: 'middle'
  marginTop: '7%'
}

const invisible = {
  visibility: 'hidden'
}

const right = {
  float: 'right',
}

const header = {
  marginLeft: '-4%'
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
