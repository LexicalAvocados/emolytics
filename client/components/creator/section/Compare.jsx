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
    }
    // this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    // this.setState({
    //   options: this.props.currentSection.options
    // })

  }

  // handleChange(e) {
  //   e.preventDefault();
  //   this.setState({
  //     [e.target.name]: e.target.value
  //   })
  //   console.log(this);
  // }

  render () {

    var divStyle = {
      borderLeft: '1px solid #000'
    };

    var heading = {
      textAlign: 'center',

    }

    return (
      <div>
        <div>
          <div className="sectionComparison">
            <div>
              <Col md={6}>
                <Col sm={12} style={heading}>
                  <p>{this.props.optionsToCompare[0].name}</p>
                </Col>
                <br/>
                <CompareCharts idx={1} option={this.props.optionsToCompare[0]}/>
              </Col>

              <Col md={6} style={divStyle}>
                <Col sm={12} style={heading}>
                  <p>{this.props.optionsToCompare[1].name}</p>
                </Col>
                <br/>
                <CompareCharts idx={2} option={this.props.optionsToCompare[1]}/>
              </Col>
            </div>
          </div>
        </div>
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