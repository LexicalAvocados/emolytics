import React from 'react';
import c3 from 'c3';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../actions';
import axios from 'axios';
import pad from 'array-pad';
import { Grid, Row, Col } from 'react-bootstrap'

import SideBar from '../creator/option/SideBar.jsx';
import Overview from '../creator/option/Subcomponents/Overview.jsx';
import Emotion from '../creator/option/Subcomponents/Emotion.jsx';

import TryItOutVideo from './TryItOutVideo.jsx';

class TryItOutAnalytics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {name: 'blobbert', age: '26', gender: 'male'},
      attention: [['Attention', 0, 0.5, 1, 1, 0.7, 0.8, 0.8, 0.5, 0.2, 0.6, 1, 1, 0.8, 0.5, 0.7, 1, 1, 0.9, 0.8, 0.9, 0.8,
                  0.75, 0.6, 0.4, 0.3, 0.34, 0.4, 0.6, 0.7, 0.8, 0.8, 0.6, 0.7, 0.4, 0.2, 0.36, 0.56, 0.7, 0.8, 0.7, 0.6,
                  0.6, 1, 1, 0.8, 0.5, 0.7, 1, 1, 0.9, 0.8, 0.9, 0.6, 1, 1, 0.8, 0.5, 0.7, 1, 1, 0.9, 0.8, 0.9, 0.7, 0.6,
                  0.6, 1, 1, 0.8, 0.5, 0.7, 1, 1, 0.9, 0.8, 0.9, 0.8, 0.7, 0.8, 0.6, 0.7, 0.19, 0.1, 0.36, 0.56, 0.7, 0.8
                ]],
      timestamp: '0',
      emotionObj: {},
      emotionsArrForRender: [],
      likeRatio: '',
      duration: 141,
      completion: 0,
      sideNavSelection: 'overview',
      allUsers: [],
      selectedUsers: [],
      graph: null,
      player: null,
    }
    this.timestampCallback = this.timestampCallback.bind(this);
    this.setDuration = this.setDuration.bind(this);
    this.generateCharts = this.generateCharts.bind(this);
    this.changeSideNavSelection = this.changeSideNavSelection.bind(this);
    // this.lineGraphDataSwitch = this.lineGraphDataSwitch.bind(this);
    // this.setStateAfterDuration = this.setStateAfterDuration.bind(this);
    this.handleUserSelectCb = this.handleUserSelectCb.bind(this);
    // this.recalculateChartsBasedOnUserSelect = this.recalculateChartsBasedOnUserSelect.bind(this);
    this.calculateCompletionPerc = this.calculateCompletionPerc.bind(this);
    this.setEmotionsArrFromObj = this.setEmotionsArrFromObj.bind(this);
    // console.log(this);
  }

  componentDidMount() {
    //orientation modal
    // this.props.actions.changeOption(this.props.currentSection.option);
    var player = this.refs.player;
    // console.log(player);
    var diff = this.state.duration - 1;
    let padArr = pad([], diff, null);
    let initialEmoObj = {
      "anger": ['Anger'].concat(padArr),
      "contempt": ['Contempt'].concat(padArr),
      "disgust": ['Disgust'].concat(padArr),
      "fear": ['Fear'].concat(padArr),
      "happiness": ['Happiness'].concat(padArr),
      "neutral": ['Neutral'].concat(padArr),
      "sadness": ['Sadness'].concat(padArr),
      "surprise": ['Surprise'].concat(padArr)
    }
    this.setState({
      player: player,
      emotionObj: initialEmoObj
    }, () => {
      let currentEmoObj = this.state.emotionObj;
      let initialEmoArrays = [currentEmoObj.anger, currentEmoObj.contempt, currentEmoObj.disgust,
                      currentEmoObj.fear, currentEmoObj.happiness, currentEmoObj.neutral, currentEmoObj.sadness, currentEmoObj.surprise];
      this.generateCharts(initialEmoArrays);
    })
  };

  setEmotionsArrFromObj(emoObj, time) {
    // console.log('Object in callback', emoObj);
    let newEmoObj = emoObj
    let currentEmoObj = this.state.emotionObj;

    if (emoObj) {
      for (var key in newEmoObj) {
        if (key === 'neutral') {
          currentEmoObj[key][time] = newEmoObj[key] / 7
        } else {
          currentEmoObj[key][time] = newEmoObj[key];
        }
      }
    }
    // console.log('current emotion obj', currentEmoObj)
    // var emotions = ["anger", "contempt", "disgust", "fear", "happiness",
    //                 "neutral", "sadness", "surprise" ]

    let emoArrays = [currentEmoObj.anger, currentEmoObj.contempt, currentEmoObj.disgust,
                    currentEmoObj.fear, currentEmoObj.happiness, currentEmoObj.neutral, currentEmoObj.sadness, currentEmoObj.surprise];

        this.setState({
          emotionObj: currentEmoObj,
          emotionsArrForRender: emoArrays
        }, () => this.generateCharts(this.state.emotionsArrForRender))
  }

  calculateCompletionPerc(array) {
    let userCompletionObj = array.sort((a, b) => a.time - b.time).reduce((acc, curr) => {
      if (!acc[curr.userId]) acc[curr.userId] = 0;
      if (acc[curr.userId] >= 0) {
        if (curr.time > acc[curr.userId]) acc[curr.userId] = curr.time / this.state.duration
      }
      return acc;
    }, {})
    // console.log('completionObj', userCompletionObj);
    var avgCompletion = 0;
    var numberOfUsers = 0;
    for (var key in userCompletionObj) {
      avgCompletion += userCompletionObj[key];
      numberOfUsers++
    };
    avgCompletion = Math.floor(1000*(avgCompletion / numberOfUsers))/10;
    this.setState({
      completion: avgCompletion
    })
  }

  // changeOption(obj) {
  //
  // }

  generateCharts(lineGraphData) {
      // console.log('generating charts now', lineGraphData);
      var lineData = {
        data: lineGraphData
      }
      this.props.actions.changeLineGraphData(lineData);
      // c3.select('.optionChart').unload();
      var lineGraph = c3.generate({
        bindto: '.tryItOutLineGraph',
        selection: {
          enabled: true
        },
        data: {
          onclick: (d) => {
            let clickedTimestamp = d.x.toString();
            this.setState({
              timestamp: clickedTimestamp
            }, () => {
              var player = this.refs.player;
              // console.log(player);
              player.seekTo(this.state.timestamp)
            })
          },
          columns: lineGraphData,
        }
      });

      var pieChart = c3.generate({
        bindto: '.emotionChart',
        data: {
          columns: [
            ['Anger', this.state.emotionObj.anger.slice(1).reduce((sum, val) => sum+= +val, 0)],
            ['Contempt', this.state.emotionObj.contempt.slice(1).reduce((sum, val) => sum+= +val, 0)],
            ['Disgust', this.state.emotionObj.disgust.slice(1).reduce((sum, val) => sum+= +val, 0)],
            ['Fear', this.state.emotionObj.fear.slice(1).reduce((sum, val) => sum+= +val, 0)],
            ['Happiness', this.state.emotionObj.happiness.slice(1).reduce((sum, val) => sum+= +val, 0)],
            ['Neutral', this.state.emotionObj.neutral.slice(1).reduce((sum, val) => sum+= +val, 0)],
            ['Sadness', this.state.emotionObj.sadness.slice(1).reduce((sum, val) => sum+= +val, 0)],
            ['Surprise', this.state.emotionObj.surprise.slice(1).reduce((sum, val) => sum+= +val, 0)]
          ],
          type : 'pie'
        }
      });
      this.setState({
        graph: lineGraph
      })
      // this.forceUpdate();
  }

  setDuration(dur) {
    this.setState({
      duration: dur
    }, () => {
      this.setStateAfterDuration();
    })
  };

  timestampCallback(seconds){
    this.setState({
      timestamp: seconds
    }, () => {
      var player = this.refs.player;
      player.seekTo(this.state.timestamp)
    })
  };

  changeSideNavSelection(item) {
    this.setState({
      sideNavSelection: item
    }, this.lineGraphDataSwitch);
  };

  handleUserSelectCb(userArr) {
    this.setState({
      selectedUsers: userArr
    }, () => {
      let userIdsArray = this.state.selectedUsers.reduce((acc, curr) => {
        acc.push(curr.id); return acc;
      }, []);
      this.recalculateChartsBasedOnUserSelect(userIdsArray);
    })
  };

  render() {
    return (
      <div className='TryItOutAnalyticsContainer'>
        <h3> Try it out with Bladerunner 2049 Trailer </h3>
        <h4> Just watch the video and view your reaction data on the graph! </h4>
        <Grid>
          <Row className='tryitout'>
            <Col xs={12} md={6}>
              <TryItOutVideo setEmotionsArrFromObj={this.setEmotionsArrFromObj}/>
            </Col>
            <Col xs={12} md={6}>
              <br/><br/>
              <div className="tryItOutLineGraph"></div>
            </Col>
          </Row>
        </Grid>


          {1 === 0 ?
            (<Overview
              allUsers={this.state.allUsers}
              selectedUsers={this.state.selectedUsers}
              viewer={this.state.user}
              attention={this.state.attention[0]}
              user={this.state.user}
              timestampCallback={this.timestampCallback}
              emotionsObj={this.state.emotionObj}
              likeRatio={this.state.likeRatio}
              completionStatus={this.state.completion}
              sideNavSelection={this.state.sideNavSelection}
              />
            ): ''
          }


      </div>
    )
  }
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
) (TryItOutAnalytics);
