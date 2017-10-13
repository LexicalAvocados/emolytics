import React from 'react';

// Separate component because we will want to display more information and style it easily
class Invited extends React.Component {
  constructor(props) {
    super(props);
  }




  render () {
    return (
      <div>
        <p>Invited:</p>
        {this.props.invited.map((invitee, i) => (
          <p key={i}>Name: {invitee.username} Email: {invitee.email}</p>
        ))}
        <button onClick={this.props.submitInvites}>Finish Inviting...</button>
      </div>
    );
  }
}

export default Invited;