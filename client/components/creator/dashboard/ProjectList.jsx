import React from 'react';
import {Link, withRouter } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios';

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
        })
        // console.log(this.state.sections);
      })
      .catch((err) => {
        console.log('Request to get relevant sections NOT sent to server!', err);
      });
  }

  onClickCallback() {
    this.props.onProjectClick(this.props.project, this.state.sections);
    this.props.history.push('/project' + this.props.project.id);

  }

  // routeToProject() {
  //   this.props.history.push('/project' + this.props.project.id);
  // }

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
    }
    return (
      <div>
        <div onClick={this.onClickCallback} className='projectsContainer'>
          {/* <Link to={'/project' + this.props.project.id}> */}


          <div style={data}>
            <h4>{this.props.project.name}</h4>
            {/* </Link> */}
            <p>{this.props.project.description}</p>
            <p> <u> Sections </u> </p>
            { this.state.sections.map((section, i) => {
              return (
                <p key={i}>{section.name}</p>
              );
            })}
          </div>
          <div style={time}>
            <br/>
            <p><small>Created On: {this.state.date = new Date(this.props.project.createdAt.slice(0, 19)).toString().slice(0, 24)} </small></p>
          </div>

        </div>
        <div style={del}>
          <Button onClick={() => this.props.deleteProject(this.props.project.id)}>Delete</Button>
        </div>
      </div>
    );
  }
}

export default withRouter(ProjectList);
