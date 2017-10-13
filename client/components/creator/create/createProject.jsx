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
  }
}

// function that gets invoked when add new project button is clicked
submitProjectClick() {
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
      this.props.actions.submitProject(project)
      // this.state.actions.submitProject(project)
    })
    .catch((err) => {
      console.error('Request to create new project NOT sent to server!', err);
    })
}

render () {
  return (
    <div>
      <Link to={'/project/' + this.state.name}>
        <p onClick{this.submitProjectClick}>{this.state.name}</p>
      </Link>
      <p>{this.state.description}</p>
    </div>
  )
}

const mapStateToProps = (state) => {
  return({
    router: state.router,
    submitProject: state.submitProject
  });
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(changeActions, dispatch)
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
) (CreateProject);