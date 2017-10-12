import React from 'react';
import c3 from 'c3';
import c3Chart from './c3Chart.jsx';
import ReactPlayer from 'react-player';

class OptionHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {
    //axios GET request for attention
    var chart = c3.generate({
      bindto: '.chart',
      data: {
        // x: 'x',
        columns: [
          ['attention', 0, 0.5, 1, 1, 1, 0.7, 0.8, 0.8, 0.5, 0.2, 0.6, 1, 1, 1, 1, 0.8, 0.5, 0.7, 1]
        ]
      }
    });
  }

  render() {
    return (
      <div classID='container'>
        <ReactPlayer url='https://www.youtube.com/watch?v=gCcx85zbxz4' playing controls={true} height={570} width={1000} style={playerStyle}/>
        <div className="chart" style={chartStyle}>
          <p> Yo </p>
        </div>
      </div>
    )
  }
}

const chartStyle = {
  position: "absolute",
  bottom: "0px",
  height: "27%",
  width: "1030px"
}

const playerStyle = {
  marginLeft: "2%"
}

export default OptionHome;
