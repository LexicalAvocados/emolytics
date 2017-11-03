import React from 'react';
import c3 from 'c3';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../../actions';

class Emotion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
    this.generateCharts = this.generateCharts.bind(this);
    this.calcMaxEmotion = this.calcMaxEmotion.bind(this);
    console.log('Emotion', this);
  }

  componentDidMount() {
    this.generateCharts();
    console.log('match params', this.props.match);

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.optionEmotionObj.emotionPerc.Anger) {
      this.generateCharts();
    }
  }

  generateCharts() {
    if (this.props.optionEmotionObj.emotionPerc.Anger) {
      c3.generate({
        bindto: '.emotionChart',
        data: {
          columns: [
            ['Anger', this.props.optionEmotionObj.emotionPerc.Anger],
            ['Contempt', this.props.optionEmotionObj.emotionPerc.Contempt],
            ['Disgust', this.props.optionEmotionObj.emotionPerc.Disgust],
            ['Fear', this.props.optionEmotionObj.emotionPerc.Fear],
            ['Happiness', this.props.optionEmotionObj.emotionPerc.Happiness],
            ['Neutral', this.props.optionEmotionObj.emotionPerc.Neutral],
            ['Sadness', this.props.optionEmotionObj.emotionPerc.Sadness],
            ['Surprise', this.props.optionEmotionObj.emotionPerc.Surprise]
          ],
          type : 'pie'
        }
      });
    }
  }

  calcMaxEmotion() {
    if (this.props.optionEmotionObj.emotionPerc.anger) {
      return 'NAN'
    } else {
      let emotions = this.props.optionEmotionObj.emotionPerc
      let highest = { emotion: null, avg: 0 }
      for (var feeling in emotions) {
        // console.log('feeling', emotions[feeling])
        if (emotions[feeling] > highest.avg && feeling != 'time' && feeling != 'Attention' && feeling != 'Count') {
          highest.emotion = feeling;
          highest.avg = emotions[feeling];
        }
      }

      return highest.emotion;
    }
  }

  render() {
    const center = {
      textAlign: "center"
    }

    return (
      <div className="testerEmotion">
        { this.props.match.path === "/section:id" ? (
          <div>
        <div className="optionTitle">
          <h4> <small> Demographics </small> </h4>
        </div>
        <hr/>
        </div>
        ) : ""
        }
        <p style={center}> Most Prevalent Emotion: {this.calcMaxEmotion()}</p>
        <div className='emotionChart'></div>
      </div>
    )

  }


};



const mapStateToProps = (state) => ({
  loggedInUser: state.loggedInUser,
  router: state.router
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Emotion));
