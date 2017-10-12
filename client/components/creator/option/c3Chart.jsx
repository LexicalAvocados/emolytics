import React from 'react';
import c3 from 'c3';
import axios from 'axios';

class c3Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attentionArray: [0, 0.5, 1, 1, 1, 0.7, 0.8, 0.8, 0.5, 0.2, 0.6, 1, 1, 1, 1, 0.8, 0.5, 0.7, 1]
    }
  }

  componentDidMount() {
    //axios GET request for attention
    console.log('hey')
    var chart = c3.generate({
      bindto: '.chart',
      data: {
        // x: 'x',
        columns: ['data1', 0, 0.5, 1, 1, 1, 0.7, 0.8, 0.8, 0.5, 0.2, 0.6, 1, 1, 1, 1, 0.8, 0.5, 0.7, 1]
      }
    });
  }

  render() {
    return (
      <div className="chart">
        <p> Yo </p>
      </div>
    )
  }

};

export default c3Chart;
