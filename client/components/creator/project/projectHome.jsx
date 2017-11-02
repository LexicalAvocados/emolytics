import React from 'react';
import { Link, withRouter } from 'react-router-dom';
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
      fromHome: true,
    };
    this.onSectionClick = this.onSectionClick.bind(this);
    this.associateOptions = this.associateOptions.bind(this);
    this.toggle = this.toggle.bind(this);
    this.redirectToSection = this.redirectToSection.bind(this);
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

  toggle() {
    this.setState({
      open: !this.state.open
    })
  }

  redirectToSection() {
    this.props.history.push('/section' + this.props.currentSection.id);
  }

  render() {
    const height = {
      height: '150px'
    };
    return (
      <div className="projectHomeContainer">
        { this.props.currentProject.id === 0 ? (
          <h3 className="demoWelcomeHeader">This is the Project Home! From here you can view all of the sections associated with a project. Sections themselves are associated with options! Yay!</h3>
        ) : (
          null
        )}
        <Panel collapsible header={`${this.props.currentProject.name.toUpperCase()}`} expanded={this.state.open} onExited={this.redirectToSection}>
            <p style={height}>{this.props.currentProject.description}</p>
        </Panel>
        <div>
          <DisplaySections
            fromProjectHome={this.state.fromHome}
            collapse={this.toggle}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log('LOG WITHIN HOME', state);
  return ({
    router: state.router,
    currentProject: state.currentProject,
    currentSection: state.currentSection,
    notifications: state.notifications
  });
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});


export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
) (ProjectHome));



/*
<Panel header={`Project Name: ${this.props.currentProject.name}`} bsStyle="warning" style={height}>
<Collapse in={this.state.open} onExited={this.redirectToSection}>
  <h6>Description: {this.props.currentProject.description}</h6>
</Collapse>
*/
