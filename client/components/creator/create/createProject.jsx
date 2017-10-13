import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

class CreateProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: ''
    };
    this.addProjectClick = this.addProjectClick.bind(this);
  }
}

componentDidMount() {
  axios.post('/api/createProject', {
    name: this.state.name,
    description: this.state.description
  })
    .then((response) => {
      this.setState({
        name: response.data.name,
        description: response.data.description
      })
    })
    .catch((err) => {
      console.error('Request to create new project NOT sent to server!', err);
    })
}

// function that gets invoked when add new project button is clicked
addProjectClick() {

}

render () {
  // return (
  //   <div>
  //     <Link to={}>
  //       <p onClick{}></p>
  //     </Link>
  //     <p>{this.state.name}</p>
  //     <p>{this.state.description}</p>

  //   </div>
  // )
}


export default CreateProject;