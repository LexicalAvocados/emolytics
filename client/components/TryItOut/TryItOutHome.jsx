import React from 'react';
import TryItOutAnalytics from './TryItOutAnalytics.jsx';

class TryItOutHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div className='tryItOutHomeContainer'>
        <TryItOutAnalytics />
      </div>
    )
  }

};

export default TryItOutHome;
