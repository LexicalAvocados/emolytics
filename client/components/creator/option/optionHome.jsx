import React from 'react';
import c3 from 'c3';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';
import axios from 'axios';
import pad from 'array-pad';
import {ButtonToolbar, ToggleButtonGroup, ToggleButton, Col, Row, Grid}  from 'react-bootstrap';
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
      optionEmotionObj: {
        emotionPerc: {
          Contempt: 0,
        },
        attention: ['Attention'],
        count:[0]
      },
      demographicStats: {},
      allDemographicsObj: {}
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
    this.selectChange = this.selectChange.bind(this);
    this.recalculateChartsBasedOnDemographicSelect = this.recalculateChartsBasedOnDemographicSelect.bind(this);
    this.setDemographicsStuff = this.setDemographicsStuff.bind(this);
    this.refreshDemographicStats = this.refreshDemographicStats.bind(this);
    console.log(this);
  }

  componentWillMount() {
    // Change the Option to display
    this.props.actions.changeOption(this.props.currentSection.option);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentSection.option.youtubeUrl !== nextProps.currentSection.option.youtubeUrl) {
      axios.post('/api/getFrames', {
        optionId: nextProps.currentSection.option.id
      })
        .then((res) => {
          console.log('GET FRAMES', res.data);

          this.setState({
            optionEmotionObj: res.data
          }, () => {
            console.log('run generate charts');
            this.calculateCompletionPerc()
            this.generateCharts();
          })
        })

      axios.post('api/option/getAllAnnotations', {
        option: nextProps.currentOption
      })
        .then(data => {
          var temp = {
            annotations: data.data
          }
          this.props.actions.changeAnnotations(temp);
        })
    }
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
          console.log('run generate charts');
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
            }, this.setDemographicsStuff )
          })
        })
      })

    axios.get('/api/getFeedback', { params: { optionId: this.props.currentSection.option.id }})
    .then((summary) =>  {
      // console.log
      this.props.currentSection.option.feedback = summary.data;
    })
    .catch((err) => {
      console.log(err);
    });


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

  setDemographicsStuff() {
    //demographics/user settings stuff
    var initialDemographicsObj = {
      'race': {},
      'sex': {}
    }

    var allDemographicsObj = this.state.selectedUsers.reduce((acc, curr) => {
      if (curr.race === null) {
        acc.race[`Not Provided`] ? acc.race[`Not Provided`]+=1 : acc.race[`Not Provided`] = 1;
      } else {
        acc.race[`${curr.race}`] ? acc.race[`${curr.race}`]+=1 : acc.race[`${curr.race}`] = 1;
      }

      if (curr.sex === null) {
        acc.sex[`Not Provided`] ? acc.sex[`Not Provided`]+=1 : acc.sex[`Not Provided`] = 1;
      } else {
        acc.sex[`${curr.sex}`] ? acc.sex[`${curr.sex}`]+=1 : acc.sex[`${curr.sex}`] = 1;
      }

      return acc;
    }, initialDemographicsObj)

    var userIdsArray = this.state.selectedUsers.reduce((acc, curr) => {
      acc.push(curr.id); return acc;
    }, [])

    axios.post('/api/generateAgeRangeObjForUserIdsArray', {userIdsArray})
    .then((res) => {
      allDemographicsObj['ageRange'] = res.data
      console.log('ALLDEMOGRAPHICSOBJ', allDemographicsObj)

      let allRaces = Object.keys(allDemographicsObj.race)
      let allGenders = Object.keys(allDemographicsObj.sex)
      let allAgeRanges = Object.keys(allDemographicsObj.ageRange)

      let selectedDemographicsObj = {
        races: allRaces,
        genders: allGenders,
        ageRanges: allAgeRanges
      }
      this.props.actions.setOptionDemographicsSelection(selectedDemographicsObj);
      this.setState({
        allDemographicsObj : allDemographicsObj,
      })
    })
  };

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

  refreshDemographicStats() {
    // console.log('REFRESHING STATS NOW')
    axios.post('/api/option/refreshDemographics', {
      optionId: this.props.currentSection.option.id,
      selectedRaces: this.props.setOptionDemographicsSelection.races,
      selectedGenders: this.props.setOptionDemographicsSelection.genders
    })
    .then( (res) => {
      var cr = res.data.finished / res.data.total
      console.log('res from refresh demographics', res.data)
      this.setState({
        completion: cr,
        demographicStats: res.data
      }, () => console.log('refreshed demographic state', this.state.demographicStats))
    })
  }


  generateCharts() {
      // this.props.actions.changeLineGraphData(lineData);

      if (this.state.sideNavSelection === 'attention') {
        var arr = []
        this.state.optionEmotionObj.attention.forEach((elem, i) => {
          i !== 0 ? arr.push(parseFloat(parseFloat(elem).toFixed(2))) : arr.push(elem);

        })
        console.log(this.state.sideNavSelection, arr);
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
            columns: [arr],
          },
          axis: {
            y: {
              show: true
            }
          },
        });

      } else {
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
          },
        });

      }

      this.setState({
        graph: lineGraph
      }, () => {
        // if (this.state.sideNavSelection == 'annotations') {
        //   var player = this.refs.player1;
        //   this.setState({
        //     player: player
        //   })
        // } else {
        //   var player = this.refs.player;
        //   this.setState({
        //     player: player
        //   })
        // }
      })
      // this.forceUpdate();
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
      console.log('SWITCH');
      this.generateCharts();

    }
    else if (this.state.sideNavSelection === 'overview' || this.state.sideNavSelection === 'emotions' || this.state.sideNavSelection == 'annotations') {
      this.generateCharts(this.state.emotionsArrForRender)

    }

  };

  recalculateChartsBasedOnUserSelect(userIdsArray){
    // axios.post('/api/getFrames', {
    //   optionId: this.props.currentSection.option.id
    // })
    // .then((res) => {
    //   let filteredFramesArr = res.data.filter(item => userIdsArray.includes(item.userId));
    //   // console.log('filteredFramesArr', filteredFramesArr)
    //   this.calculateCompletionPerc(filteredFramesArr);
    //
    //     // axios.post('/api/getLikes', {
    //     //   optionId: this.props.currentSection.option.id
    //     // })
    //     // .then( (res) => {
    //     //   let likeCount = res.data.reduce((tot, curr) => {
    //     //     if(curr.like === true && userIdsArray.includes(curr.userId)) tot++
    //     //     return tot;
    //     //   }, 0)
    //     //   let likeRatio = `${likeCount}/${this.state.selectedUsers.length}`
    //     //   this.setState({
    //     //     likeRatio: likeRatio
    //     //   })
    //     // })
    //     // .then( () => {
    //     //   this.generateCharts(this.state.emotionsArrForRender);
    //     // })
    // })
  }

  recalculateChartsBasedOnDemographicSelect(responseObj) {
    this.setState({
      optionEmotionObj: responseObj
    }, () => {
      console.log('state after demograpic select', this.state)
      this.generateCharts()
      this.refreshDemographicStats()
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
    }, () => {
      this.generateCharts();
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
        { this.props.currentSection.id === 0 ? (
          <h4 className="demoWelcomeHeader">Below you can find all the data we've collected for the option you just clicked on. Using the dropdown to the right, you can filter the information being displayed. When your done looking at the analytics for this video, try clicking the compare button to the left.</h4>
        ) : (
          null
        )}
        <div style={selectionDiv}>
          <select onChange={this.selectChange} style={selectionStyle} value={this.state.sideNavSelection}>
            <option value="overview">Overview</option>
            <option value="attention">Attention</option>
            <option value="feedback">Feedback</option>
            <option value="emotions">Emotion</option>
            <option value="annotations">Annotations</option>
            <option value="detailedDemographics">Detailed Demographics</option>
            <option value="heatmap">Eye Tracking</option>
            <option value="settings">Settings</option>
          </select>
        </div>

          { this.state.sideNavSelection !== 'heatmap' ? (

            <div className='nonHeatmapContainer'>
            {(this.state.sideNavSelection === 'overview' || this.state.sideNavSelection === 'attention' || this.state.sideNavSelection === 'annotations')  ?
              (
                <div className='optionHomeTop'>
                  <Col xs={this.state.sideNavSelection === "annotations" ? 7 : 12 }>
                    <div className="optionHomeContainer">
                      <div className="optionPlayer">
                        <ReactPlayer url={this.props.currentSection.option.youtubeUrl}
                          ref="player"
                          progressFrequency={1000} onProgress={this.updateProgress}
                          controls={true} height="90%" width='100%' className='optionPlayer' onDuration={this.setDuration}
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
                timestampCallback={this.timestampCallback}
                generateCharts = {this.generateCharts}
                />
              ): ''
            }

            {this.state.sideNavSelection === 'attention' ? (
              <Col md={12}>
                <div className='attentionRightPanelContainer'>
                  <div className="optionContainer">
                    <Demographics demographic={this.state.demographicStats} />
                  </div>
                  <div className="optionContainer">
                    <Attention optionEmotionObj={this.state.optionEmotionObj} attention={this.state.attention[0]} timestampCallback={this.timestampCallback}/>
                  </div>
                </div>
              </Col>
            ) : ''}

            {this.state.sideNavSelection === 'feedback' ? (
              <div className='feedbackRightPanelContainer'>
                <div className="optionContainer">
                  <Demographics demographic={this.state.demographicStats} selectedUsers={this.state.selectedUsers} allUsers={this.state.allUsers}/>
                </div>
                <div className="optionContainer">
                  <Feedback optionEmotionObj={this.state.optionEmotionObj} demographic={this.state.demographicStats} feedback={this.props.currentSection.option.feedback} likeRatio={this.state.likeRatio} completionStatus={this.state.completion} />
                </div>
              </div>
            ) : ''}

            {this.state.sideNavSelection === 'emotions' ? (
              <div className='emotionsRightPanelContainer'>
                <div className="optionContainer">
                  <Demographics demographic={this.state.demographicStats} selectedUsers={this.state.selectedUsers} allUsers={this.state.allUsers}/>
                </div>
                <div className="optionContainer">
                  <Emotion optionEmotionObj={this.state.optionEmotionObj} emotionsObj={this.state.emotionObj} />
                </div>
              </div>
            ) : ''}

            {this.state.sideNavSelection === 'settings' ? (
              <div className='emotionsRightPanelContainer'>
                <UserSelect user={this.state.user} optionId={this.props.currentSection.option.id}
                            userSelectCb={this.handleUserSelectCb} changeSideNavSelection={this.changeSideNavSelection}
                            selectedUsers={this.state.selectedUsers} allUsers={this.state.allUsers}
                            demographicSelectCb={this.recalculateChartsBasedOnDemographicSelect}
                            allDemographicsObj={this.state.allDemographicsObj} refreshDemographics={this.refreshDemographicStats}/>
              </div>
            ) : ''}

            {this.state.sideNavSelection === 'annotations' ? (
                <div className="optionHomeAnnotationsDiv">

                  <Col md={5}>
                    <div className="optionHomeRight">
                      <Annotations optionEmotionObj={this.state.optionEmotionObj} graph={this.state.graph} player={this.state.player}/>
                    </div>
                  </Col>
                </div>
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

const col10Style = {
  marginBottom: "20px"
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
  width: "100%%",
  height: "100%",
  position: "relative",
  // marginLeft: '5%'
}

const videoPlayerUnderStyle = {
  width: "100%",
  marginRight: "2.5%",
  marginLeft: "2.5%",
  height: "65vh",
  position: "absolute",
  top: '0',
  left: '0'
}

const heatmapSuperimposedStyle = {

  height: "65vh",
  position: "absolute",
  top: '0',
  left: '0',
  // marginTop: '6%',
  zIndex: "10",
  width: "85%",
  marginLeft: '12%',
  marginRight: '3%'
}

const buttonStyle = {
  position: 'absolute',
  top: '90%',
  left: '40%',
  marginTop: '32%',
  zIndex: '30'
}

const mapStateToProps = (state) => {
  console.log(state);
  return ({
    router: state.router,
    currentProject: state.currentProject,
    currentSection: state.currentSection,
    loggedInUser: state.loggedInUser,
    currentOptionAnnotations: state.currentOptionAnnotations,
    currentOption: state.currentOption,
    lineGraphData: state.lineGraphData,
    setOptionDemographicsSelection: state.setOptionDemographicsSelection
  });
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
) (OptionHome);


// allUsers={this.state.allUsers}
// selectedUsers={this.state.selectedUsers}
// viewer={this.state.user}
// attention={this.state.attention[0]}
// user={this.state.user}
// timestampCallback={this.timestampCallback}
// emotionsObj={this.state.emotionObj}
// likeRatio={this.state.likeRatio}
// completionStatus={this.state.completion}
// sideNavSelection={this.state.sideNavSelection}
