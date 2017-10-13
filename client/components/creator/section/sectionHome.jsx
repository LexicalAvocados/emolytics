import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions'
import OptionList from './OptionList.jsx';
import InviteTesters from './InviteTesters.jsx';
import axios from 'axios';


class SectionHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      testers: [],
      invited: []
    };
    this.onOptionClick = this.onOptionClick.bind(this);
    this.grabTesters = this.grabTesters.bind(this);
    this.addInvitee = this.addInvitee.bind(this);
    this.submitInvites = this.submitInvites.bind(this);
  }
  
  onOptionClick(index) {
    // console.log('OPTION CLICKED', this.props.currentSection.options[index]);
    this.props.actions.changeCurrentOption(this.props.currentSection.options[index]);
  }

  grabTesters() {
    axios.get('/api/getTesters')
      .then((response) => {
        console.log('RESPONSE FROM GET TESTERS', response); 
        this.setState({
          testers: response.data
        });
        console.log(this.state.testers);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  addInvitee(index) {
    if (this.state.invited.length >= 0 && this.state.invited.indexOf(this.state.testers[index]) === -1) {
      this.setState({
        invited: [...this.state.invited, this.state.testers[index]]
      });
    } else {
      alert('You\'ve already invited this person.');
    }
  }

  submitInvites() { // After this is clicked give some feedback to creator - collapse the thing, says sent
    axios.post('/api/sendEmails', { invitedArr: this.state.invited })
      .then((success) => {
        // console.log(success);
        this.setState({
          invited: []
        })
      })
      .catch((failure) => {
        console.log('Invites NOT sent', failure);
      })

  }

  render() {
    return (
      <div>
        <h3>{this.props.currentProject.name}</h3>
        <p>{this.props.currentProject.description}</p>
        <p>{this.props.currentSection.name}</p>
        <button onClick={this.grabTesters}>Invite testers to view options!</button>
        { this.state.testers.length ? (
          <div>
            {this.state.testers.map((tester, i) => (
              <InviteTesters 
                tester={tester}
                key={i}
                index={i}
                addInvitee={this.addInvitee}
              />
            ))}
            { this.state.invited.length ? (
              <div>
                <p>Invited:</p>
                {this.state.invited.map((invitee, i) => (
                  <p key={i}>Name: {invitee.username} Email: {invitee.email}</p> 
                ))}
                <button onClick={this.submitInvites}>Finish Inviting...</button>
              </div>
            ) : (
              null
            )}

          </div>
        ) : (
          null
        )}
        
        { this.props.currentSection.options.map((option, i) => (
          <OptionList 
            option={option}
            key={i}
            index={i}
            onOptionClick={this.onOptionClick}
          />
        ))}
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



export default connect(
  mapStateToProps,
  mapDispatchToProps
) (SectionHome);