import React from 'react';
import { connect } from 'react-redux';

class SectionHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }


  render() {
    return (
      <div>
        <p>SECTION HOME</p>
      </div>
    );
  }
}


// export default SectionHome;
const mapStateToProps = (state) => {
  console.log('LOG WITHIN SECTION HOME', state);
  return ({
    currentProject: state.currentProject
  })
};


export default connect(
  mapStateToProps
  ) (SectionHome)