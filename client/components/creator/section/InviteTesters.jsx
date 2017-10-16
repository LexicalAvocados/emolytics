import React from 'react';

// Separate component because we will want to display more information and style it easily
class InviteTesters extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div>
        <p>Name: {this.props.tester.username} Age: {this.props.tester.age} Sex: {this.props.tester.sex} Race: {this.props.tester.race}</p>
      </div>
    );
  }
}

export default InviteTesters;

//onClick={() => this.props.addInvitee(this.props.index)}