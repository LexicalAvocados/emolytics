import React from 'react';
import {Link} from 'react-router-dom';
import { Button, Modal, Form, FormGroup, FormControl, Row, Col, ControlLabel, OverlayTrigger, Popover, ButtonToolbar, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import axios from 'axios';
import OptionData from './OptionData.jsx';
import AddOption from '../create/addOption.jsx';
import EditPage from '../create/EditPage.jsx';
import AddCredits from './AddCredits.jsx';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';
import BellIcon from 'react-bell-icon';
import InvitationPanel from './InvitationPanel.jsx';

class OptionListEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      date: '',
      total: 0,
      perView: 0,
      notEnoughCredits: false,
      // invitedByOption: false,
      testers: [],
      testersCopy: [],
      haveInvited: false,
      displayPanel: false,
      specificTesters: [],
      totalNumberOfInvitedTesters: 0,
      makePublic: false
    };
    this.revealAddOption = this.revealAddOption.bind(this);
    this.updateTotal = this.updateTotal.bind(this);
    this.updatePerView = this.updatePerView.bind(this);
    this.submitCredits = this.submitCredits.bind(this);
    this.showNotifications = this.showNotifications.bind(this);
    this.renderPanel = this.renderPanel.bind(this);
    this.changeTestersCopy = this.changeTestersCopy.bind(this);
    this.revealAddOption = this.revealAddOption.bind(this);
    this.optionListPopover = this.optionListPopover.bind(this);
    this.filterTestersForOptions = this.filterTestersForOptions.bind(this);
    // this.renderInvited = this.renderInvited.bind(this);
    this.mount = this.mount.bind(this);
    this.setPublic = this.setPublic.bind(this);
    this.convertBoolToNumberForPublic = this.convertBoolToNumberForPublic.bind(this);
  }

  componentWillMount() {
    if (this.props.option !== 'End') {
      this.mount(this.props.option);
    }
    this.props.onRef(this);
    this.setState({
      makePublic: this.props.currentOption.isPublic
    });
  }

  mount(option) {
    // console.log('PUBLIC ? ', this.props.currentOption.isPublic)
    if (option !== 'End') {
      axios.get('/api/getTestersForOption', { params: { optionId: option.id }})
        .then((testerIds) => {
          console.log(testerIds)
          this.props.concatTesters(testerIds.data, this.props.index);
          this.setState({
            specificTesters: testerIds.data,
            invitedByOption: false,
            displayPanel: false,
            haveInvited: false,
            makePublic: this.props.currentOption.isPublic
          }, () => this.filterTestersForOptions());
        })
        .catch((err) => {
          console.log('Error retrieving testers for option', err);
        });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.sectionId !== this.props.sectionId) {
      if (nextProps.option !== 'End') {
        this.mount(nextProps.option);
      }
      return true;
    }
    if (nextProps.showEdit === false) {
      this.props.resetToNull();
      if (nextProps.option !== null) {
        this.mount(nextProps.option);
      }
      return true;
    }
    return true;
  }

  renderPanel() {
    this.setState({
      displayPanel: !this.state.displayPanel,
    });
  }

  changeTestersCopy(filtered) {
    this.setState({
      testersCopy: filtered
    });
  }



  revealAddOption() {
    this.setState({
      showAddOption: !this.state.showAddOption
    });
  }

  filterTestersForOptions() {
    let priorInvites = false;
    let uninvitedTesters = this.props.allTesters.filter((tester) => {
      if (this.state.specificTesters.indexOf(tester.id) >= 0) {
        priorInvites = true;
      } else {
        return tester;
      }
    });
    this.setState({
      testers: uninvitedTesters,
      testersCopy: uninvitedTesters,
      haveInvited: priorInvites,
      totalNumberOfInvitedTesters: this.state.specificTesters.length
    });
    this.props.incrementTotalInvitedTesters(this.state.specificTesters.length);
  }

  updateTotal(e) {
    if(e.target.value > this.props.loggedInUser.credits) {
      this.setState({
        notEnoughCredits: true
      })
    } else {
      this.setState({
        notEnoughCredits: false,
        total: e.target.value
      })
    }
  };

  updatePerView(e) {
    this.setState({
      perView: e.target.value
    })
  };

  setPublic(num) {
    var bool;
    num === 1 ? bool = false : bool = true;
    this.setState({
      makePublic: bool
    }, () => {
      this.props.currentOption.isPublic = bool;
      axios.post('/api/option/setPublicStatus', {
        optionId: this.props.currentOption.id,
        makePublic: this.state.makePublic
      })
        .then((res) => {
          console.log('res from updating public status', res)
        })
    })
  }

  submitCredits(e) {
    e.preventDefault();
    if (this.props.currentSection.id === 0) {
      alert('You cannot use the credits system in the demo. If you\'d like to leave the demo please create a project.');
      return;
    }
    let body = {
      optionId: this.props.currentOption.id,
      total: this.state.total,
      perView: this.state.perView
    };
    axios.post('/api/addCreditsToOption', body)
      .then((res)=>{
        // console.log('res from addCreditsToOption', res)
        this.setState({
          showAddCredits: false
        })
      })
      .then(()=>{
        //deduce points from user total
        axios.post('/api/addCredits', {
          amount: -this.state.total
        })
          .then((res)=>{
            // console.log('res from deducting credits from user', res);
            let credits = this.props.loggedInUser.credits - this.state.total;
            this.props.actions.setCredits(credits); // Redundant on first login
            this.setState({
              total: 0,
              perView: 0
            })
          })
      })
  }

  showNotifications(option) {
    // console.log('Notifications to display', notifsArray)
    this.props.showNotifsCb(option)
  }

  optionListPopover() {
    if (this.props.currentSection.id === 0) {
      return (
        <Popover id="popover-trigger-hover" title="Guten Tag!" style={this.props.currentSection.displayOptionListPopover}>Clicking on an option will bring up information about that option.</Popover>
      );
    } else {
      let hidden = {
        display: 'none'
      };
      return (
        <Popover id="popover-trigger-hover" style={hidden}></Popover>
      );
    }
  }

  callBeginEdit(option) {
    this.props.beginEdit(option, this.state.testers, this.state.testersCopy)
  }


  convertBoolToNumberForPublic(bool) {
    return bool ? 2 : 1;
  }

  render() {
    const containerStyle = {
    };

    const details =  {
    };

    const stats =  {
      display: 'inline-block',
      position: 'absolute',
      float: 'right',
      // marginLeft: '36%'
      right: '5px'
    };

    const notifs = {
    };

    const testers = {
    };

    const testersIcon = {
      height: '20px',
      width: '20px'
    };

    const iconImg = {
      // height: '10vh',
      width: '90%'
    };

    const hrStyle = {
      borderTop: '1px solid rgba(0, 0, 0, 0.1)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.3)'
    }

    return (
      <div>
        { this.props.option !== 'End'  ? (
          <OverlayTrigger placement="right" overlay={this.optionListPopover()}>
            <div className="currentSectionOptionListEntry" onClick={() => this.props.onOptionClick(this.props.index)}>
              <div className="optionListEntry" style={containerStyle}>
                <div style={stats}>
                  { this.props.notifications.length > 0 ? (
                    <div onClick={() => {this.showNotifications(this.props.option)}} style={notifs}>
                      <BellIcon height='20' width='20' />
                      <a>{this.props.notifications[0].count || 0}</a>
                    </div>
                  ) : ''}

                  <div style={testers}>
                    <img style={testersIcon} src="https://www.shareicon.net/data/512x512/2015/10/31/664827_users_512x512.png"/>
                    <a>{this.state.totalNumberOfInvitedTesters}</a>
                  </div>

                </div>

                <div style={details}>
                  <img className="optionListThumbnail2" src={this.props.option.thumbnail} style={iconImg} alt=""/>
                  <p className="closerText"> <b> {this.props.option.name} </b> </p>
                  <p className="closerText"> <small> {this.props.option.description} </small> </p>
                  <p className="closerText"> <small> Balance: {this.props.option.totalcredits || 0} </small> </p>
                </div>
                {/* <p>Created On: {this.state.date = new Date(this.props.option.createdAt.slice(0, 19)).toString().slice(0, 24)}</p> */}
              </div>
              {/* <OptionData data={this.props.optionData}/> */}
              <Button bsSize="small" onClick={() => this.props.beginEdit(this.props.option, this.state.testers, this.state.testersCopy)}>Option Settings</Button>
            </div>
          </OverlayTrigger>
        ) : (
          <div onClick={this.revealAddOption} className="currentSectionOptionListEntry">
            <div className="optionListEntry" style={plusStyle}>
              <h1 >+</h1> {/* Style this later */}
            </div>
          </div>
        )}
        <Modal bsSize="large" show={this.state.showAddOption} onHide={this.revealAddOption}>
          <Modal.Header closeButton>
            <Modal.Title>Add an Option</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddOption
              close={this.revealAddOption}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.revealAddOption}>Close</Button>
          </Modal.Footer>
        </Modal>

        <Modal bsSize="large" show={this.props.showEdit} onHide={this.props.toggleEdit} onEntering={this.renderPanel} onExiting={this.renderPanel}>
          <Modal.Header closeButton>
            <Modal.Title>Option Settings</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <Row style={offset}>
              <Col md={6}>
                <EditPage
                  close={this.props.toggleEdit}
                  toEdit={'Option'}
                  />
              </Col>
              <Col md={6}>
                <AddCredits
                  notEnoughCredits={this.state.notEnoughCredits}
                  submitCredits={this.submitCredits}
                  updateTotal={this.updateTotal}
                  updatePerView={this.updatePerView}
                  credits={this.props.loggedInUser.credits}
                  option={this.props.currentOption}
                  />
              </Col>
            </Row>

          <hr style={hrStyle} />
          <Row>
            <Col md={6}>

              <h3> Invite Testers </h3>
              {!this.state.displayPanel ? (
                <div>
                  {this.props.invitedByOption ? (
                    <p>Testers Invited!</p>
                  ) : (
                    null
                  )}
                  <Button onClick={this.renderPanel}>Invite testers</Button>

                </div>
              ) : (

                <InvitationPanel
                  renderInvited={this.props.renderInvitedByOption}
                  changeTestersCopy={this.changeTestersCopy}
                  renderPanel={this.renderPanel}
                  style={optionInvitationPanelStyle}
                  displayBorder={false}
                  />

              )}
            </Col>

            <Col md={6}>
              <h3> Access </h3>
                <ButtonToolbar>
                  <ToggleButtonGroup type="radio" name="public" defaultValue={this.convertBoolToNumberForPublic(this.state.makePublic)} onChange={this.setPublic}>
                    <ToggleButton value={1}>Private</ToggleButton>
                    <ToggleButton value={2}>Public</ToggleButton>
                  </ToggleButtonGroup>
                </ButtonToolbar>
            </Col>

          </Row>

          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.toggleEdit}>Done</Button>
            <Button onClick={this.props.deleteOption} style={fleft}>Delete this Option</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

const plusStyle = {
  marginLeft: '30%'
}

const optionInvitationPanelStyle = {
  // width: ''
  marginLeft: '20%'
}

const offset = {
  marginLeft: '3%'
}

const fleft = {
  float: 'left'
}

const mapStateToProps = (state) => ({
  router: state.router,
  currentSection: state.currentSection,
  loggedInUser: state.loggedInUser,
  currentOption: state.currentOption
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OptionListEntry);
