import React from 'react';

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