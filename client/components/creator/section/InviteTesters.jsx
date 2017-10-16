import React from 'react';
import { Checkbox } from 'react-bootstrap';


// Separate component because we will want to display more information and style it easily
class InviteTesters extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <Checkbox onChange={(e) => this.props.handleInvites(e, this.props.index)}>
        Name: {this.props.tester.username} Age: {this.props.tester.age} Sex: {this.props.tester.sex} Race: {this.props.tester.race}
      </Checkbox>
    );
  }
}

export default InviteTesters;

//onClick={() => this.props.addInvitee(this.props.index)}

{/* <p>Name: {this.props.tester.username} Age: {this.props.tester.age} Sex: {this.props.tester.sex} Race: {this.props.tester.race}</p> */}