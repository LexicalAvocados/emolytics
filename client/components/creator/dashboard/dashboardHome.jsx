import React from 'react';
import ProjectList from './ProjectList.jsx';
import CreateProject from '../create/createProject.jsx';
import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';
import { Row, Col, Button, Modal, Popover } from 'react-bootstrap';
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
      notifsObj: {}
    };
    this.onProjectClick = this.onProjectClick.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.getProjectsFromDatabase = this.getProjectsFromDatabase.bind(this);
    this.revealCreate = this.revealCreate.bind(this);
    this.beginEdit = this.beginEdit.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.calculateNotifsForProject = this.calculateNotifsForProject.bind(this);
    this.projectPopover = this.projectPopover.bind(this);
    this.hiddenProjectPopover = this.hiddenProjectPopover.bind(this);
  }

  componentDidMount() {
    this.getProjectsFromDatabase();
    axios.get('/api/getCreditBalance')
      .then((res)=> {
        this.props.actions.setCredits(res.data); // Redundant on first login
      });
  }

  componentWillUnmount() {
    if (this.props.history.location.pathname === '/createProject' && this.state.projects.id === 0) {
      this.props.actions.changeCurrentProject(this.state.projects);
    }
  }

  getProjectsFromDatabase(refresh) {
    axios.get('/api/getProjectsForUser', {params: { username: this.props.loggedInUser.username }})
      .then((response) => {
        if (response.data[0].id !== 0) {
          let sortedProjects = response.data.sort((one, two) => {
            if (one.createdAt < two.createdAt) return 1;
            if (one.createdAt > two.createdAt) return -1;
          });
          this.setState({
            projects: sortedProjects,
            retrieved: true
          });
        } else {
          this.setState({ 
            projects: response.data[0],
            retrieved: true
          });
          this.props.currentProject.id === 0;
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

  onProjectClick(obj, sections, id) {
    if (id === 0 && this.props.currentSection.hidden) {
      this.props.currentSection.backFromHome = true;
    }
    obj['sections'] = sections;
    this.props.actions.changeCurrentProject(obj);
  }

  revealCreate() {
    this.setState({
      showCreate: !this.state.showCreate
    });
  }

  beginEdit(e, project) {
    e.stopPropagation()
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
          this.setState({
            projects: [],
            retrieved: false // Hopefully doesn't introduce problems
          });
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

  projectPopover() {
    return (
      <Popover id="popover-trigger-hover" title="Hi!">Projects are organized into sections. You can see the number of sections within this project to the left. Click on the project to see its sections, or click the edit button to edit change the name or description of the project.</Popover>
    );
  }

  hiddenProjectPopover() {
    let hidden = {
      display: 'none'
    }
    return (
      <Popover id="popover-trigger-focus" style={hidden}></Popover>
    );
  }

  render () {
    var inherit = {
      display: 'inherit'
    };
    // var secondLine = {
    //   display: 'inherit',
    //   marginLeft: '3%'
    // }
    
    return (
      <div>
        { this.state.retrieved ? (
      <div className="dashboardHomeContainer">
          { this.state.projects.id === 0 ? (
            <h3 className="demoWelcomeHeader"> Welcome to Emolytics (new name forthcoming)! This page lists all your projects. Below you will find a demonstration project, hover over the project to learn more about it and how to interact with it.</h3> 
          ) : (
            null
          )}
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
                  inDemo={this.state.projects.id}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.revealCreate}>Close</Button>
              </Modal.Footer>
            </Modal>
          </div>
          <hr/>
          <br/>
          { this.state.projects.id !== 0 ? (
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
                        popover={this.hiddenProjectPopover()}
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
                  <Col className="projectListContainer" md={4}>
                    <ProjectList
                      onProjectClick={this.onProjectClick}
                      deleteProject={this.deleteProject}
                      getProjectsFromDatabase={this.getProjectsFromDatabase}
                      project={this.state.projects}
                      beginEdit={this.beginEdit}
                      toggleEdit={this.toggleEdit}
                      displayEdit={this.state.displayEdit}
                      refreshSections={this.state.refreshSections}
                      notifs={this.calculateNotifsForProject(this.state.projects)}
                      allNotifications={this.props.notifications}
                      popover={this.projectPopover()}
                    />
                  </Col>
                </Row>
              </div>
            )}
          </div>
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
    notifications: state.notifications,
    currentSection: state.currentSection
  });
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ChangeActions, dispatch)
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
) (DashboardHome));
