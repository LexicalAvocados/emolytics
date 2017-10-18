import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';
import OptionList from './OptionList.jsx';
import InvitationPanel from './InvitationPanel.jsx';
import { Link, withRouter } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios';

class SectionHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayPanel: false,
      invited: false,
      haveInvited: false,
      invitedUserIds: [],
      testers: [],
      testersCopy: []
    }
    this.onOptionClick = this.onOptionClick.bind(this);
    this.renderInvited = this.renderInvited.bind(this);
    // this.renderHaveInvited = this.renderHaveInvited.bind(this);
    this.changeTestersCopy = this.changeTestersCopy.bind(this);
    this.renderPanel = this.renderPanel.bind(this);
  }

  componentDidMount() {
    // axios.get('/api/getTestersForOption', { params: { optionId: this.props.option.id }})
    //   .then((response) => {
    //     return response.data
    //   })
    //   .then((userIdsArray) => {
    //     let priorInvites = true;
        axios.get('/api/getTesters')
          .then((response) => {
            // var uninvitedTesters = response.data.filter((tester) => {
            //   if (userIdsArray.indexOf(tester.id) === -1) return tester;
            // });
            // if (uninvitedTesters.length === response.data.length) { 
            //   priorInvites = false;
            // }
            this.setState({
              testers: response.data,
              testersCopy: response.data,
              haveInvited: false
            });
          })
          .catch((err) => {
            console.log(err);
          });
      // })
      // .catch((error) => {
      //   console.log(error);
      // });
  }

  onOptionClick(index) {
    this.props.actions.changeCurrentOption(this.props.currentSection.options[index]);
    this.props.history.push('/option' + this.props.currentSection.options[index].id);
  }

  renderInvited() {
    this.setState({
      invited: !this.state.invited
    });
  }

  changeTestersCopy(filtered) {
    this.setState({
      testersCopy: filtered
    });
  }

  renderPanel() {
    this.setState({
      displayPanel: !this.state.displayPanel
    });
  }

  render() {
    return (
      <div className="sectionHomeContainer">
        <h3>{this.props.currentProject.name}</h3>
        <p>{this.props.currentProject.description}</p>
        <p>{this.props.currentSection.name}</p>
        <Link to="/addOption">
          <Button className="addSectionButton">Add an option</Button>
        </Link>
        { this.state.haveInvited ? (
          <p className="closerText">You have previously invited testers to view this option</p> 
        ) : ( null )}
        { !this.state.invited ? (
          !this.state.displayPanel ? (
            <Button onClick={this.renderPanel}>Invite testers</Button>
          ) : (
            <InvitationPanel
              option={this.props.option}
              sectionId={this.props.currentSection.id}
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
        <div className="currentSectionOptionsList">
          { this.props.currentSection.options.map((option, i) => (
            <OptionList
              option={option}
              key={i}
              index={i}
              onOptionClick={this.onOptionClick}
            />
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log('LOG WITHIN SECTION HOME', state);
  return ({
    router: state.router,
    currentProject: state.currentProject,
    currentSection: state.currentSection
  });
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});


export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
) (SectionHome));