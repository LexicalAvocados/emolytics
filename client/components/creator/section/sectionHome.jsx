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
      testers: []
    };
    this.onOptionClick = this.onOptionClick.bind(this);
    this.grabTesters = this.grabTesters.bind(this);
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

  render() {
    return (
      <div>
        <h3>{this.props.currentProject.name}</h3>
        <p>{this.props.currentProject.description}</p>
        <p>{this.props.currentSection.name}</p>
        <button onClick={this.grabTesters}>Invite testers to view options!</button>
        { this.state.testers.length ? (
          this.state.testers.map((tester, i) => (
            <InviteTesters 
            tester={tester}
            key={i}
            />
          ))
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