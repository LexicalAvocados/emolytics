import React from 'react';
import {Link} from 'react-router-dom';
import SectionList from './SectionList.jsx';
import { connect } from 'react-redux';
import axios from 'axios';


class ProjectHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: []
    };
  }

  componentDidMount() {
    this.retrieveSections();
  }

  retrieveSections() {
    axios.get('/api/getRelatedSections', { params: {projectId: 1}})
      .then((res) => {
        console.log('Request to get relevant sections sent to server', res); 
      })
      .catch((err) => {
        console.log('Request to get relevant sections NOT sent to server!', err);
      })
  }

  render() {
    return (
      <div>
        <h2>PROJECT NAME</h2>
        <p>PROJECT DESCRIPTION</p>
        <Link to="/projectCreate">Add option</Link> {/* Pass sectionId in link*/}
        {this.state.sections.map((section, i) => (
          <SectionList 
            section={section}
            key={i}
          />
        ))}
      </div>
    )
  }
}


export default ProjectHome;
