import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';
import OptionList from './OptionList.jsx';
import { withRouter } from 'react-router-dom';

class SectionHome extends React.Component {
  constructor(props) {
    super(props);
    this.onOptionClick = this.onOptionClick.bind(this);
  }

  onOptionClick(index) {
    this.props.actions.changeCurrentOption(this.props.currentSection.options[index]);
    this.props.history.push('/option' + this.props.currentSection.options[index].id);
  };

  render() {
    return (
      <div className="sectionHomeContainer">
        <h3>{this.props.currentProject.name}</h3>
        <p>{this.props.currentProject.description}</p>
        <p>{this.props.currentSection.name}</p>
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