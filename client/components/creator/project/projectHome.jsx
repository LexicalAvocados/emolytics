import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import SectionList from './SectionList.jsx';
import { connect } from 'react-redux';
import { Button, Panel, Collapse } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';
import DisplaySections from '../section/DisplaySections.jsx';
import axios from 'axios';

class ProjectHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rerenderOptions: false,
      open: true,
      fromHome: true
    };
    this.onSectionClick = this.onSectionClick.bind(this);
    this.deleteSection = this.deleteSection.bind(this);
    this.associateOptions = this.associateOptions.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentWillUnmount() {

  }

  onSectionClick(obj, options) {
    obj['options'] = options;
    this.props.actions.changeCurrentSection(obj, options);
  }

  associateOptions() {
    this.setState({
      rerenderOptions: false
    });
  }

  deleteSection(id) {
    if (confirm('Are you sure you want to delete this section?')) {
      this.props.currentProject.sections = this.props.currentProject.sections.filter((section) => {
        if (section.id !== id) {
          return section;
        }
      });
      // console.log('This should be the current project', this.props.currentProject);
      axios.delete('/api/deleteSection', { params: {sectionId: id, toDelete: 'id'} })
        .then((response) => {
          // console.log(response);
          this.props.actions.removeSectionFromSections(this.props.currentProject.sections);
          this.setState({
            rerenderOptions: true
          });
        })
        .catch((error) => {
          console.log('Error deleting section', error);
        });
    }
  }

  toggle() {
    this.setState({
      open: !this.state.open
    })
  }

  render() {
    return (
      <div className="projectHomeContainer">
        <Collapse in={this.state.open}>
          <Panel header={`Project Title: ${this.props.currentProject.name}`} bsStyle="warning">
            <h6>Description: {this.props.currentProject.description}</h6>
          </Panel>
        </Collapse>

        <div>
          {/* {this.props.currentProject.sections.map((section, i) => {
            // console.log('ITERATING THROUGH SECTIONS', section);
            return (
              <SectionList
                toggle={this.toggle}
                onSectionClick={this.onSectionClick}
                deleteSection={this.deleteSection}
                rerenderOptions={this.state.rerenderOptions}
                associateOptions={this.associateOptions}
                section={section}
                key={i}
              />
            );
          })} */}
          <DisplaySections
            fromProjectHome={this.state.fromHome}
          />
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


