import React from 'react';
import ProjectList from './ProjectList.jsx';
import axios from 'axios';

class DashboardHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      sections: []
    };
  }

  componentDidMount() {
    axios.get('/api/getProjectsForUser', {params: { username: 'Bob' }})
      .then((response) => {
        this.setState({
          projects: response.data
        })
        console.log(this.state.projects);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  render () {
    return (
      <div>
        <p>PROJECT HOME</p>
        { this.state.projects.map((project, i) => (
          <ProjectList 
            project={project}
            key={i}
          />
        ))}

      </div>
    );
  }
}

export default DashboardHome;