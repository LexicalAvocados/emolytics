import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';

class CreateProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: ''
    };
    this.submitProjectClick = this.submitProjectClick.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
  }

  handleNameChange(event) {
    // name of property of state you want to update
    this.setState({
      name: event.target.value
    });
  }

  handleDescriptionChange(event) {
  // name of property of state you want to update
    this.setState({
      description: event.target.value
    });
}
// function that gets invoked when add new project button is clicked
submitProjectClick(e) {
  e.preventDefault();
  axios.post('/api/createProject', {
    name: this.state.name,
    description: this.state.description
  })
    .then((response) => {
      this.setState({
        name: response.data.name,
        description: response.data.description
      })
      // redux
      // this.props.actions.submitProject(project)
    })
    .catch((err) => {
      console.error('Request to create new project NOT sent to server!', err);
    })
}

  render() {
    return (
      <div className="CreateProject">
        <h3>Create Project</h3>
        <form onSubmit={this.submitProjectClick}>
          Project Name: <br />
          <input type="text" name="projectname" value={this.state.name} onChange={this.handleNameChange} /><br />
          Project Description: <br />
          <input type="text" name="projectdescription" value={this.state.description} onChange={this.handleDescriptionChange} /><br />
          <input type="submit" value="Submit" />
          </form>
      </div>
    )
  }
}

export default CreateProject;


//   render() {
//     return (
//       <div className="CreateProject">
//         <h3>Create Project</h3>
//         <form onSubmit={this.submitProjectClick}>
//           Project Description: <br />
//           <input type="text" name="projectdescription" value={this.state.value} onChange={this.handleChange} /><br />
//           Section: <br />
//           <input type="text" name="section" /><br />
//           Video Description: <br />
//           <input type="text" name="videodescription" /><br />
//           Notes: <br />
//           <input type="text" name="notes" /><br />
//           <input type="submit" value="Submit" />
//           </form>
//       </div>
//     )
//   }
// }

// export default CreateProject;

//Redux
  // render () {
  //   return (
  //     <div>
  //       <Link to={'/project/' + this.state.name}>
  //         <p onClick={this.submitProjectClick}>{this.state.name}</p>
  //       </Link>
  //       <p>{this.state.description}</p>
  //     </div>
  //   )
  // }


// Redux....
// const mapStateToProps = (state) => {
//   return({
//     router: state.router,
//     submitProject: state.submitProject
//   });
// };

// const mapDispatchToProps = (dispatch) => ({
//   actions: bindActionCreators(changeActions, dispatch)
// });


// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// ) (CreateProject);

