import React from 'react';
import {Link} from 'react-router-dom';

const SectionList = (props) => (
  <div>
    <Link to="/section">   {/* + theId for that section - should pass in as props */}
      <p>Name of the section</p> 
    </Link>
    {/* VideoThumbnails with the section - map returning separate entities */}
  </div>
);

export default SectionList;