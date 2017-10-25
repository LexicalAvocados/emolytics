import React from 'react';
import { Col } from 'react-bootstrap';
import CompareCharts from './ComparisonCharts.jsx';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';
import { Link, withRouter } from 'react-router-dom';

// Separate component because we will want to display more information and style it easily
class CompareOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      option1: 0,
      option2: 0,

    }
    console.log(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.setState({
      options: this.props.currentSection.options
    })
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    })
    console.log(this);
  }

  render () {

    var divStyle = {
      borderLeft: '1px solid #000'
    };

    var heading = {
      clear: 'right',

    }
    var selections = this.state.options.map( (elem, i) => {
      return <option value={i}>{elem.name}</option>
    })

    return (
      <div>
      { this.state.options.length >= 2 ? (
        <div>
          <div className="sectionComparison">
          <div style={heading}>
            <h3  >Comparison</h3>
          </div>
          <br/>

          <div>
          <Col md={6}>
            <select name="option1" value={this.state.option1} onChange={this.handleChange}>

              {selections}
              
            </select>
            <CompareCharts idx={1} option={this.props.currentSection.options[this.state.option1]}/>

          </Col>

          <Col md={6} style={divStyle}>
            <select name="option2" value={this.state.option2} onChange={this.handleChange}>

              {selections}
              
            </select>
            <CompareCharts idx={2} option={this.props.currentSection.options[this.state.option2]}/>
          </Col>
          </div>
        </div>
        </div>
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
  currentSection: state.currentSection
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});


export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(CompareOptions));


{/* <Checkbox onChange={(e) => this.props.handleInvites(e, this.props.index)}>
Name: {this.props.tester.username} Age: {this.props.tester.age} Sex: {this.props.tester.sex} Race: {this.props.tester.race}
</Checkbox> */}