import React from 'react';
import axios from 'axios';

class ProjectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: []
    };
  }
  
  // Uxse id of project to get all sections
  componentDidMount() {
    axios.get('/api/getRelatedSections', { params: {projectId: this.props.project.id}})
      .then((sections) => {
        // console.log('Request to get relevant sections sent to server', res);
        this.setState({
          sections: sections.data
        })
        console.log(this.state.sections);
      })
      .catch((err) => {
        console.log('Request to get relevant sections NOT sent to server!', err);
      })
  }



  render() {
    return (
      <div>
        <p>{this.props.project.name}</p>
        <p>{this.props.project.description}</p>
        { this.state.sections.map((section, i) => {
          return (
            <p>{section.name}</p>
          );
        })}
      </div>
    );
  }
}

export default ProjectList;