import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

class SectionList extends React.Component {
  constructor(props) {
    super(props)
    this.state ={

    };
  }

  componentDidMount() {
    axios.get('/api/getOptionsForSection', { params: {sectionId: 1}})
      .then((res) => {
        console.log('Request to get options for section sent to server', res);
      })
      .catch((err) => {
        console.log('Request to get options for section NOT sent to server');
      })
  }

  render () {
    return (
      <div>
        <Link to="/section">   {/* + theId for that section - should pass in as props */}
          <p>Name of the section</p> 
        </Link>
        {/* VideoThumbnails with the section - map returning separate entities */}
      </div>
    );
  }
}


export default SectionList;