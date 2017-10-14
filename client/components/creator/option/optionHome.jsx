import React from 'react';
import c3 from 'c3';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';
import axios from 'axios';
import pad from 'array-pad';

import SideBar from './SideBar.jsx';
import Overview from './Subcomponents/Overview.jsx';
import Attention from './Subcomponents/Attention.jsx';
import Demographics from './Subcomponents/Demographics.jsx';
import Emotion from './Subcomponents/Emotion.jsx';
import Feedback from './Subcomponents/Feedback.jsx';

class OptionHome extends React.Component {
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
      likeStatus: false,
      duration: 0,
      completion: 0,
      sideNavSelection: 'overview'
    }
    this.timestampCallback = this.timestampCallback.bind(this);
    this.setDuration = this.setDuration.bind(this);
    this.generateCharts = this.generateCharts.bind(this);
    this.changeSideNavSelection = this.changeSideNavSelection.bind(this);
    this.lineGraphDataSwitch = this.lineGraphDataSwitch.bind(this);
    this.setStateAfterDuration = this.setStateAfterDuration.bind(this);
  }

  componentDidMount() {
    //orientation modal
    this.setState({
      user: this.props.loggedInUser
    })
  }

  setStateAfterDuration() {
    var emotions = ["anger", "contempt", "disgust", "fear", "happiness",
                    "neutral", "sadness", "surprise" ]

    axios.post('/api/getFrames', {
      optionId: this.props.currentSection.option.id
    })
    .then((res) => {
      let tempEmotionObj = {};
      let calcCompletion = Math.floor(1000*(res.data.length / this.state.duration))/10;
      this.setState({
        completion: calcCompletion
      })

      emotions.forEach(emo => {
        let capitalized = emo.slice(0, 1).toUpperCase() + emo.slice(1);
        tempEmotionObj[emo] = res.data.reduce((acc, curr) => {
            acc.push(curr[emo]);
            return acc;
          }, [capitalized]);
        if (tempEmotionObj[emo].length < this.state.duration) {
          var diff = this.state.duration - tempEmotionObj[emo].length - 1;
          let padArr = pad([], diff, null);
          tempEmotionObj[emo] = tempEmotionObj[emo].concat(padArr);
        }
      })
      return tempEmotionObj;
    })
    .then((emoObj) => {
      let emoArray = [emoObj.anger, emoObj.contempt, emoObj.disgust, emoObj.fear,
                      emoObj.happiness, emoObj.neutral,emoObj.sadness,emoObj.surprise];
      this.setState({
        emotionObj: emoObj,
        emotionsArrForRender: emoArray
      })
    })
    .then( () => {
      axios.post('/api/getLike', {
        optionId: this.props.currentSection.option.id,
        username: this.props.loggedInUser.username
      })
      .then( (res) => {
        this.setState({
          likeStatus: res.data.like
        })
      })
    })
    .then( () => {
      this.generateCharts(this.state.emotionsArrForRender);
    })
    .then( () => {
      let diff = this.state.duration - this.state.attention[0].length - 1;
      let padArr = pad([], diff, null);
      let paddedAttentionArr = [this.state.attention[0].concat(padArr)];
      this.setState({
        attention: paddedAttentionArr
      })
    })
  }

  generateCharts(lineGraphData) {
      console.log('generating charts now', lineGraphData);
      // c3.select('.optionChart').unload();
      var lineGraph = c3.generate({
        bindto: '.optionChart',
        data: {
          onclick: (d) => {
            let clickedTimestamp = d.x.toString();
            this.setState({
              timestamp: clickedTimestamp
            }, () => this.ReactPlayer.seekTo(this.state.timestamp))
          },
          columns: lineGraphData
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
  }

  setDuration(dur) {
    this.setState({
      duration: dur
    }, () => {
      this.setStateAfterDuration();
    })

  }

  timestampCallback(seconds){
    this.setState({
      timestamp: seconds
    }, () => this.ReactPlayer.seekTo(this.state.timestamp))
  }

  changeSideNavSelection(item) {
    this.setState({
      sideNavSelection: item
    }, this.lineGraphDataSwitch);
  }

  lineGraphDataSwitch() {
    if (this.state.sideNavSelection === 'attention') {
      this.generateCharts(this.state.attention);
    }
    if (this.state.sideNavSelection === 'overview' || this.state.sideNavSelection === 'emotions') {
      this.generateCharts(this.state.emotionsArrForRender)
    }
  }

  render() {
    return (
      <div className='optionAnalyticsContainer'>
        <SideBar changeCb={this.changeSideNavSelection}/>
        <div className='leftSide'>
          <ReactPlayer url={this.props.currentSection.option.youtubeUrl}
            ref={(player) => { this.ReactPlayer = player; }}
            controls={true} height={420} width={750} className='optionPlayer' onDuration={this.setDuration}
            config={{
              youtube: {
                playerVars: { showinfo: 1}
              }
            }}/>
          <div className="optionChart">
          </div>
        </div>
        <div className="rightSide">
          {this.state.sideNavSelection === 'overview' ?
            (<Overview
              viewer={this.state.user}
              attention={this.state.attention[0]}
              user={this.state.user}
              timestampCallback={this.timestampCallback}
              emotionsObj={this.state.emotionObj}
              likeStatus={this.state.likeStatus}
              completionStatus={this.state.completion}
              sideNavSelection={this.state.sideNavSelection}
              />
            ): ''
          }

          {this.state.sideNavSelection === 'attention' ? (
            <div className='attentionRightPanelContainer'>
              <Demographics user={this.state.user} />
              <Attention attention={this.state.attention[0]} timestampCallback={this.timestampCallback}/>
            </div>
          ) : ''}

          {this.state.sideNavSelection === 'feedback' ? (
            <div className='feedbackRightPanelContainer'>
              <Demographics user={this.state.user} />
              <Feedback likeStatus={true} completionStatus={this.state.completion} />
            </div>
          ) : ''}

          {this.state.sideNavSelection === 'emotions' ? (
            <div className='emotionsRightPanelContainer'>
              <Demographics user={this.state.user} />
              <Emotion emotionsObj={this.state.emotionObj} />
            </div>
          ) : ''}

        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return ({
    router: state.router,
    currentProject: state.currentProject,
    currentSection: state.currentSection,
    loggedInUser: state.loggedInUser
  });
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
) (OptionHome);
