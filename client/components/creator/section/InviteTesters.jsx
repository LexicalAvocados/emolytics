import React from 'react';


// Separate component because we will want to display more information and style it easily
class InviteTesters extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <p>Availabe tester: {this.props.totalTesters}</p>
    );
  }
}

export default InviteTesters;