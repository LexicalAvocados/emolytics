import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';
import OptionListEntry from './OptionListEntry.jsx';
import FocusGroupsList from '../dashboard/FocusGroupsList.jsx';
import InvitationPanel from './InvitationPanel.jsx';
import { Link, withRouter } from 'react-router-dom';
import { Button, Col, Row, Carousel, Modal, Popover } from 'react-bootstrap';
import axios from 'axios';
import AddSection from '../create/addSection.jsx';
import SectionCarousel from './SectionCarousel.jsx';
import EditPage from '../create/EditPage.jsx';

class DisplaySections extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      splitSections: [],
      showAddSection: false,
      showEdit: false,
      idOfClickedOnSection: null
    };
    this.revealEdit = this.revealEdit.bind(this);
    this.revealAddSection = this.revealAddSection.bind(this);
    this.onSectionClick = this.onSectionClick.bind(this);
    this.splitSections = this.splitSections.bind(this);
    this.deleteSection = this.deleteSection.bind(this);
    this.beginEdit = this.beginEdit.bind(this);
  }

  componentDidMount() {
    this.splitSections();
    if (this.props.currentProject.id !== 0) { // Clear for all but demo
      this.props.currentSection.hidden = {display: 'none'};
    }
    if (this.props.currentProject.id === 0 && this.props.currentSection.backFromHome) {
      this.props.currentSection.hidden = {};
    }
  }


  onSectionClick(obj, fromProjectHome) { 
    // obj['totalInvited'] = 0;
    // this.props.currentSection.totalInvited = 0;
    axios.get('/api/getOptionsForSection', { params: {sectionId: obj.id}})
      .then((options) => {
        let sortedOptions = options.data.sort((one, two) => {
          if (one.createdAt < two.createdAt) return 1;
          if (one.createdAt > two.createdAt) return -1;
        });
        sortedOptions.push('End')
        obj['options'] = sortedOptions;
        // obj['totalInvited'] = 0;
        this.props.actions.changeCurrentSection(obj, options);
        if (!this.props.currentSection.hidden || !this.props.currentSection.hasOwnProperty('display')) {
          this.props.currentSection.hidden = {display: 'none'};
          this.props.currentSection.backFromHome = false;
        } 
        this.props.clearOnNewSection();
      })
      .catch((err) => {
        console.log('Request to get options for section NOT sent to server');
      });
    if (fromProjectHome) {
      this.props.collapse();
    }
  }

  splitSections() {
    if (!this.state.showEdit && !this.props.currentProject.sections.includes('End')) {
      this.props.currentProject.sections.push('End');
    }
    var splits = [];
    for (var i = 0; i < this.props.currentProject.sections.length; i += 3) {
      splits.push(this.props.currentProject.sections.slice(i, i + 3))
    }
    this.setState({
      splitSections: splits
    });
  }

  deleteSection() {
    if (this.state.idOfClickedOnSection === 0) {
      alert('You cannot delete this demo sections! It will disappear when you create a project');
      return;
    }
    if (confirm('Are you sure you want to delete this section?')) {
      this.props.currentProject.sections = this.props.currentProject.sections.filter((section, i) => {
        if (section.id !== this.state.idOfClickedOnSection) {
          return section;
        } else {
          if (i + 2 !== this.props.currentProject.sections.length) { // Adjust for artificial end
            this.props.actions.changeCurrentSection(this.props.currentProject.sections[i + 1]);
          } else {
            this.props.actions.changeCurrentSection(this.props.currentProject.sections[0]);
          }
        }
      });
      axios.delete('/api/deleteSection', { params: {toDelete: 'id', id: this.state.idOfClickedOnSection} })
        .then((response) => {
          // console.log(response);
          this.props.actions.removeSectionFromSections(this.props.currentProject.sections);
          this.splitSections();
          this.revealEdit();
        })
        .catch((error) => {
          console.log('Error deleting section', error);
        });
    }
  }

  revealAddSection() {
    this.setState({
      showAddSection: !this.state.showAddSection
    });
  }

  beginEdit(section) {
    this.props.actions.changeCurrentSection(section);
    this.setState({
      showEdit: !this.state.showEdit,
      idOfClickedOnSection: section.id
    });
  }

  revealEdit() {
    this.setState({
      showEdit: !this.state.showEdit,
    });
  }

  render() {
    var hidden = {
        display: 'none'
      };
    return (
      <div>
        <SectionCarousel
          splitSections={this.state.splitSections}
          beginEdit={this.beginEdit}
          revealAddSection={this.revealAddSection}
          onSectionClick={this.onSectionClick}
          fromProjectHome={this.props.fromProjectHome}
          totalInvitedTesters={this.props.totalInvitedTesters}
          fromSectionHome={this.props.fromSectionHome}
        />

        <Modal bsSize="large" show={this.state.showAddSection} onHide={this.revealAddSection}>
          <Modal.Header closeButton>
            <Modal.Title>Add a Section</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddSection
              close={this.revealAddSection}
              splitSections={this.splitSections}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.revealAddSection}>Close</Button>
          </Modal.Footer>
        </Modal>

        <Modal bsSize="large" show={this.state.showEdit} onHide={this.revealEdit}>
          <Modal.Header closeButton>
            <Modal.Title>Edit this Section</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <EditPage
              close={this.revealEdit}
              toEdit={'Section'}
              splitSections={this.splitSections}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.revealEdit}>Close</Button>
            <Button onClick={this.deleteSection}>Delete this Section</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loggedInUser: state.loggedInUser,
  focusGroups: state.focusGroups,
  currentFocusGroup: state.currentFocusGroup,
  router: state.router,
  currentProject: state.currentProject,
  currentSection: state.currentSection
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});


export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(DisplaySections));
