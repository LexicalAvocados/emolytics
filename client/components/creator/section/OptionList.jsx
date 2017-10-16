import React from 'react';
import {Link} from 'react-router-dom';
import InvitationPanel from './InvitationPanel.jsx'
import { DropdownButton, MenuItem } from 'react-bootstrap';
import axios from 'axios';


class OptionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invited: false
    };
    this.renderInvited = this.renderInvited.bind(this);
  }

  renderInvited() {
    this.setState({
      invited: !this.state.invited
    });
  }


  render() {
    return (
      <div className="currentSectionOptionListEntry">
        <Link to={'/option' + this.props.option.id}>
          <img src={this.props.option.thumbnail} alt="" onClick={() => this.props.onOptionClick(this.props.index)}/>
        </Link>
        { this.state.invited ? (
          <p>Testers Invited!</p>
        ) : (
          <InvitationPanel
            option={this.props.option}
            renderInvited={this.renderInvited}
          />
        )}
      </div>
    );
  }
}

export default OptionList;


// Separate component because we will want to display more information and style it easily
// class Invited extends React.Component {
//   constructor(props) {
//     super(props);
//   }




//   render () {
//     return (
//       <div>
//         <p>Invited:</p>
//         {this.props.invited.map((invitee, i) => (
//           <p key={i}>Name: {invitee.username} Email: {invitee.email}</p>
//         ))}
//         <button onClick={this.props.submitInvites}>Finish Inviting...</button>
//       </div>
//     );
//   }
// }

// export default Invited;