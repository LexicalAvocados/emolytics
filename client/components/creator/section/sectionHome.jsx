import React from 'react';
import { connect } from 'react-redux';
import OptionList from './OptionList.jsx';

class SectionHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }


  render() {
    return (
      <div>
        <h3>{this.props.currentProject.name}</h3>
        <p>{this.props.currentProject.description}</p>
        <p>{this.props.currentSection.name}</p>
        { this.props.currentSection.options.map((option, i) => (
          <OptionList 
            option={option}
            key={i}
          />
        ))}
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  // console.log('LOG WITHIN SECTION HOME', state);
  return ({
    currentProject: state.currentProject,
    currentSection: state.currentSection
  })
};


export default connect(
  mapStateToProps
  ) (SectionHome)