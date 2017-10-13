import React from 'react';

class InviteTesters extends React.Component {
  constructor(props) {
    super(props);
  }




  render () {
    return (
      <p>{this.props.tester.username}</p> //And whatever other information about the user we want to display.
    );
  }
}

export default InviteTesters;