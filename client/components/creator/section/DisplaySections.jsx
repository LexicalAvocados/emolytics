import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';
import OptionListEntry from './OptionListEntry.jsx';
import FocusGroupsList from '../dashboard/FocusGroupsList.jsx';
import InvitationPanel from './InvitationPanel.jsx';
import { Link, withRouter } from 'react-router-dom';
import { Button, Col, Row, Carousel, Modal } from 'react-bootstrap';
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
      showEdit: false
    };
    this.revealEdit = this.revealEdit.bind(this);
    this.revealAddSection = this.revealAddSection.bind(this);
    this.onSectionClick = this.onSectionClick.bind(this);
    this.splitSections = this.splitSections.bind(this);
  }

  componentWillMount() {
    this.splitSections();
  }


  onSectionClick(obj, fromProjectHome) { // Make this functional
    axios.get('/api/getOptionsForSection', { params: {sectionId: obj.id}})
      .then((options) => {
        let sortedOptions = options.data.sort((one, two) => {
          if (one.createdAt < two.createdAt) return 1;
          if (one.createdAt > two.createdAt) return -1;
        });
        sortedOptions.push('End')
        obj['options'] = sortedOptions;
        this.props.actions.changeCurrentSection(obj, options);
      })
      .catch((err) => {
        console.log('Request to get options for section NOT sent to server');
      });
    if (fromProjectHome) {
      console.log('yall made it');//NOPE
      this.props.history.push('/section' + obj.id);
    }
  }

  splitSections() {
    if (!this.state.showEdit) {
      this.props.currentProject.sections.push('End');
      // this.props.currentSection.options.push('End');
    }
    var splits = [];
    for (var i = 0; i < this.props.currentProject.sections.length; i += 3) {
      splits.push(this.props.currentProject.sections.slice(i, i + 3))
    }
    this.setState({
      splitSections: splits
    });
  }

  revealAddSection() {
    this.setState({
      showAddSection: !this.state.showAddSection
    });
  }

  revealEdit() {
    this.setState({
      showEdit: !this.state.showEdit
    });
  }

  render() {
    return (
      <div>
        <SectionCarousel
          splitSections={this.state.splitSections}
          revealEdit={this.revealEdit}
          revealAddSection={this.revealAddSection}
          onSectionClick={this.onSectionClick}
          fromProjectHome={this.props.fromProjectHome}
        />

        <Modal bsSize="large" show={this.state.showAddSection} onHide={this.revealAddSection}>
          <Modal.Header closeButton>
            <Modal.Title>Add a Section</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddSection
              close={this.revealAddSection}
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
            <Button>Delete this Section</Button> {/* Implement onCLick later */}
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
