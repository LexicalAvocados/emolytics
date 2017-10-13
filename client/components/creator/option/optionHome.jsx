import React from 'react';
import c3 from 'c3';
import ReactPlayer from 'react-player';
import DetailsPanel from './detailsPanel.jsx';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions'

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
      timestamp: '0'
    }
    this.timestampCallback = this.timestampCallback.bind(this);
  }

  componentDidMount() {
    //axios GET request for attention
    var lineGraph = c3.generate({
      bindto: '.optionChart',
      data: {
        // x: 'x',
        columns: [
          this.state.attention
        ]
      }
    });

    var pieChart = c3.generate({
      //axios GET request for emotions
      bindto: '.emotionChart',
      data: {
        columns: [
            ['anger', 30],
            ['contempt', 1],
            ['disgust', 40],
            ['fear', 120],
            ['happiness', 65],
            ['neutral', 7],
            ['sadness', 5],
            ['surprise', 220],
        ],
        type : 'pie'
      }
    });
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
        <ReactPlayer url={this.props.currentSection.youtubeUrl}
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
            />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return ({
    router: state.router,
    currentProject: state.currentProject,
    currentSection: state.currentSection
  });
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
) (OptionHome);
