import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

class ProjectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: []
    };
    this.onClickCallback = this.onClickCallback.bind(this)
  }
  
  // Uxse id of project to get all sections
  componentDidMount() {
    axios.get('/api/getRelatedSections', { params: {projectId: this.props.project.id}})
      .then((sections) => {
        // console.log('Request to get relevant sections sent to server', res);
        this.setState({
          sections: sections.data
        })
        // console.log(this.state.sections);
      })
      .catch((err) => {
        console.log('Request to get relevant sections NOT sent to server!', err);
      })
  }

  onClickCallback() {
    this.props.onProjectClick(this.props.project, this.state.sections)
  }

  render() {
    return (
      <div>
        <Link to={'/project' + this.props.project.id}>
          <p onClick={this.onClickCallback}>{this.props.project.name}</p>
        </Link>
        <p>{this.props.project.description}</p>
        { this.state.sections.map((section, i) => {
          return (
            <p key={i}>{section.name}</p>
          );
        })}
      </div>
    );
  }
}

export default ProjectList;