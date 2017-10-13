import React from 'react';

class InviteTesters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      testers: []
    };
  }

  grabTesters() {
    axios.get('/api/getTesters')
      .then((response) => {
        console.log('RESPONSE FROM GET TESTERS', response); 
        // this.setState({
        //   testers: response.data
        // })
      })
      .catch((err) => {
        console.log(err);
      })
  }


  render () {
    return (
      <p onClick={this.grabTesters}>Invite testers to view options!</p>
    );
  }
}

export default InviteTesters;