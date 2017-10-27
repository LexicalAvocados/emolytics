import React from 'react';
import ProjectList from './ProjectList.jsx';
import CreateProject from '../create/createProject.jsx';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';
import { Row, Col, Button, Modal } from 'react-bootstrap';
import {Link} from 'react-router-dom';


export class DashboardHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      retrieved: false,
      showCreate: false,
      displayEdit: false,
      idOfClickedOn: null,
      fromDashboard: true,
      refreshSections: false,
      notifsObj: {},
      demo: false
    };
    this.onProjectClick = this.onProjectClick.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.getProjectsFromDatabase = this.getProjectsFromDatabase.bind(this);
    this.revealCreate = this.revealCreate.bind(this);
    this.beginEdit = this.beginEdit.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.calculateNotifsForProject = this.calculateNotifsForProject.bind(this);
  }

  componentDidMount() {
    this.getProjectsFromDatabase();
    axios.get('/api/getCreditBalance')
      .then((res)=> {
        this.props.actions.setCredits(res.data); // Redundant on first login
      });
  }

  getProjectsFromDatabase(refresh) {
    axios.get('/api/getProjectsForUser', {params: { username: this.props.loggedInUser.username }})
      .then((response) => {
        if (response.data.id !== 0) {
          let sortedProjects = response.data.sort((one, two) => {
            if (one.createdAt < two.createdAt) return 1;
            if (one.createdAt > two.createdAt) return -1;
          });
          this.setState({
            projects: sortedProjects,
            retrieved: true,
            demo: false
          });
        } else {
          this.setState({ 
            projects: response.data,
            demo: true
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
    if (refresh) {
      this.setState({
        refreshSections: true
      });
    }
    axios.get('/api/creator/allNotifications')
      .then((res) => {
        let reduxObj = { allUserNotifs: res.data };
        this.props.actions.setNotifications(reduxObj);

        var projectNotifs = this.props.notifications.allUserNotifs.reduce((acc, curr) => {
          acc[`${curr.projectId}`] ? acc[`${curr.projectId}`]+=1 : acc[`${curr.projectId}`] = 1;
          return acc;
        }, {});
        this.setState({
          notifsObj: projectNotifs
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
      idOfClickedOn: project.id,
      refreshSections: true
    });
    this.props.actions.changeCurrentProject(project);
  }

  toggleEdit() {
    this.setState({
      displayEdit: !this.state.displayEdit,
      refreshSections: false
    });
  }

  deleteProject() {
    // if id is 0, nooo
    if (this.state.idOfClickedOn === 0) {
      alert('Sneaky! You cannot delete the demo project! It will disappear when you create a project');
      return;
    }
    if (confirm('Are you sure you want to delete this project?')) {
      axios.delete('/api/deleteProject', { params: {toDelete: 'id', id: this.state.idOfClickedOn}})
        .then((response) => {
          this.getProjectsFromDatabase(true);
          this.toggleEdit();
        })
        .catch((err) => {
          console.log('Error deleting project', err);
        });
    }
  }

  calculateNotifsForProject(projObj) {
    let id = projObj.id;
    // console.log('project', projObj)
    for (var key in this.state.notifsObj) {
      if (+key === id) {
        return this.state.notifsObj[id];
      }
    }
    return 0;
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
          this.state.projects.length && !this.state.demo ? (
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
                      refreshSections={this.state.refreshSections}
                      notifs={this.calculateNotifsForProject(project)}
                      allNotifications={this.props.notifications}
                    />
                  </Col>
                ))}
              </Row>
              <Link to='/account'>
                <Button className="addEntityButton" style={inherit}>Credits: {this.props.loggedInUser.credits || 0}</Button>
              </Link>
            </div>
          ) : (
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
                    refreshSections={this.state.refreshSections}
                    notifs={this.calculateNotifsForProject(project)}
                    allNotifications={this.props.notifications}
                  />
                </Col>
              ))}
            </Row>      
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
  textAlign: 'center',
  float: 'right',
  padding: '10px',
  color: 'black'
};

const mapStateToProps = (state) => {
  // console.log('LOG WITHIN DASHBOARD', state);
  return ({
    router: state.router,
    currentProject: state.currentProject,
    loggedInUser: state.loggedInUser,
    notifications: state.notifications
  });
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
) (DashboardHome);
