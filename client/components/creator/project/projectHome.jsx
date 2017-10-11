import React from 'react';
import Link from 'react-router-dom':
import SectionList from './SectionList.jsx';

class ProjectHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  // Should have projectId - need to use that to grab sections - need to use section id to grab options
  // May need to query for the remainder of project information as well. 


  render() {
    return (
      <div>
        <h2>PROJECT NAME</h2>
        <p>PROJECT DESCRIPTION</p>
        <Link to='/optionsCreate'>Add option</Link>
        <SectionList />
      </div>
    )
  }
}

// Dynamically rendered secitons
  // Map through all related sections
    // For each section grab options, pass to section list
// An add option button 