import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';
import OptionListEntry from './OptionListEntry.jsx';
import FocusGroupsList from '../dashboard/FocusGroupsList.jsx';
import InvitationPanel from './InvitationPanel.jsx';
import { Link, withRouter } from 'react-router-dom';
import { Button, Col, Row, Carousel, Modal, Panel } from 'react-bootstrap';
import axios from 'axios';
import Compare from './Compare.jsx';
import ToggleDisplay from 'react-toggle-display';
import AddSection from '../create/addSection.jsx';
import SectionCarousel from './SectionCarousel.jsx';
import EditPage from '../create/EditPage.jsx';
import OptionHome from '../option/OptionHome.jsx';
import DisplaySections from './DisplaySections.jsx';

class SectionHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayPanel: false,
      invited: false,
      assigned: false,
      haveInvited: false,
      invitedUserIds: [],
      testersForOptions:[],
      idOfClickedOnOption: null,
      testers: [],
      testersCopy: [],
      optionData: [],
      compare: false,
      showData: false,
      compareOptions: [],
      fromSectionHome: true,
      showEdit: false
    };
    this.onOptionClick = this.onOptionClick.bind(this);
    this.renderInvited = this.renderInvited.bind(this);
    // this.renderHaveInvited = this.renderHaveInvited.bind(this);
    this.changeTestersCopy = this.changeTestersCopy.bind(this);
    this.concatTesters = this.concatTesters.bind(this);
    this.renderPanel = this.renderPanel.bind(this);
    this.assignFocusGroup = this.assignFocusGroup.bind(this);
    this.deleteOption = this.deleteOption.bind(this);
    this.getOptionsData = this.getOptionsData.bind(this);
    this.compare = this.compare.bind(this);
    this.clearOnNewSection = this.clearOnNewSection.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.beginEdit = this.beginEdit.bind(this);
    this.getNotificationsForOption = this.getNotificationsForOption.bind(this);
  }

  componentWillMount() {
    axios.get('/api/getTesters')
      .then((response) => {
        this.setState({
          testers: response.data
        });
        // console.log('TESTERS BEFORE FILTER', this.state.testers)
      })
      .catch((err) => {
        console.log(err);
      });

    this.getOptionsData();
  }

  clearOnNewSection() {
    this.setState({
      compareOptions: [],
      showData: false,
      compare: false,
    });
  }

  concatTesters(testers, index) {
    var freeOfDuplicates = [];
    testers.forEach((tester) => {
      if (this.state.testersForOptions.indexOf(tester) === -1) {
        freeOfDuplicates.push(tester);
      }
    });
    this.setState({
      testersForOptions: [ ...this.state.testersForOptions, ...freeOfDuplicates ]
    });
    if (index === this.props.currentSection.options.length - 1) {
      this.state.testersForOptions.concat(testers);
      var priorInvites = true;
      var testersThatHaveNotBeenInvited = this.state.testers.filter((tester) => {
        if (this.state.testersForOptions.indexOf(tester.id) === -1) return tester;
      });
      // console.log('Not invited', testersThatHaveNotBeenInvited);
      // console.log('All', this.state.testers);
      if (testersThatHaveNotBeenInvited.length === this.state.testers.length) {
        priorInvites = false;
      }
      this.setState({
        testers: testersThatHaveNotBeenInvited,
        testersCopy: testersThatHaveNotBeenInvited,
        haveInvited: priorInvites
      });
    }
  }



  onOptionClick(index) { // Functional
    if (this.state.compare) { // We are setting up to compare
      if (this.state.compareOptions.length < 2) { // Need two options
        this.setState({
          compareOptions: [ ...this.state.compareOptions, this.props.currentSection.options[index]],
          showData: false
        });
      } else {
        this.setState({
          compareOptions: [],
          compare: false,
          showData: true
        });
        this.props.actions.changeCurrentOption(this.props.currentSection.options[index]);
      }
    } else { // Clicked on option
      this.setState({
        showData: true,
        compareOptions: []
      });
      this.props.actions.changeCurrentOption(this.props.currentSection.options[index]);
    }
  }

  renderInvited() {
    this.setState({
      invited: !this.state.invited
    });
  }

  renderAssigned() {
    this.setState({
      assigned: !this.state.assigned
    });
  }

  changeTestersCopy(filtered) {
    this.setState({
      testersCopy: filtered
    });
  }

  deleteOption() {
    if (confirm('Are you sure you want to delete this option?')) {
      this.props.currentSection.options = this.props.currentSection.options.filter((option, i) => {
        if (option.id !== this.state.idOfClickedOnOption) {
          return option;
        } else {
          this.props.actions.changeCurrentOption([]); // Set to nothing
          this.clearOnNewSection();
        }
      });
      this.props.actions.removeOptionFromOptions(this.props.currentSection.options);
      axios.delete('/api/deleteOption', { params: {toDelete: 'id', id: this.state.idOfClickedOnOption} })
        .then((response) => {
          this.toggleEdit();
        })
        .catch((error) => {
          console.log('Error deleting option', error);
        });
    }
  }

  beginEdit(option) {
    this.props.actions.changeOption(option);
    this.setState({
      showEdit: !this.state.showEdit,
      idOfClickedOnOption: option.id
    });
  }

  toggleEdit() {
    this.setState({
      showEdit: !this.state.showEdit
    });
  }

  renderPanel() {
    this.setState({
      displayPanel: !this.state.displayPanel,
    });
  }

  assignFocusGroup() {
    let options = this.props.currentSection.options;
    let focusGroupMembers = this.state.testers.reduce((members, tester, i) => {
      if (this.props.currentFocusGroup.testers.includes(tester.username)) {
        return [...members, tester];
      } else {
        return members;
      }
    }, []);
    // console.log('options:', options, 'focusGroupMembers:', focusGroupMembers);

    axios.post('/api/sendEmails', {
      invitedArr: focusGroupMembers,
      options
    })
      .then(res => {
        this.renderAssigned();
      })
      .catch(err => {
        console.log('Error assigning Group to Section:', err);
      })
  }

  getOptionsData() {
    axios.post('/api/section/getOptionsData', this.props.currentSection.options)
      .then(data => {
        // console.log(data);
        if (data.data) {
          this.setState({
            optionData: data.data
          })
        }
      })
  }

  compare() {
    console.log(this.props.currentSection.options.length);
    if (this.props.currentSection.options.length < 3) { // Adjust for dummy option
      alert('You\'ll need at least two options before you can compare them!');
    } else {
      this.setState({
        compare: !this.state.compare
      });
    }
  }

  getNotificationsForOption(option) {
    var idForOption = option.id;
    if (this.props.notifications.allUserNotifs) {
      var notifsForOption = this.props.notifications.allUserNotifs.filter((item) => {
        return item.optionId === idForOption;
      });
    }
    return notifsForOption || [];
  }

  render() {
    return (
      <div className="sectionHomeContainer">
        <div>
          <div>
            <Panel collapsible header={`Project Name: ${this.props.currentProject.name}`}>
              Description: {this.props.currentProject.description}
            </Panel>
          </div>
          <DisplaySections
            clearOnNewSection={this.clearOnNewSection}
            fromSectionHome={this.state.fromSectionHome}
          />
        </div>

        { !this.state.compare ? (
          <Button onClick={this.compare}> Compare </Button>
        ): (
          <p>Choose two options</p>
        )}


        { this.state.haveInvited ? (
          <p className="closerText">You have previously invited testers to view this option</p>
        ) : ( null )}

        { !this.state.invited ? (
          !this.state.displayPanel ? (
            <Button onClick={this.renderPanel}>Invite testers</Button>
          ) : (
            <InvitationPanel
              options={this.props.currentSection.options}
              renderInvited={this.renderInvited}
              invitedUserIds={this.state.invitedUserIds}
              testers={this.state.testers}
              testersCopy={this.state.testersCopy}
              changeTestersCopy={this.changeTestersCopy}
              renderPanel={this.renderPanel}
            />
          )
        ) : (
          <p>Testers Invited!</p>
        )}
        <Col className="currentSectionOptionsList" md={3}>
          { this.props.currentSection.options.map((option, i) => ( // Scrolling will have to be fine tuned later
            <OptionListEntry
              option={option}
              notifications={this.getNotificationsForOption(option)}
              key={i}
              index={i}
              onOptionClick={this.onOptionClick}
              concatTesters={this.concatTesters}
              deleteOption={this.deleteOption}
              beginEdit={this.beginEdit}
              toggleEdit={this.toggleEdit}
              showEdit={this.state.showEdit}
            />
          ))}
        </Col>

        {this.props.focusGroups.length > 0 ?
          <div>
            <FocusGroupsList />
            {this.props.currentFocusGroup && this.props.currentFocusGroup.testers.length > 0 ?
              <div>
                <h3>{this.props.currentFocusGroup.name} Members</h3>
                <div>
                  <ul>
                    {this.props.currentFocusGroup.testers.map((tester, i) => (
                      <li key={i}>{tester}</li>
                    ))}
                  </ul>
                </div>
                <Button
                  bsStyle='primary'
                  onClick={this.assignFocusGroup}
                >Assign Group to Section</Button>
                {this.state.assigned ?
                  'Group Assigned!'
                :
                  null}
              </div>
            :
              null}
          </div>
        :
          null}




         { this.state.showData ? (
            <OptionHome />
         ):(
           null
         )}

         { this.state.compareOptions.length === 2 ? (
           <Compare
             optionsToCompare={this.state.compareOptions}
             compare={this.compare}
           />
         ) : (
           null
         )}

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
  currentSection: state.currentSection,
  notifications: state.notifications
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});


export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SectionHome));
