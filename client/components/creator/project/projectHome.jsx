import React from 'react';
import {Link} from 'react-router-dom';
import SectionList from './SectionList.jsx';
import { connect } from 'react-redux';
import axios from 'axios';


const ProjectHome = (props) => (
  <div>
    <h2>{props.currentProject.name}</h2>
    <p>{props.currentProject.description}</p>
    <Link to="/projectCreate">Add option</Link>
    {props.currentProject.sections.map((section, i) => (
      <SectionList 
        section={section}
        key={i}
      />
    ))}
  </div>
);

const mapStateToProps = (state) => {
  // console.log('LOG WITHIN PROJECTHOME', state);
  return ({
    currentProject: state.currentProject
  })
}

export default connect(
  mapStateToProps
  ) (ProjectHome)
