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

  render() {
    return (
      <div>
        <h2>{this.props.currentProject.currentProject.name}</h2>
        <p>{this.props.currentProject.currentProject.description}</p>
        <Link to="/projectCreate">Add option</Link>
        {this.props.currentProject.currentProject.sections.map((section, i) => (
          <SectionList 
            section={section}
            key={i}
          />
        ))}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  console.log('LOG WITHIN PROJECTHOME', state);
  return ({
    currentProject: state.currentProject
  })
}


// export default ProjectHome;
export default connect(
  mapStateToProps
  ) (ProjectHome)
