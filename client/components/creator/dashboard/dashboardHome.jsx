import React from 'react';
import axios from 'axios';

class DashboardHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      sections: []
    };
  }
  // Request to db for all projects for that given user.
    // Uxse id of project to get all sections

  componentDidMount() {
    axios.get('/api/getProjectsForUser', {params: { username: 'Bob' }})
      .then((response) => {
        console.log('DA RESPONSE', response);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  render () {
    return (
      <div>
        <p>PROJECT HOME</p>
      </div>
    );
  }
}

export default DashboardHome;