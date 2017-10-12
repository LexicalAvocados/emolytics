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
    axios.get('/getProjectsForUser')
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  render () {
    return (
      <div>
        
      </div>
    );
  }
}

export default DashboardHome;

// Map through projects 
  // 