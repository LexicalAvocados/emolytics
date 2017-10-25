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

  toggle() {
    this.setState({
      open: !this.state.open
    })
  }

  render() {
    return (
      <div className="projectHomeContainer">
        <Collapse in={this.state.open}>
          <Panel header={`Project Name: ${this.props.currentProject.name}`} bsStyle="warning">
            <h6>Description: {this.props.currentProject.description}</h6>
          </Panel>
        </Collapse>

        <div>
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


