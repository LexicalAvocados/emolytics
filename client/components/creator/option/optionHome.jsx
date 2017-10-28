import React from 'react';
import c3 from 'c3';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';
import axios from 'axios';
import pad from 'array-pad';
import {ButtonToolbar, ToggleButtonGroup, ToggleButton, Col}  from 'react-bootstrap';
import $ from 'jquery';
import Slider, { Range } from 'rc-slider';
import Select from 'react-select';

import SideBar from './SideBar.jsx';
import Overview from './Subcomponents/Overview.jsx';
import Attention from './Subcomponents/Attention.jsx';
import Demographics from './Subcomponents/Demographics.jsx';
import Emotion from './Subcomponents/Emotion.jsx';
import Feedback from './Subcomponents/Feedback.jsx';
import UserSelect from './Subcomponents/UserSelect.jsx';
import Annotations from './Subcomponents/Annotation.jsx';
import DetailedDemographics from './Subcomponents/DetailedDemographics.jsx';
import HeatMap from './Subcomponents/HeatMap.jsx';


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
      selectedUsers: [],
      graph: null,
      player: null,
      heatmapSetting: 1,
      videoTime: 0,
      playVideoForHM: false,
      optionEmotionObj: { emotionPerc: {}, attention: ['Attention'], count:[0] },
      demographicStats: {},
    }
    this.timestampCallback = this.timestampCallback.bind(this);
    this.setDuration = this.setDuration.bind(this);
    this.generateCharts = this.generateCharts.bind(this);
    this.changeSideNavSelection = this.changeSideNavSelection.bind(this);
    this.lineGraphDataSwitch = this.lineGraphDataSwitch.bind(this);
    this.handleUserSelectCb = this.handleUserSelectCb.bind(this);
    this.recalculateChartsBasedOnUserSelect = this.recalculateChartsBasedOnUserSelect.bind(this);
    this.calculateCompletionPerc = this.calculateCompletionPerc.bind(this);
    this.handleHeatmapData = this.handleHeatmapData.bind(this);
    this.updateProgress = this.updateProgress.bind(this);
    this.sliderCallback = this.sliderCallback.bind(this);
    this.playVideoButtonCallback = this.playVideoButtonCallback.bind(this);
    this.playVideoButtonIcon = this.playVideoButtonIcon.bind(this);
    this.selectChange = this.selectChange.bind(this)
    console.log(this);
  }

  componentWillMount() {
    // Change the Option to display
    this.props.actions.changeOption(this.props.currentSection.option);
  }

  componentDidMount() {
    //orientation modal
    var player = this.refs.player;
    // console.log(player);
    this.setState({
      player: player
    })
    axios.post('/api/getFrames', {
      optionId: this.props.currentSection.option.id
    })
      .then((res) => {
        console.log('GET FRAMES', res.data);

        this.setState({
          optionEmotionObj: res.data
        }, () => {
          this.calculateCompletionPerc()
          this.generateCharts();
        })
      })




    this.setState({
      user: this.props.loggedInUser
    }, () => {
      axios.post('/api/getLikes', {
        optionId: this.props.currentSection.option.id
      })
      .then( (res) => {
        // console.log('response from like endpoint', res.data)
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


    axios.post('/api/getUsersIdsWhoWatced', {
      optionId: this.props.currentSection.option.id
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
            })
          })
        })
      })



    // Get all of the annotations associated with the selected option
    axios.post('api/option/getAllAnnotations', {
      option: this.props.currentOption
    })
      .then(data => {
        var temp = {
          annotations: data.data
        }
        this.props.actions.changeAnnotations(temp);
      })
  }

  calculateCompletionPerc() {
    axios.post('/api/option/getDemographics', {
      id: this.props.currentSection.option.id
    })
    .then( (res) => {
      var cr = res.data.finished / res.data.total
      console.log('RES DATA', res.data)
      this.setState({
        completion: cr,
        demographicStats: res.data
      })
    })
  }


  generateCharts(lineGraphData) {
      var lineData = {
        data: lineGraphData
      }
      this.props.actions.changeLineGraphData(lineData);
      // c3.select('.optionChart').unload();
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
              console.log(player);
              player.seekTo(this.state.timestamp)
            })
          },
          columns: this.state.optionEmotionObj.emotionAvg,
        },
        axis: {
          y: {
            show: false
          }
        }
      });

      // var pieChart = c3.generate({
      //   bindto: '.emotionChart',
      //   data: {
      //     columns: [
      //       ['Anger', this.state.emotionObj.anger.slice(1).reduce((sum, val) => sum+= +val, 0)],
      //       ['Contempt', this.state.emotionObj.contempt.slice(1).reduce((sum, val) => sum+= +val, 0)],
      //       ['Disgust', this.state.emotionObj.disgust.slice(1).reduce((sum, val) => sum+= +val, 0)],
      //       ['Fear', this.state.emotionObj.fear.slice(1).reduce((sum, val) => sum+= +val, 0)],
      //       ['Happiness', this.state.emotionObj.happiness.slice(1).reduce((sum, val) => sum+= +val, 0)],
      //       ['Neutral', this.state.emotionObj.neutral.slice(1).reduce((sum, val) => sum+= +val, 0)],
      //       ['Sadness', this.state.emotionObj.sadness.slice(1).reduce((sum, val) => sum+= +val, 0)],
      //       ['Surprise', this.state.emotionObj.surprise.slice(1).reduce((sum, val) => sum+= +val, 0)]
      //     ],
      //     type : 'pie'
      //   }
      // });
      var pieChart = c3.generate({
        bindto: '.emotionChart',
        data: {
          columns: [
            ['Anger', this.state.optionEmotionObj.emotionPerc.Anger],
            ['Contempt', this.state.optionEmotionObj.emotionPerc.Contempt],
            ['Disgust', this.state.optionEmotionObj.emotionPerc.Disgust],
            ['Fear', this.state.optionEmotionObj.emotionPerc.Fear],
            ['Happiness', this.state.optionEmotionObj.emotionPerc.Happiness],
            ['Neutral', this.state.optionEmotionObj.emotionPerc.Neutral],
            ['Sadness', this.state.optionEmotionObj.emotionPerc.Sadness],
            ['Surprise', this.state.optionEmotionObj.emotionPerc.Surprise]
          ],
          type : 'pie'
        }
      });
      this.setState({
        graph: lineGraph
      })
      this.forceUpdate();
  }

  setDuration(dur) {
    this.setState({
      duration: dur
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
      }, () => {
        console.log('sidenav state', this.state.sideNavSelection)
        if (this.state.sideNavSelection !== 'heatmap') this.lineGraphDataSwitch()
      });

  };

  lineGraphDataSwitch() {
    if (this.state.sideNavSelection === 'attention') {
      this.generateCharts(this.state.attention);
    }
    else if (this.state.sideNavSelection === 'overview' || this.state.sideNavSelection === 'emotions' || this.state.sideNavSelection == 'annotations') {
      this.generateCharts(this.state.emotionsArrForRender)
    }
  };

  recalculateChartsBasedOnUserSelect(userIdsArray){
    axios.post('/api/getFrames', {
      optionId: this.props.currentSection.option.id
    })
    .then((res) => {
      let filteredFramesArr = res.data.filter(item => userIdsArray.includes(item.userId));
      // console.log('filteredFramesArr', filteredFramesArr)
      this.calculateCompletionPerc(filteredFramesArr);

      axios.post('/api/organizeFramesByEmotion', {
        frames: filteredFramesArr,
        duration: this.state.duration
      })
      .then((res) => {
        var emoObj = res.data;
        let emoArray = [emoObj.anger, emoObj.contempt, emoObj.disgust, emoObj.fear,
          emoObj.happiness, emoObj.neutral,emoObj.sadness,emoObj.surprise];
          this.setState({
            emotionObj: emoObj,
            emotionsArrForRender: emoArray
          })
        })
        axios.post('/api/getLikes', {
          optionId: this.props.currentSection.option.id
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
    })
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

  handleHeatmapData(num) {
    var boolForPlayVideo;
    num === 2 ? boolForPlayVideo = true : boolForPlayVideo = false;
    this.setState({
      heatmapSetting: num,
      playVideoForHM: boolForPlayVideo
    })
  }

  updateProgress(timeObj) {
    // console.log('timeObj', timeObj);
    this.setState({
      videoTime: Math.floor(timeObj.playedSeconds)
    })
  };

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

  selectChange(e) {
    e.preventDefault();
    this.setState({
      sideNavSelection: e.target.value
    })
  }

  render() {
    var selectionStyle = {
      float: 'right',
      backgroundColor: 'white'
    }

    var selectionDiv = {
      padding: '10px',
      overflow: 'auto'
    }

    var hrStyle = {
      marginTop: '0'
    }


    return (

      <div className='optionAnalyticsContainer'>
        <div style={selectionDiv}>
          <select onChange={this.selectChange} style={selectionStyle} >
            <option value="overview">Overview</option>
            <option value="attention">Attention</option>
            <option value="feedback">Feedback</option>
            <option value="emotions">Emotion</option>
            <option value="settings">Settings</option>
            <option value="annotations">Annotations</option>
            <option value="detailedDemographics">Detailed Demographics</option>
            <option value="heatmap">Eye Tracking</option>
          </select>
        </div>

          { this.state.sideNavSelection !== 'heatmap' ? (

            <div className='nonHeatmapContainer'>
            {(this.state.sideNavSelection === 'overview' || this.state.sideNavSelection === 'attention' || this.state.sideNavSelection === 'annotations')  ? 
              (
                <div className='optionHomeTop'>
                  <Col xs={12}>
                    <div className="optionHomeContainer">
                      <div className="optionPlayer">
                        <ReactPlayer url={this.props.currentSection.option.youtubeUrl}
                          ref="player"
                          progressFrequency={1000} onProgress={this.updateProgress}
                          controls={true} height="90%" width='95%' className='optionPlayer' onDuration={this.setDuration}
                          config={{
                            youtube: {
                              playerVars: { showinfo: 1}
                            }
                          }}/>
                      </div>
                      <div className="optionChart">
                      </div>
                    </div>
                  </Col>
                </div>
              ): ''
          }


          <div className="optionHomeBottom">
            {this.state.sideNavSelection === 'overview' ?
              (<Overview
                optionEmotionObj={this.state.optionEmotionObj}
                demographic={this.state.demographicStats}
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
                <div className="optionContainer">
                  <Demographics demographic={this.state.demographicStats} />
                </div>
                <div className="optionContainer">
                  <Attention optionEmotionObj={this.state.optionEmotionObj} attention={this.state.attention[0]} timestampCallback={this.timestampCallback}/>
                </div>
              </div>
            ) : ''}

            {this.state.sideNavSelection === 'feedback' ? (
              <div className='feedbackRightPanelContainer'>
                <Demographics demographic={this.state.demographicStats} selectedUsers={this.state.selectedUsers} allUsers={this.state.allUsers}/>
                <Feedback optionEmotionObj={this.state.optionEmotionObj} demographic={this.state.demographicStats} feedback={this.props.currentSection.option.feedback} likeRatio={this.state.likeRatio} completionStatus={this.state.completion} />
              </div>
            ) : ''}

            {this.state.sideNavSelection === 'emotions' ? (
              <div className='emotionsRightPanelContainer'>
                <Demographics demographic={this.state.demographicStats} selectedUsers={this.state.selectedUsers} allUsers={this.state.allUsers}/>
                <Emotion optionEmotionObj={this.state.optionEmotionObj} emotionsObj={this.state.emotionObj} />
              </div>
            ) : ''}

            {this.state.sideNavSelection === 'settings' ? (
              <div className='emotionsRightPanelContainer'>
                <UserSelect user={this.state.user} optionId={this.props.currentSection.option.id}
                            userSelectCb={this.handleUserSelectCb} changeSideNavSelection={this.changeSideNavSelection}
                            selectedUsers={this.state.selectedUsers} allUsers={this.state.allUsers}/>
              </div>
            ) : ''}

            {this.state.sideNavSelection === 'annotations' ? (
                <Annotations graph={this.state.graph} player={this.state.player}/>
            ) : ''}

            {this.state.sideNavSelection === 'detailedDemographics' ? (
                <DetailedDemographics selectedUsers={this.state.selectedUsers}/>
            ) : ''}

            </div>
          </div>
        ) : (

            <div className='heatmapComponentContainer' style={heatmapComponentContainerStyle}>

              <div className='videoPlayerUnder' style={videoPlayerUnderStyle}>
                <ReactPlayer url={this.props.currentSection.option.youtubeUrl}
                  ref="player"
                  progressFrequency={1000} onProgress={this.updateProgress}
                  playing={this.state.playVideoForHM}
                  controls={true} height="90%" width='95%' className='optionPlayer' onDuration={this.setDuration}
                  config={{
                    youtube: {
                      playerVars: { showinfo: 1}
                    }
                  }}/>
              </div>

              <div className='heatmapSuperimposed' style={heatmapSuperimposedStyle}>
                <HeatMap option={this.props.currentSection.option} setting={this.state.heatmapSetting} time={this.state.videoTime}/>
              </div>

              <div className='buttons' style={buttonStyle}>
                {this.state.heatmapSetting === 2 ? (
                  <div style={sliderStyle}>
                    <Slider max={this.state.duration} onChange={this.sliderCallback} value={Math.floor(this.state.videoTime)}/>
                    <img src={this.playVideoButtonIcon()} height={20} width={20}
                         style={iconStyle} onClick={this.playVideoButtonCallback} className='playPauseIcon'></img>
                  </div>
                ): ''}
                <br/><br/>
                <ButtonToolbar>
                  <ToggleButtonGroup type="radio" name='aggtime' defaultValue={1} onChange={this.handleHeatmapData}>
                    <ToggleButton value={1}>Aggregate</ToggleButton>
                    <ToggleButton value={2}>Over Time</ToggleButton>
                  </ToggleButtonGroup>
                </ButtonToolbar>
              </div>
              <br/><br/><br/><br/><br/><br/>
          </div>

        )
      }
      </div>
    )
  }
}

const iconStyle = {
  position: 'absolute',
  top: '-10%',
  left: '-19%',
  zIndex: '105'
}

const sliderStyle = {
  position: 'absolute',
  top: '100%',
  left: '2%',
  zIndex: '104',
  width: '100%',
  marginTop: "5%"
}

const heatmapComponentContainerStyle = {
  width: "86%",
  height: "100%",
  position: "relative",
  marginLeft: '5%'
}

const videoPlayerUnderStyle = {
  width: "100%",
  height: "100%",
  position: "absolute",
  top: '0',
  left: '0'
}

const heatmapSuperimposedStyle = {
  width: "100%",
  height: "100%",
  position: "absolute",
  top: '0',
  left: '0',
  marginTop: '6%',
  zIndex: "100"
}

const buttonStyle = {
  position: 'absolute',
  top: '84%',
  left: '40%',
  zIndex: '102'
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
) (OptionHome);
