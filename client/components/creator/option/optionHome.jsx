import React from 'react';
import c3 from 'c3';
import ReactPlayer from 'react-player';
import DetailsPanel from './detailsPanel.jsx';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';
import axios from 'axios';

class OptionHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {name: 'blobbert', age: '26', gender: 'male'},
      attention: ['attention', 0, 0.5, 1, 1, 0.7, 0.8, 0.8, 0.5, 0.2, 0.6, 1, 1, 0.8, 0.5, 0.7, 1, 1, 0.9, 0.8, 0.9, 0.8,
                  0.75, 0.6, 0.4, 0.3, 0.34, 0.4, 0.6, 0.7, 0.8, 0.8, 0.6, 0.7, 0.4, 0.2, 0.36, 0.56, 0.7, 0.8, 0.7, 0.6,
                  0.6, 1, 1, 0.8, 0.5, 0.7, 1, 1, 0.9, 0.8, 0.9, 0.6, 1, 1, 0.8, 0.5, 0.7, 1, 1, 0.9, 0.8, 0.9, 0.7, 0.6,
                  0.6, 1, 1, 0.8, 0.5, 0.7, 1, 1, 0.9, 0.8, 0.9, 0.8, 0.7, 0.8, 0.6, 0.7, 0.19, 0.1, 0.36, 0.56, 0.7, 0.8
                ],
      timestamp: '0',
      emotionObj: {},
      likeStatus: false
    }
    this.timestampCallback = this.timestampCallback.bind(this);
  }

  componentDidMount() {
    //axios GET request for attention

    var emotions = ["anger", "contempt", "disgust", "fear", "happiness",
                    "neutral", "sadness", "surprise" ]

    axios.post('/api/getFrames', {
      optionId: this.props.currentSection.option.id
    })
    .then((res) => {
      let tempEmotionObj = {};

      emotions.forEach(emo => {
        tempEmotionObj[emo] = res.data.reduce((acc, curr) => {
            acc.push(curr[emo]);
            return acc;
          }, [emo])
      })

      return tempEmotionObj;
    })
    .then((emoObj) => {
      this.setState({
        emotionObj: emoObj
      })
    })
    .then( () => {
      //generate charts now
      // console.log('all emotions', this.state.emotionObj)
      var lineGraph = c3.generate({
        bindto: '.optionChart',
        data: {
          // x: 'x',
          columns: [
            this.state.emotionObj.anger,
            this.state.emotionObj.contempt,
            this.state.emotionObj.disgust,
            this.state.emotionObj.fear,
            this.state.emotionObj.happiness,
            this.state.emotionObj.neutral,
            this.state.emotionObj.sadness,
            this.state.emotionObj.surprise
          ]
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
    })
    .then( () => {
      axios.post('/api/getLike', {
        optionId: this.props.currentSection.option.id,
        username: this.props.loggedInUser.username
      })
      .then( (res) => {
        console.log('res in option home from like', res)
        this.setState({
          likeStatus: res.data.like
        })
      })
    })
  }

  timestampCallback(seconds){
    this.setState({
      timestamp: seconds
    }, () => this.ReactPlayer.seekTo(this.state.timestamp))

  }

  render() {
    return (
      <div className='optionAnalyticsContainer'>
      <div className='leftSide'>
        <ReactPlayer url={this.props.currentSection.option.youtubeUrl}
          ref={(player) => { this.ReactPlayer = player; }}
          controls={true} height={420} width={750} className='optionPlayer'/>
        <div className="optionChart">
        </div>
      </div>
          <DetailsPanel
            viewer={this.state.user}
            attention={this.state.attention}
            user={this.state.user}
            timestampCallback={this.timestampCallback}
            emotionsObj={this.state.emotionObj}
            likeStatus={this.state.likeStatus}
            />
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
