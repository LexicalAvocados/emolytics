import React from 'react';
import c3 from 'c3';
import axios from 'axios';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../../actions';

class DetailedDemographics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ageDistribution: []
    }
    this.getAgeDistribution = this.getAgeDistribution.bind(this);
    this.generateBarChart = this.generateBarChart.bind(this);
    this.generatePieChartGender = this.generatePieChartGender.bind(this);
    this.generatePieChartRace = this.generatePieChartRace.bind(this);
  }

  componentDidMount() {
    this.getAgeDistribution();
  }

  getAgeDistribution() {
      var userIdsArray = this.props.selectedUsers.reduce((acc, curr) => {
        acc.push(curr.id); return acc;
      }, []);
      // console.log('userIdsArray', userIdsArray)
      var ageDist = ['Selected Users',0,0,0,0,0,0,0,0,0]
      // [selectedusers, 13-20, 21-30, 31-40, 41-50, 51-60, 61-70, 71-80]
      userIdsArray.forEach(uid => {
        axios.get('/api/creator/getUserAgeRange', {
          params: {
            uid: uid
          }
        })
        .then( (ageRangeInd) => {
          let newInd = ageRangeInd.data
          ageDist[+newInd+1]++;
          this.setState({
            ageDistribution: ageDist
          }, () => {
            this.generateBarChart();
            this.generatePieChartGender();
            this.generatePieChartRace();
          })
        })
      })
  };

  generateBarChart() {
    var barGraph = c3.generate({
      bindto: '.ageDistributionChart',
      size: {
        height: 200,
        width: 480
      },
      data: {
          columns: [this.state.ageDistribution],
          type: 'bar',
          colors: {
            'Selected Users': '#962828'
          }
      },
      bar: {
          width: {
              ratio: 0.5 // this makes bar width 50% of length between ticks
          }
      },
      axis: {
        x: {
            type: 'category',
            categories: ['13-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80', '81-90', '91-100']
          }
        }
    })
  };

  generatePieChartGender() {
    var genderObj = this.props.selectedUsers.reduce((acc, curr) => {
      if (curr.sex === 'Male') acc['male'] ? acc['male']++ : acc['male'] = 1;
      if (curr.sex === 'Female') acc['female'] ? acc['female']++ : acc['female'] = 1;
      if (curr.sex === null) acc['np'] ? acc['np']++ : acc['np'] = 1;
      return acc;
    }, {})
    // console.log('genderObj', genderObj);

    var genderArrays = [];
    for (var key in genderObj) {
      if (key !== null) {
        genderArrays.push([`${key}`, genderObj[key]])
      } else {
        genderArrays.push(['Not Provided', genderObj[key]])
      }
    }
    // console.log('genderArrays', genderArrays)

    var pieChartGender = c3.generate({
      bindto: '.genderDistributionChart',
      size: {
        height: 200,
        width: 200
      },
      data: {
        columns: genderArrays,
        type : 'pie',
        colors: {
          male: '#547199',
          female: '#7b5499'
        }
      },
    })
  };

  generatePieChartRace() {
    var raceObj = this.props.selectedUsers.reduce((acc, curr) => {
      curr.race && acc[curr.race] ? acc[curr.race]++ : acc[curr.race] = 1;
      return acc;
    }, {});
    let raceArrays = [];
    for (var key in raceObj) {
      if (key !== 'null') {
        raceArrays.push([`${key}`, raceObj[key]])
      } else {
        raceArrays.push(['Not Provided', raceObj[key]])
      }
    }
    // console.log('race arrays', raceArrays)
    var pieChartRace = c3.generate({
      bindto: '.raceDistributionChart',
      size: {
        height: 200,
        width: 200
      },
      data: {
        columns: raceArrays,
        type : 'pie'
      }
    })
  };

  render() {
    return (
      <div className='DetailedDemographicsContainer' style={center}>
        <h3> Demographics (detailed) </h3>
        <div className='ageDistribution'>
          <p> Age Distribution: </p>
          <div className='ageDistributionChart'></div>
        </div>
        <br/>
        <div className='genderAndRaceContainer'>

          <div className='genderDistribution'>
            <p> Gender Distribution: </p>
            <div className='genderDistributionChart'></div>
          </div>

          <div className='raceDistribution'>
            <p> Race Distribution: </p>
            <div className='raceDistributionChart'></div>
          </div>

        </div>
      </div>
    )
  }
};

const center = {
  textAlign: 'center'
}

const mapStateToProps = (state) => {
  return ({
    router: state.router,
    currentProject: state.currentProject,
    currentSection: state.currentSection,
    loggedInUser: state.loggedInUser,
    currentOptionAnnotations: state.currentOptionAnnotations,
    currentOption: state.currentOption,
    lineGraphData: state.lineGraphData
  });
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
) (DetailedDemographics);
