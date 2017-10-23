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
      finished: null,
      like: null,
      comment: '',
      attentionArr: [],
      emotionObj: {},
      emotionArrs: []
    }
  }

  componentWillMount() {
    axios.post('/api/tester/getOptionResultsForTester', {
      userId: this.props.loggedInUser.id,
      optionId: this.props.currentTesterOption.id
    })
      .then(res => {
        console.log('res.data:', res.data);
        let frames = res.data[0];
        let feedback = res.data[1];

        let anger = ['Anger', ...frames.map(frame => frame.anger)];
        let contempt = ['Contempt', ...frames.map(frame => frame.contempt)];
        let disgust = ['Disgust', ...frames.map(frame => frame.disgust)];
        let fear = ['Fear', ...frames.map(frame => frame.fear)];
        let happiness = ['Happiness', ...frames.map(frame => frame.happiness)];
        let neutral = ['Neutral', ...frames.map(frame => frame.neutral)];
        let sadness = ['Sadness', ...frames.map(frame => frame.sadness)];
        let surprise = ['Surprise', ...frames.map(frame => frame.surprise)];

        this.setState({
          finished: feedback.finished,
          like: feedback.like,
          comment: feedback.comment,
          attentionArr: [['Attention', ...frames.map(frame => frame.attention)]],
          emotionObj: {anger, contempt, disgust, fear, happiness, neutral, sadness, surprise},
          emotionArrs: [anger, contempt, disgust, fear, happiness, neutral, sadness, surprise]
        }, () => console.log('this.state in callback:', this.state));
      })
      .catch(err => {
        console.log('Error fetching Option Data from database:', err);
      })
  }

  render() {
    return (
      <div>

        {`Hi! This is Option ${this.props.currentTesterOption.id}!`}

        {/*<div className='optionAnalyticsContainer'>

          <div className='leftSide'>
            <div className="optionPlayer">
              <ReactPlayer
                className='optionPlayer'
                url={this.props.currentSection.option.youtubeUrl}
                ref="player"
                controls={true}
                height="90%"
                width='95%'
                onDuration={this.setDuration}
                config={{
                  youtube: {
                    playerVars: { showinfo: 1 }
                  }
                }}
              />
            </div>

            <div className="optionChart">
            </div>

          </div>

          <div className="rightSide">
            <div className='testerAnalyticsContainer'>

              <div className="optionContainer">
                <Feedback
                  likeRatio={props.likeRatio}
                  completionStatus={props.completionStatus}
                />
              </div>

              <div className="optionContainer">
                <Emotion
                  emotionsObj={props.emotionsObj}
                />
              </div>

              <div className="optionContainer">
                <Attention
                  attention={props.attention}
                  timestampCallback={props.timestampCallback}
                />
              </div>

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