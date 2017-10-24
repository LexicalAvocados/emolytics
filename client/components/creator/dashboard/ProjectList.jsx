import React from 'react';
import {Link, withRouter } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import EditPage from '../create/EditPage.jsx';

class ProjectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: [],
      date: ''
    };
    this.onClickCallback = this.onClickCallback.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    axios.get('/api/getRelatedSections', { params: {projectId: this.props.project.id}})
      .then((sections) => {
        // console.log('Request to get relevant sections sent to server', res);
        let sortedSections = sections.data.sort((one, two) => {
          if (one.createdAt < two.createdAt) return 1;
          if (one.createdAt > two.createdAt) return -1;
        });
        this.setState({
          sections: sortedSections
        });
      })
      .catch((err) => {
        console.log('Request to get relevant sections NOT sent to server!', err);
      });
  }

  onClickCallback() {
    this.props.onProjectClick(this.props.project, this.state.sections);
    this.props.history.push('/project' + this.props.project.id);
  }

  render() {
    var time = {
      float: "right"
    }

    var data = {
      float: "left"
    }

    var del = {
      float: "right",
      clear: "right",
      width: '100%'
    }

    var edit = {
      width: '100%',
      backgroundColor: 'whitesmoke'
    }
    return (
      <div>
        <div className='projectsContainer'>
          <div onClick={this.onClickCallback}>
            <div style={data}>
              <h4>{this.props.project.name}</h4>
              <p>{this.props.project.description}</p>
              <p> <u> Number of Sections:</u>  {this.state.sections.length} </p>
              {/* { this.state.sections.map((section, i) => {
                return (
                  <p key={i}>{section.name}</p>
                );
              })} */}
            </div>
            <div style={time}>
              <br/>
              <p><small>Created On: {this.state.date = new Date(this.props.project.createdAt.slice(0, 19)).toString().slice(0, 24)} </small></p>
            </div>
          </div>
          <div style={del}>
            <Button onClick={() => this.props.beginEdit(this.props.project)} style={edit}>Edit</Button> {/* Finish the styling on this later */}
          </div>
        </div>
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
