import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';
import OptionListEntry from './OptionListEntry.jsx';
import FocusGroupsList from '../dashboard/FocusGroupsList.jsx';
import InvitationPanel from './InvitationPanel.jsx';
import { Link, withRouter } from 'react-router-dom';
import { Button, Col, Row, Carousel, Modal, Panel, OverlayTrigger, Popover, ListGroup, ListGroupItem, Fade, Alert } from 'react-bootstrap';
import axios from 'axios';
import Compare from './Compare.jsx';
import ToggleDisplay from 'react-toggle-display';
import AddSection from '../create/addSection.jsx';
import SectionCarousel from './SectionCarousel.jsx';
import EditPage from '../create/EditPage.jsx';
import OptionHome from '../option/OptionHome.jsx';
import DisplaySections from './DisplaySections.jsx';
import SnackBar from 'react-material-snackbar';
import { NotificationStack } from 'react-notification';


class SectionHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayPanel: false,
      invited: false,
      assigned: false,
      haveInvited: false,
      testersForOptions:[],
      idOfClickedOnOption: null,
      testers: [],
      testersCopy: [],
      optionData: [],
      compare: false,
      showData: false,
      compareOptions: [],
      fromSectionHome: true,
      showEdit: null,
      showNotifications: false,
      currentNotification: {},
      allNotifications: [],
      testerToPassToOptionListEntry: [],
      noCreditsAlert: [],
      fromSectionHomeToInvitationPanel: true,
      totalInvitedTesters: 0,
      active: -1,
      invitedByOption: false,
      fixedTesterPool: []
    };
    this.onOptionClick = this.onOptionClick.bind(this);
    this.renderInvited = this.renderInvited.bind(this);
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
    this.showNotifsCb = this.showNotifsCb.bind(this);
    this.decorateNotificationObjects = this.decorateNotificationObjects.bind(this);
    this.dismissNotification = this.dismissNotification.bind(this);
    this.resetToNull = this.resetToNull.bind(this);
    this.onOptionClickCallbackForLowCredit = this.onOptionClickCallbackForLowCredit.bind(this);
    this.incrementTotalInvitedTesters = this.incrementTotalInvitedTesters.bind(this);
    this.renderInvitedByOption = this.renderInvitedByOption.bind(this);
  }

  componentWillMount() {
    axios.get('/api/getTesters')
      .then((response) => {
        this.setState({
          testers: response.data,
          testerToPassToOptionListEntry: response.data,
          fixedTesterPool: response.data
        });
        // console.log('TESTERS BEFORE FILTER', this.state.teers)
      })
      .catch((err) => {
        console.log(err);
      });

    this.getOptionsData();
    this.decorateNotificationObjects();
  }

  incrementTotalInvitedTesters(count) {
    this.setState({
      totalInvitedTesters: this.state.totalInvitedTesters += count
    });    
  }

  resetToNull() {
    this.setState({
      showEdit: null
    });
  }

  renderInvitedByOption() {
    this.setState({
      invitedByOption: !this.state.invitedByOption
    });
  }

  toggleEdit() {
    this.setState({
      showEdit: false
    });
  }

  decorateNotificationObjects() {

    if (this.props.notifications.allUserNotifs) {

      var consolidatedNotifs = this.props.notifications.allUserNotifs.reduce((acc, curr) => {
        acc[curr.optionName] ? acc[curr.optionName] += 1 : acc[curr.optionName] = 1;
        return acc;
      }, {});

      var allNotifs = [];
      for (var key in consolidatedNotifs) {
        let temp = {};
        temp['optionName'] = key;
        temp['count'] = consolidatedNotifs[key]
        temp['message'] = `${consolidatedNotifs[key]} testers watched your option ${key}`;
        allNotifs.push(temp);
      }

      this.setState({
        allNotifications: allNotifs
      })
    } //close if block
  }

  clearOnNewSection() {
    this.setState({
      compareOptions: [],
      showData: false,
      compare: false,
      totalInvitedTesters: 0,
      displayPanel: false
    });
  }

  concatTesters(testers, index) {
    this.setState({
      testersForOptions: []
    });
    var freeOfDuplicates = [];
    testers.forEach((tester) => {
      if (this.state.testersForOptions.indexOf(tester) === -1) {
        freeOfDuplicates.push(tester);
      }
    });
    this.setState({
      testersForOptions: [ ...this.state.testersForOptions, ...freeOfDuplicates ]
    });
    if (index + 1 === this.props.currentSection.options.length - 1) { // This condition is bad
      console.log('within the if', this.state.testersForOptions)
      this.state.testersForOptions.concat(testers);
      var priorInvites = true;
      var testersThatHaveNotBeenInvited = this.state.fixedTesterPool.filter((tester) => {
        if (this.state.testersForOptions.indexOf(tester.id) === -1) return tester;
      });
      if (testersThatHaveNotBeenInvited.length === this.state.fixedTesterPool.length) {
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
        compareOptions: [],
      });
      this.props.currentSection.displayOptionListPopover = { display: 'none'};
      this.props.actions.changeCurrentOption(this.props.currentSection.options[index]);
    }
  }

  onOptionClickCallbackForLowCredit(option) {
    // need to get testers in option home state

    // create function in optionListEntry that returns the testers in state, call from here
    this.oler.callBeginEdit(option);
    // call begin edit with those arguments

  }

  renderInvited() {
    this.setState({
      invited: !this.state.invited
    });
  }

  renderAssigned() {
    console.log('inside renderAssigned');
    this.setState({
      assigned: true
    });
    setTimeout(() => this.setState({assigned: false}), 3000);
  }

  beginEdit(option, testers, testersCopy) {
    this.props.currentOption.testers = testers;
    this.props.currentOption.testersCopy = testersCopy;
    this.props.actions.changeOption(option);
    this.setState({
      showEdit: !this.state.showEdit,
      idOfClickedOnOption: option.id,
      invitedByOption: false
    });
  }

  deleteOption() {
    if (this.state.idOfClickedOnOption === 0 || this.state.idOfClickedOnOption === 1) {
      alert('You cannot delete demo options! They will disappear when you create a project');
      return;
    }
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

  renderPanel(e, opening = false, section) {
    e.stopPropagation();
    if (this.state.displayPanel === false) {
      this.displaySecs.highlightSelected(section.id, false, true);
    }
    if (opening) {
      var noCredits = this.props.currentSection.options.reduce((acc, option) => {
        if ((option.totalcredits === 0 || option.totalcredits <= (option.creditsperview * 2)) && option !== 'End') {
          acc.push(option);
        }
        return acc;
      }, []);
    }
    this.setState({
      displayPanel: !this.state.displayPanel,
      noCreditsAlert: noCredits
    })
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
    var nameOfOption = option.name;
    if (this.state.allNotifications) {
      var notifsForOption = this.state.allNotifications.filter((item) => {
        return item.optionName === nameOfOption;
      });
    }
    return notifsForOption || [];
  }

  showNotifsCb(option) {
    // Filter notifications in state by selected option id

    var filteredNotifs = this.state.allNotifications.filter((item) => {
      return item.optionName === option.name
    })

    this.setState({
      showNotifications: true,
      currentNotification: filteredNotifs[0]
    })
  };

  dismissNotification() {
    //splice current notification from allNotifications array in state
    var optionNameToDelete = this.state.currentNotification.optionName;
    var editedNotifications = this.state.allNotifications.filter((item) => {
      return item.optionName !== this.state.currentNotification.optionName
    })
    //remove current notification from state
    this.setState({
      allNotifications: editedNotifications,
      currentNotification: {},
      showNotifications: false
    })
    //axios call to db with optionName
    axios.post('/api/markNotificationAsSeen', {
      optionName: optionNameToDelete
    })
      .then((res) => {
      })
  }

  render() {

    var middleStyle = {
      clear: 'both'
    }
    const top = {
      marginTop: '10px',
      marginBottom: '-10px',
      marginRight: '5%',
      float: 'right'
    }

    return (
      <div className="sectionHomeContainer">
        <div>
          <div>
            { this.props.currentSection.id === 0 ? (
              <h3 className="demoWelcomeHeader">From this page you can see all the options associated with a specifc section! This is the best place to manage your various sections and their options. You can invite testers to view the options within a section, and edit the options within a section.</h3>
            ):(
              null
            )}
            <Panel collapsible header={`${this.props.currentProject.name.toUpperCase()}`}>
              {this.props.currentProject.description}
            </Panel>
          </div>
          <DisplaySections
            clearOnNewSection={this.clearOnNewSection}
            fromSectionHome={this.state.fromSectionHome}
            totalInvitedTesters={this.state.totalInvitedTesters}
            renderPanel={this.renderPanel}
            onRef={displaySecs => (this.displaySecs = displaySecs)}
          />
        </div>

        <div style={middleStyle}>

          { !this.state.compare ? (
            <Button style={top} onClick={this.compare}> Compare </Button>
          ): (
            <p>Choose two options</p>
            // No ability to cancel. Need to heavily change this
          )}

          { !this.state.invited ? (
            !this.state.displayPanel ? (
              null
            ) : (
              <div>
                <Col md={6}>
                  <InvitationPanel
                    options={this.props.currentSection.options}
                    renderInvited={this.renderInvited}
                    testers={this.state.testers}
                    testersCopy={this.state.testersCopy}
                    renderPanel={this.renderPanel}
                    noCreditsAlert={this.state.noCreditsAlert}
                    fromSectionHomeToInvitationPanel={this.state.fromSectionHomeToInvitationPanel}
                    onOptionClickCallbackForLowCredit={this.onOptionClickCallbackForLowCredit}
                  />
                </Col>
                <Col md={6}>
                  <div className='sectionHomeInviteModule'>
                    <h3>Invite by Group</h3>
                    
                    <hr className='standardHR'/>

                    {this.props.focusGroups.length > 0 ?
                      <div>
                        <FocusGroupsList />

                        {this.props.currentFocusGroup && this.props.currentFocusGroup.testers.length > 0 ?
                          <div>

                            <Button
                              bsStyle='primary'
                              className='sectionHomeAssignGroupBtn'
                              onClick={this.assignFocusGroup}
                            > Assign <i>{this.props.currentFocusGroup.name}</i> to Section </Button>

                            <Fade in={this.state.assigned}>
                              <Alert bsStyle='success'>
                                Testers assigned!
                              </Alert>
                            </Fade>

                          </div>
                        :
                          null}

                      </div>
                    :
                      null}
                  </div>
                </Col>
              </div>
            )
          ) : (
            <p>Testers Invited!</p>
          )}

        </div>

        <Col className="currentSectionOptionsList" md={2}>
          { this.props.currentSection.options.map((option, i) => ( // Scrolling will have to be fine tuned later
            <OptionListEntry
              onRef={oler => (this.oler = oler)}
              option={option}
              notifications={this.getNotificationsForOption(option)}
              key={i}
              sectionId={this.props.currentSection.id}
              index={i}
              onOptionClick={this.onOptionClick}
              concatTesters={this.concatTesters}
              deleteOption={this.deleteOption}
              beginEdit={this.beginEdit}
              toggleEdit={this.toggleEdit}
              showEdit={this.state.showEdit}
              showNotifsCb={this.showNotifsCb}
              allTesters={this.state.testerToPassToOptionListEntry}
              resetToNull={this.resetToNull}
              incrementTotalInvitedTesters={this.incrementTotalInvitedTesters}
              renderInvitedByOption={this.renderInvitedByOption}
              invitedByOption={this.state.invitedByOption}
            />
          ))}
        </Col>
        { this.state.showData ? (
          <Col md={10} style={col10Style}>
            <OptionHome />
          </Col>
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

          { this.state.showNotifications && this.state.allNotifications.length > 0 ? (
              <div onClick={this.dismissNotification} style={notifContainerStyle}>
                <SnackBar show={true} >
                  <p> {this.state.currentNotification.message}</p>
                </SnackBar>
              </div>
          ) : ''}

      </div>
    );
  }
}

const col10Style = {
  marginBottom: "20px"
}

const notifContainerStyle = {
  opacity: '0.5'
}

const mapStateToProps = (state) => ({
  loggedInUser: state.loggedInUser,
  focusGroups: state.focusGroups,
  currentFocusGroup: state.currentFocusGroup,
  router: state.router,
  currentProject: state.currentProject,
  currentSection: state.currentSection,
  notifications: state.notifications,
  currentOption: state.currentOption
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});


export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SectionHome));
