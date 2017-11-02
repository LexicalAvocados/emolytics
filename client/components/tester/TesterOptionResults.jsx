import React from 'react';
import c3 from 'c3';
import ReactPlayer from 'react-player';
import { Col } from 'react-bootstrap';
import axios from 'axios';
import Slider, { Range } from 'rc-slider';
import Select from 'react-select';

import Attention from '../creator/option/Subcomponents/Attention.jsx';
import Emotion from '../creator/option/Subcomponents/Emotion.jsx';
import HeatMap from '../creator/option/Subcomponents/Heatmap.jsx';

// React-Redux connect() boilerplate
// NOTE: you may have to modify the filepath for ChangeActions
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../actions';

class TesterOptionResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      player: null,
      graph: null,
      timestamp: '0',
      duration: 0,
      finished: null,
      like: null,
      comment: '',
      optionEmotionObj: {
        emotionPerc: {
          Contempt: 0,
        }, 
        attention: ['Attention'], 
        count:[0] 
      },
      videoTime: 0,
      heatmapSetting: 1,
      playVideoForHM: false
    }
    this.generateCharts = this.generateCharts.bind(this);
  }

  componentDidMount() {
    // axios.post('/api/tester/getOptionResultsForTester', {
    //   userId: this.props.loggedInUser.id,
    //   optionId: this.props.currentTesterOption.id
    // })
    //   .then(res => {
    //     console.log('res.data:', res.data);
    //     let frames = res.data[0];
    //     let testerOptionData = res.data[1];

    //     let anger = ['Anger', ...frames.map(frame => +frame.anger)];
    //     let contempt = ['Contempt', ...frames.map(frame => +frame.contempt)];
    //     let disgust = ['Disgust', ...frames.map(frame => +frame.disgust)];
    //     let fear = ['Fear', ...frames.map(frame => +frame.fear)];
    //     let happiness = ['Happiness', ...frames.map(frame => +frame.happiness)];
    //     let neutral = ['Neutral', ...frames.map(frame => +frame.neutral)];
    //     let sadness = ['Sadness', ...frames.map(frame => +frame.sadness)];
    //     let surprise = ['Surprise', ...frames.map(frame => +frame.surprise)];

    //     this.setState({
    //       player: this.refs.player,
    //       duration: testerOptionData.length,
    //       finished: testerOptionData.finished,
    //       like: testerOptionData.like,
    //       comment: testerOptionData.comment,
    //       attentionArr: [['Attention', ...frames.map(frame => +frame.attention)]],
    //       emotionsObj: {anger, contempt, disgust, fear, happiness, neutral, sadness, surprise},
    //       emotionsArrs: [anger, contempt, disgust, fear, happiness, neutral, sadness, surprise]
    //     }, () => this.generateCharts(this.state.emotionsArrs));
    //   })
    //   .catch(err => {
    //     console.log('Error fetching Option Data from database:', err);
    //   })
    let frameData = axios.post('/api/getFrames', {
      optionId: this.props.currentTesterOption.id,
      userId: this.props.loggedInUser.id
    })

    let optionData = axios.post('/api/tester/getOptionDataOnlyForTester', {
      optionId: this.props.currentTesterOption.id,
      userId: this.props.loggedInUser.id      
    })

    Promise.all([frameData, optionData])
      .then(responses => {
        let data = responses.map(res => res.data);
        this.setState({
          player: this.refs.player,
          duration: data[1].length,
          finished: data[1].finished,
          like: data[1].like,
          comment: data[1].comment,
          optionEmotionObj: data[0],
        }, () => {
          console.log('run generate charts');
          this.generateCharts();
        })
      })
  }

  generateCharts(lineGraphData) {
      console.log('generateCharts state:', this.state);
      var lineData = {
        data: lineGraphData
      }
      this.props.actions.changeLineGraphData(lineData);
      var lineGraph = c3.generate({
        bindto: '.optionChart',
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
              player.seekTo(this.state.timestamp)
            });
          },
          columns: this.state.optionEmotionObj.emotionAvg,
        },
        axis: {
          y: {
            show: false
          }
        }
      });
      console.log('lineGraph:', lineGraph);
      this.setState({
        graph: lineGraph
      });
      this.forceUpdate();
  }

  handleHeatmapData(num) {
    var boolForPlayVideo;
    num === 2 ? boolForPlayVideo = true : boolForPlayVideo = false;
    this.setState({
      heatmapSetting: num,
      playVideoForHM: boolForPlayVideo
    })
  }

  timestampCallback(seconds) {
    this.setState({
      timestamp: seconds
    }, () => {
      var player = this.refs.player;
      player.seekTo(this.state.timestamp)
    });
  }

  updateProgress(timeObj) {
    // console.log('timeObj', timeObj);
    this.setState({
      videoTime: Math.floor(timeObj.playedSeconds)
    })
  }

  sliderCallback(time) {
    this.setState({
      playVideoForHM: false
    }, () => {
      this.timestampCallback(time);
    })
  }

  playVideoButtonIcon() {
    return this.state.playVideoForHM ? 'https://cdn1.iconfinder.com/data/icons/material-audio-video/20/pause-circle-outline-128.png' : 'https://image.flaticon.com/icons/svg/26/26025.svg';
  }

  playVideoButtonCallback() {
    this.setState({
      playVideoForHM: !this.state.playVideoForHM
    }, this.playVideoButtonIcon )
  }

  render() {
    return (
      <div className='testerResultsPage'>

        <Col md={8}>
          <div className='testerResultsPlayer'>
            <ReactPlayer
              url={this.props.currentTesterOption.youtubeUrl}
              ref='player'
              controls={true}
              height='100%'
              width='96%'
              config={{
                youtube: {
                  playerVars: { showinfo: 1 }
                }
              }}
            />
          </div>
          <div className='optionChart'>
          </div>
        </Col>

          <Col md={4}>

            <div className='lightPurpleModule'>
              <h3>Personal Feedback</h3>
              You <span style={{'fontWeight': 'bold'}}>{this.state.finished ? 'finished' : 'did not finish'}</span> this video
              {this.state.finished ?
                <div>
                  <div>You <span style={{'fontWeight': 'bold'}}>{this.state.like ? 'liked' : 'did not like'}</span> this video</div>
                  <div>{this.state.comment ? `Your comment on this video: ${this.state.comment}` : null}</div>
                </div>
              :
                null}
            </div>

            <div className='lightPurpleModule'>
              <h3> Emotions Breakdown </h3>
              <Emotion optionEmotionObj={this.state.optionEmotionObj} />
            </div>
            {/*<HeatMap
              option={this.props.currentTesterOption}
              setting={this.state.heatmapSetting}
              time={this.state.videoTime}
            />*/}
          </Col>

      </div>
    )
  }
}


// React-Redux connect() boilerplate
// 1. Include the properties in the Store you want this component to have access to
// 2. Change the Component name at the very end to the one in the current file
const mapStateToProps = (state) => ({
  loggedInUser: state.loggedInUser,
  currentTesterOption: state.currentTesterOption,
  router: state.router
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(TesterOptionResults));