import React from 'react';
import ProjectList from './ProjectList.jsx';
import CreateProject from '../create/createProject.jsx';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';
import { Row, Col, Button, Modal } from 'react-bootstrap';


class DashboardHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      retrieved: false,
      showCreate: false,
      displayEdit: false
    };
    this.onProjectClick = this.onProjectClick.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.getProjectsFromDatabase = this.getProjectsFromDatabase.bind(this);
    this.revealCreate = this.revealCreate.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
  }

  componentDidMount() {
    this.getProjectsFromDatabase();
  }
  
  getProjectsFromDatabase() {
    axios.get('/api/getProjectsForUser', {params: { username: this.props.loggedInUser.username }})
      .then((response) => {
        // console.log(response.data);
        let sortedProjects = response.data.sort((one, two) => {
          if (one.createdAt < two.createdAt) return 1;
          if (one.createdAt > two.createdAt) return -1;
        });
        this.setState({
          projects: sortedProjects,
          retrieved: true
        });
        console.log(this.state.projects)
      })
      .catch((err) => {
        console.log(err);
      });
  }  

  onProjectClick(obj, sections) {
    obj['sections'] = sections;
    this.props.actions.changeCurrentProject(obj);
  }

  revealCreate() {
    this.setState({
      showCreate: !this.state.showCreate 
    });
  }

  toggleEdit() {
    this.setState({
      displayEdit: !this.state.displayEdit
    });
  }

  deleteProject(id) {
    console.log(this.state.projects);
    console.log('DELETING', id);
    if (confirm('Are you sure you want to delete this project?')) {
      let filteredProjects = this.state.projects.filter((project) => {
        if (project.id !== id) return project;
      });
      console.log('filteredprojectessssss', filteredProjects);
      axios.delete('/api/deleteProject', { params: {projectId: id, toDelete: 'id'}})
        .then((response) => {
          // console.log(response);
          this.setState({
            projects: filteredProjects
          });
        })
        .catch((err) => {
          console.log('Error deleting project', err);
        })
    }
  }

  render () {
    var inherit = {
      display: "inherit"
    }
    return (
      <div className="dashboardHomeContainer">
        <div className="dashboardHeader">
          <h2 style={inherit}>Projects</h2>
          <Button className="addEntityButton" style={inherit} onClick={this.revealCreate}>Add Project</Button>
          <Modal bsSize="large" show={this.state.showCreate} onHide={this.revealCreate}>
            <Modal.Header closeButton>
              <Modal.Title>Create A Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <CreateProject 
                close={this.revealCreate}
                getProjectsFromDatabase={this.getProjectsFromDatabase}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.revealCreate}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
        <hr/>
        <br/>
        { this.state.retrieved ? (
          this.state.projects.length ? (
            <Row className="show-grid">
              { this.state.projects.map((project, i) => (
                <Col className="projectListContainer" md={4} key={JSON.stringify(project.name)+i}>
                  <ProjectList
                    onProjectClick={this.onProjectClick}
                    deleteProject={this.deleteProject}
                    getProjectsFromDatabase={this.getProjectsFromDatabase}
                    project={project}
                    toggleEdit={this.toggleEdit}
                    displayEdit={this.state.displayEdit}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <div>
              <p>Welcome Good Sir/Lady, you do not currently have any projects!</p>
              <p>Why don't you click the 'Create Projects' button in the Navigation Bar and start doing something with your life!</p>
            </div>
          )
        ) : (
          null
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
