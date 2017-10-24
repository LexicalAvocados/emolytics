import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import SectionList from './SectionList.jsx';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';
import axios from 'axios';

class ProjectHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rerenderOptions: false
    }
    this.onSectionClick = this.onSectionClick.bind(this);
    this.deleteSection = this.deleteSection.bind(this);
    this.associateOptions = this.associateOptions.bind(this);
  }

  onSectionClick(obj, options) {
    obj['options'] = options;
    this.props.actions.changeCurrentSection(obj, options);
  }

  associateOptions() {
    this.setState({
      rerenderOptions: false
    })
  }

  deleteSection(id) {
    if (confirm('Are you sure you want to delete this section?')) {
      this.props.currentProject.sections = this.props.currentProject.sections.filter((section) => {
        if (section.id !== id) {
          return section;
        }
      });
      console.log('This should be the current project', this.props.currentProject);
      axios.delete('/api/deleteSection', { params: {sectionId: id, toDelete: 'id'} })
        .then((response) => {
          console.log(response);
          this.props.actions.removeSectionFromSections(this.props.currentProject.sections);
          this.setState({
            rerenderOptions: true
          });
        })
        .catch((error) => {
          console.log('Error deleting section', error);
        })
    }
  }

  render() {
    return (
      <div className="projectHomeContainer">
        <h2>Project Title: {this.props.currentProject.name}</h2>
        <h4>Project Description: {this.props.currentProject.description}</h4>
        <Link to="/addSection">
          <Button className="addSectionButton">Add a section</Button>
        </Link>
        <div>
          {this.props.currentProject.sections.map((section, i) => (
            <SectionList
              onSectionClick={this.onSectionClick}
              deleteSection={this.deleteSection}
              rerenderOptions={this.state.rerenderOptions}
              associateOptions={this.associateOptions}
              section={section}
              key={i}
            />
          ))}
        </div>
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  // console.log('LOG WITHIN PROJECTHOME', state);
  return ({
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
) (ProjectHome));
