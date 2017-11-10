import React from 'react';
import {Link, withRouter } from 'react-router-dom';
import { Button, Modal, OverlayTrigger, Popover } from 'react-bootstrap';
import axios from 'axios';
import EditPage from '../create/EditPage.jsx';
import BellIcon from 'react-bell-icon';

class ProjectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: [],
      date: ''
    };
    this.onClickCallback = this.onClickCallback.bind(this);
    this.getRelatedSections = this.getRelatedSections.bind(this);
  }

  componentDidMount() {
    this.getRelatedSections();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.refreshSections) {
      console.log('Seciont to be refreshed')
      this.getRelatedSections();
    }
  }

  getRelatedSections() {
    axios.get('/api/getRelatedSections', { params: {projectId: this.props.project.id}})
      .then((sections) => {
        // console.log('Request to get relevant sections sent to server', res);
        if (sections.data.id === 0) { // Filter for demo section
          this.setState({
            sections: sections.data
          });
          return;
        }
        let sortedSections = sections.data.sort((one, two) => {
          if (one.createdAt < two.createdAt) return 1;
          if (one.createdAt > two.createdAt) return -1;
        });

        var sectionNotifsObj = this.props.allNotifications.allUserNotifs.reduce((acc, curr) => {
          acc[`${curr.sectionId}`] ? acc[`${curr.sectionId}`]+=1 : acc[`${curr.sectionId}`] = 1;
          return acc;
        }, {});

        // console.log('sectionNotifsObj', sectionNotifsObj)
        let sectionArr = sortedSections;
        for (var key in sectionNotifsObj) {
          for (let i = 0; i < sectionArr.length; i++) {
            if (+key === sectionArr[i].id) {
              sectionArr[i]['notifications'] = +sectionNotifsObj[key];
            }
          }
        }

        this.setState({
          sections: sectionArr
        }, () => {
          console.log('sections in state after notifs', this.state.sections);
          console.log('associated project', this.props.project);
        });
      })
      .catch((err) => {
        console.log('Request to get relevant sections NOT sent to server!', err);
      });
  }

  onClickCallback() {
    this.props.onProjectClick(this.props.project, this.state.sections, this.props.project.id);
    this.props.history.push('/project' + this.props.project.id);
  }



  render() {
    var time = {
      float: 'right'
    };

    var data = {
      float: 'left'
    };

    var del = {
      float: 'right',
      clear: 'right',
      width: '100%'
    };

    var edit = {
      width: '100%',
      backgroundColor: 'whitesmoke',
      
    };

    const gridBoxForProject = {
      display: 'grid',
      gridTemplateColumns: '50% 50%',
      gridTemplateRows: '50% 50%',
      overflow: 'hidden'
    };

    const titleDisplayStyle = {
      gridColumn: '1',
      gridRow: '1'
    };

    const projectDescription = {
      gridColumn: '1/2',
      gridRow: '2',
      width: '100%',
      // overflow: 'hidden'
    }

    const rightSideDisplay = {
      gridColumn: '2',
      gridRow: '1',
      display: 'grid',
      gridTemplateColumns: '100%',
      gridTemplateRows: 'repeat(2, 3vh)'
    };

    const notifDisplayStyle = {
      gridColumn: '1',
      gridRow: '1',
      textAlign: 'right'
    };

    const timeDisplayStyle = {
      gridColumn: '1',
      gridRow: '2',
      textAlign: 'right'
    };




    return (
      <div className="projectListEntry" onClick={this.onClickCallback}>
        <OverlayTrigger placement="right" overlay={this.props.popover}>
          <div className='projectsContainer'>
            <div style={gridBoxForProject}>

              <div style={rightSideDisplay} className='timeAndNotifs'>

                <div style={notifDisplayStyle}>
                  { this.props.notifs > 0 ? (
                    <div>
                      <BellIcon width='20' height='20' active={false} animate={false}/>
                      <a>  {this.props.notifs}</a>
                    </div>
                  ) : '' }
                </div>
                <div style={timeDisplayStyle}>
                  <p><small>Created On: {this.state.date = new Date(this.props.project.createdAt.slice(0, 19)).toString().slice(0, 15)} </small></p>
                </div>
              </div>
              <div>
                <div style={titleDisplayStyle}>
                  <h4 className="upperTextToTruncate">{this.props.project.name.toUpperCase()}</h4>
                </div>
                <div style={projectDescription}> 
                  <p className="lowerTextToTruncate">{this.props.project.description}</p>
                </div>
              </div>
            </div>
            <div style={del}>
              <p> <u> Number of Sections:</u>  {this.state.sections.length} </p>
              <Button onClick={(e) => this.props.beginEdit(e, this.props.project)} style={edit}>Edit</Button> {/* Finish the styling on this later */}
            </div>
          </div>
        </OverlayTrigger>
        <Modal bsSize="large" show={this.props.displayEdit} onHide={this.props.toggleEdit}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Your Project</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <EditPage
              close={this.props.toggleEdit}
              toEdit={'Project'}
              getProjectsFromDatabase={this.props.getProjectsFromDatabase}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button style={data} onClick={this.props.deleteProject}>Delete this Project</Button>
            <Button onClick={this.props.toggleEdit}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default withRouter(ProjectList);  