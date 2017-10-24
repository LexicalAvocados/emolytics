import React from 'react';
import ReactHeatmap from 'react-heatmap';
import axios from 'axios';

class HeatMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      frames: [],
      heatmapArr: []
    }
    this.massageData = this.massageData.bind(this);
  }

  componentDidMount() {
    //axios
  }

  massageData() {
    var counterForHeatmap = this.state.frames.reduce((acc, curr) => {
      //pythagorean distance
      acc[`${curr.x}_${curr.y}`] ? (
        acc[`${curr.x}_${curr.y}`].value += 1
      ) : (
        acc[`${curr.x}_${curr.y}`] = {
          x: curr.x,
          y: curr.y,
          time: curr.time,
          value: 1
        }
      );
      return acc;
    }, {})

    var arrayForHeatMap = [];
    for (var key in dataForHeatmap) {
      arrayForHeatMap.push(dataForHeatmap[key])
    }
    this.setState({
      heatmapArr: arrayForHeatMap
    })
  };

  render() {
    return (
      <div className='heatmapContainer' style={heatmapStyle}>
        <p> Text from Heatmap </p>
        <ReactHeatmap max={5} data={this.state.heatmapArr || dummydata} />
      </div>
    )
  }
}

const heatmapStyle = {
  height: '100%',
  width: '100%'
}

const dummydata = [{ x: 10, y: 15, value: 5}, { x: 50, y: 50, value: 2}];

export default HeatMap;
