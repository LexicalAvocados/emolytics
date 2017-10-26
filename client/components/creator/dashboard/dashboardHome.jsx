import React from 'react';
import ProjectList from './ProjectList.jsx';
import CreateProject from '../create/createProject.jsx';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';
import { Row, Col, Button, Modal } from 'react-bootstrap';
import {Link} from 'react-router-dom';


class DashboardHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      retrieved: false,
      showCreate: false,
      displayEdit: false,
      notifications: [],
      idOfClickedOn: null,
      credits: 0,
      fromDashboard: true
    };
    this.onProjectClick = this.onProjectClick.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.getProjectsFromDatabase = this.getProjectsFromDatabase.bind(this);
    this.revealCreate = this.revealCreate.bind(this);
    this.beginEdit = this.beginEdit.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
  }

  componentDidMount() {
    this.getProjectsFromDatabase();
    axios.get('/api/getCreditBalance')
      .then((res)=> {
        this.setState({
          credits: res.data
        });
      });
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
      })
      .catch((err) => {
        console.log(err);
      });
    axios.get('/api/creator/allNotifications')
      .then((res) => {
        this.setState({
          notifications: res.data
        }, () => {
          var projectNotifs = this.state.notifications.reduce((acc, curr) => {
            acc[`${curr.projectId}`] ? acc[`${curr.projectId}`]+=1 : acc[`${curr.projectId}`] = 1;
            return acc;
          }, {});
        });
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

  beginEdit(project) {
    this.setState({
      displayEdit: !this.state.displayEdit,
      idOfClickedOn: project.id
    });
    this.props.actions.changeCurrentProject(project);
  }

  toggleEdit() {
    this.setState({
      displayEdit: !this.state.displayEdit
    });
  }

  deleteProject(id) {
    if (confirm('Are you sure you want to delete this project?')) {
      let filteredProjects = this.state.projects.filter((project) => {
        if (project.id !== this.state.idOfClickedOn) return project;
      });
      axios.delete('/api/deleteProject', { params: {projectId: this.state.idOfClickedOn, toDelete: 'id'}})
        .then((response) => {
          // console.log(response);
          this.setState({
            projects: filteredProjects
          });
          this.toggleEdit();
        })
        .catch((err) => {
          console.log('Error deleting project', err);
        });
    }
  }

  render () {
    var inherit = {
      display: 'inherit'
    };
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
                fromDashboard={this.state.fromDashboard}
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
            <div>
            <Row className="show-grid">
              { this.state.projects.map((project, i) => (
                <Col className="projectListContainer" md={4} key={i}>
                  <ProjectList
                    onProjectClick={this.onProjectClick}
                    deleteProject={this.deleteProject}
                    getProjectsFromDatabase={this.getProjectsFromDatabase}
                    project={project}
                    beginEdit={this.beginEdit}
                    toggleEdit={this.toggleEdit}
                    displayEdit={this.state.displayEdit}
                  />
                </Col>
              ))}
            </Row>
            <Link to='/account'>
              <Button className="addEntityButton" style={inherit}>Credits: {this.state.credits || 0}</Button>
            </Link>
            </div>
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

const creditDisplayStyle = {
  textAlign: "center",
  float: "right",
  padding: "10px",
  color: "black"
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
