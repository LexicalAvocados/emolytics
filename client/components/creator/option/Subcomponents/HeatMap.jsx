import React from 'react';
import ReactHeatmap from 'react-heatmap';
import axios from 'axios';

class HeatMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allFrames: [],
      heatmapArr: []
    }
    this.massageData = this.massageData.bind(this);
    // console.log('this in heatmap const', this)
  }

  componentDidMount() {
    // console.log('Props in heatMap', this.props.option.id)
    axios.get('/api/creator/getEyeTrackingForOption', {
      params: {
        optionId: this.props.option.id
      }
    })
    .then( (res) => {
      console.log('response from heatmap frames', res)
      this.massageData(res.data)
    })
  };

  massageData(frames) {
    var counterForHeatmap = frames.reduce((acc, curr) => {

      acc[`${curr.x}_${curr.y}`] ? (
        acc[`${curr.x}_${curr.y}`].value += 1
      ) : (
        acc[`${curr.x}_${curr.y}`] = {
          x: parseInt(+curr.x*150),
          y: parseInt(+curr.y*120),
          time: +curr.time,
          value: 1
        }
      );
      return acc;
    }, {})

    var arrayForHeatMap = [];
    for (var key in counterForHeatmap) {
      arrayForHeatMap.push(counterForHeatmap[key])
    }
    arrayForHeatMap = arrayForHeatMap.sort((a,b) => a.time - b.time)
    console.log('arrayForHeatMap', arrayForHeatMap)
    this.setState({
      heatmapArr: arrayForHeatMap,
      allFrames: arrayForHeatMap
    })
  };

  componentWillReceiveProps() {
    console.log('PROPS', this.props);

    if(this.props.setting === 2) {
      var arrayInTimeRange = this.state.allFrames.filter(item => Math.floor(item.time) === this.props.time);
      console.log('array in time range', arrayInTimeRange);
      this.setState({
        heatmapArr: arrayInTimeRange
      })
    } else {
      this.setState({
        heatmapArr: this.state.allFrames
      })
    }

  }

  render() {
    return (
      <div className='heatmapContainer' style={heatmapStyle}>

          <ReactHeatmap max={2} data={this.state.heatmapArr || dummydata} className='reactHeatmap'/>

      </div>
    )
  }
}

const heatmapStyle = {
  height: '100%',
  width: '100%'
}

const dummydata = [{ x: 10, y: 15, value: 1}, { x: 50, y: 50, value: 2}];

export default HeatMap;
