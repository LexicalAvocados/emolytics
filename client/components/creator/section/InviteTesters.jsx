import React from 'react';

// Separate component because we will want to display more information and style it easily
class InviteTesters extends React.Component {
  constructor(props) {
    super(props);
  }




  render () {
    return (
      <p onClick={() => this.props.addInvitee(this.props.index)}>{this.props.tester.username}</p> //And whatever other information about the user we want to display.
    );
  }
}

export default InviteTesters;