import React from 'react';
import ProjectList from './ProjectList.jsx';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';


class DashboardHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: []
    };
    this.onProjectClick = this.onProjectClick.bind(this);
  }

  componentDidMount() {
    axios.get('/api/getProjectsForUser', {params: { username: this.props.loggedInUser.username }}) // this.props.loggedInUser.username (import it below)
      .then((response) => {
        this.setState({
          projects: response.data
        })
      })
      .catch((err) => {
        console.log(err);
      })
  }


  onProjectClick(obj, sections) {
    obj['sections'] = sections;
    this.props.actions.changeCurrentProject(obj);
  }

  // Change this so that the rendering tears stop
  render () {
    return (
      <div>
        <h2>Project Home</h2>
        { this.state.projects.length ? (
          <div>
            { this.state.projects.map((project, i) => (
              <ProjectList
                onProjectClick={this.onProjectClick}
                project={project}
                key={i}
              />
            ))}
          </div>
        ) : (
          <div>
            <p>Welcome Good Sir/Lady, you do not currently have any projects!</p>
            <p>Why don't you click the 'Create Projects' button in the Navigation Bar and start doing something with your life!</p>
          </div>
        )}

      </div>
    );
  }
}



const mapStateToProps = (state) => {
  console.log('LOG WITHIN DASHBOARD', state);
  return ({
    router: state.router,
    currentProject: state.currentProject,
    loggedInUser: state.loggedInUser
  });
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
) (DashboardHome);