import React from 'react';
import c3 from 'c3';
import ReactPlayer from 'react-player';
import axios from 'axios';
import pad from 'array-pad';

import Attention from '../creator/option/Subcomponents/Attention.jsx';
import Emotion from '../creator/option/Subcomponents/Emotion.jsx';
import Feedback from '../creator/option/Subcomponents/Feedback.jsx';

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
      timestamp: 0,
      duration: 0,
      finished: null,
      like: null,
      comment: '',
      attentionArr: [],
      emotionObj: {},
      emotionArrs: []
    }
    this.generateCharts = this.generateCharts.bind(this);
  }

  componentWillMount() {

    axios.post('/api/tester/getOptionResultsForTester', {
      userId: this.props.loggedInUser.id,
      optionId: this.props.currentTesterOption.id
    })
      .then(res => {
        console.log('res.data:', res.data);
        let frames = res.data[0];
        let testerOptionData = res.data[1];

        let anger = ['Anger', ...frames.map(frame => frame.anger)];
        let contempt = ['Contempt', ...frames.map(frame => frame.contempt)];
        let disgust = ['Disgust', ...frames.map(frame => frame.disgust)];
        let fear = ['Fear', ...frames.map(frame => frame.fear)];
        let happiness = ['Happiness', ...frames.map(frame => frame.happiness)];
        let neutral = ['Neutral', ...frames.map(frame => frame.neutral)];
        let sadness = ['Sadness', ...frames.map(frame => frame.sadness)];
        let surprise = ['Surprise', ...frames.map(frame => frame.surprise)];

        this.setState({
          player: this.refs.player,
          duration: testerOptionData.length,
          finished: testerOptionData.finished,
          like: testerOptionData.like,
          comment: testerOptionData.comment,
          attentionArr: [['Attention', ...frames.map(frame => frame.attention)]],
          emotionObj: {anger, contempt, disgust, fear, happiness, neutral, sadness, surprise},
          emotionArrs: [anger, contempt, disgust, fear, happiness, neutral, sadness, surprise]
        }, () => this.generateCharts(this.state.emotionObj));
      })
      .catch(err => {
        console.log('Error fetching Option Data from database:', err);
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
      this.forceUpdate();
  }

  render() {
    return (
      <div className='optionAnalyticsContainer'>

        <div className='leftSide'>
          <div className='optionPlayer'>
            <ReactPlayer
              className='optionPlayer'
              url={this.props.currentTesterOption.youtubeUrl}
              ref='player'
              controls={true}
              height='90%'
              width='95%'
              config={{
                youtube: {
                  playerVars: { showinfo: 1 }
                }
              }}
            />
          </div>

          <div className='optionChart'>
          </div>

        </div>

        {/*<div className='rightSide'>
          <div className='testerAnalyticsContainer'>

            <div className='optionContainer'>
              <Feedback
                likeRatio={props.likeRatio}
                completionStatus={props.completionStatus}
              />
            </div>

            <div className='optionContainer'>
              <Emotion
                emotionsObj={props.emotionsObj}
              />
            </div>

            <div className='optionContainer'>
              <Attention
                attention={props.attention}
                timestampCallback={props.timestampCallback}
              />
            </div>

          </div>
        </div>*/}

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