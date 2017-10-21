import React from 'react';
import axios from 'axios';

// Separate component because we will want to display more information and style it easily
class CompareCharts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    console.log(this);
  }

  componentWillMount() {
    axios.post('/api/getUsersIdsWhoWatced', {
      optionId: this.props.option.id
    })
    .then( (res) => {
      // console.log(res);
      res.data.forEach(userId => {
        console.log('user id for axios', userId.userId)
        axios.post('/api/getUsersNamesWhoWatced', {
          userId: userId.userId
        })
        .then((username) => {
          console.log('user obj response', username)
          let oldUsers = this.state.allUsers.slice()
          let newUsers = oldUsers.concat(username.data);
          this.setState({
            allUsers: newUsers,
            selectedUsers: newUsers
          })
        })
      })
    })
  }

  render () {
    return (
    	<div className="sectionCompareCharts">

      <p> {this.props.option.name} </p>


      </div>
    );
  }
}

export default CompareCharts;


{/* <Checkbox onChange={(e) => this.props.handleInvites(e, this.props.index)}>
Name: {this.props.tester.username} Age: {this.props.tester.age} Sex: {this.props.tester.sex} Race: {this.props.tester.race}
</Checkbox> */}