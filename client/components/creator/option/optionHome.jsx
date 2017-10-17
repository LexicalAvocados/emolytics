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
import UserSelect from './Subcomponents/UserSelect.jsx';

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
      likeRatio: '',
      duration: 0,
      completion: 0,
      sideNavSelection: 'overview',
      allUsers: [],
      selectedUsers: []
    }
    this.timestampCallback = this.timestampCallback.bind(this);
    this.setDuration = this.setDuration.bind(this);
    this.generateCharts = this.generateCharts.bind(this);
    this.changeSideNavSelection = this.changeSideNavSelection.bind(this);
    this.lineGraphDataSwitch = this.lineGraphDataSwitch.bind(this);
    this.setStateAfterDuration = this.setStateAfterDuration.bind(this);
    this.handleUserSelectCb = this.handleUserSelectCb.bind(this);
    this.recalculateChartsBasedOnUserSelect = this.recalculateChartsBasedOnUserSelect.bind(this);
  }

  componentDidMount() {
    //orientation modal
    axios.post('/api/getUsersIdsWhoWatced', {
      optionId: 4 //this.props.currentSection.option.id
    })
    .then( (res) => {
      res.data.forEach(userId => {
        // console.log('user id for axios', userId.userId)
        axios.post('/api/getUsersNamesWhoWatced', {
          userId: userId.userId
        })
        .then((username) => {
          // console.log('user obj response', username)
          let oldUsers = this.state.allUsers.slice()
          let newUsers = oldUsers.concat(username.data);
          this.setState({
            allUsers: newUsers,
            selectedUsers: newUsers
          }, () => {
            console.log('state set with users', this.state)
            let averagedCompletion = this.state.completion / this.state.selectedUsers.length;
            this.setState({
              completion: averagedCompletion
            })
          })
        })
      })
    })
    this.setState({
      user: this.props.loggedInUser
    }, () => {
      axios.post('/api/getLikes', {
        optionId: 4 //this.props.currentSection.option.id
      })
      .then( (res) => {
        let likeCount = res.data.reduce((tot, curr) => {
          if(curr.like === true) tot++
          return tot;
        }, 0)
        let likeRatio = `${likeCount}/${res.data.length}`
        this.setState({
          likeRatio: likeRatio
        })
      })
    })
  }

  setStateAfterDuration() {
    var emotions = ["anger", "contempt", "disgust", "fear", "happiness",
                    "neutral", "sadness", "surprise" ]

    axios.post('/api/getFrames', {
      optionId: 4 //this.props.currentSection.option.id
    })
    .then((res) => {
      let tempEmotionObj = {};
      let calcCompletion = Math.floor(1000*(res.data.length / this.state.duration))/10;
      this.setState({
        completion: calcCompletion
      })
      console.log('refresher on what is res.data', res.data)
      emotions.forEach(emo => {
        let capitalized = emo.slice(0, 1).toUpperCase() + emo.slice(1);
        tempEmotionObj[emo] = res.data.sort((a, b) => a.time - b.time).reduce((acc, curr) => {
            if (emo === 'neutral') {
              if (acc[curr.time]) {
                acc[curr.time] = (acc[curr.time] + +curr[emo] / 8) / 2;
                return acc;
              } else {
                acc.push(+curr[emo] / 8);
                return acc;
              }
            }
            else {
              if (acc[curr.time]) {
                acc[curr.time] = (acc[curr.time] + +curr[emo] )/ 2;
                return acc;
              } else {
                acc.push(+curr[emo]);
                return acc;
              }
            }
          }, [capitalized]);
        if (tempEmotionObj[emo].length < this.state.duration) {
          var diff = this.state.duration - tempEmotionObj[emo].length - 1;
          let padArr = pad([], diff, null);
          tempEmotionObj[emo] = tempEmotionObj[emo].concat(padArr);
        }
      })
      console.log('tempEmotionObj', tempEmotionObj)
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
      this.forceUpdate();
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
    }, () => this.ReactPlayer.seekTo(this.state.timestamp))
  };

  changeSideNavSelection(item) {
    this.setState({
      sideNavSelection: item
    }, this.lineGraphDataSwitch);
  };

  lineGraphDataSwitch() {
    if (this.state.sideNavSelection === 'attention') {
      this.generateCharts(this.state.attention);
    }
    if (this.state.sideNavSelection === 'overview' || this.state.sideNavSelection === 'emotions') {
      this.generateCharts(this.state.emotionsArrForRender)
    }
  };

  recalculateChartsBasedOnUserSelect(userIdsArray){
    var emotions = ["anger", "contempt", "disgust", "fear", "happiness",
                    "neutral", "sadness", "surprise" ];
    axios.post('/api/getFrames', {
      optionId: 4 //this.props.currentSection.option.id
    })
    .then((res) => {
      let tempEmotionObj = {};
      // console.log('in recalculation', res.data)
      console.log('selected user ids', userIdsArray)
      emotions.forEach(emo => {
        let capitalized = emo.slice(0, 1).toUpperCase() + emo.slice(1);
        tempEmotionObj[emo] = res.data.sort((a, b) => a.time - b.time).reduce((acc, curr) => {
        if (userIdsArray.includes(curr.userId) && curr.time !== null) {
              if (emo === 'neutral') {
                if (acc[curr.time]) {
                  acc[curr.time] = (acc[curr.time] + +curr[emo] / 8) / 2;
                } else {
                  acc.push(+curr[emo] / 8);
                }
              }
              else {
                if (acc[curr.time]) {
                  acc[curr.time] = (acc[curr.time] + +curr[emo] )/ 2;
                } else {
                  acc.push(+curr[emo]);
                }
              }
            }
              return acc;
            }, [capitalized]);
            if (tempEmotionObj[emo].length < this.state.duration) {
              var diff = this.state.duration - tempEmotionObj[emo].length - 1;
              let padArr = pad([], diff, null);
              tempEmotionObj[emo] = tempEmotionObj[emo].concat(padArr);
            }
          })
          console.log('tempEmotionObj', tempEmotionObj)
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
    axios.post('/api/getLikes', {
      optionId: 4 //this.props.currentSection.option.id
    })
    .then( (res) => {
      let likeCount = res.data.reduce((tot, curr) => {
        if(curr.like === true && userIdsArray.includes(curr.userId)) tot++
        return tot;
      }, 0)
      let likeRatio = `${likeCount}/${this.state.selectedUsers.length}`
      this.setState({
        likeRatio: likeRatio
      })
    })
    .then( () => {
      this.generateCharts(this.state.emotionsArrForRender);
    })
    // .then( () => {
    //   let diff = this.state.duration - this.state.attention[0].length - 1;
    //   let padArr = pad([], diff, null);
    //   let paddedAttentionArr = [this.state.attention[0].concat(padArr)];
    //   this.setState({
    //     attention: paddedAttentionArr
    //   })
    // })
  }

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
      <div className='optionAnalyticsContainer'>
        <SideBar changeCb={this.changeSideNavSelection} currSelected={this.state.sideNavSelection}/>
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

          {this.state.sideNavSelection === 'attention' ? (
            <div className='attentionRightPanelContainer'>
              <Demographics selectedUsers={this.state.selectedUsers} allUsers={this.state.allUsers}/>
              <Attention attention={this.state.attention[0]} timestampCallback={this.timestampCallback}/>
            </div>
          ) : ''}

          {this.state.sideNavSelection === 'feedback' ? (
            <div className='feedbackRightPanelContainer'>
              <Demographics selectedUsers={this.state.selectedUsers} allUsers={this.state.allUsers}/>
              <Feedback likeRatio={this.state.likeRatio} completionStatus={this.state.completion} />
            </div>
          ) : ''}

          {this.state.sideNavSelection === 'emotions' ? (
            <div className='emotionsRightPanelContainer'>
              <Demographics selectedUsers={this.state.selectedUsers} allUsers={this.state.allUsers}/>
              <Emotion emotionsObj={this.state.emotionObj} />
            </div>
          ) : ''}

          {this.state.sideNavSelection === 'settings' ? (
            <div className='emotionsRightPanelContainer'>
              <UserSelect user={this.state.user} optionId={this.props.currentSection.option.id}
                          userSelectCb={this.handleUserSelectCb} changeSideNavSelection={this.changeSideNavSelection}
                          selectedUsers={this.state.selectedUsers} allUsers={this.state.allUsers}/>
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
